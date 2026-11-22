// Source: LinkedIn experience, education and certifications.

export type Role = {
  company: string;
  title: string;
  type: string;
  period: string;
  location: string;
  summary: string;
  points: string[];
  tools: string[];
  project?: string; // slug of a related case study
};

export const experience: Role[] = [
  {
    company: "UBE Group (Thailand)",
    title: "Data Engineer Intern",
    type: "Internship · On-site",
    period: "May – Jul 2026",
    location: "Rayong, Thailand",
    summary: "Built an end-to-end ELT platform that turned fragmented legacy data into a warehouse and self-service data marts.",
    points: [
      "Designed and implemented an end-to-end ELT pipeline to centralise fragmented legacy data into a structured data warehouse and data marts.",
      "Built ingestion and transformation workflows with Airbyte, PostgreSQL, dbt and Apache Airflow, with Microsoft SQL Server as the legacy source.",
      "Implemented automated orchestration, pipeline monitoring and failure alerts to improve reliability and reduce manual intervention.",
      "Developed self-service data marts that let users search, preview, download and access data through APIs.",
      "Improved data retrieval from about 10 minutes to 0.1–3 seconds through the redesigned architecture.",
    ],
    tools: ["SQL", "Airbyte", "PostgreSQL", "dbt", "Airflow", "MS SQL Server", "Docker"],
    project: "ube-elt-platform",
  },
  {
    company: "CP Axtra",
    title: "Data Engineer Intern",
    type: "Internship · Hybrid · BI Technology Trainee Program",
    period: "May – Jul 2025",
    location: "Bangkok, Thailand",
    summary: "Hands-on with cloud data engineering — Databricks, Azure Data Factory and PySpark — plus the Tencent WeData ecosystem.",
    points: [
      "Gained hands-on exposure to data engineering concepts through independent practice and experimentation.",
      "Explored Databricks and Azure Data Factory by building practice ETL/ELT workflows on the Online Retail II dataset.",
      "Developed PySpark transformation exercises covering cleaning, processing and preparation.",
      "Explored Tencent WeData and its ecosystem, including DLC, Spark SQL, TDSQL, EMR and TCHouse.",
    ],
    tools: ["Python", "SQL", "PySpark", "Databricks", "Azure Data Factory", "Delta Lake"],
    project: "retail-etl-azure-databricks",
  },
];

export const education = {
  school: "Chulalongkorn University",
  degree: "Bachelor of Engineering (B.Eng.)",
  field: "Computer Engineering & Digital Technology (CEDT)",
  period: "2024 – 2027",
  note: "Year 3",
};

export const certifications = [
  {
    name: "Certificate of Internship — Data Engineering",
    issuer: "UBE Group (Thailand)",
    date: "Jul 2026",
  },
  {
    name: "Business Intelligence Technology Trainee Program",
    issuer: "CP Axtra",
    date: "Aug 2025",
  },
];
