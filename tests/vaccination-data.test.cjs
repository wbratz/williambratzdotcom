const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const ts = require("typescript");
const originalTs = require.extensions[".ts"];
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
const {
  loadVaccinationData,
  parseCsv,
  vaccinationFiles,
  privateFileContent,
} = require("../src/server/vaccination-data.ts");
const {
  paired,
  pearson,
  differences,
  indexed,
  points,
  numberOrNull,
  threeConditionRows,
  THREE_CONDITION_FILE,
} = require("../utils/vaccination-analysis.ts");
const secret = require("../src/server/secret.ts");
const fileHandler = require("../src/server/secret-files-api.ts").default;
require.extensions[".ts"] = originalTs;
const data = loadVaccinationData();
const table = (name) => data.tables.find((table) => table.name === name).rows;

test("current comparison excludes obesity and recalculates all three-condition results", () => {
  const annual = table("04_merged_annual_analysis.csv");
  const current = threeConditionRows(annual);
  assert.deepEqual(
    threeConditionRows(annual.map((row) => ({ ...row, obesity_pct: "999" }))),
    current,
  );
  const start = current.find((row) => row.surveillance_year === "2002");
  const end = current.find((row) => row.surveillance_year === "2022");
  assert.equal(Number(start.combined_condition_rate_sum_per_100), 16.16);
  assert.equal(Number(end.combined_condition_rate_sum_per_100), 19.62);
  assert.equal(Number(start.combined_sum_index_2002_100), 100);
  assert.equal(Number(start.combined_equal_weight_index_2002_100), 100);
  assert.ok(
    Math.abs(
      Number(end.combined_equal_weight_index_2002_100) - 234.74808324205915,
    ) < 1e-10,
  );
  const pairs = paired(
    current,
    "modeled_early_life_plus_prenatal_doses",
    "combined_condition_rate_sum_per_100",
  );
  assert.equal(pairs.length, 11);
  assert.equal(differences(pairs).length, 10);
  assert.ok(Math.abs(pearson(pairs) - 0.8232055120909911) < 1e-10);
  assert.ok(
    Math.abs(pearson(differences(pairs)) - -0.16694008609913666) < 1e-10,
  );
  assert.ok(
    Math.abs(
      pearson(
        paired(
          current,
          "modeled_early_life_plus_prenatal_doses",
          "combined_equal_weight_index_2002_100",
        ),
      ) - 0.8975444452263723,
    ) < 1e-10,
  );
  assert.equal(
    current.find((row) => row.surveillance_year === "2000")
      .combined_condition_rate_sum_per_100,
    "",
  );
  assert.notEqual(
    current.find((row) => row.surveillance_year === "2020")
      .combined_condition_rate_sum_per_100,
    "",
  );
  assert.deepEqual(table(THREE_CONDITION_FILE), current);
});

test("all 18 exported correlations reproduce from their supplied source rows", () => {
  const annual = table("04_merged_annual_analysis.csv");
  const models = table("02_vaccine_schedule_models.csv");
  const combined = table("05_childhood_afflictions_composite.csv");
  const merged = annual.map((row) => ({
    ...row,
    ...models.find(
      (model) => model.surveillance_year === row.surveillance_year,
    ),
  }));
  const results = table("06_pearson_correlations.csv");
  assert.equal(results.length, 18);
  for (const row of results) {
    let values;
    if (row.model_note === "first_differences") {
      values = differences(
        paired(
          annual,
          "modeled_early_life_plus_prenatal_doses",
          row.comparison.startsWith("autism")
            ? "autism_per_1000"
            : "combined_condition_rate_sum_per100",
        ),
      );
    } else if (row.model_note === "composite_reconstructed") {
      values = paired(combined, row.x_variable, row.y_variable);
    } else if (row.comparison.startsWith("autism_vs_")) {
      values = paired(merged, row.x_variable, row.y_variable);
    } else {
      values = paired(
        annual,
        row.comparison.endsWith("same_year_model")
          ? "same_year_schedule_age2_doses_estimate"
          : "modeled_early_life_plus_prenatal_doses",
        row.y_variable.toLowerCase(),
      );
    }
    assert.equal(
      values.length,
      Number(row.n_paired_observations),
      row.comparison,
    );
    assert.ok(
      Math.abs(pearson(values) - Number(row.pearson_r)) <= 0.00000051,
      `${row.comparison}: ${pearson(values)} != ${row.pearson_r}`,
    );
  }
});

test("composite calculations match their labels and missing observations stay missing", () => {
  const rows = table("05_childhood_afflictions_composite.csv");
  const baseline = rows.find((row) => row.year === "2002");
  const keys = [
    "autism_pct",
    "adhd_ever_diagnosed_pct",
    "current_asthma_pct",
    "obesity_pct",
  ];
  for (const row of rows) {
    const sum = keys.reduce((total, key) => total + Number(row[key]), 0);
    const equal =
      keys.reduce(
        (total, key) =>
          total + (Number(row[key]) / Number(baseline[key])) * 100,
        0,
      ) / 4;
    assert.ok(
      Math.abs(sum - Number(row.combined_condition_rate_sum_per_100)) < 1e-8,
    );
    assert.ok(
      Math.abs(equal - Number(row.equal_weight_four_condition_index_2002_100)) <
        1e-5,
    );
  }
  const values = points(table("04_merged_annual_analysis.csv"), "obesity_pct");
  assert.equal(values.find((point) => point.year === 2020).value, null);
  assert.equal(
    indexed(values, 2002).find((point) => point.year === 2020).value,
    null,
  );
  assert.equal(
    indexed(values, 2002).find((point) => point.year === 2002).value,
    100,
  );
  assert.equal(numberOrNull(""), null);
});

test("all ten downloadable originals are byte-for-byte preserved", () => {
  assert.equal(vaccinationFiles.length, 10);
  for (const file of vaccinationFiles)
    assert.deepEqual(
      privateFileContent(file.name),
      readFileSync(`contents/private/childhood-vaccinations/${file.name}`),
      file.name,
    );
});

test("CSV reader preserves quoted commas, escaped quotes, newlines and empty cells", () => {
  const csv =
    '\uFEFFname,note,missing\r\nalpha,"comma, and ""quote""",\r\nbeta,"two\nlines",3\r\n';
  const parsed = parseCsv(csv);
  assert.deepEqual(parsed.rows, [
    { name: "alpha", note: 'comma, and "quote"', missing: "" },
    { name: "beta", note: "two\nlines", missing: "3" },
  ]);
});

test("original file endpoint denies unauthenticated access and unknown paths", async () => {
  const original = secret.authorized;
  const response = () => ({
    code: 200,
    headers: {},
    setHeader(key, value) {
      this.headers[key] = value;
    },
    getHeader(key) {
      return this.headers[key];
    },
    status(code) {
      this.code = code;
      return this;
    },
    end() {
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  });
  try {
    secret.authorized = async () => false;
    const deniedCurrent = response();
    await fileHandler(
      { method: "GET", query: { filename: THREE_CONDITION_FILE }, headers: {} },
      deniedCurrent,
    );
    assert.equal(deniedCurrent.code, 404);
    for (const file of vaccinationFiles) {
      const res = response();
      await fileHandler(
        { method: "GET", query: { filename: file.name }, headers: {} },
        res,
      );
      assert.equal(res.code, 404);
      assert.equal(res.body, undefined);
      assert.equal(
        res.headers["Cache-Control"],
        "private, no-store, max-age=0",
      );
    }
    secret.authorized = async () => true;
    const currentDownload = response();
    await fileHandler(
      { method: "GET", query: { filename: THREE_CONDITION_FILE }, headers: {} },
      currentDownload,
    );
    assert.equal(currentDownload.code, 200);
    assert.equal(
      currentDownload.headers["Content-Type"],
      "text/csv; charset=utf-8",
    );
    assert.deepEqual(
      parseCsv(currentDownload.body.toString()).rows,
      table(THREE_CONDITION_FILE),
    );
    const invalid = response();
    await fileHandler(
      { method: "GET", query: { filename: "../.env.local" }, headers: {} },
      invalid,
    );
    assert.equal(invalid.code, 404);
    const csv = response();
    await fileHandler(
      {
        method: "GET",
        query: { filename: "01_autism_prevalence.csv" },
        headers: {},
      },
      csv,
    );
    assert.equal(csv.code, 200);
    assert.equal(csv.headers["Content-Type"], "text/csv; charset=utf-8");
    assert.deepEqual(
      csv.body,
      readFileSync(
        "contents/private/childhood-vaccinations/01_autism_prevalence.csv",
      ),
    );
    const head = response();
    await fileHandler(
      {
        method: "HEAD",
        query: {
          filename: "childhood_health_vaccine_correlations_one_page.pdf",
        },
        headers: {},
      },
      head,
    );
    assert.equal(head.code, 200);
    assert.equal(head.headers["Content-Type"], "application/pdf");
    assert.equal(head.body, undefined);
  } finally {
    secret.authorized = original;
  }
});
