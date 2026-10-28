import type { Series } from "../../utils/vaccination-analysis";
import styles from "../../styles/vaccinations.module.css";

export default function SecretLineChart({
  title,
  unit,
  series,
  baseline,
}: {
  title: string;
  unit: string;
  series: Series[];
  baseline?: number;
}) {
  const all = series.flatMap((s) => s.points);
  const years = all.map((point) => point.year);
  const start = Math.min(...years);
  const end = Math.max(...years);
  const maximum = Math.max(...all.map((point) => point.value ?? 0));
  const step =
    maximum > 250
      ? 100
      : maximum > 100
        ? 50
        : maximum > 40
          ? 10
          : maximum > 15
            ? 5
            : maximum > 4
              ? 2
              : 0.5;
  const top = Math.ceil(maximum / step) * step || 1;
  const ticks = Array.from(
    { length: Math.round(top / step) + 1 },
    (_, i) => i * step,
  );
  const x = (year: number) => 56 + ((year - start) / (end - start || 1)) * 590;
  const y = (value: number) => 250 - (value / top) * 215;
  const xTicks = [
    ...new Set([
      start,
      ...years.filter((year) => (year - start) % 4 === 0),
      end,
    ]),
  ].sort((a, b) => a - b);
  return (
    <>
      <ul className={styles.legend}>
        {series.map((s) => (
          <li key={s.label}>
            <span style={{ background: s.color }} />
            {s.label}
          </li>
        ))}
      </ul>
      <div
        className={styles.chartScroll}
        tabIndex={0}
        aria-label={`${title}. Scroll horizontally on smaller screens.`}
      >
        <svg
          viewBox="0 0 670 294"
          className={styles.chart}
          role="img"
          aria-label={`${title}. ${unit}. Exact values are in the data table below.`}
        >
          <title>{title}</title>
          <desc>
            {unit}. {series.map((s) => s.label).join(", ")}. Missing values are
            left blank.
          </desc>
          <text x="56" y="17" fill="#abb8a4" fontSize="11">
            {unit}
          </text>
          {ticks.map((value) => (
            <g key={value}>
              <line
                x1="56"
                x2="646"
                y1={y(value)}
                y2={y(value)}
                stroke="#354130"
                strokeWidth="1"
              />
              <text
                x="45"
                y={y(value) + 4}
                fill="#aeb9a9"
                fontSize="11"
                textAnchor="end"
              >
                {value}
              </text>
            </g>
          ))}
          {baseline !== undefined && (
            <line
              x1="56"
              x2="646"
              y1={y(baseline)}
              y2={y(baseline)}
              stroke="#a9b69b"
              strokeDasharray="4 5"
            />
          )}
          {xTicks.map((year) => (
            <text
              key={year}
              x={x(year)}
              y="279"
              fill="#aeb9a9"
              fontSize="11"
              textAnchor="middle"
            >
              {year}
            </text>
          ))}
          {series.map((s) => {
            let penDown = false;
            const path = s.points
              .map((point) => {
                if (point.value === null) {
                  penDown = false;
                  return "";
                }
                const segment = `${penDown ? "L" : "M"}${x(point.year)},${y(
                  point.value,
                )}`;
                penDown = true;
                return segment;
              })
              .join(" ");
            return (
              <g key={s.label}>
                <path
                  d={path}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.5"
                  strokeDasharray={s.dashed ? "6 5" : undefined}
                />
                {s.points
                  .filter((point) => point.value !== null)
                  .map((point) => (
                    <circle
                      key={point.year}
                      cx={x(point.year)}
                      cy={y(point.value!)}
                      r="3.5"
                      fill={s.color}
                    >
                      <title>{`${s.label}, ${point.year}: ${Number(
                        point.value!.toFixed(2),
                      )}`}</title>
                    </circle>
                  ))}
              </g>
            );
          })}
        </svg>
      </div>
      <details className={styles.chartData}>
        <summary>Chart values</summary>
        <div className={styles.tableScroll} tabIndex={0}>
          <table>
            <caption>
              {title} · {unit}
            </caption>
            <thead>
              <tr>
                <th>Year</th>
                {series.map((s) => (
                  <th key={s.label}>{s.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...new Set(years)]
                .sort((a, b) => a - b)
                .map((year) => (
                  <tr key={year}>
                    <th scope="row">{year}</th>
                    {series.map((s) => {
                      const value = s.points.find(
                        (point) => point.year === year,
                      )?.value;
                      return (
                        <td key={s.label}>
                          {value === null || value === undefined
                            ? "—"
                            : Number(value.toFixed(2))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}
