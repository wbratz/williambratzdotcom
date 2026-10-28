import type { PrivateApiRequest, PrivateApiResponse } from "./private-http";
import { authorized, privateHeaders } from "./secret";
import {
  vaccinationFiles,
  privateFileContent,
  loadVaccinationData,
} from "./vaccination-data";
import { THREE_CONDITION_FILE } from "../../utils/vaccination-analysis";

export default async function handler(
  req: PrivateApiRequest,
  res: PrivateApiResponse,
) {
  privateHeaders(res);
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }
  const file = vaccinationFiles.find(
    (file) => file!.name === req.query.filename,
  );
  const derived = req.query.filename === THREE_CONDITION_FILE;
  if (!file && !derived) return res.status(404).end();
  try {
    if (!(await authorized(req, res))) return res.status(404).end();
    let content: Buffer;
    if (derived) {
      const table = loadVaccinationData().tables.find(
        (table) => table.name === THREE_CONDITION_FILE,
      )!;
      const quote = (value: string) => `"${value.replace(/"/g, '""')}"`;
      content = Buffer.from(
        [
          table.columns.map(quote).join(","),
          ...table.rows.map((row) =>
            table.columns.map((column) => quote(row[column])).join(","),
          ),
        ].join("\r\n") + "\r\n",
      );
    } else content = privateFileContent(file!.name);
    const name = derived ? THREE_CONDITION_FILE : file!.name;
    const type = derived ? "text/csv" : file!.type;
    res.setHeader(
      "Content-Type",
      type === "text/csv" ? "text/csv; charset=utf-8" : type,
    );
    res.setHeader(
      "Content-Disposition",
      `${
        req.query.download === "1" || type === "text/csv"
          ? "attachment"
          : "inline"
      }; filename="${name}"`,
    );
    res.setHeader("Content-Length", content.length);
    if (req.method === "HEAD") return res.status(200).end();
    return res.status(200).send(content);
  } catch {
    return res.status(503).end();
  }
}
