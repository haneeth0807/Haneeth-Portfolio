{
  "project_name": "Personal Developer Portfolio (Haneeth)",
  "app_type": "portfolio",
  "theme": {
    "default": "dark",
    "toggle_supported": true,
    "dark_palette": {
      "bg_primary": "#0A0D12",
      "bg_secondary": "#111622",
      "bg_card": "rgba(17, 24, 39, 0.65)",
      "bg_card_border": "rgba(56, 189, 248, 0.25)",
      "glow_primary": "rgba(14, 165, 233, 0.15)",
      "glow_secondary": "rgba(20, 184, 166, 0.12)",
      "text_primary": "#F5F3EF",
      "text_secondary": "#94A3B8",
      "text_muted": "#64748B",
      "accent_blue": "#38BDF8",
      "accent_teal": "#14B8A6",
      "accent_pill_bg": "rgba(56, 189, 248, 0.12)",
      "accent_pill_border": "rgba(56, 189, 248, 0.3)"
    },
    "light_palette": {
      "bg_primary": "#F8FAFC",
      "bg_secondary": "#F1F5F9",
      "bg_card": "rgba(255, 255, 255, 0.85)",
      "bg_card_border": "rgba(14, 165, 233, 0.25)",
      "glow_primary": "rgba(56, 189, 248, 0.1)",
      "glow_secondary": "rgba(20, 184, 166, 0.08)",
      "text_primary": "#0F172A",
      "text_secondary": "#475569",
      "text_muted": "#64748B",
      "accent_blue": "#0284C7",
      "accent_teal": "#0D9488",
      "accent_pill_bg": "rgba(2, 132, 199, 0.08)",
      "accent_pill_border": "rgba(2, 132, 199, 0.25)"
    }
  },
  "typography": {
    "font_files": [
      "Plus Jakarta Sans",
      "Space Grotesk",
      "JetBrains Mono"
    ],
    "headings": {
      "font_family": "'Plus Jakarta Sans', sans-serif",
      "weights": "font-extrabold / font-bold",
      "h1": "text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight",
      "h2": "text-2xl sm:text-3xl lg:text-4xl tracking-tight font-bold",
      "h3": "text-xl sm:text-2xl font-semibold",
      "h4": "text-lg sm:text-xl font-medium"
    },
    "body": {
      "font_family": "'Plus Jakarta Sans', sans-serif",
      "class": "text-base text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed"
    },
    "mono_labels": {
      "font_family": "'JetBrains Mono', monospace",
      "class": "text-xs uppercase tracking-widest text-sky-400 font-medium"
    }
  },
  "logo_mark": {
    "description": "Custom SVG flame-like monogram HR logo in cream/cyan with subtle glowing backdrop, used in header & favicon",
    "monogram": "HR",
    "color": "#F5F3EF"
  },
  "navigation": {
    "type": "Floating Pill Header",
    "pages": [
      { "name": "Home", "path": "/" },
      { "name": "About Me", "path": "/about" },
      { "name": "Work", "path": "/work" },
      { "name": "Projects", "path": "/projects" },
      { "name": "Contact Me", "path": "/contact" }
    ],
    "style": "Glassmorphic rounded-full container with blur, active tab indicator pill animation using Framer Motion layoutId, right side dark/light theme toggle button"
  },
  "pages_and_features": {
    "home": {
      "hero": "Kinetic line-by-line masked text reveal, headline 'Building Digital Experiences with Precision & Purpose', subtle 3D tilt card for portrait photo",
      "heres_me": "Section featuring profile photo with teal/blue backdrop glow, short bio, call-to-action buttons",
      "side_projects_bento": "3 Bento tiles showcasing current highlights (Featured project, Spotify listening/podcast tile, Tech stack summary)",
      "github_contributions": "Real GitHub activity heat map component querying @haneeth0807 GitHub profile with daily grid boxes",
      "marquee": "Slow editorial text marquee with technology keywords and domain specialties"
    },
    "about": {
      "my_story_carousel": "Interactive slide carousel mapping life/career milestones with smooth navigation arrows & dot controls",
      "philosophy_cards": "Translucent glass cards with hover glow depicting engineering & design principles",
      "skills_pills": "Grouped pill tags for Skills 1-10 across Frontend, Backend, Tools & Architecture",
      "side_ventures": "Cards for Spotify podcast / audio creator section and technical writing blog highlights"
    },
    "work": {
      "summary_and_resume": "Resume download button with micro-interaction, career quick-stats counter widgets",
      "experience_timeline": "Interactive vertical timeline cards showing career experience, key accomplishments, tech tags",
      "education_cards": "Structured cards showing degree, university, timeline, relevant course highlights"
    },
    "projects": {
      "filter_tags": "All, Fullstack, AI/ML, Frontend, Open Source",
      "project_cards": "Problem/Solution outcome cards with live demo & GitHub repository links, tech tags, hover tilt",
      "modal_drawer": "Detailed view drawer or modal for deep-dive into project architecture"
    },
    "contact": {
      "info_cards": "Email, GitHub, LinkedIn, Location cards with copy-to-clipboard micro-interactions",
      "form": "Message form with validation, submitting to FastAPI `/api/contact` backend endpoint with Sonner toast alert feedback",
      "social_links": "Pill icons with glow states on hover"
    }
  },
  "image_urls": {
    "profile_portrait": "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHxfc29mdHdhcmUlMjBkZXZlbG9wZXIlMjBwb3J0cmFpdHxlbnwwfHx8fDE3OTA1MDA1NTl8MA&ixlib=rb-4.1.0&q=85",
    "profile_secondary": "https://images.unsplash.com/photo-1763536529823-953ff472bf35?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHxfc29mdHdhcmUlMjBkZXZlbG9wZXIlMjBwb3J0cmFpdHxlbnwwfHx8fDE3OTA1MDA1NTl8MA&ixlib=rb-4.1.0&q=85",
    "project_thumbs": [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHx8Y29kZSUyMGRhc2hib2FyZHxlbnwwfHx8fDE3OTA1MDA1NTl8MA&ixlib=rb-4.1.0&q=85",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHx8ZGF0YSUyMHZpc3VhbGl6YXRpb258ZW58MHx8fDE3OTA1MDA1NTl8MA&ixlib=rb-4.1.0&q=85",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHxsYXB0b3AlMjBjb2Rpbmd8ZW58MHx8fDE3OTA1MDA1NTl8MA&ixlib=rb-4.1.0&q=85"
    ]
  },
  "motion_and_libraries": {
    "framer_motion": "For page transitions, scroll triggers, active nav pill layoutId, hover card tilts",
    "lenis": "For smooth momentum scrolling engine",
    "lucide_react": "For icons throughout components",
    "sonner": "For contact form feedback toast notifications"
  },
  "data_testid_guidelines": {
    "nav": {
      "home_link": "nav-link-home",
      "about_link": "nav-link-about",
      "work_link": "nav-link-work",
      "projects_link": "nav-link-projects",
      "contact_link": "nav-link-contact",
      "theme_toggle": "theme-toggle-button"
    },
    "contact_form": {
      "name_input": "contact-name-input",
      "email_input": "contact-email-input",
      "subject_input": "contact-subject-input",
      "message_input": "contact-message-input",
      "submit_button": "contact-submit-button"
    },
    "work": {
      "resume_download": "resume-download-button"
    },
    "github_grid": "github-contribution-graph"
  },
  "instructions_to_main_agent": [
    "Strictly follow the 5-page layout structure (Home, About Me, Work, Projects, Contact Me) matching the screenshots.",
    "Maintain the dark palette by default (#0A0D12 near-black background with translucent blue/teal glowing cards), while supporting seamless light mode toggling.",
    "Use JS/JSX components since this repository uses React with JavaScript (.js/.jsx).",
    "Ensure all interactive elements have data-testid attributes attached for testing.",
    "Implement the FastAPI endpoint for contact form saving and verification in backend/app."
  ]
}

