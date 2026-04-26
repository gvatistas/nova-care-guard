/**
 * Certa — single source of truth for every visible string and number.
 * Per spec §10. Components must NEVER hard-code copy or claims.
 */

export const site = {
  brand: {
    name: "Certa",
    legalName: "Certa Labs Technologies",
    tagline: "The operational layer for AI in healthcare.",
    thesis: "We make probabilistic models non-probabilistic, for clinical reasoning.",
    fellow: "Palantir Startup Fellow · Cohort 002",
    raise: { amount: "$3M", valuation: "$15M" },
  },

  hero: {
    eyebrow: "CERTA HEALTH ／ FORMERLY PCARE+",
    classified: { left: "CERTA ／ DOSSIER 01 · OPERATIONAL LAYER", right: "PALANTIR STARTUP FELLOW · COHORT 002" },
    h1: "The operational layer for AI in healthcare.",
    subhead:
      "Certa makes probabilistic models behave deterministically inside the clinic. Published guidelines compile into verified, FHIR-native decision artifacts that any agent — Claude, ChatGPT, your in-house assistant — calls as a tool. No inference at runtime. No hallucination. Every recommendation traceable to its source page and paragraph.",
    primaryCta: { label: "TRY THE API", href: "#contact" },
    secondaryCta: { label: "READ THE WHITEPAPER", href: "/whitepaper" },
    trust: [
      "PALANTIR STARTUP FELLOW",
      "SEED · $3M / $15M",
      "SOC 2 TYPE II · IN PROGRESS",
      "FHIR R4 ／ MCP ／ CDS HOOKS",
    ],
    dossier: { num: "Nº 01", label: "DETERMINISTIC CLINICAL REASONING" },
  },

  problem: {
    classified: { left: "CERTA ／ DOSSIER 02 · THE PROBLEM", right: "FRONTIER MEDICINE" },
    eyebrow: "02 · THE PROBLEM OF AI IN HEALTHCARE",
    h1: "Generative models are wrong about medicine — quietly, repeatedly, at scale.",
    lead:
      "Frontier models reach roughly three-quarters of expert performance on rigorous clinical evaluation. The remaining quarter is where patients live. Inference is, by construction, a sample from a distribution: shrink the variance and you still have a tail, and in medicine the tail is where someone misses a screening, gets the wrong dose, or ends up in an ICU eighteen months later.",
    pillars: [
      {
        k: "ACCURACY",
        h: "A quarter of clinical answers fail expert review.",
        b: "Across hundreds of millions of consumer health conversations a year, that residue is not noise. It is the product.",
      },
      {
        k: "PROVENANCE",
        h: "No source. No page. No paragraph.",
        b: "Two clinicians ask the same question and receive two answers. Neither is auditable. Neither is reproducible. Neither is defensible to a regulator.",
      },
      {
        k: "LIABILITY",
        h: "The FDA now classifies non-transparent CDS as a medical device.",
        b: "Disclaimers do not absorb the exposure. RAG, chain-of-thought, function calling — every retrofit still ends in a sample from a distribution.",
      },
    ],
    closer:
      "For clinical reasoning, you do not need a smaller distribution. You need a different object entirely.",
  },

  pricing: {
    classified: { left: "CERTA ／ DOSSIER 08 · COMMERCIALS", right: "TIERED" },
    eyebrow: "07 · PRICING",
    h1: "Three commercial surfaces. One artifact underneath.",
    sub: "Usage-metered API at the bottom. White-glove infrastructure at the top. Every tier ships with the same audit pack.",
    tiers: [
      {
        name: "DEVELOPER",
        tag: "API ACCESS",
        price: "$0.04",
        unit: "/ recommendation",
        blurb: "Prototype against the live catalog. Pay only for verified recommendations returned. No floor.",
        features: [
          "Public catalog (40+ guidelines)",
          "MCP, REST, Python, TS, Go SDKs",
          "Audit pack on every response",
          "Community support",
        ],
        cta: { label: "GET API KEY", href: "#contact" },
        accent: "graphite",
      },
      {
        name: "ENTERPRISE",
        tag: "PRODUCTION",
        price: "From $48K",
        unit: "/ year",
        blurb: "Volume-tiered for teams shipping clinical AI in production. SLAs, BAA, and a named clinical lead.",
        features: [
          "Full catalog + custom compilations",
          "HIPAA BAA · SOC 2 Type II",
          "<100ms p50 latency SLA",
          "FHIR SDC artifact export",
          "Dedicated solutions engineer",
        ],
        cta: { label: "REQUEST QUOTE", href: "#contact" },
        accent: "bone",
        featured: true,
      },
      {
        name: "SOVEREIGN",
        tag: "ON-PREM ／ AIR-GAP",
        price: "Custom",
        unit: "annual license",
        blurb: "For health systems, payers, and governments that require artifacts running entirely inside their perimeter.",
        features: [
          "On-prem, air-gapped, or VPC deployment",
          "FedRAMP Moderate (roadmap)",
          "Bespoke guideline pipelines",
          "Quarterly clinical-council review",
          "24/7 named-on-call support",
        ],
        cta: { label: "TALK TO SALES", href: "#contact" },
        accent: "blue",
      },
    ],
  },

  probabilism: {
    classified: { left: "CERTA // DOSSIER 02 · WHY THIS EXISTS", right: "CLASSIFIED" },
    eyebrow: "01 · WHY THIS EXISTS",
    h1: "Frontier models are wrong about medicine — predictably, repeatedly, at scale.",
    lead:
      "OpenAI's HealthBench, the first rigorous public evaluation of medical reasoning across 262 physicians, 26 specialties, and 49 languages, established the ceiling: top frontier models score around 75% expert-level. The trajectory is asymptotic. More training shrinks the variance; it does not collapse it to a delta. In medicine, the tail kills people.",
    body:
      "Three taxes follow. An accuracy tax — at frontier scale, billions of clinical conversations a year, ~25% of which a physician panel would flag as incomplete, incorrect, or unsafe. A cost tax — every clinical dialogue burns 5,000–40,000 tokens of inference at 2–30¢ per turn. A liability tax — the FDA's January 2026 final guidance classifies non-transparent CDS as a medical device; disclaimers do not absorb it.",
    closer:
      "RAG, chain-of-thought, function calling — every technique that promises to fix this still ends in a sample from a distribution. Variance shrinks; the distribution remains. For clinical reasoning, you do not need a smaller distribution. You need a different object.",
    stats: [
      { value: "≈ 250M", caption: "Suboptimal clinical responses at frontier scale, per year", source: "HealthBench × WAU disclosure (May 2025)" },
      { value: "54%", caption: "Mean US ambulatory guideline compliance", source: "McGlynn et al., NEJM 2003" },
      { value: "5%", caption: "Adults receiving all recommended preventive services", source: "HHS ODPHP 2024" },
      { value: "≈ 1M", caption: "Preventable deaths in NA per year", source: "CDC 2024; Statistics Canada 2023" },
    ],
  },

  compiler: {
    classified: { left: "CERTA // DOSSIER 03 · THE THESIS", right: "BUILD-TIME → RUN-TIME" },
    eyebrow: "02 · THE THESIS",
    h1: "We use language models the way compilers use optimization passes.",
    body1:
      "At build time, an LLM extracts the decision logic from a clinical guideline — every conditional branch, every eligibility threshold, every recommendation — and produces a static, FHIR-compliant Structured Data Capture artifact that encodes the full decision tree. Schema-enforced generation makes structural validity mathematical. An SMT solver proves exhaustiveness, determinism, and reachability across the entire infinite input space — not a finite test suite.",
    body2:
      "At runtime, the LLM is gone. The artifact is the binary. A patient state goes in, a guideline-concordant recommendation comes out, with a pointer to the source page and paragraph. Zero inference. Zero hallucination. Every output reproducible.",
    body3:
      "Conversational intelligence and clinical correctness become separable concerns. Your AI agent — Claude, ChatGPT, Gemini, your in-house assistant — handles language. Certa handles medicine. Worrying about your model hallucinating a screening recommendation becomes like worrying about a web browser miscalculating a bank balance.",
    buildLane: ["PDF", "LLM", "Schema-Enforced Gen", "SMT Verify", "Graph Verify", "Static FHIR SDC Artifact"],
    runLane: ["Binary", "MCP / REST / SDK", "Your Agent"],
  },

  janeDoe: {
    classified: { left: "CERTA // DOSSIER 04 · ONE PATIENT", right: "EYES ONLY" },
    eyebrow: "03 · ONE PATIENT",
    h1: "Jane Doe is 52, a smoker, due for screenings she has been entitled to for years.",
    lead:
      "Two timelines. Same patient, same guideline, two systems. The difference between them — eighteen months and roughly $284,000 — is the addressable problem in one row.",
    patient: {
      name: "Jane Doe, 52",
      profile: "Female · BMI 28.4 · Smoker (12 pk-yr)",
      vitals: [
        { l: "BP", v: "138/88" },
        { l: "A1c", v: "6.1%" },
        { l: "LDL", v: "142" },
      ],
      caption: "Synthetic patient · USPSTF Grade A LDCT eligibility",
    },
    without: {
      pill: "✕ WITHOUT CERTA",
      nodes: [
        { label: "Colonoscopy", sublabel: "Ordered on schedule. Routine.", status: "Completed" as const },
        { label: "Lung cancer screening", sublabel: "20 pack-year history buried in chart. Not surfaced at the encounter.", status: "Deferred" as const },
        { label: "LDCT scan", sublabel: "USPSTF Grade A recommendation. Eligible. Never ordered.", status: "Missed" as const, critical: true },
      ],
      stat: { time: "18 MONTHS LATER", outcome: "LATE-STAGE DIAGNOSIS", cost: "$288,000 TREATMENT COST" },
    },
    with: {
      pill: "✓ WITH CERTA",
      nodes: [
        { label: "Colonoscopy", sublabel: "ACS guideline triggered. Order auto-generated, traceable.", status: "Scheduled" as const },
        { label: "Lung cancer screening", sublabel: "20 pack-year history detected at intake. USPSTF Grade A pathway entered.", status: "Detected" as const },
        { label: "LDCT scan", sublabel: "Order generated with full provenance trail to source guideline page.", status: "Ordered" as const },
      ],
      stat: { time: "SAME VISIT", outcome: "EARLY DETECTION", cost: "$4,200 SCREENING COST" },
    },
    auditPack: [
      { k: "artifact_id",  v: "certa.uspstf.lung-cancer-screening@v2.1.0-2026.03" },
      { k: "source_pdf",   v: "uspstf_2021_lung_cancer_screening.pdf" },
      { k: "source_page",  v: "4, paragraph 3" },
      { k: "verification", v: "SMT-proven exhaustiveness, determinism, reachability" },
      { k: "fhir_resource",v: "QuestionnaireResponse → Order/MedicationRequest" },
      { k: "compile_log",  v: "certa-build-2026.03.14T18:22:11Z" },
      { k: "signature",    v: "ed25519:9b7e170e…c207" },
    ],
  },

  howItWorks: {
    classified: { left: "CERTA // DOSSIER 05 · THE PIPELINE", right: "VERIFIED" },
    eyebrow: "04 · HOW IT WORKS",
    h1: "From PDF to verified, deployable artifact. In five stages.",
    pips: ["ZERO HALLUCINATION", "ZERO INFERENCE COST VARIABILITY"],
    stages: [
      {
        num: "01" as const, name: "INGEST", short: "Parse & Structure",
        desc: "Layout-aware multimodal parsing turns guideline PDFs — text, tables, flowcharts — into a structured logic graph.",
        badge: "FHIR R4 inputs · 80%+ flowchart fidelity",
      },
      {
        num: "02" as const, name: "NORMALIZE", short: "Type & Constrain",
        desc: "Schema-enforced generation produces FHIR SDC items by construction. Structural validity is mathematical.",
        badge: "0.0% schema violation",
      },
      {
        num: "03" as const, name: "COMPILE", short: "Prove Correctness",
        desc: "Constrained generation emits decision logic; an SMT solver proves exhaustiveness, determinism, and reachability across the entire infinite input space.",
        badge: "SMT-verified",
      },
      {
        num: "04" as const, name: "VERIFY", short: "Validate & Audit",
        desc: "Graph-theoretic checks confirm acyclicity, connectivity, no orphan recommendations, no dead-end subtrees.",
        badge: "100% reachable, 0 dead rules",
      },
      {
        num: "05" as const, name: "DEPLOY", short: "Ship as Infrastructure",
        desc: "Static FHIR SDC artifact. Runs on any SDC renderer. Callable as an MCP tool. Zero inference at runtime.",
        badge: "Air-gap, on-prem, or cloud",
      },
    ],
    compliance: ["HIPAA · COMPLIANT", "FHIR R4 · NATIVE", "HL7 CDS HOOKS · SUPPORTED"],
    closer:
      "The same artifact deploys to Google's Android FHIR SDK, NLM's LHC-Forms, and CSIRO Smart Forms — without our involvement.",
  },

  guideBench: {
    classified: { left: "CERTA // DOSSIER 06 · OPEN BENCHMARK", right: "LIVE" },
    eyebrow: "05 · OPEN BENCHMARK",
    h1: "GuideBench.",
    h1Tail: "The open evaluation framework for clinical decision logic.",
    sub: "10 guidelines. 750+ synthetic patients. 4 fidelity metrics.",
    body:
      "Modeled on the Hugging Face Open LLM Leaderboard and LM Arena. Ten foundational guidelines. 750+ synthetic patient profiles, including counterfactual pairs that cross clinical thresholds (age 49 vs 50; 19 vs 20 pack-year). Four metrics: exact-outcome match, counterfactual robustness, provenance traceability, error-criticality weighting. Open source. Re-runnable on any pipeline.",
    aggregate: { fidelity: 98.7, patients: 750 },
    industryAvg: 72.3,
    guidelines: [
      { source: "USPSTF",  name: "Lung Cancer (LDCT)",          patients: 142, fidelity: 99.1, status: "Verified" as const },
      { source: "ACS",     name: "Colorectal Screening",        patients: 128, fidelity: 98.4, status: "Verified" as const },
      { source: "ACC/AHA", name: "Cardiovascular Risk",         patients: 156, fidelity: 97.8, status: "Verified" as const },
      { source: "ADA",     name: "Type 2 Diabetes",             patients: 134, fidelity: 99.3, status: "Verified" as const },
      { source: "USPSTF",  name: "Breast Cancer (Mammography)", patients:  98, fidelity: 98.9, status: "Verified" as const },
      { source: "USPSTF",  name: "Cervical Cancer (Pap/HPV)",   patients:  92, fidelity: 99.5, status: "Verified" as const },
    ],
    refresh: "2026-04-25 06:11 UTC",
    methodology: "arXiv:2509.xxxxx",
    repo: "github.com/certa-labs/guidebench",
  },

  projectAlpha: {
    classified: { left: "CERTA // DOSSIER 07 · DEPLOYED", right: "OPERATIONAL" },
    eyebrow: "06 · DEPLOYED",
    h1: "Project Alpha — five Quebec health networks, twenty clinical sites, in production.",
    sub: "Real-time deployment monitoring across our installed base.",
    body:
      "Adherence to thirteen USPSTF and Choisir-avec-soin preventive services rose from a 45% baseline to a verified 94% at the most recent quarter. Intake time dropped 90%. More than one thousand action plans are issued every day from the same compiled artifact running across every clinic.",
    totals: { clinics: 20, baselineAdherence: 45, currentAdherence: 94 },
    outcomes: [
      "90% INTAKE TIME REDUCTION",
      ">1,000 ACTION PLANS / DAY",
      "94% PREVENTIVE-SERVICE ADHERENCE",
    ],
    closer:
      "Project Alpha is the basis of every audit-evidence claim Certa makes to the FDA, CMS, and our customers' regulators. It is also why we are not a slide deck.",
  },

  build: {
    classified: { left: "CERTA // DOSSIER 08 · INTEGRATE", right: "RUN-TIME" },
    eyebrow: "07 · BUILD",
    h1: "Three lines of MCP. Or REST. Or one of three SDKs.",
    body:
      "Certa ships as MCP-first. The Linux Foundation's Agentic AI Foundation governs the protocol; OpenAI, Google, Microsoft, and Amazon have adopted it. Your agent calls Certa as a tool, no custom integration. For environments without MCP, our REST API and SDKs in Python, TypeScript, and Go cover the rest. Median latency under 100 ms. SOC 2 Type II audit in progress; HIPAA BAA on day one.",
    catalog: [
      { source: "USPSTF",  name: "Lung Cancer Screening (LDCT)",  version: "v2021", compiledAt: "2026-03-14", days: 42 },
      { source: "USPSTF",  name: "Colorectal Cancer Screening",   version: "v2021", compiledAt: "2026-04-02", days: 23 },
      { source: "USPSTF",  name: "Breast Cancer (Mammography)",   version: "v2024", compiledAt: "2026-04-19", days:  6 },
      { source: "ADA",     name: "Type 2 Diabetes — Standards",   version: "v2025", compiledAt: "2026-04-08", days: 17 },
      { source: "ACC/AHA", name: "ASCVD Primary Prevention",      version: "v2024", compiledAt: "2026-03-30", days: 26 },
      { source: "NICE",    name: "Hypertension in Adults (NG136)",version: "v2023", compiledAt: "2026-04-22", days:  3 },
    ],
    catalogFooter:
      "Catalog grows weekly. Compiled artifacts respect a 60-day freshness SLA from source publication.",
  },

  segments: {
    classified: { left: "CERTA // DOSSIER 09 · DEPLOYMENT SURFACES", right: "Q-BRANCH" },
    eyebrow: "08 · WHO IT IS FOR",
    h1: "One pipeline. Six deployment surfaces.",
    sub: "Each surface is a full pitch — copy is written for the lead persona of that segment.",
    items: [
      {
        id: "frontier-labs",
        name: "Frontier Labs",
        accent: "var(--seg-purple)",
        accentHsl: "hsl(var(--seg-purple))",
        tagline: "Training data and runtime tool",
        stat: { value: "0.0%", label: "Hallucination rate" },
        pitch:
          "Replace the probabilistic-error tax on your consumer health surface. A single MCP call returns a deterministic, traceable clinical recommendation; your model handles the conversation. Audit pack ships with every response.",
        accounts: "OpenAI Health Safety · Anthropic Applied · Google DeepMind Health · xAI",
        hologram: "icosahedron" as const,
      },
      {
        id: "clinical-ai",
        name: "Clinical AI Products",
        accent: "var(--seg-blue)",
        accentHsl: "hsl(var(--seg-blue))",
        tagline: "Drop-in clinical reasoning",
        stat: { value: "<100 ms", label: "Median latency" },
        pitch:
          "Ship clinical decision support inside your product without staffing a clinical team. FHIR-native artifact embeds in any EHR workflow. The decision logic is on Certa's verified server; your UI stays thin.",
        accounts: "Abridge · OpenEvidence · Hippocratic · Glass · Ambience · Nabla · Elation · Commure",
        hologram: "octahedron" as const,
      },
      {
        id: "consumer-health",
        name: "Consumer Health Platforms",
        accent: "var(--seg-cyan)",
        accentHsl: "hsl(var(--seg-cyan))",
        tagline: "Recommendations as a service",
        stat: { value: "100%", label: "Guideline-backed" },
        pitch:
          "Apple Health tracks heart rate. Oura measures sleep. None of them can tell a user that their age, sex, smoking history, and ACC/AHA risk profile mean they should discuss statin therapy with their physician — without raising medical-device exposure. Certa returns the recommendation, with provenance. You render it.",
        accounts: "Apple · Oura · Withings · Garmin · Whoop",
        hologram: "heart" as const,
      },
      {
        id: "payers",
        name: "Payers",
        accent: "var(--seg-brown)",
        accentHsl: "hsl(var(--seg-brown))",
        tagline: "Preventive ROI at scale",
        stat: { value: "68×", label: "Cost asymmetry" },
        pitch:
          "Early detection at $4,200 vs late-stage treatment at $288K+. Population-level guideline bundles deploy through your member portal or care-management workflow. Our T-MSIS analysis identifies $320–450M in annual Medicaid billing gaps from missed USPSTF preventive services.",
        accounts: "UnitedHealth · CVS Aetna · Elevance · Humana · Centene",
        hologram: "dodecahedron" as const,
      },
      {
        id: "publishers",
        name: "Guideline Publishers",
        accent: "var(--seg-amber)",
        accentHsl: "hsl(var(--seg-amber))",
        tagline: "Compilation as a service",
        stat: { value: "≈50% → 98%", label: "Adherence delta" },
        pitch:
          "You spend years writing the guideline. It gets followed about half the time. Compilation-as-a-service turns your narrative into a verified, deployable artifact carrying your imprimatur. Your authority. Our distribution.",
        accounts: "USPSTF · ACC · AHA · ACOG · ACS · NICE",
        hologram: "torus" as const,
      },
      {
        id: "government",
        name: "Government & Public Health",
        accent: "var(--seg-slate)",
        accentHsl: "hsl(var(--seg-slate))",
        tagline: "RHTP-aligned infrastructure",
        stat: { value: "$10B/yr", label: "RHTP funding" },
        pitch:
          "The Rural Health Transformation Program allocates $10B per fiscal year FY2026–2030 with explicit mandates for AI-enabled, evidence-based preventive care. Certa artifacts are exactly the deliverable the statute names. Procurement is via cooperative agreement and SBIR/STTR; ISO 27001 and FedRAMP Moderate on the roadmap.",
        accounts: "CMS · CDC · VA · IHS · State health departments · IRAP / ISC (CA)",
        hologram: "tetrahedron" as const,
      },
    ],
  },

  cta: {
    classified: { left: "CERTA // DOSSIER 10 · BEGIN PROTOCOL", right: "READY" },
    eyebrow: "09 · GET STARTED",
    h1: "Three lines of code. The probabilistic-error tax goes away.",
    body:
      "Sign up for an API key. Read the methodology paper. Run GuideBench against your own model. Then route your clinical dialogues through Certa and watch the audit-pack land in your logs.",
    primaryCta: { label: "TRY THE API", href: "/docs" },
    secondaryCta: { label: "READ THE METHODOLOGY PAPER", href: "/whitepaper" },
    dossier: { num: "Nº 10", label: "BEGIN PROTOCOL" },
    footer: {
      tagline: "DECISIONS, NOT ADJECTIVES.",
      copyright: "© 2026 CERTA LABS TECHNOLOGIES. ALL RIGHTS RESERVED.",
      locations: ["Palo Alto, CA", "Denver, CO"],
      columns: [
        {
          title: "Product",
          links: [
            { label: "Whitepaper", href: "/whitepaper" },
            { label: "GuideBench", href: "/guidebench" },
            { label: "Catalog", href: "/docs/catalog" },
            { label: "Pricing", href: "/pricing" },
            { label: "Status", href: "https://status.certa.health" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Press", href: "/press" },
            { label: "Contact", href: "/contact" },
          ],
        },
        {
          title: "Legal",
          links: [
            { label: "Privacy", href: "/legal/privacy" },
            { label: "Terms", href: "/legal/terms" },
            { label: "BAA", href: "/legal/baa" },
            { label: "Security", href: "/security" },
            { label: "SOC 2 Letter", href: "/security/soc2" },
          ],
        },
      ],
    },
  },

  nav: [
    { href: "#how-it-works", label: "ARCHITECTURE" },
    { href: "#guidebench",   label: "GUIDEBENCH" },
    { href: "#project-alpha",label: "DEPLOYMENTS" },
    { href: "#build",        label: "BUILD" },
  ],
} as const;

export type SiteContent = typeof site;
