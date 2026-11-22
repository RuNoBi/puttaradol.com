// All personal info lives here. Edit this file — not the components.
// Source: LinkedIn (linkedin.com/in/puttaradol) and GitHub (github.com/RuNoBi).

export const profile = {
  name: "Puttaradol",
  fullName: "Puttaradol Pongpanich",
  nickname: "Run",
  role: "Data Engineer",
  headline: "I build pipelines that turn scattered data into something people can actually use.",
  summary:
    "Year-3 Computer Engineering & Digital Technology student at Chulalongkorn University, with two data engineering internships behind me — at UBE Group and CP Axtra.",
  status: "Open to internships",
  location: "Bangkok, TH",
  timezone: "Asia/Bangkok",
  siteUrl: "https://puttaradol.com",
  university: "Chulalongkorn University",
  program: "B.Eng. Computer Engineering & Digital Technology (CEDT)",
  focus: "ELT pipelines · data warehousing · orchestration",
  links: {
    // Leave empty to hide email everywhere on the site.
    email: "hello@puttaradol.com",
    github: "https://github.com/RuNoBi",
    linkedin: "https://www.linkedin.com/in/puttaradol/",
    instagram: "https://www.instagram.com/run_ptrd/",
  },
} as const;

/** Big numbers for the About section. Every figure comes from real work. */
export const stats = [
  { value: "2", label: "Data engineering internships", detail: "UBE Group · CP Axtra" },
  { value: "700K+", label: "Complaint records processed", detail: "City Issue Breach Predictor" },
  { value: "0.1–3 s", label: "Data retrieval, down from ~10 min", detail: "UBE warehouse & marts" },
  { value: "5", label: "ML models trained & compared", detail: "SLA breach prediction" },
] as const;

/** "How I work" — pipeline stages with the tools actually used at each. */
export const pipeline = [
  {
    id: "ingest",
    title: "Ingest",
    text: "Pull data out of the systems that own it — legacy databases, files, APIs — without breaking them.",
    tools: ["Airbyte", "Azure Data Factory", "MS SQL Server"],
  },
  {
    id: "store",
    title: "Store",
    text: "Land it somewhere structured and queryable, with a clear home for raw, cleaned and modelled data.",
    tools: ["PostgreSQL", "Delta Lake", "Databricks"],
  },
  {
    id: "transform",
    title: "Transform",
    text: "Model it into tables people understand — staging, warehouse, then marts built for real questions.",
    tools: ["dbt", "PySpark", "SQL"],
  },
  {
    id: "orchestrate",
    title: "Orchestrate",
    text: "Schedule, monitor and alert, so the pipeline runs itself and failures surface before users notice.",
    tools: ["Apache Airflow", "Docker"],
  },
  {
    id: "serve",
    title: "Serve",
    text: "Put the data where it's used — self-service marts, APIs, catalogues and dashboards.",
    tools: ["Data marts + API", "CKAN", "Power BI"],
  },
] as const;
