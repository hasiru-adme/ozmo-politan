import type { Metadata } from "next";
import LegalLayout, { type LegalSection } from "@/components/LegalLayout";
import { LEGAL as L } from "@/lib/legalConfig";

export const metadata: Metadata = {
  title: "Terms of Service | OZMO",
  description: "The terms that apply when you use the OZMO website and services.",
};

const sections: LegalSection[] = [
  {
    heading: "About these terms",
    blocks: [
      {
        type: "p",
        text: `These terms apply to your use of our website and to the services provided by ${L.entity} (ABN ${L.abn}), trading as ${L.brand}. Individual projects may also have a written quote or agreement. If it conflicts with these terms, the quote or agreement prevails for that project.`,
      },
    ],
  },
  {
    heading: "Our services",
    blocks: [
      {
        type: "p",
        text: "We provide websites, business automation, integrations, AI-assisted workflows and related managed services. The exact scope, deliverables, timeline and price of each project are set out in a written quote that we confirm with you before work starts.",
      },
      {
        type: "p",
        text: "Examples and demonstrations on our website, including sample dashboards and workflow illustrations, are for illustration only and are not guarantees of results.",
      },
    ],
  },
  {
    heading: "Quotes and pricing",
    blocks: [
      {
        type: "ul",
        items: [
          "All prices are in Australian dollars (AUD). [Prices include / exclude GST.]",
          'Prices shown on our website as "from" are starting prices. The final price depends on scope and is confirmed in your written quote.',
          "Quotes are valid for [30] days unless stated otherwise.",
          "Work outside the agreed scope is quoted separately and only done with your approval.",
        ],
      },
    ],
  },
  {
    heading: "Payment and payment plans",
    blocks: [
      {
        type: "ul",
        items: [
          "[Describe payment terms, e.g. deposit of X% before work starts, balance on delivery, invoices payable within 14 days.]",
          "[If you offer instalment plans: describe how they work, whether any fees or interest apply, and what happens if a payment is missed.]",
          "[State your late payment position, e.g. we may pause work or managed services while an invoice is overdue.]",
        ],
      },
    ],
  },
  {
    heading: "Third-party software and fees",
    blocks: [
      {
        type: "p",
        text: "Our solutions may rely on third-party tools such as hosting platforms, CRMs, email, payment and AI services. Unless your quote says otherwise, subscription, usage and API fees charged by those providers are separate from our fees and are your responsibility. Those providers' own terms apply, and we are not responsible for changes to their services, pricing or availability.",
      },
    ],
  },
  {
    heading: "What we need from you",
    blocks: [
      {
        type: "ul",
        items: [
          "Accurate information, content and access that we reasonably need to do the work, provided on time.",
          "Timely feedback and approvals. Delays on your side may move delivery dates.",
          "Confirmation that you have the right to use any content, logos, images and data you give us.",
          "Compliance with the laws that apply to your business, including privacy and spam laws for any messages or data your systems handle.",
        ],
      },
    ],
  },
  {
    heading: "Ownership and intellectual property",
    blocks: [
      {
        type: "p",
        text: "[State clearly, e.g. On full payment, you own the custom content and deliverables created specifically for you, and you keep ownership of your domain, accounts and data.]",
      },
      {
        type: "p",
        text: "We keep ownership of our pre-existing tools, code libraries, templates and know-how, and grant you a [non-exclusive, perpetual] licence to use them as part of your deliverables. We may show completed work in our portfolio [unless you ask us not to].",
      },
    ],
  },
  {
    heading: "Support and managed services",
    blocks: [
      {
        type: "p",
        text: "[Describe your support offer, e.g. Projects include 3 months of support after launch, covering bug fixes and technical help for what we built. This does not include new features.]",
      },
      {
        type: "p",
        text: "[Describe monthly managed services: what is covered (hosting, maintenance, security, backups, support), the monthly fee, how to cancel and the notice period.]",
      },
    ],
  },
  {
    heading: "Changes, cancellation and refunds",
    blocks: [
      {
        type: "ul",
        items: [
          "[Describe how either party can cancel a project and how work already done is charged.]",
          "[Describe your refund position. Note: this does not limit rights you have under the Australian Consumer Law.]",
          "Either party may end a managed service by giving [30 days'] written notice.",
        ],
      },
    ],
  },
  {
    heading: "Australian Consumer Law",
    blocks: [
      {
        type: "p",
        text: "Our services come with guarantees that cannot be excluded under the Australian Consumer Law (ACL). Nothing in these terms excludes, restricts or modifies those guarantees or any other rights you have under the ACL. Where the law allows, our liability for a breach of a consumer guarantee is limited, at our option, to resupplying the services or paying the cost of having them resupplied.",
      },
    ],
  },
  {
    heading: "Limitation of liability",
    blocks: [
      {
        type: "p",
        text: "To the extent permitted by law, we are not liable for indirect or consequential loss, including loss of profit, revenue, data or business opportunity. Our total liability in connection with a project is limited to [the fees you paid us for that project in the preceding 12 months]. We do not guarantee that a website or system will be uninterrupted or error-free, or that it will produce a particular business result.",
      },
    ],
  },
  {
    heading: "Using our website",
    blocks: [
      {
        type: "ul",
        items: [
          "Use the site lawfully, and do not attempt to disrupt, scrape or gain unauthorised access to it.",
          "Content on this site is owned by or licensed to us. You may not copy or reuse it without permission.",
          "Links to third-party sites are provided for convenience. We are not responsible for their content.",
          "Information on this site is general in nature and not professional advice.",
        ],
      },
    ],
  },
  {
    heading: "Privacy",
    blocks: [
      {
        type: "p",
        text: "How we handle personal information is explained in our Privacy Policy at /privacy.",
      },
    ],
  },
  {
    heading: "Governing law",
    blocks: [
      {
        type: "p",
        text: "These terms are governed by the laws of Victoria, Australia. Both parties submit to the non-exclusive jurisdiction of the courts of Victoria and the Commonwealth of Australia.",
      },
    ],
  },
  {
    heading: "Contact us",
    blocks: [
      {
        type: "p",
        text: `${L.entity} · ABN ${L.abn} · ${L.address} · ${L.email} · ${L.phone}`,
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated={L.updated}
      intro="These terms explain how our website and services work, what you can expect from us, and what we ask from you."
      sections={sections}
    />
  );
}