import type {
  PropertyDocument,
  PropertyDocumentCategory,
  PropertyDocumentStatus,
  PropertyDocumentType,
  PropertyCategory,
} from "@/lib/types";

export interface PropertyDocumentMeta {
  type: PropertyDocumentType;
  label: string;
  category: PropertyDocumentCategory;
  description: string;
  aliases: string[]; // Used for AI pattern matching & extraction
}

export const DOCUMENT_CATEGORIES: {
  id: PropertyDocumentCategory;
  title: string;
  description: string;
}[] = [
  {
    id: "title_land",
    title: "Title & Land Documents",
    description: "Ownership titles, government approvals, and land registration deeds.",
  },
  {
    id: "building_dev",
    title: "Building & Planning Approvals",
    description: "Architectural, structural, and municipal planning approvals.",
  },
  {
    id: "estate_dev",
    title: "Estate & Developer Documentation",
    description: "Private estate allocations, layout approvals, and infrastructure records.",
  },
  {
    id: "other",
    title: "Legal & Other Documentation",
    description: "Probate, letters of administration, court orders, and special agreements.",
  },
];

export const DOCUMENT_TYPES_META: Record<PropertyDocumentType, PropertyDocumentMeta> = {
  // --- Title & Land Documents ---
  certificate_of_occupancy: {
    type: "certificate_of_occupancy",
    label: "Certificate of Occupancy (C of O)",
    category: "title_land",
    description: "State government issued 99-year land grant certificate.",
    aliases: ["c of o", "certificate of occupancy", "cofo", "c-of-o"],
  },
  governors_consent: {
    type: "governors_consent",
    label: "Governor's Consent",
    category: "title_land",
    description: "Official executive approval for land transfer or mortgage assignment.",
    aliases: ["governor's consent", "governors consent", "gov consent"],
  },
  deed_of_assignment: {
    type: "deed_of_assignment",
    label: "Deed of Assignment",
    category: "title_land",
    description: "Legal instrument transferring land ownership from seller to buyer.",
    aliases: ["deed of assignment", "assignment deed"],
  },
  deed_of_lease: {
    type: "deed_of_lease",
    label: "Deed of Lease",
    category: "title_land",
    description: "Contract granting long-term leasehold property rights.",
    aliases: ["deed of lease", "leasehold deed"],
  },
  registered_deed: {
    type: "registered_deed",
    label: "Registered Deed",
    category: "title_land",
    description: "Title deed officially registered at the State Land Registry.",
    aliases: ["registered deed", "registered title deed"],
  },
  survey_plan: {
    type: "survey_plan",
    label: "Survey Plan",
    category: "title_land",
    description: "Licensed surveyor map showing exact boundaries and beacon numbers.",
    aliases: ["survey plan", "survey map", "survey"],
  },
  registered_survey: {
    type: "registered_survey",
    label: "Registered Survey Plan",
    category: "title_land",
    description: "Survey plan lodged and registered with the Surveyor General's Office.",
    aliases: ["registered survey", "lodged survey", "registered survey plan"],
  },
  excision: {
    type: "excision",
    label: "Excision",
    category: "title_land",
    description: "Government release of ancestral land back to indigenous community.",
    aliases: ["excision", "excised land"],
  },
  gazette: {
    type: "gazette",
    label: "Gazette",
    category: "title_land",
    description: "Official government publication documenting excised land boundaries.",
    aliases: ["gazette", "gazetted title"],
  },
  allocation_letter: {
    type: "allocation_letter",
    label: "Government Allocation Letter",
    category: "title_land",
    description: "Official allotment letter issued by state housing/land ministry.",
    aliases: ["allocation letter", "government allocation"],
  },
  power_of_attorney: {
    type: "power_of_attorney",
    label: "Power of Attorney",
    category: "title_land",
    description: "Legal authorization granting property management/sale authority.",
    aliases: ["power of attorney", "poa"],
  },
  purchase_receipt: {
    type: "purchase_receipt",
    label: "Purchase Receipt",
    category: "title_land",
    description: "Documented proof of land purchase payment.",
    aliases: ["purchase receipt", "payment receipt", "land receipt"],
  },
  land_agreement: {
    type: "land_agreement",
    label: "Land Purchase Agreement",
    category: "title_land",
    description: "Initial sale contract executed between buyer and vendor.",
    aliases: ["land agreement", "contract of sale", "sale agreement"],
  },

  // --- Building & Development Documents ---
  approved_building_plan: {
    type: "approved_building_plan",
    label: "Approved Building Plan",
    category: "building_dev",
    description: "State planning authority approval for building architectural design.",
    aliases: ["approved building plan", "building plan approval", "building plan"],
  },
  building_approval: {
    type: "building_approval",
    label: "Building Approval Certificate",
    category: "building_dev",
    description: "Formal construction permit issued by physical planning agency.",
    aliases: ["building approval", "construction approval"],
  },
  development_permit: {
    type: "development_permit",
    label: "Development Permit",
    category: "building_dev",
    description: "Official permit authorizing real estate development activities.",
    aliases: ["development permit", "dev permit"],
  },
  planning_permit: {
    type: "planning_permit",
    label: "Planning Permit",
    category: "building_dev",
    description: "Physical planning clearance for site utilization.",
    aliases: ["planning permit", "site clearance"],
  },
  as_built_approval: {
    type: "as_built_approval",
    label: "As-Built Structural Approval",
    category: "building_dev",
    description: "Post-construction structural inspection certification.",
    aliases: ["as built approval", "as-built approval", "structural certificate"],
  },
  environmental_planning_approval: {
    type: "environmental_planning_approval",
    label: "Environmental Impact / Planning Clearance",
    category: "building_dev",
    description: "Environmental agency assessment and drainage clearance.",
    aliases: ["environmental approval", "eia", "drainage clearance"],
  },

  // --- Estate & Developer Documents ---
  estate_allocation_letter: {
    type: "estate_allocation_letter",
    label: "Estate Allocation Letter",
    category: "estate_dev",
    description: "Developer allotment letter assigning specific plot or unit number.",
    aliases: ["estate allocation letter", "plot allocation letter"],
  },
  deed_of_assignment_developer: {
    type: "deed_of_assignment_developer",
    label: "Developer Deed of Assignment",
    category: "estate_dev",
    description: "Deed executed by property developer in favor of unit buyer.",
    aliases: ["developer deed of assignment", "developer assignment"],
  },
  developer_title: {
    type: "developer_title",
    label: "Developer Parent Title",
    category: "estate_dev",
    description: "Global title (C of O / Consent) covering the entire estate development.",
    aliases: ["developer title", "global c of o", "parent title", "global title"],
  },
  estate_survey: {
    type: "estate_survey",
    label: "Estate Master Survey",
    category: "estate_dev",
    description: "Overall perimeter survey of the estate layout.",
    aliases: ["estate survey", "master survey"],
  },
  estate_layout_approval: {
    type: "estate_layout_approval",
    label: "Approved Estate Layout",
    category: "estate_dev",
    description: "Government-approved master plan for the estate subdivision.",
    aliases: ["estate layout approval", "approved layout"],
  },
  infrastructure_service_charge: {
    type: "infrastructure_service_charge",
    label: "Estate Infrastructure / Service Documentation",
    category: "estate_dev",
    description: "Records of infrastructure levies and estate management covenants.",
    aliases: ["infrastructure document", "service charge deed", "estate covenant"],
  },

  // --- Other Documents ---
  probate_letters_of_admin: {
    type: "probate_letters_of_admin",
    label: "Probate / Letters of Administration",
    category: "other",
    description: "High Court authorization for inherited estate property transactions.",
    aliases: ["probate", "letters of administration", "letter of administration"],
  },
  court_order: {
    type: "court_order",
    label: "Court Order / Judgment",
    category: "other",
    description: "Judicial order validating property ownership or dispute resolution.",
    aliases: ["court order", "court judgment"],
  },
  other_documentation: {
    type: "other_documentation",
    label: "Other Documentation",
    category: "other",
    description: "Additional legal or vendor documentation.",
    aliases: ["other documentation", "other title"],
  },
};

export const STATUS_META: Record<
  PropertyDocumentStatus,
  { label: string; badgeClass: string; icon: string; description: string }
> = {
  available: {
    label: "Available / Sighted",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: "✓",
    description: "Document confirmed available or sighted.",
  },
  pending: {
    label: "Processing / Pending",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
    icon: "⏳",
    description: "Document in process with government agency or developer.",
  },
  requires_verification: {
    label: "Requires Verification",
    badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-300",
    icon: "🔍",
    description: "Source mentions document or vague title requiring legal verification.",
  },
  not_available: {
    label: "Not Available",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-300",
    icon: "✕",
    description: "Confirmed not available or not applicable for this property.",
  },
  not_applicable: {
    label: "Not Applicable",
    badgeClass: "bg-stone-100 text-stone-600 border-stone-200",
    icon: "—",
    description: "Document type does not apply to this property category.",
  },
  not_stated: {
    label: "Not Stated",
    badgeClass: "bg-stone-100 text-stone-500 border-stone-200",
    icon: "?",
    description: "No information stated in source description.",
  },
};

/**
 * Returns a complete normalized list of PropertyDocument items for a property.
 * Any omitted document type defaults to `not_stated`.
 */
export function normalizeDocumentation(
  existingDocs: PropertyDocument[] = []
): PropertyDocument[] {
  const map = new Map<PropertyDocumentType, PropertyDocument>();

  existingDocs.forEach((doc) => {
    if (DOCUMENT_TYPES_META[doc.type]) {
      map.set(doc.type, doc);
    }
  });

  return (Object.keys(DOCUMENT_TYPES_META) as PropertyDocumentType[]).map(
    (type) => {
      if (map.has(type)) {
        return map.get(type)!;
      }
      return {
        type,
        status: "not_stated",
      };
    }
  );
}

/**
 * Returns prioritized document types based on property category.
 */
export function getPrioritizedDocTypes(
  category: PropertyCategory,
  propertyType?: string
): PropertyDocumentType[] {
  if (category === "land") {
    return [
      "certificate_of_occupancy",
      "governors_consent",
      "registered_survey",
      "excision",
      "gazette",
      "deed_of_assignment",
      "allocation_letter",
      "estate_layout_approval",
    ];
  }

  if (propertyType === "apartment" || propertyType === "duplex" || propertyType === "terrace") {
    return [
      "certificate_of_occupancy",
      "governors_consent",
      "approved_building_plan",
      "deed_of_assignment",
      "developer_title",
      "estate_allocation_letter",
    ];
  }

  return [
    "certificate_of_occupancy",
    "governors_consent",
    "approved_building_plan",
    "deed_of_assignment",
    "registered_survey",
    "building_approval",
  ];
}
