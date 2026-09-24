import type { Faq, Insight, SiteContent, Testimonial } from "@/lib/types";

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    quote:
      "Buying land was something I'd delayed for years because I was afraid of making the wrong decision. Abundance Abodes explained every document, answered every question, and guided me through the process with confidence.",
    attribution: "Verified land buyer, Lagos",
  },
  {
    id: "t-2",
    quote:
      "They told me what a property could not do before telling me what it could. That honesty saved me from an expensive mistake — and helped me find something better.",
    attribution: "First-time home buyer",
  },
];

export const faqs: Faq[] = [
  {
    id: "f-1",
    question: "What does 'verified' actually mean at Abundance Abodes?",
    answer:
      "Before any property reaches you, we examine the essentials: title documents, survey plans, ownership authority to sell, and — for estates and allocations — confirmation of status and outstanding obligations. If a property cannot pass these checks, we do not present it, no matter how attractive the price looks.",
  },
  {
    id: "f-2",
    question: "Do you charge buyers for your brokerage service?",
    answer:
      "Our consultation and advisory conversations are free. Where we earn commission, it is typically paid by sellers or developers on completed transactions — and where any buyer-side fee applies, we disclose it clearly in writing before you commit to anything.",
  },
  {
    id: "f-3",
    question: "Can you help with Governor's Consent and documentation?",
    answer:
      "Yes. We guide clients through Governor's Consent applications, deed preparation, and estate allocation paperwork, working with licensed professionals where required. You always know which stage your documentation is at and what comes next.",
  },
  {
    id: "f-4",
    question: "I'm in the diaspora. Can I buy through you?",
    answer:
      "We regularly serve Nigerians abroad. Consultations happen over video calls, verification reports are shared digitally, and inspections can be recorded or conducted live so you see exactly what you are buying before you commit funds.",
  },
  {
    id: "f-5",
    question: "Do you handle rentals and property management?",
    answer:
      "Our core focus is sales brokerage and acquisition advisory for homes and land. For management services we prefer to refer clients to vetted specialists rather than spread our attention thin — ask us and we will point you well.",
  },
  {
    id: "f-6",
    question: "How do I start?",
    answer:
      "Book a consultation. Tell us your goals, budget, and timeline; we will shortlist verified options that fit, explain the honest trade-offs of each, and support you from offer through documentation to handover.",
  },
];

export const insights: Insight[] = [
  {
    id: "i-1",
    slug: "verify-before-you-buy-nigerian-land-documents-explained",
    title: "Verify Before You Buy: Nigerian Land Documents Explained",
    excerpt:
      "C of O, Governor's Consent, gazette, excision, deed of assignment — what each document means, who issues it, and why it decides whether your land purchase is safe.",
    tag: "Due diligence",
    publishedAt: "2026-07-21T09:00:00Z",
    readMinutes: 7,
    body: [
      {
        paragraphs: [
          "Most painful stories in Nigerian real estate begin the same way: money moved before documents were understood. The antidote is not cynicism — it is knowing exactly which papers matter and what each one proves.",
        ],
      },
      {
        heading: "Certificate of Occupancy (C of O)",
        paragraphs: [
          "The C of O is the state government's confirmation of a right of occupancy over a parcel of land, typically for 99 years. It is the strongest common evidence of title. When a seller cannot produce one, that alone should slow everything down until the alternative chain of title has been properly examined.",
        ],
      },
      {
        heading: "Governor's Consent",
        paragraphs: [
          "When land that already holds a right of occupancy changes hands, the transfer must be consented to by the Governor of the state. Without this consent, your purchase may exist only between you and the seller — not against the rest of the world. Always confirm whether consent has been obtained, is being processed, or is not yet applicable.",
        ],
      },
      {
        heading: "Survey plan and charting",
        paragraphs: [
          "A registered survey plan fixes the exact coordinates and boundaries of the land. Charting those coordinates at the state lands bureau tells you whether the land falls under government acquisition, committed land, or freehold zones. This single check prevents some of the most expensive mistakes in the market.",
        ],
      },
      {
        heading: "Gazette and excision (Lagos context)",
        paragraphs: [
          "For communities whose land was acquired by government, an excision formally releases part of it back, published in the state gazette. Land described as 'under excision' is not yet yours to build safely — verify the gazette publication yourself or have a professional do it.",
        ],
      },
      {
        heading: "Deed of assignment",
        paragraphs: [
          "The deed of assignment is the contract that transfers interest from seller to buyer. Read every clause: description of the property, consideration, covenants, and conditions precedent. Never sign a deed you have not had reviewed line by line.",
        ],
      },
      {
        paragraphs: [
          "None of these checks requires luck — only discipline. At Abundance Abodes, verification precedes recommendation on every listing we present. If you would like a second opinion on a property you have found elsewhere, book a consultation and we will gladly review the documents with you.",
        ],
      },
    ],
  },
  {
    id: "i-2",
    slug: "ibejulekki-investor-checklist-2026",
    title: "The Ibeju-Lekki Investor's Checklist",
    excerpt:
      "The corridor anchored by the deep sea port and airport project keeps drawing capital. Here is the checklist we run before recommending any Ibeju-Lekki estate to clients.",
    tag: "Investment",
    publishedAt: "2026-06-30T09:00:00Z",
    readMinutes: 6,
    body: [
      {
        paragraphs: [
          "Ibeju-Lekki rewards preparation more than enthusiasm. The growth story is real, but not every estate within shouting distance of the headline projects deserves your money. This is the internal checklist we apply before presenting any scheme.",
        ],
      },
      {
        heading: "1. Documentation status",
        paragraphs: [
          "Ask three questions: Is there a gazetted excision or C of O covering the scheme? Is there a registered survey plan with plot numbers? What exactly will you receive after final payment? Vague answers here end our evaluation immediately.",
        ],
      },
      {
        heading: "2. Physical inspection, not brochure inspection",
        paragraphs: [
          "Drive the access road yourself. Check drainage, fencing progress, and whether allocated plots show genuine development activity. An estate you can only see in renders is a promise, not yet a property.",
        ],
      },
      {
        heading: "3. Developer track record",
        paragraphs: [
          "How many schemes has the company delivered? Speak to existing subscribers where possible. Payment-plan flexibility is good; delivery history is better.",
        ],
      },
      {
        heading: "4. Exit liquidity",
        paragraphs: [
          "Consider who buys after you. Plots near paved roads, gates, and commercial frontage resell far faster than interior plots. Investment value concentrates at the edges of convenience.",
        ],
      },
      {
        paragraphs: [
          "Run any opportunity past this list and the weak ones reveal themselves quickly. Better still, bring it to us — due diligence is precisely what we do all day.",
        ],
      },
    ],
  },
  {
    id: "i-3",
    slug: "first-home-in-lagos-realistic-budget-guide",
    title: "Buying Your First Home in Lagos: A Realistic Budget Guide",
    excerpt:
      "Beyond the sticker price: agency fees, consent costs, service charges, and the hidden arithmetic first-time buyers should plan for.",
    tag: "Buyer guides",
    publishedAt: "2026-05-26T09:00:00Z",
    readMinutes: 8,
    body: [
      {
        paragraphs: [
          "First-time buyers usually budget for one number: the price of the house. Experienced buyers budget for five. Planning for the full picture turns an intimidating process into a managed project.",
        ],
      },
      {
        heading: "The five numbers",
        paragraphs: [
          "First, the purchase price itself. Second, agency and legal fees, commonly calculated as percentages of the price — agree them in writing early. Third, perfection-of-title costs such as Governor's Consent fees and stamp duties, which vary by state and property value. Fourth, moving and immediate furnishing costs, which buyers routinely underestimate. Fifth, if buying into an estate, the service charge structure and what it actually covers.",
        ],
      },
      {
        heading: "Financing honestly",
        paragraphs: [
          "Mortgage depth in Nigeria is improving but limited; most purchases still resolve through savings, family structures, or structured instalments directly with developers. Be honest about which of those you are using, because each carries different timing risks. Whatever the route, keep proof of every payment — it becomes part of your title file later.",
        ],
      },
      {
        heading: "Off-plan versus finished",
        paragraphs: [
          "Off-plan pricing can be meaningfully lower, but you carry completion risk. Insist on a verifiable developer track record, staged payments tied to construction milestones, and a lawyer-reviewed contract. A finished home costs more per square metre and buys certainty instead.",
        ],
      },
      {
        paragraphs: [
          "Bring your numbers to a consultation and we will pressure-test them with current market data — before you make offers, not after.",
        ],
      },
    ],
  },
];

export const siteContent: SiteContent = {
  addressLines: ["Serving clients across Nigeria", "Lagos • Ibadan • Ogun"],
};
