import type { Metadata } from "next";
import LegalLayout, { type LegalSection } from "@/components/LegalLayout";
import { LEGAL as L } from "@/lib/legalConfig";

export const metadata: Metadata = {
  title: "Privacy Policy | OZMO",
  description: "How OZMO collects, uses and protects your personal information.",
};

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    blocks: [
      {
        type: "p",
        text: `${L.entity} (ABN ${L.abn}), trading as ${L.brand} ("we", "us", "our"), provides websites, automation and digital systems for small businesses. This policy explains how we handle personal information in line with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).`,
      },
    ],
  },
  {
    heading: "What information we collect",
    blocks: [
      { type: "p", text: "Depending on how you deal with us, we may collect:" },
      {
        type: "ul",
        items: [
          "Contact details you give us: name, email address, phone number and business name.",
          "The message or enquiry you send, including which package or service you are interested in.",
          "Details you share during calls, discovery sessions and projects, such as how your business operates.",
          "Technical information when you visit our website: IP address, browser and device type, pages viewed and referring site.",
          "Records of our communications with you.",
        ],
      },
      {
        type: "p",
        text: "We do not ask for sensitive information (such as health or financial account details) through our website forms. Please do not include it in your message.",
      },
    ],
  },
  {
    heading: "How we collect it",
    blocks: [
      {
        type: "ul",
        items: [
          "Directly from you, through our contact forms, email, phone or meetings.",
          "Automatically, through cookies and similar technologies on our website (see section 7).",
          "From third parties, such as referrers, only where you have agreed or it is reasonable to do so.",
        ],
      },
    ],
  },
  {
    heading: "Why we collect and use it",
    blocks: [
      {
        type: "ul",
        items: [
          "To respond to your enquiry and provide quotes.",
          "To deliver, support and improve our services.",
          "To manage billing, payment plans and our business records.",
          "To keep our website secure and prevent spam or misuse.",
          "To understand how our website is used so we can improve it.",
          "To send you information about our services, only where you have consented or the law otherwise allows (see section 5).",
          "To meet our legal obligations.",
        ],
      },
    ],
  },
  {
    heading: "Marketing and the Spam Act",
    blocks: [
      {
        type: "p",
        text: "We only send commercial electronic messages (email or SMS) where we have your consent, or where you have an existing relationship with us and the message is relevant. Every marketing message includes our contact details and a functional way to unsubscribe. You can opt out at any time by using the unsubscribe link or contacting us.",
      },
    ],
  },
  {
    heading: "Who we share information with",
    blocks: [
      {
        type: "p",
        text: "We do not sell your personal information. We share it only with service providers who help us run our business, and only as needed. These may include:",
      },
      {
        type: "ul",
        items: [
          "[Website hosting and infrastructure provider, e.g. Vercel]",
          "[Email delivery provider, e.g. Resend / Google Workspace]",
          "[CRM or project tools, e.g. HubSpot / Notion]",
          "[Analytics provider, e.g. Google Analytics]",
          "[Payment or invoicing provider, e.g. Stripe / Xero]",
          "Professional advisers (accountants, lawyers) and authorities where required by law.",
        ],
      },
    ],
  },
  {
    heading: "Overseas disclosure",
    blocks: [
      {
        type: "p",
        text: "Some of our providers store or process data outside Australia, including in [countries, e.g. the United States]. [If any of our team members or contractors access information from outside Australia, list the country here.] Where we disclose personal information overseas, we take reasonable steps to make sure the recipient handles it in a way consistent with the APPs.",
      },
    ],
  },
  {
    heading: "Cookies and analytics",
    blocks: [
      {
        type: "p",
        text: "Our website may use cookies and similar technologies to remember preferences and measure traffic. You can block or delete cookies in your browser settings, but some features may not work as intended. [Describe your analytics setup, e.g. Google Analytics with IP anonymisation, and whether you show a cookie banner.]",
      },
    ],
  },
  {
    heading: "Security and retention",
    blocks: [
      {
        type: "p",
        text: "We take reasonable steps to protect personal information from misuse, interference, loss and unauthorised access, including access controls and encrypted connections. No method of transmission over the internet is completely secure, so we cannot guarantee absolute security.",
      },
      {
        type: "p",
        text: "We keep personal information only as long as we need it for the purposes above or as the law requires. When it is no longer needed, we take reasonable steps to delete or de-identify it. [State typical retention, e.g. unsuccessful enquiries deleted after 24 months.]",
      },
    ],
  },
  {
    heading: "Accessing and correcting your information",
    blocks: [
      {
        type: "p",
        text: `You can ask to access or correct the personal information we hold about you, or ask us to delete it, by contacting us at ${L.email}. We may need to verify your identity first. We will respond within a reasonable time, generally within 30 days.`,
      },
    ],
  },
  {
    heading: "Complaints",
    blocks: [
      {
        type: "p",
        text: `If you think we have breached the APPs, contact us at ${L.email} and we will investigate and reply in writing. If you are not satisfied with our response, you can complain to the Office of the Australian Information Commissioner (OAIC) at oaic.gov.au.`,
      },
    ],
  },
  {
    heading: "Changes to this policy",
    blocks: [
      {
        type: "p",
        text: "We may update this policy from time to time. The latest version is always on this page, with the date at the top.",
      },
    ],
  },
  {
    heading: "Contact us",
    blocks: [
      {
        type: "p",
        text: `${L.entity} · ${L.address} · ${L.email} · ${L.phone}`,
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated={L.updated}
      intro="We respect your privacy. This policy explains what personal information we collect, why we collect it, and the choices you have."
      sections={sections}
    />
  );
}