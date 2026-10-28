import { useState } from "react";
import Head from "../../compat/Head";
import Link from "./PrivateLink";
import type { VaccinationData } from "../../server/vaccination-data";
import SecretLineChart from "../SecretLineChart";
import {
  indexed,
  points,
  paired,
  pearson,
  differences,
  THREE_CONDITION_FILE,
} from "../../../utils/vaccination-analysis";
import base from "../../../styles/secret.module.css";
import styles from "../../../styles/vaccinations.module.css";

export type Props = { data?: VaccinationData; unavailable?: boolean };
const colors = {
  model: "#c3ee80",
  autism: "#ed9c80",
  adhd: "#79d4c0",
  asthma: "#b2a2ed",
  gold: "#edc575",
  composite: "#80bdec",
};
const modelKey = "modeled_early_life_plus_prenatal_doses";
const modelLabel = "Birth-year schedule: childhood + pregnancy";
const fileUrl = (name: string, download = false) =>
  `/api/secret-data/${encodeURIComponent(name)}${
    download ? "?download=1" : ""
  }`;
const signed = (value: number | null) =>
  value === null ? "—" : `${value >= 0 ? "+" : ""}${value.toFixed(3)}`;

export default function ChildhoodVaccinationsPage({
  data,
  unavailable,
}: Props) {
  const [tableName, setTableName] = useState(THREE_CONDITION_FILE);
  if (unavailable || !data)
    return (
      <div className={base.shell}>
        <main className={base.main}>
          <section className={base.gate}>
            <h1>Briefly offline.</h1>
            <p>
              This rabbit hole is temporarily unavailable. Please try again
              shortly.
            </p>
            <Link href="/secret/rabbit-holes">
              <a>← Rabbit holes</a>
            </Link>
          </section>
        </main>
      </div>
    );
  const table = (name: string) =>
    data.tables.find((table) => table.name === name)!.rows;
  const annual = table("04_merged_annual_analysis.csv");
  const models = table("02_vaccine_schedule_models.csv");
  const observations = table("03_child_health_observations_long.csv");
  const correlations = table("06_pearson_correlations.csv");
  const combined = table(THREE_CONDITION_FILE);
  const combinedChart = combined.filter(
    (row) => Number(row.surveillance_year) >= 2002,
  );
  const combinedStart = combined.find(
    (row) => row.surveillance_year === "2002",
  )!;
  const combinedEnd = combined.find((row) => row.surveillance_year === "2022")!;
  const combinedPairs = paired(
    combined,
    modelKey,
    "combined_condition_rate_sum_per_100",
  );
  const combinedChangePairs = differences(combinedPairs);
  const combinedEqualR = pearson(
    paired(combined, modelKey, "combined_equal_weight_index_2002_100"),
  );
  const rateSumIncrease =
    (Number(combinedEnd.combined_condition_rate_sum_per_100) /
      Number(combinedStart.combined_condition_rate_sum_per_100) -
      1) *
    100;
  const scheduleStart = Number(
    annual.find((row) => row.surveillance_year === "2002")![modelKey],
  );
  const scheduleEnd = Number(
    annual.find((row) => row.surveillance_year === "2022")![modelKey],
  );
  const scheduleIncrease = (scheduleEnd / scheduleStart - 1) * 100;
  const correlation = (name: string) => {
    if (name === "current_combined_vs_birth_year")
      return {
        pearson_r: String(pearson(combinedPairs)),
        n_paired_observations: String(combinedPairs.length),
      };
    if (name === "current_combined_changes")
      return {
        pearson_r: String(pearson(combinedChangePairs)),
        n_paired_observations: String(combinedChangePairs.length),
      };
    return correlations.find((row) => row.comparison === name)!;
  };
  const chosen = data.tables.find((table) => table.name === tableName)!;
  const modelSeries = {
    label: modelLabel,
    color: colors.model,
    points: indexed(points(annual, modelKey), 2000),
  };
  const overview = "childhood_health_vaccine_correlations_one_page";
  const snapshot = [
    {
      label: "Autism",
      key: "autism_vs_childhood_plus_maternal_scenario",
      color: colors.autism,
    },
    {
      label: "ADHD",
      key: "adhd_ever_diagnosed_pct_vs_birth_cohort_model",
      color: colors.adhd,
    },
    {
      label: "Asthma",
      key: "current_asthma_pct_vs_birth_cohort_model",
      color: colors.asthma,
    },
    {
      label: "Sum of three condition rates",
      key: "current_combined_vs_birth_year",
      color: colors.composite,
    },
  ];
  const variants = [
    [
      "Schedule in the reporting year",
      "autism_vs_same_year_schedule",
      "Use the schedule from the year autism was measured, rather than the year the children were born.",
    ],
    [
      "Original birth-year estimate",
      "autism_vs_original_birth_year_schedule",
      "Use the original reconstructed childhood dose count for the year the age-8 group was born.",
    ],
    [
      "Revised routine-childhood estimate",
      "autism_vs_revised_fixed_childhood_schedule",
      "Use the revised count of routine doses by age 2, before adding separate flu or pregnancy estimates. The export does not document the full reconstruction.",
    ],
    [
      "Child doses + pregnancy doses",
      "autism_vs_childhood_plus_maternal_scenario",
      "Add the estimated childhood flu doses and assumed doses recommended to the mother during pregnancy to the revised routine-childhood count.",
    ],
    [
      "Child + pregnancy estimate, plus 2 COVID doses",
      "autism_vs_childhood_plus_maternal_plus_COVID_2_doses_scenario",
      "Keep that combined estimate, then add 2 hypothetical COVID doses at age 7–8 for the group observed in 2022.",
    ],
    [
      "Child + pregnancy estimate, plus 3 COVID doses",
      "autism_vs_childhood_plus_maternal_plus_COVID_3_doses_scenario",
      "Use the same combined estimate, but add 3 hypothetical COVID doses instead of 2 for that group.",
    ],
  ];
  function observedSeries(metric: string, label: string, color: string) {
    return {
      label,
      color,
      points: points(
        observations.filter((row) => row.metric === metric),
        "value",
        "reporting_year",
      ),
    };
  }
  return (
    <div className={base.shell} id="top">
      <Head>
        <title>Childhood Vaccinations · Rabbit holes · William Bratz</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="referrer" content="no-referrer" />
        <link rel="icon" type="image/png" href="/white-rabbit.png" />
      </Head>
      <header className={base.header}>
        <Link href="/secret">
          <a className={base.wordmark}>
            <img
              className={base.avatar}
              src="/after-hours-avatar.jpg"
              alt="Illustrated portrait of a man holding a child"
              width={56}
              height={56}
            />
            <span> / AFTER HOURS</span>
          </a>
        </Link>
        <nav>
          <Link href="/secret/rabbit-holes">
            <a>← Rabbit holes</a>
          </Link>
          <Link href="/secret">
            <a>Directory</a>
          </Link>
        </nav>
      </header>
      <main className={`${base.main} ${styles.article}`}>
        <section className={styles.hero}>
          <div className={styles.kicker}>
            <img src="/white-rabbit.png" alt="" width={40} height={40} />
            <span>RABBIT HOLE 001 / A LOOK AT THE NUMBERS</span>
          </div>
          <h1>
            Childhood
            <br />
            <em>Vaccinations.</em>
          </h1>
          <p className={styles.subtitle}>
            Historical health trends & reconstructed vaccine schedules.
          </p>
          <div className={styles.tags}>
            <span>2000–2022 MAIN COMPARISONS</span>
            <span>AUTISM / ADHD / ASTHMA</span>
            <span>OBESITY EXCLUDED</span>
          </div>
          <div className={styles.tldr}>
            <h2>TLDR</h2>
            <p>
              Across the reporting years in these files, higher estimated
              vaccine recommendation counts generally line up with higher autism
              and ADHD measures, and lower asthma measures. This shows a pattern
              in group-level trends over time; it does not show whether children
              who received more vaccines had different health outcomes or what
              caused the changes.
            </p>
          </div>
          <p className={styles.provenance}>
            Exploratory exports from an earlier chat. The main autism series
            matches the{" "}
            <a
              href="https://www.cdc.gov/autism/data-research/index.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              CDC table
            </a>
            ; the other source values and schedule estimates remain unverified.
          </p>
        </section>
        <nav className={styles.jumpNav} aria-label="On this page">
          <a href="#trends">01 / Trends</a>
          <a href="#correlations">02 / Correlations</a>
          <a href="#models">03 / Models</a>
          <a href="#combined">04 / Combined measures</a>
          <a href="#originals">05 / Original files</a>
        </nav>

        <section id="trends" className={styles.section}>
          <div className={styles.sectionHeading}>
            <span>01 / THE TIMELINE</span>
            <h2>How the series move.</h2>
            <p>
              Reporting years on the bottom axis. A missing value leaves a gap.
            </p>
          </div>
          <div className={styles.chartGrid}>
            <figure className={styles.figure}>
              <figcaption>
                <h3>Autism vs. recommended vaccinations</h3>
                <p>
                  Childhood recommendations plus assumed recommendations during
                  pregnancy, using the children’s birth year. These are
                  estimated numbers of doses from the schedule, not vaccinations
                  recorded as received.
                </p>
                <p>
                  Each line starts at 100 in 2000; 200 means twice its starting
                  value. This lets us compare how much two differently measured
                  quantities changed.
                </p>
              </figcaption>
              <SecretLineChart
                title="Autism and estimated child plus pregnancy dose recommendations, indexed to 2000"
                unit="Index · 2000 = 100"
                baseline={100}
                series={[
                  modelSeries,
                  {
                    label: "Autism identified at age 8",
                    color: colors.autism,
                    points: indexed(points(annual, "autism_per_1000"), 2000),
                  },
                ]}
              />
              <p className={styles.note}>
                The green line adds doses estimated to be recommended for a
                child by age 2, including flu, to assumed flu and/or Tdap doses
                recommended to the mother during pregnancy. The count includes
                recommendations for both mother and child; actual vaccinations
                received are unknown, and no mother–child vaccination records
                are linked.
              </p>
            </figure>
            <figure className={styles.figure}>
              <figcaption>
                <h3>Reported childhood health measures</h3>
                <p>ADHD: ages 3–17. Asthma: ages 0–17.</p>
              </figcaption>
              <SecretLineChart
                title="Reported ADHD and asthma rates"
                unit="Percent in each measure's own age group"
                series={[
                  {
                    label: "ADHD, ever diagnosed",
                    color: colors.adhd,
                    points: points(annual, "adhd_ever_diagnosed_pct"),
                  },
                  {
                    label: "Current asthma",
                    color: colors.asthma,
                    points: points(annual, "current_asthma_pct"),
                  },
                ]}
              />
              <p className={styles.note}>
                These age groups are not the same as the age-8 autism group.
              </p>
            </figure>
          </div>
          <details className={styles.extra}>
            <summary>
              Additional observations: allergies, diabetes & profound autism
            </summary>
            <p className={styles.note}>
              These sparse observations are supplied separately and excluded
              from the three-condition combined measures.
            </p>
            <div className={styles.chartGrid}>
              <figure className={styles.figure}>
                <figcaption>
                  <h3>Allergies</h3>
                  <p>
                    Ages 0–17. Plotted years represent multi-year survey
                    periods.
                  </p>
                </figcaption>
                <SecretLineChart
                  title="Reported food and skin allergies"
                  unit="Percent · ages 0–17"
                  series={[
                    observedSeries("food_allergy", "Food allergy", colors.gold),
                    observedSeries("skin_allergy", "Skin allergy", colors.adhd),
                  ]}
                />
              </figure>
              <figure className={styles.figure}>
                <figcaption>
                  <h3>Diabetes</h3>
                  <p>
                    SEARCH study areas. Type 1: ages 0–19. Type 2: ages 10–19.
                  </p>
                </figcaption>
                <SecretLineChart
                  title="Reported diabetes prevalence in SEARCH study areas"
                  unit="Cases per 1,000 in each age group"
                  series={[
                    observedSeries("type_1_diabetes", "Type 1", colors.autism),
                    observedSeries(
                      "type_2_diabetes",
                      "Type 2",
                      colors.composite,
                    ),
                  ]}
                />
              </figure>
            </div>
            <div className={styles.tableScroll} tabIndex={0}>
              <table>
                <caption>
                  Profound autism · age 8 · sparse supplied estimates
                </caption>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Cases per 1,000</th>
                    <th>Value status</th>
                  </tr>
                </thead>
                <tbody>
                  {observations
                    .filter((row) => row.metric === "profound_autism")
                    .map((row) => (
                      <tr key={row.reporting_year}>
                        <th scope="row">{row.reporting_year}</th>
                        <td>{row.value}</td>
                        <td>
                          {row.data_status === "approximate_derived_prior_chat"
                            ? "Approximate; derived in prior chat"
                            : "Prior-chat figure; not independently verified"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>

        <section id="correlations" className={styles.section}>
          <div className={styles.sectionHeading}>
            <span>02 / MOVING TOGETHER</span>
            <h2>Correlation, in plain numbers.</h2>
            <p>
              We estimate the number of vaccination doses recommended by the
              children’s birth-year schedule, including assumed recommendations
              during pregnancy. We then match that number with a health measure
              reported in the same year and calculate how closely the numbers
              line up. That score is called a correlation, or Pearson r.
            </p>
            <p>
              Near +1 means higher recommended-vaccination counts line up with
              higher health-measure values; near −1 means they line up with
              lower values. Near 0 means little straight-line pattern. These
              scores describe relationships across years, not a child’s chance
              of illness or cause and effect.
            </p>
          </div>
          <div className={styles.figure}>
            <p className={styles.note}>
              Each health measure compared with the estimated total of child
              recommendations and recommendations during pregnancy.
            </p>
            <div className={styles.tableScroll} tabIndex={0}>
              <table className={styles.correlations}>
                <caption className={styles.srOnly}>
                  Correlations from the supplied CSV, with counts of paired
                  observations
                </caption>
                <thead>
                  <tr>
                    <th>Measure</th>
                    <th aria-hidden="true">
                      −1 <span className={styles.axisZero}>0</span>
                      <span className={styles.axisEnd}>+1</span>
                    </th>
                    <th>Correlation score (r)</th>
                    <th>Years with both values</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.map((item) => {
                    const row = correlation(item.key);
                    const r = Number(row.pearson_r);
                    return (
                      <tr key={item.key}>
                        <th scope="row">{item.label}</th>
                        <td aria-hidden="true">
                          <div className={styles.barTrack}>
                            <span
                              style={{
                                left: `${r < 0 ? 50 + r * 50 : 50}%`,
                                width: `${Math.abs(r) * 50}%`,
                                background: item.color,
                              }}
                            />
                          </div>
                        </td>
                        <td className={styles.coefficient}>{signed(r)}</td>
                        <td>{row.n_paired_observations}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className={styles.note}>
              “Years with both values” counts reporting years where we have both
              a vaccination-schedule estimate and that health measure. For
              example, 12 means 12 matched pairs of numbers, one pair per
              reporting year; it does not mean 12 children. The health measures
              cover different ages.
            </p>
          </div>
          <div className={styles.comparisonIntro}>
            <h3>Do bigger schedule increases match bigger health increases?</h3>
            <p>
              Two sets of numbers can both rise over 20 years without rising by
              larger amounts during the same periods. This check asks whether a
              bigger jump in the recommended vaccination count goes with a
              bigger jump in autism or the combined health measure from one
              report to the next.
            </p>
            <p>
              For example, from 2002 to 2004 the recommended-vaccination
              estimate rises by 1 dose, while reported autism prevalence rises
              by 1.4 cases per 1,000. We pair those two changes and repeat the
              calculation for each available reporting period.
            </p>
            <div className={styles.finding}>
              <h4>What this check shows</h4>
              <p>
                The increases do not closely track each other. In these files,
                bigger jumps in the recommended vaccination count do not show a
                strong pattern of bigger jumps in autism or the combined health
                measure, even though their overall levels generally rise over
                time.
              </p>
            </div>
          </div>
          <div className={styles.changeGrid}>
            {[
              ["Autism", "autism_consecutive_changes_vs_vaccine_model_changes"],
              ["Sum of three condition rates", "current_combined_changes"],
            ].map(([label, key]) => (
              <div className={styles.change} key={key}>
                <span>FROM ONE REPORT TO THE NEXT</span>
                <h3>{label}</h3>
                <strong className={styles.changeVerdict}>
                  Changes don’t closely track
                </strong>
                <small>
                  Correlation score:{" "}
                  {signed(Number(correlation(key).pearson_r))} (near 0)
                </small>
                <small>
                  {correlation(key).n_paired_observations} changes calculated
                  from {Number(correlation(key).n_paired_observations) + 1}{" "}
                  reporting years
                </small>
              </div>
            ))}
            <p className={styles.changeExplanation}>
              Twelve reporting years create 11 report-to-report changes; the
              combined measure has {combinedPairs.length} complete years, so it
              creates {combinedChangePairs.length}. Both scores are weak and
              slightly negative, rather than strongly positive. Some reports are
              farther apart than others, and these changes have not been
              converted into per-year rates. This check does not establish what
              caused the changes.
            </p>
          </div>
        </section>

        <section id="models" className={styles.section}>
          <div className={styles.sectionHeading}>
            <span>03 / THE ASSUMPTIONS</span>
            <h2>
              Same health data.
              <br />
              Different dose estimates.
            </h2>
            <p>
              We keep the autism data fixed and change how vaccine
              recommendations are counted and which year’s schedule is used.
              This checks how much the correlation depends on those choices,
              rather than treating one reconstructed count as the only possible
              estimate.
            </p>
          </div>
          <div className={styles.modelStack}>
            <figure className={styles.figure}>
              <figcaption>
                <h3>What changes in the dose estimate?</h3>
                <p>
                  Children aged 8 in the 2022 autism report were born in 2014. A
                  reporting-year estimate uses the 2022 schedule; a birth-year
                  estimate uses the 2014 schedule to approximate their earlier
                  recommendations.
                </p>
              </figcaption>
              <SecretLineChart
                title="Alternative reconstructed vaccine dose counts"
                unit="Estimated recommended doses · not doses received"
                series={[
                  {
                    label: "Schedule in reporting year",
                    color: colors.composite,
                    points: points(
                      models,
                      "same_year_schedule_age2_doses_estimate",
                    ),
                  },
                  {
                    label: "Routine child doses, birth-year schedule",
                    color: colors.gold,
                    points: points(
                      models,
                      "revised_fixed_childhood_doses_by_24mo_estimate",
                    ),
                  },
                  {
                    label: modelLabel,
                    color: colors.model,
                    points: points(models, modelKey),
                  },
                ]}
              />
            </figure>
            <div className={styles.figure}>
              <h3>How those choices change the score</h3>
              <p className={styles.note}>
                The same 12 autism observations are used in every row. Only the
                dose estimate changes. Fractional counts are estimates in the
                supplied model, not records of partial doses received.
              </p>
              <div className={styles.tableScroll} tabIndex={0}>
                <table>
                  <caption className={styles.srOnly}>
                    Autism correlation under each supplied dose scenario
                  </caption>
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Correlation score (r)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map(([label, key, explanation]) => (
                      <tr key={key}>
                        <th scope="row">
                          {label}
                          <small className={styles.variantExplanation}>
                            {explanation}
                          </small>
                        </th>
                        <td className={styles.coefficient}>
                          {signed(Number(correlation(key).pearson_r))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className={styles.note}>
                The score ranges from +0.591 to +0.920 under these assumptions.
                A higher score means closer alignment with that chosen dose
                estimate; it does not make the estimate more accurate or show
                greater harm.
              </p>
              <p className={styles.timing}>
                The two COVID scenarios add doses at age 7–8 in 2022 for
                children born in 2014. They occur after typical autism onset and
                are not infant exposure measures.
              </p>
            </div>
          </div>
        </section>

        <section id="combined" className={styles.section}>
          <div className={styles.sectionHeading}>
            <span>04 / ADDING THINGS UP</span>
            <h2>
              Combined childhood chronic conditions vs. recommended
              vaccinations.
            </h2>
            <p>
              Birth-year schedule, including assumed recommendations during
              pregnancy. Here, “combined childhood chronic conditions” means
              only autism, ADHD, and asthma. Obesity is excluded. We summarize
              these three measures in two ways and compare each summary with the
              estimated number of recommended vaccination doses for the
              children’s birth-year group.
            </p>
          </div>
          <figure className={styles.figure}>
            <figcaption>
              <h3>Two methods, the same three conditions</h3>
              <p>
                Both summary lines start at 100 in 2002; 130 means 30% above
                that starting value. The green dose-estimate line uses the same
                relative scale so the trends can be compared.
              </p>
            </figcaption>
            <div className={styles.methodGrid}>
              <div>
                <h4>1 / Add the reported percentages</h4>
                <p>
                  Convert autism from cases per 1,000 to cases per 100 by
                  dividing by 10: 6.6 per 1,000 becomes 0.66%. Add that to the
                  ADHD and asthma percentages. Conditions with larger
                  percentages contribute more to the total. Rescale the total so
                  2002 equals 100: this is the rate-sum index.
                </p>
              </div>
              <div>
                <h4>2 / Give each measure equal weight</h4>
                <p>
                  First express each measure as a percentage of its own 2002
                  value, then average the three results. A doubling counts the
                  same for each measure, even if their original percentages
                  differ: this is the equal-weight index.
                </p>
              </div>
            </div>
            <SecretLineChart
              title="Combined childhood chronic conditions versus recommended vaccinations, using the birth-year schedule including pregnancy"
              unit="Index · 2002 = 100"
              baseline={100}
              series={[
                {
                  label: modelLabel,
                  color: colors.model,
                  points: indexed(points(combinedChart, modelKey), 2002),
                },
                {
                  label: "Rate-sum index",
                  color: colors.autism,
                  points: points(combinedChart, "combined_sum_index_2002_100"),
                },
                {
                  label: "Equal-weight index",
                  color: colors.composite,
                  dashed: true,
                  points: points(
                    combinedChart,
                    "combined_equal_weight_index_2002_100",
                  ),
                },
              ]}
            />
            <div className={styles.finding}>
              <h4>What this shows</h4>
              <p>
                The recommended-vaccination estimate and both combined health
                summaries rise over 2002–2022, so they broadly follow the same
                upward trend over the full period. They do not rise step for
                step: the vaccination estimate is mostly flat after 2014; the
                sum of the three condition rates rises earlier, then mostly
                levels off and fluctuates, while the equal-weight summary keeps
                rising overall.
              </p>
              <p>
                The estimated recommended-vaccination count rises from{" "}
                {scheduleStart} to {scheduleEnd} doses, about{" "}
                {scheduleIncrease.toFixed(0)}%. From 2002 to 2022, the sum of
                the three reported rates rises from{" "}
                {Number(
                  combinedStart.combined_condition_rate_sum_per_100,
                ).toFixed(2)}{" "}
                to{" "}
                {Number(
                  combinedEnd.combined_condition_rate_sum_per_100,
                ).toFixed(2)}
                , about {rateSumIncrease.toFixed(0)}%. With equal weighting, the
                index rises from 100 to{" "}
                {Number(
                  combinedEnd.combined_equal_weight_index_2002_100,
                ).toFixed(1)}
                , about{" "}
                {(
                  Number(combinedEnd.combined_equal_weight_index_2002_100) - 100
                ).toFixed(0)}
                %.
              </p>
              <p>
                The upward trend appears with either way of combining the health
                measures, but the size of the rise depends on the weighting.
                This is a comparison of historical group trends, not evidence
                that vaccination caused the health trends. Children can appear
                in more than one measure, and the age groups differ, so neither
                summary tells us the percentage of children with at least one
                condition.
              </p>
            </div>
            <p className={styles.note}>
              {combinedPairs.length} years have all three health measures.
              Recalculated correlations with the birth-year vaccination estimate
              are {signed(pearson(combinedPairs))} for the rate sum and{" "}
              {signed(combinedEqualR)} for the equal-weight index. Neither index
              counts unique children. A baseline of 100 is a relative starting
              point, not 100% of children.
            </p>
          </figure>
        </section>

        <section id="originals" className={styles.section}>
          <div className={styles.sectionHeading}>
            <span>05 / BACK TO THE SOURCE FILES</span>
            <h2>The original material.</h2>
            <p>
              Original files are preserved unchanged and include obesity and the
              older four-condition comparisons. They are archived references,
              not the current combined comparison. Download CSV 09 for the
              recalculated autism, ADHD, and asthma comparison used above.
            </p>
          </div>
          <details className={styles.extra}>
            <summary>Original overview (includes obesity; archived)</summary>
            <figure className={styles.original}>
              <a
                href={fileUrl(`${overview}.png`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={fileUrl(`${overview}.png`)}
                  alt="Original one-page reference showing indexed trends, correlations, alternate models, and limitations for vaccine recommendations and childhood health"
                  width={2304}
                  height={1440}
                  loading="lazy"
                />
              </a>
              <figcaption>
                <span>
                  Original, unedited overview · open image for full size
                </span>
                <a
                  href={fileUrl(`${overview}.pdf`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open PDF ↗
                </a>
              </figcaption>
            </figure>
          </details>
          <div className={styles.fileGrid}>
            {data.tables.map((file) => (
              <a key={file.name} href={fileUrl(file.name, true)} download>
                <span>CSV / {file.name.slice(0, 2)}</span>
                <strong>{file.title}</strong>
                <small>Download ↓</small>
              </a>
            ))}
            <a href={fileUrl(`${overview}.png`, true)} download>
              <span>PNG</span>
              <strong>Original chart image</strong>
              <small>Download ↓</small>
            </a>
            <a href={fileUrl(`${overview}.pdf`, true)} download>
              <span>PDF</span>
              <strong>One-page reference</strong>
              <small>Download ↓</small>
            </a>
          </div>
          <details className={styles.extra}>
            <summary>Browse the CSV tables</summary>
            <label className={styles.tablePicker}>
              Choose a file
              <select
                value={tableName}
                onChange={(event) => setTableName(event.target.value)}
              >
                {data.tables.map((table) => (
                  <option key={table.name} value={table.name}>
                    {table.title} · {table.rows.length} rows
                  </option>
                ))}
              </select>
            </label>
            <div
              className={`${styles.tableScroll} ${styles.rawData}`}
              tabIndex={0}
            >
              <table>
                <caption>
                  {chosen.title} · original column names · blank cells shown as
                  —
                </caption>
                <thead>
                  <tr>
                    {chosen.columns.map((column) => (
                      <th key={column}>{column.replace(/_/g, " ")}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chosen.rows.map((row, i) => (
                    <tr key={i}>
                      {chosen.columns.map((column) => (
                        <td key={column}>{row[column] || "—"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
          <div className={styles.sourceNotes}>
            <h3>Reading these comparisons</h3>
            <ul>
              <li>
                Shared trends over time can produce strong correlations without
                one series causing the other.
              </li>
              <li>
                Age groups, survey periods, and diagnostic definitions differ.
                Missing cells are not filled in.
              </li>
              <li>
                Schedule counts are reconstructed assumptions. Doses recommended
                during pregnancy are hypothetical here; no mother–infant
                vaccination records are linked.
              </li>
              <li>
                The overview also lists a “+flu” r of +0.870; that specific
                variant is not separately documented in the supplied correlation
                CSV.
              </li>
            </ul>
            <p>
              Evidence context:{" "}
              <a
                href="https://www.who.int/news/item/11-12-2025-statement-gacvs-vaccines-autism"
                target="_blank"
                rel="noopener noreferrer"
              >
                WHO’s December 2025 review
              </a>{" "}
              concluded that the available high-quality evidence indicates
              vaccines do not cause autism.
            </p>
            <details>
              <summary>Source references recorded in the exports</summary>
              <ul>
                <li>
                  <a
                    href="https://www.cdc.gov/autism/data-research/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CDC ADDM autism prevalence table
                  </a>{" "}
                  · main autism values checked against this table on October 28,
                  2026; surveillance sites change over time.
                </li>
                <li>
                  <a
                    href="https://www.cdc.gov/nchs/nhis/index.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    NHIS
                  </a>{" "}
                  · ADHD, asthma, and allergy source repository.
                </li>
                <li>
                  <a
                    href="https://www.cdc.gov/nchs/nhanes/index.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    NHANES
                  </a>{" "}
                  · archived obesity source repository; excluded from current
                  comparisons.
                </li>
                <li>
                  <a
                    href="https://www.cdc.gov/diabetes/data-research/research/search-for-diabetes-in-youth-study.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SEARCH for Diabetes in Youth
                  </a>{" "}
                  · diabetes source reference.
                </li>
                <li>
                  <a
                    href="https://www.cdc.gov/vaccines/hcp/imz-schedules/resources.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Immunization schedule resources
                  </a>{" "}
                  · repository recorded for the schedule reconstruction.
                </li>
              </ul>
              <p>
                Repository links do not verify every exported value. Original
                provenance and assumptions remain available in the methodology
                CSV.
              </p>
            </details>
          </div>
        </section>
        <div className={styles.endnote}>
          <Link href="/secret/rabbit-holes">
            <a>← Back to Rabbit holes</a>
          </Link>
          <a href="#top">Back to top ↑</a>
        </div>
      </main>
      <footer className={base.footer}>
        <span>WILLIAM BRATZ</span>
        <span>Follow the white rabbit.</span>
      </footer>
    </div>
  );
}
