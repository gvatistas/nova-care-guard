import { useState } from "react";
import { Section, SectionHeader, ClassifiedStrip, EyebrowLabel } from "@/components/hud";
import { site } from "@/content/site";

const CODE: Record<string, { lang: string; code: string }> = {
  MCP: {
    lang: "json",
    code: `{
  "mcp_servers": {
    "certa": {
      "url": "https://api.certa.health/mcp",
      "auth": { "type": "bearer", "token": "$CERTA_API_KEY" }
    }
  }
}`,
  },
  REST: {
    lang: "http",
    code: `POST https://api.certa.health/v1/next-question
Content-Type: application/json
Authorization: Bearer $CERTA_API_KEY

{
  "guideline": "uspstf.lung-cancer-screening@2021",
  "patient_state": {
    "age": 52,
    "sex": "F",
    "smoking": { "status": "current", "pack_years": 20 }
  }
}`,
  },
  PYTHON: {
    lang: "python",
    code: `from certa import Certa

c = Certa()  # reads CERTA_API_KEY from env
result = c.next_question(
    guideline="uspstf.lung-cancer-screening@2021",
    patient_state={
        "age": 52, "sex": "F",
        "smoking": {"status": "current", "pack_years": 20},
    },
)
print(result.recommendation)         # "LDCT screening, annual"
print(result.provenance.page)        # 4
print(result.audit_pack.signature)   # "ed25519:9b7e170e…c207"`,
  },
  TYPESCRIPT: {
    lang: "typescript",
    code: `import { Certa } from "@certa/sdk";

const c = new Certa(); // reads process.env.CERTA_API_KEY
const result = await c.nextQuestion({
  guideline: "uspstf.lung-cancer-screening@2021",
  patientState: {
    age: 52, sex: "F",
    smoking: { status: "current", packYears: 20 },
  },
});
console.log(result.recommendation);      // "LDCT screening, annual"
console.log(result.auditPack.signature); // "ed25519:9b7e170e…c207"`,
  },
};

const TABS = ["MCP", "REST", "PYTHON", "TYPESCRIPT"] as const;

const BuildWithCertaSection = () => {
  const c = site.build;
  const [tab, setTab] = useState<(typeof TABS)[number]>("MCP");
  const cur = CODE[tab];

  return (
    <Section id="build" surface="obsidian" scale="standard">
      <ClassifiedStrip left={c.classified.left} right={c.classified.right} />
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 mb-10">
        <div className="lg:col-span-6">
          <SectionHeader id="build" eyebrow={c.eyebrow} headline={c.h1} />
        </div>
        <p className="lg:col-span-6 text-body text-graphite">{c.body}</p>
      </div>

      {/* Code surface */}
      <div className="border border-rule bg-carbon">
        <div role="tablist" className="flex border-b border-rule overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={t === tab}
              onClick={() => setTab(t)}
              className="px-5 py-3 border-r border-rule text-mono-eyebrow whitespace-nowrap transition-colors"
              style={{
                color: t === tab ? "hsl(var(--certa-bone))" : "hsl(var(--certa-muted))",
                background: t === tab ? "hsl(var(--certa-ink))" : "transparent",
              }}
            >
              {t}
            </button>
          ))}
          <div className="flex-1 border-r border-rule" />
        </div>
        <pre className="overflow-x-auto px-6 py-5 text-mono-code text-bone/90 whitespace-pre">
          <code className={`language-${cur.lang}`}>{cur.code}</code>
        </pre>
      </div>

      {/* Catalog grid */}
      <div className="mt-12">
        <EyebrowLabel className="!text-bone/70">CATALOG · COMPILED ARTIFACTS</EyebrowLabel>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-l border-t border-rule">
          {c.catalog.map((it) => (
            <div key={it.name} className="border-r border-b border-rule bg-ink p-5">
              <EyebrowLabel>{it.source}</EyebrowLabel>
              <h3 className="mt-2 text-h3 text-bone">{it.name}</h3>
              <p className="mt-3 font-mono text-body-sm text-graphite">
                {it.version} · {it.compiledAt}
                <span className="ml-2 inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal-green" />
                  <span className="text-mono-eyebrow text-signal-green">{it.days}d</span>
                </span>
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-body-sm text-muted-foreground">{c.catalogFooter}</p>
      </div>
    </Section>
  );
};

export default BuildWithCertaSection;
