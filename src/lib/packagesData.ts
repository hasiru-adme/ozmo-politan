import {
  AppWindow,
  Bot,
  BarChart3,
  Cloud,
  Cpu,
  Globe,
  Lock,
  Megaphone,
  Palette,
  ShoppingCart,
  Smartphone,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type Package = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  price: number; // USD, "From" price
  popular: boolean;
  features: string[];
};

export type Category = {
  id: string;
  label: string;
  tagline: string;
  icon: LucideIcon;
  packages: Package[];
};

const p = (
  id: string,
  name: string,
  eyebrow: string,
  description: string,
  price: number,
  features: string[],
  popular = false
): Package => ({ id, name, eyebrow, description, price, popular, features });

export const categories: Category[] = [
  {
    id: "website",
    label: "Website",
    tagline: "Business websites, landing pages and portfolios.",
    icon: Globe,
    packages: [
      p("website-starter", "Starter", "GET ONLINE", "Everything you need to establish a professional digital presence.", 1800, [
        "Professional website",
        "Mobile responsive design",
        "Basic SEO setup",
        "Contact & enquiry forms",
        "SSL & security",
        "Managed hosting",
      ]),
      p("website-business", "Business", "GROW", "A stronger digital system designed to generate leads and save time.", 3500, [
        "Everything in Starter",
        "Advanced website structure",
        "Lead capture system",
        "Business automation",
        "Analytics & tracking",
        "Priority technical support",
      ], true),
      p("website-custom", "Custom", "SCALE", "A custom digital solution built around the way your business works.", 6000, [
        "Custom design system",
        "Multi-language support",
        "Third-party integrations",
        "CMS & content workflows",
        "Performance optimisation",
        "Custom infrastructure",
      ]),
    ],
  },
  {
    id: "webapp",
    label: "Web App",
    tagline: "Dashboards, portals, SaaS and booking systems.",
    icon: AppWindow,
    packages: [
      p("webapp-basic", "Basic App", "LAUNCH", "A focused web app that solves one core problem well.", 4000, [
        "User login & accounts",
        "Core feature set",
        "Admin panel",
        "Responsive interface",
        "Managed hosting",
        "Basic analytics",
      ]),
      p("webapp-pro", "Pro App", "GROW", "A full product with roles, payments and integrations.", 8000, [
        "Everything in Basic App",
        "Roles & permissions",
        "Payments & billing",
        "API & integrations",
        "Notifications & email",
        "Priority technical support",
      ], true),
      p("webapp-enterprise", "Enterprise", "SCALE", "A scalable platform built for teams, volume and security.", 15000, [
        "Multi-tenant architecture",
        "Single sign-on (SSO)",
        "Advanced reporting",
        "Audit logs & compliance",
        "Load-tested infrastructure",
        "Dedicated support",
      ]),
    ],
  },
  {
    id: "iot",
    label: "IoT",
    tagline: "Smart devices, sensors and live monitoring.",
    icon: Cpu,
    packages: [
      p("iot-pilot", "Pilot", "PROVE IT", "A small connected setup to test your idea in the real world.", 3500, [
        "Sensor & device setup",
        "Cloud data collection",
        "Live status dashboard",
        "Basic alerts",
        "Device documentation",
        "Managed cloud hosting",
      ]),
      p("iot-connected", "Connected", "GROW", "A reliable multi-device system with dashboards and automation.", 7500, [
        "Everything in Pilot",
        "Multi-device management",
        "Real-time dashboards",
        "Rules & automation",
        "SMS & email alerts",
        "Remote firmware updates",
      ], true),
      p("iot-industrial", "Industrial", "SCALE", "Production-grade IoT for factories, farms and large sites.", 14000, [
        "Custom hardware integration",
        "Edge processing",
        "Predictive maintenance",
        "ERP & system integration",
        "Secure device provisioning",
        "24/7 monitoring",
      ]),
    ],
  },
  {
    id: "ai",
    label: "AI",
    tagline: "Chatbots, AI automation and custom AI tools.",
    icon: Bot,
    packages: [
      p("ai-assistant", "Assistant", "GET STARTED", "An AI assistant trained on your business to help customers and staff.", 2500, [
        "Website or WhatsApp chatbot",
        "Trained on your content",
        "Lead capture",
        "Human handover",
        "Conversation analytics",
        "Managed hosting",
      ]),
      p("ai-automation", "Automation", "GROW", "AI that handles repetitive work across your tools and documents.", 6000, [
        "Everything in Assistant",
        "Document & data processing",
        "Email & CRM automation",
        "Custom AI workflows",
        "Approval & review steps",
        "Priority technical support",
      ], true),
      p("ai-custom", "Custom AI", "SCALE", "A bespoke AI solution designed around your data and processes.", 12000, [
        "Custom AI agents",
        "Private data pipelines",
        "Model evaluation & tuning",
        "System integrations",
        "Usage & cost controls",
        "Dedicated support",
      ]),
    ],
  },
  {
    id: "mobile",
    label: "Mobile App",
    tagline: "iOS and Android apps for your customers or team.",
    icon: Smartphone,
    packages: [
      p("mobile-starter", "Starter App", "LAUNCH", "A simple, polished app on iOS and Android.", 5000, [
        "iOS & Android build",
        "User accounts",
        "Core feature set",
        "Push notifications",
        "App store submission",
        "Basic analytics",
      ]),
      p("mobile-business", "Business App", "GROW", "A feature-rich app connected to your systems.", 10000, [
        "Everything in Starter App",
        "Payments & subscriptions",
        "Admin dashboard",
        "API integrations",
        "Offline support",
        "Priority technical support",
      ], true),
      p("mobile-custom", "Custom App", "SCALE", "A complex app with custom features and infrastructure.", 18000, [
        "Custom backend",
        "Real-time features",
        "Hardware & device access",
        "Advanced security",
        "Load-tested infrastructure",
        "Dedicated support",
      ]),
    ],
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    tagline: "Online stores, payments and inventory.",
    icon: ShoppingCart,
    packages: [
      p("ecom-starter", "Starter Store", "SELL ONLINE", "A clean online store ready to take orders.", 2800, [
        "Product catalogue",
        "Cart & checkout",
        "Online payments",
        "Mobile responsive design",
        "Basic SEO setup",
        "Managed hosting",
      ]),
      p("ecom-growth", "Growth Store", "GROW", "A store built to convert, retain and upsell customers.", 5500, [
        "Everything in Starter Store",
        "Inventory management",
        "Discounts & coupons",
        "Abandoned cart recovery",
        "Shipping integrations",
        "Analytics & tracking",
      ], true),
      p("ecom-custom", "Custom Store", "SCALE", "A custom commerce platform for high volume or complex catalogues.", 10000, [
        "Multi-vendor or B2B support",
        "ERP & POS integration",
        "Custom checkout flows",
        "Multi-currency & language",
        "Performance optimisation",
        "Dedicated support",
      ]),
    ],
  },
  {
    id: "automation",
    label: "Automation",
    tagline: "Workflows, CRM and email automation, integrations.",
    icon: Workflow,
    packages: [
      p("auto-essentials", "Essentials", "SAVE TIME", "Automate your most repetitive tasks in a few days.", 1200, [
        "Up to 3 workflows",
        "Form & email automation",
        "App-to-app syncing",
        "Notifications & alerts",
        "Documentation",
        "30-day support",
      ]),
      p("auto-business", "Business", "GROW", "Connected systems that run your daily operations.", 3000, [
        "Everything in Essentials",
        "CRM setup & automation",
        "Lead routing & follow-ups",
        "Reporting automation",
        "Error monitoring",
        "Priority technical support",
      ], true),
      p("auto-custom", "Custom", "SCALE", "Complex, custom automation across your whole business.", 7000, [
        "Custom integrations & APIs",
        "Multi-step approval flows",
        "Legacy system connections",
        "Custom dashboards",
        "Scalable infrastructure",
        "Dedicated support",
      ]),
    ],
  },
  {
    id: "data",
    label: "Data & Analytics",
    tagline: "Dashboards, reporting and business intelligence.",
    icon: BarChart3,
    packages: [
      p("data-dashboard", "Dashboard", "SEE CLEARLY", "One clear dashboard with your most important numbers.", 2200, [
        "Up to 3 data sources",
        "Custom dashboard",
        "Key metrics & charts",
        "Scheduled email reports",
        "Secure access",
        "Managed hosting",
      ]),
      p("data-insights", "Insights", "GROW", "Connected data with deeper reporting across teams.", 5000, [
        "Everything in Dashboard",
        "Unlimited data sources",
        "Data cleaning & modelling",
        "Team & role views",
        "Alerts on key changes",
        "Priority technical support",
      ], true),
      p("data-platform", "Data Platform", "SCALE", "A full data warehouse and BI setup for larger organisations.", 11000, [
        "Data warehouse",
        "Automated pipelines",
        "Advanced BI & forecasting",
        "AI-assisted analysis",
        "Governance & access control",
        "Dedicated support",
      ]),
    ],
  },
  {
    id: "branding",
    label: "Branding & Design",
    tagline: "Logo, UI/UX and brand identity.",
    icon: Palette,
    packages: [
      p("brand-identity", "Identity", "LOOK THE PART", "A clear logo and visual identity for your business.", 900, [
        "Logo design",
        "Colour palette & typography",
        "Brand guidelines (short)",
        "Social media assets",
        "Business card design",
        "Source files",
      ]),
      p("brand-brand", "Brand", "GROW", "A complete brand system you can use everywhere.", 2500, [
        "Everything in Identity",
        "Full brand guidelines",
        "Stationery & templates",
        "Presentation template",
        "Brand voice & messaging",
        "Packaging or signage design",
      ], true),
      p("brand-uiux", "UI/UX Design", "SCALE", "Product design for websites and apps, ready for development.", 4500, [
        "User research & flows",
        "Wireframes",
        "High-fidelity UI design",
        "Interactive prototype",
        "Design system",
        "Developer handoff",
      ]),
    ],
  },
  {
    id: "marketing",
    label: "SEO & Marketing",
    tagline: "Search, ads, content and growth.",
    icon: Megaphone,
    packages: [
      p("mkt-foundation", "Foundation", "GET FOUND", "The SEO and tracking basics every business needs.", 700, [
        "SEO audit & fixes",
        "Google Business setup",
        "Keyword research",
        "Analytics & tracking",
        "Monthly report",
        "Email support",
      ]),
      p("mkt-growth", "Growth", "GROW", "Ongoing marketing to bring in steady leads.", 1500, [
        "Everything in Foundation",
        "Content & blog plan",
        "Paid ads management",
        "Email marketing",
        "Conversion optimisation",
        "Monthly strategy call",
      ], true),
      p("mkt-full", "Full Service", "SCALE", "A full digital marketing team working on your growth.", 3500, [
        "Multi-channel campaigns",
        "Social media management",
        "Video & creative content",
        "Marketing automation",
        "Advanced reporting",
        "Dedicated account manager",
      ]),
    ],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    tagline: "Hosting, migration and infrastructure.",
    icon: Cloud,
    packages: [
      p("cloud-setup", "Setup", "GET STABLE", "Reliable, secure hosting set up the right way.", 1500, [
        "Cloud hosting setup",
        "Domain, DNS & SSL",
        "Automated backups",
        "Basic monitoring",
        "Deployment pipeline",
        "Documentation",
      ]),
      p("cloud-migration", "Migration", "GROW", "Move your systems to the cloud without downtime.", 4000, [
        "Everything in Setup",
        "Infrastructure audit",
        "Zero-downtime migration",
        "Cost optimisation",
        "Staging environments",
        "Priority technical support",
      ], true),
      p("cloud-infra", "Infrastructure", "SCALE", "Scalable, automated infrastructure for growing platforms.", 9000, [
        "Infrastructure as code",
        "Auto-scaling & load balancing",
        "CI/CD pipelines",
        "Disaster recovery",
        "24/7 monitoring",
        "Dedicated support",
      ]),
    ],
  },
  {
    id: "security",
    label: "Cybersecurity",
    tagline: "Audits, protection and monitoring.",
    icon: Lock,
    packages: [
      p("sec-audit", "Audit", "KNOW YOUR RISK", "A clear picture of where your business is exposed.", 1500, [
        "Website & system scan",
        "Vulnerability report",
        "Prioritised fix list",
        "Access & password review",
        "Email security check",
        "Summary call",
      ]),
      p("sec-protect", "Protect", "GROW", "Fixes and protection put in place for you.", 4000, [
        "Everything in Audit",
        "Vulnerability fixes",
        "Firewall & WAF setup",
        "Backup & recovery plan",
        "Staff security guidance",
        "Priority technical support",
      ], true),
      p("sec-monitor", "Monitor", "SCALE", "Continuous monitoring and response for higher-risk businesses.", 8000, [
        "24/7 threat monitoring",
        "Incident response plan",
        "Penetration testing",
        "Compliance support",
        "Quarterly security reviews",
        "Dedicated support",
      ]),
    ],
  },
];