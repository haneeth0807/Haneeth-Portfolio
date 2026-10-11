from fastapi import FastAPI, APIRouter, HTTPException, Request, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import time
import uuid
import asyncio
import logging
import smtplib
import ipaddress
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pathlib import Path
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pydantic import BaseModel, Field, field_validator
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
GMAIL_USER     = os.environ["GMAIL_USER"]
GMAIL_PASS     = os.environ["GMAIL_APP_PASSWORD"]
OWNER_EMAIL    = os.environ["OWNER_EMAIL"]
GITHUB_USER    = os.environ["GITHUB_USER"]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ---------- Email guardrail gate ----------
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} ≠ real link host {real!r} (G3)")


def _send_smtp(to: str, subject: str, html: str, reply_to: str | None) -> None:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = f"{EMAIL_FROM_NAME} <{GMAIL_USER}>"
    msg["To"]      = to
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.attach(MIMEText(html, "html"))
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(GMAIL_USER, GMAIL_PASS)
        smtp.sendmail(GMAIL_USER, to, msg.as_string())


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> None:
    _assert_safe_email(subject, html)
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, _send_smtp, to, subject, html, reply_to)


def _contact_template(name: str, email: str, message: str) -> str:
    msg = escape(message).replace("\n", "<br>")
    return (
        '<table role="presentation" width="100%" style="background:#06090d"><tr><td style="padding:32px;'
        'font-family:Arial,sans-serif;color:#e8ecf0">'
        '<p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#38aae6;margin:0 0 12px">'
        'New message from your portfolio</p>'
        f'<p style="font-size:20px;color:#fdf0d5;margin:0 0 20px"><strong>{escape(name)}</strong></p>'
        f'<p style="margin:0 0 6px;color:#8a96a2">Email: <a style="color:#fdf0d5" href="mailto:{escape(email)}">{escape(email)}</a></p>'
        f'<div style="margin-top:20px;padding:20px;border:1px solid #1a5c82;border-radius:12px;line-height:1.6">{msg}</div>'
        f'<p style="font-size:12px;color:#64748b;margin-top:24px">Sent by {escape(EMAIL_FROM_NAME)} contact form.</p>'
        '</td></tr></table>'
    )


# ---------- Models ----------
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=3, max_length=200)
    message: str = Field(min_length=1, max_length=5000)

    @field_validator("name", "message")
    @classmethod
    def strip_nonempty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Field cannot be empty")
        return v

    @field_validator("email")
    @classmethod
    def valid_email(cls, v: str) -> str:
        v = v.strip()
        if not EMAIL_RE.match(v):
            raise ValueError("Invalid email address")
        return v


class ContactOut(BaseModel):
    id: str
    name: str
    email: str
    message: str
    created_at: str


# ---------- Routes ----------
_rate: dict[str, list[float]] = {}
_gh_cache: dict = {"ts": 0, "data": None}


@api_router.get("/")
async def root():
    return {"message": "Haneeth Raja portfolio API"}


async def _notify_owner(contact_id: str, name: str, email: str, message: str):
    try:
        await send_email(
            to=OWNER_EMAIL,
            subject=f"New portfolio message from {name[:60]}",
            html=_contact_template(name, email, message),
            reply_to=email,
        )
        await db.contacts.update_one({"id": contact_id}, {"$set": {"email_sent": True}})
    except Exception as e:
        logger.error(f"Contact email failed: {e}")


@api_router.post("/contact", response_model=ContactOut)
async def create_contact(payload: ContactIn, request: Request, background: BackgroundTasks):
    ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "anon").split(",")[0]
    now = time.time()
    hits = [t for t in _rate.get(ip, []) if now - t < 600]
    if len(hits) >= 5:
        raise HTTPException(status_code=429, detail="Too many messages. Please try again later.")
    _rate[ip] = hits + [now]

    doc = ContactOut(id=str(uuid.uuid4()), name=payload.name, email=payload.email,
                     message=payload.message, created_at=datetime.now(timezone.utc).isoformat())
    await db.contacts.insert_one({**doc.model_dump(), "email_sent": False})
    background.add_task(_notify_owner, doc.id, doc.name, doc.email, doc.message)
    return doc


@api_router.get("/github/contributions")
async def github_contributions():
    if _gh_cache["data"] and time.time() - _gh_cache["ts"] < 3600:
        return _gh_cache["data"]
    try:
        async with httpx.AsyncClient(timeout=15) as http:
            r = await http.get(f"https://github-contributions-api.jogruber.de/v4/{GITHUB_USER}?y=last")
        r.raise_for_status()
        raw = r.json()
    except Exception as e:
        logger.error(f"GitHub fetch failed: {e}")
        if _gh_cache["data"]:
            return _gh_cache["data"]
        raise HTTPException(status_code=502, detail="Could not load GitHub contributions")

    # API may return total as {"lastYear": N}, {"2024": N}, or just N
    total_raw = raw.get("total", 0)
    if isinstance(total_raw, dict):
        total = total_raw.get("lastYear") or next(iter(total_raw.values()), 0)
    else:
        total = total_raw or 0

    data = {"user": GITHUB_USER, "total": total, "contributions": raw.get("contributions", [])}
    _gh_cache.update(ts=time.time(), data=data)
    return data


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
