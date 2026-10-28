import { privateFiles } from "../generated/private-files";
import {
  THREE_CONDITION_FILE,
  threeConditionRows,
} from "../../utils/vaccination-analysis";

export const vaccinationFiles = [
  {
    name: "01_autism_prevalence.csv",
    title: "Autism prevalence",
    description:
      "Age-8 surveillance figures and sparse profound-autism estimates.",
    type: "text/csv",
  },
  {
    name: "02_vaccine_schedule_models.csv",
    title: "Vaccine schedule models",
    description:
      "Reconstructed recommendation counts and hypothetical scenarios.",
    type: "text/csv",
  },
  {
    name: "03_child_health_observations_long.csv",
    title: "Child health observations",
    description:
      "Individual measures, age groups, and original survey periods.",
    type: "text/csv",
  },
  {
    name: "04_merged_annual_analysis.csv",
    title: "Annual comparisons",
    description: "The matched reporting years used in the main charts.",
    type: "text/csv",
  },
  {
    name: "05_childhood_afflictions_composite.csv",
    title: "Combined measures",
    description: "Rate sums and indices for four conditions.",
    type: "text/csv",
  },
  {
    name: "06_pearson_correlations.csv",
    title: "Correlation results",
    description:
      "All 18 supplied comparisons, sample counts, and matching notes.",
    type: "text/csv",
  },
  {
    name: "07_data_dictionary.csv",
    title: "Data dictionary",
    description: "Column meanings and units for the supplied CSV files.",
    type: "text/csv",
  },
  {
    name: "08_methodology_and_limitations.csv",
    title: "Methodology & limitations",
    description: "Source status, model assumptions, and interpretation limits.",
    type: "text/csv",
  },
  {
    name: "childhood_health_vaccine_correlations_one_page.png",
    title: "Original one-page overview",
    description: "The supplied chart image, unchanged.",
    type: "image/png",
  },
  {
    name: "childhood_health_vaccine_correlations_one_page.pdf",
    title: "Original PDF",
    description: "The supplied one-page reference, unchanged.",
    type: "application/pdf",
  },
] as const;

export type CsvRow = Record<string, string>;
export type CsvTable = {
  name: string;
  title: string;
  columns: string[];
  rows: CsvRow[];
};
export type VaccinationData = { tables: CsvTable[] };
export function privateFileContent(name: string) {
  const content = privateFiles[name];
  if (!content) throw new Error("Unknown private file");
  return Buffer.from(content, "base64");
}

// CSV exports contain quoted commas, escaped quotes, and intentionally empty cells.
export function parseCsv(source: string): {
  columns: string[];
  rows: CsvRow[];
} {
  const records: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const text = source.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = !quoted;
    } else if (!quoted && c === ",") {
      row.push(cell);
      cell = "";
    } else if (!quoted && (c === "\n" || c === "\r")) {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      if (row.some((value) => value !== "")) records.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (quoted) throw new Error("Unclosed CSV quote");
  if (cell || row.length) {
    row.push(cell);
    records.push(row);
  }
  const columns = records.shift() || [];
  return {
    columns,
    rows: records.map((values) => {
      if (values.length !== columns.length)
        throw new Error("Unexpected CSV column count");
      return Object.fromEntries(
        columns.map((column, i) => [column, values[i]]),
      );
    }),
  };
}

export function loadVaccinationData(): VaccinationData {
  const data: VaccinationData = {
    tables: vaccinationFiles
      .filter((file) => file.type === "text/csv")
      .map((file) => ({
        name: file.name,
        title: file.title,
        ...parseCsv(privateFileContent(file.name).toString("utf8")),
      })),
  };
  const current = threeConditionRows(
    data.tables.find((table) => table.name === "04_merged_annual_analysis.csv")!
      .rows,
  );
  data.tables.push({
    name: THREE_CONDITION_FILE,
    title: "Current combined comparison (autism, ADHD, asthma)",
    columns: Object.keys(current[0]),
    rows: current,
  });
  return data;
}
