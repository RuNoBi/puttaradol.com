// Case studies. Source: LinkedIn projects + experience, and each repo's README.

export type DiagramStage = {
  label: string;
  nodes: { name: string; note?: string }[];
};

export type Project = {
  slug: string;
  title: string;
  short: string;
  kind: string;
  context: string;
  period: string;
  role: string;
  stack: string[];
  metric: { value: string; label: string };
  repo?: string;
  repoNote?: string;
  overview: string;
  problem: string;
  built: string[];
  results: { value: string; label: string }[];
  architecture: DiagramStage[];
};

export const projects: Project[] = [
  {
    slug: "ube-elt-platform",
    title: "Legacy-to-Warehouse ELT Platform",
    short: "Centralised fragmented legacy data into a warehouse and self-service data marts.",
    kind: "ELT platform",
    context: "UBE Group (Thailand) · Internship",
    period: "May – Jul 2026",
    role: "Data Engineer Intern",
    stack: ["MS SQL Server", "Airbyte", "PostgreSQL", "dbt", "Apache Airflow", "CKAN", "Docker"],
    metric: { value: "10 min → 3 s", label: "data retrieval" },
    repo: "https://github.com/RuNoBi/elt-infra-bootstrap",
    repoNote:
      "The public repository contains only the infrastructure and setup layer. Business logic, production pipelines, company data, credentials and internal configuration are intentionally excluded for confidentiality.",
    overview:
      "An end-to-end ELT pipeline that moves fragmented legacy data from Microsoft SQL Server into a structured PostgreSQL data warehouse, models it with dbt, and serves it through self-service data marts that people can search, preview, download and query by API.",
    problem:
      "Operational data lived in a legacy system and was scattered across sources. Getting a usable dataset meant manual work, and a single retrieval could take around ten minutes.",
    built: [
      "Designed and implemented the end-to-end ELT pipeline, from the legacy MS SQL Server source to a structured data warehouse and data marts.",
      "Built ingestion and transformation workflows with Airbyte, PostgreSQL, dbt and Apache Airflow.",
      "Automated orchestration with pipeline monitoring and failure alerts, to improve reliability and cut manual intervention.",
      "Developed self-service data marts where users can search, preview, download and access data through APIs for downstream analytics.",
      "Packaged the platform as a reproducible Docker bootstrap — environment templates, deployment scripts, health checks and documented setup for dev, staging and production.",
    ],
    results: [
      { value: "~10 min → 0.1–3 s", label: "Data retrieval time after the redesign" },
      { value: "Self-service", label: "Search, preview, download and API access" },
      { value: "Automated", label: "Orchestration, monitoring and failure alerts" },
    ],
    architecture: [
      { label: "Source", nodes: [{ name: "MS SQL Server", note: "legacy data" }] },
      { label: "Ingest", nodes: [{ name: "Airbyte", note: "EL connectors" }] },
      { label: "Warehouse", nodes: [{ name: "PostgreSQL", note: "data warehouse" }] },
      {
        label: "Transform",
        nodes: [
          { name: "dbt", note: "staging → marts" },
          { name: "Apache Airflow", note: "schedule · alerts" },
        ],
      },
      {
        label: "Serve",
        nodes: [
          { name: "Data marts + API", note: "self-service" },
          { name: "CKAN", note: "catalogue" },
        ],
      },
    ],
  },
  {
    slug: "city-issue-breach-predictor",
    title: "City Issue Breach Predictor",
    short: "Flags Bangkok Traffy Fondue complaints that are likely to breach their SLA.",
    kind: "Data pipeline + ML",
    context: "Chulalongkorn University · Project",
    period: "University project",
    role: "Data engineering & modelling",
    stack: ["Python", "Pandas", "scikit-learn", "LightGBM", "XGBoost", "TF-IDF", "Power BI"],
    metric: { value: "700K+", label: "records processed" },
    repo: "https://github.com/RuNoBi/city-issue-breach-predictor",
    overview:
      "An end-to-end data pipeline and prediction system for Bangkok's Traffy Fondue citizen-complaint platform. It predicts which issues are at risk of breaching their SLA and explains why, so the riskiest cases can be prioritised first.",
    problem:
      "Bangkok receives hundreds of thousands of citizen-reported issues a year, from road repairs to public safety, but there was no data-driven way to flag the cases most likely to miss their SLA.",
    built: [
      "Cleaned and standardised 700,000+ complaint records, converted timestamps and extracted temporal features.",
      "Prepared a 150,000-row modelling dataset, merged with weather metrics (temperature, humidity, pressure).",
      "Engineered SLA-related and risk features for breach prediction and interpretation.",
      "Trained and compared Logistic Regression, Random Forest, XGBoost, LightGBM and HistGradientBoosting, with class-imbalance control and calibration.",
      "Built a rule-based reasoning layer: TF-IDF risk n-grams from complaint text feed a readable explanation, a numeric risk score and a low / medium / high level.",
      "Developed interactive dashboards for completed and pending complaints with risk scores, levels and human-readable explanations.",
    ],
    results: [
      { value: "700K+", label: "Complaint records processed" },
      { value: "150K", label: "Rows in the modelling dataset" },
      { value: "5", label: "Models trained and compared" },
    ],
    architecture: [
      {
        label: "Sources",
        nodes: [
          { name: "Traffy Fondue", note: "700K+ complaints" },
          { name: "Weather", note: "temp · humidity" },
        ],
      },
      { label: "Prepare", nodes: [{ name: "Pandas", note: "clean · features" }] },
      { label: "Model", nodes: [{ name: "LightGBM + 4 more", note: "breach probability" }] },
      { label: "Explain", nodes: [{ name: "TF-IDF rules", note: "risk score + reason" }] },
      { label: "Serve", nodes: [{ name: "Dashboards", note: "completed · pending" }] },
    ],
  },
  {
    slug: "retail-etl-azure-databricks",
    title: "Retail ETL on Azure & Databricks",
    short: "A cloud ETL pipeline: Azure Data Factory orchestration, PySpark transforms, Delta Lake output.",
    kind: "Cloud ETL",
    context: "CP Axtra · Internship",
    period: "Jul 2025",
    role: "Data Engineer Intern",
    stack: ["Azure Data Factory", "Databricks", "PySpark", "Delta Lake", "SQL", "Git"],
    metric: { value: "ADF → Delta", label: "end-to-end ETL" },
    repo: "https://github.com/RuNoBi/retail-etl-azure-databricks",
    overview:
      "A hands-on project exploring cloud ETL with Azure Data Factory for orchestration and Databricks for processing, using the public Online Retail II dataset.",
    problem:
      "Raw retail transactions arrive messy — missing customers, no totals, timestamps that need splitting — and aren't ready for analysis.",
    built: [
      "Built an ETL pipeline with Azure Data Factory orchestrating Databricks jobs.",
      "Used PySpark to clean nulls, derive TotalAmount and extract dates from raw transaction data.",
      "Aggregated per customer to total spend and invoice count.",
      "Stored the results as Delta tables for downstream analysis.",
      "Practised modular pipeline development with Git-based version control.",
    ],
    results: [
      { value: "4 steps", label: "Extract → transform → aggregate → load" },
      { value: "Delta Lake", label: "Analysis-ready customer summary table" },
    ],
    architecture: [
      { label: "Source", nodes: [{ name: "Online Retail II", note: "CSV" }] },
      { label: "Orchestrate", nodes: [{ name: "Azure Data Factory" }] },
      { label: "Transform", nodes: [{ name: "Databricks", note: "PySpark" }] },
      { label: "Load", nodes: [{ name: "Delta Lake", note: "customer summary" }] },
    ],
  },
  {
    slug: "olist-retail-analytics",
    title: "Retail Domain Analytics on Databricks",
    short: "Customer behaviour, spending and segmentation on the Olist e-commerce dataset.",
    kind: "Analytics",
    context: "CP Axtra · Internship",
    period: "2025",
    role: "Data Engineer Intern",
    stack: ["Databricks", "PySpark", "SQL", "Delta Lake", "matplotlib"],
    metric: { value: "3 segments", label: "VIP · Loyal · Normal" },
    repo: "https://github.com/RuNoBi/retail-analytics-olist-databricks",
    overview:
      "An independent learning project during my CP Axtra internship, exploring analytics workflows on Databricks with the public Olist Brazilian e-commerce dataset.",
    problem:
      "Order, item, payment and customer data sit in separate tables. Answering simple business questions — who spends the most, and where — means joining and modelling them first.",
    built: [
      "Created Delta tables from raw customer, order, item and payment CSVs.",
      "Used PySpark and SQL to analyse customer distribution by state, order patterns and spending.",
      "Calculated per-customer order count, total spend and average order value.",
      "Built spend-based customer segments: VIP (> 1,000), Loyal (> 500) and Normal.",
      "Visualised spending distribution, segments and average order value.",
    ],
    results: [
      { value: "5 notebooks", label: "Load → analyse → visualise → segment" },
      { value: "3 segments", label: "VIP · Loyal · Normal" },
    ],
    architecture: [
      { label: "Source", nodes: [{ name: "Olist dataset", note: "orders · payments" }] },
      { label: "Load", nodes: [{ name: "Delta tables", note: "Databricks" }] },
      { label: "Analyse", nodes: [{ name: "PySpark + SQL", note: "state · spend · AOV" }] },
      { label: "Segment", nodes: [{ name: "VIP / Loyal / Normal" }] },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
