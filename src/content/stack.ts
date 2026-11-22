// Tools and where each was actually used — no made-up proficiency bars.

export const categories = [
  "Languages",
  "Processing",
  "Ingestion & orchestration",
  "Storage & platforms",
  "Infrastructure",
  "ML & BI",
] as const;

export type Category = (typeof categories)[number];

export const stack: { name: string; category: Category; usedIn: string[] }[] = [
  { name: "Python", category: "Languages", usedIn: ["CP Axtra", "Breach Predictor"] },
  { name: "SQL", category: "Languages", usedIn: ["UBE Group", "CP Axtra", "Olist Analytics"] },

  { name: "dbt", category: "Processing", usedIn: ["UBE Group"] },
  { name: "PySpark", category: "Processing", usedIn: ["CP Axtra", "Retail ETL", "Olist Analytics"] },
  { name: "Pandas", category: "Processing", usedIn: ["Breach Predictor"] },
  { name: "Spark SQL", category: "Processing", usedIn: ["CP Axtra"] },

  { name: "Apache Airflow", category: "Ingestion & orchestration", usedIn: ["UBE Group"] },
  { name: "Airbyte", category: "Ingestion & orchestration", usedIn: ["UBE Group"] },
  { name: "Azure Data Factory", category: "Ingestion & orchestration", usedIn: ["CP Axtra", "Retail ETL"] },

  { name: "PostgreSQL", category: "Storage & platforms", usedIn: ["UBE Group"] },
  { name: "MS SQL Server", category: "Storage & platforms", usedIn: ["UBE Group"] },
  { name: "Databricks", category: "Storage & platforms", usedIn: ["CP Axtra", "Retail ETL", "Olist Analytics"] },
  { name: "Delta Lake", category: "Storage & platforms", usedIn: ["Retail ETL", "Olist Analytics"] },
  { name: "Tencent WeData", category: "Storage & platforms", usedIn: ["CP Axtra"] },

  { name: "Docker", category: "Infrastructure", usedIn: ["UBE Group"] },
  { name: "CKAN", category: "Infrastructure", usedIn: ["UBE Group"] },
  { name: "Git / GitHub", category: "Infrastructure", usedIn: ["All projects"] },

  { name: "scikit-learn", category: "ML & BI", usedIn: ["Breach Predictor"] },
  { name: "LightGBM / XGBoost", category: "ML & BI", usedIn: ["Breach Predictor"] },
  { name: "Power BI", category: "ML & BI", usedIn: ["Breach Predictor"] },
  { name: "matplotlib", category: "ML & BI", usedIn: ["Olist Analytics"] },
];
