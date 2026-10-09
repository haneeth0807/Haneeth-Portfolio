import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { API } from "@/lib/lenis";
import { EASE } from "@/components/motion";

const EMPTY = { name: "", email: "", message: "" };

const Field = ({ label, id, children }) => (
  <label htmlFor={id} className="block">
    <span className="block mb-2 text-lg text-dim">{label}</span>
    {children}
  </label>
);

export const ContactForm = () => {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all the fields.");
      return;
    }
    setStatus("sending");
    try {
      await axios.post(`${API}/contact`, form);
      setStatus("sent");
      setForm(EMPTY);
      toast.success("Message sent! I'll get back to you soon.");
      setTimeout(() => setStatus("idle"), 3500);
    } catch (err) {
      setStatus("idle");
      const d = err.response?.data?.detail;
      toast.error(typeof d === "string" ? d : "Please check your details and try again.");
    }
  };

  return (
    <form onSubmit={submit} data-testid="contact-form" className="space-y-6" noValidate>
      <Field label="Name" id="c-name">
        <input id="c-name" data-testid="contact-name-input" className="field" placeholder="Your name →" value={form.name} onChange={set("name")} maxLength={100} />
      </Field>
      <Field label="Email" id="c-email">
        <input id="c-email" type="email" data-testid="contact-email-input" className="field" placeholder="your@email.com →" value={form.email} onChange={set("email")} maxLength={200} />
      </Field>
      <Field label="Message" id="c-msg">
        <textarea id="c-msg" data-testid="contact-message-input" data-lenis-prevent className="field min-h-[240px] resize-y" placeholder="Leave a message, tell me about your projects or just say Hello! →" value={form.message} onChange={set("message")} maxLength={5000} />
      </Field>
      <motion.button
        type="submit"
        data-testid="contact-submit-button"
        disabled={status === "sending"}
        whileTap={{ scale: 0.98 }}
        className="group relative w-full overflow-hidden rounded-xl bg-fg py-4 text-canvas text-lg font-semibold disabled:opacity-70"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={status} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="inline-flex items-center gap-2">
            {status === "sending" && <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>}
            {status === "sent" && <><Check className="w-5 h-5" /> Message sent</>}
            {status === "idle" && <>Send Message <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" /></>}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </form>
  );
};