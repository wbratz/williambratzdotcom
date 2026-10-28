// These functions work only on the supplied export values; they do not verify sources.
export type Row = Record<string, string>;
export type Point = { year: number; value: number | null };
export type Series = {
  label: string;
  color: string;
  points: Point[];
  dashed?: boolean;
};

export const THREE_CONDITION_FILE = "09_three_condition_analysis.csv";

// Current combined comparison: autism (converted to %), ADHD and asthma only.
export function threeConditionRows(rows: Row[]): Row[] {
  const baseline = rows.find((row) => row.surveillance_year === "2002");
  if (!baseline) throw new Error("Missing 2002 baseline");
  const keys = [
    "autism_per_1000",
    "adhd_ever_diagnosed_pct",
    "current_asthma_pct",
  ];
  const base = keys.map((key) => numberOrNull(baseline[key]));
  if (base.some((value) => value === null || value <= 0))
    throw new Error("Incomplete baseline");
  const baseSum = base[0] / 10 + base[1] + base[2];
  return rows.map((row) => {
    const values = keys.map((key) => numberOrNull(row[key]));
    const complete = values.every((value) => value !== null);
    const sum = complete ? values[0] / 10 + values[1] + values[2] : null;
    const equal = complete
      ? values.reduce((total, value, i) => total + (value / base[i]) * 100, 0) /
        3
      : null;
    return {
      surveillance_year: row.surveillance_year,
      autism_pct: values[0] === null ? "" : String(values[0] / 10),
      adhd_ever_diagnosed_pct: row.adhd_ever_diagnosed_pct,
      current_asthma_pct: row.current_asthma_pct,
      combined_condition_rate_sum_per_100: sum === null ? "" : String(sum),
      combined_sum_index_2002_100:
        sum === null ? "" : String((sum / baseSum) * 100),
      combined_equal_weight_index_2002_100: equal === null ? "" : String(equal),
      modeled_early_life_plus_prenatal_doses:
        row.modeled_early_life_plus_prenatal_doses,
      included_conditions: "autism; ADHD; asthma",
    };
  });
}

export function numberOrNull(value: string | undefined): number | null {
  if (value === undefined || value.trim() === "") return null;
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}
export function points(
  rows: Row[],
  key: string,
  yearKey = "surveillance_year",
): Point[] {
  return rows.map((row) => ({
    year: Number(row[yearKey]),
    value: numberOrNull(row[key]),
  }));
}
export function indexed(values: Point[], baseYear: number): Point[] {
  const base = values.find((point) => point.year === baseYear)?.value;
  if (!base) throw new Error("Missing index baseline");
  return values.map((point) => ({
    ...point,
    value: point.value === null ? null : (point.value / base) * 100,
  }));
}
export function paired(rows: Row[], x: string, y: string): [number, number][] {
  return rows.flatMap((row) => {
    const a = numberOrNull(row[x]);
    const b = numberOrNull(row[y]);
    return a === null || b === null ? [] : [[a, b] as [number, number]];
  });
}
export function pearson(values: [number, number][]) {
  if (values.length < 2) return null;
  const mx = values.reduce((sum, pair) => sum + pair[0], 0) / values.length;
  const my = values.reduce((sum, pair) => sum + pair[1], 0) / values.length;
  const cov = values.reduce((sum, [x, y]) => sum + (x - mx) * (y - my), 0);
  const variance = Math.sqrt(
    values.reduce((sum, [x]) => sum + (x - mx) ** 2, 0) *
      values.reduce((sum, [, y]) => sum + (y - my) ** 2, 0),
  );
  return variance ? cov / variance : null;
}
export function differences(values: [number, number][]): [number, number][] {
  return values
    .slice(1)
    .map(([x, y], i) => [x - values[i][0], y - values[i][1]]);
}
