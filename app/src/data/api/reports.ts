import { newId, read, write } from "../db";
import { delay, nowIso } from "../../lib/delay";
import type { Report } from "../types";

/** E6.2 → E6.3 : signaler une adresse, un prix ou une donnée. */
export async function sendReport(
  recommendationId: string,
  subject: Report["subject"],
  message?: string,
): Promise<Report> {
  await delay(400);
  const report: Report = {
    id: newId("sig"),
    recommendationId,
    subject,
    message,
    status: "recu",
    createdAt: nowIso(),
  };
  write("reports", (list) => [...list, report]);
  return report;
}

export async function listReports(): Promise<Report[]> {
  await delay();
  return read("reports");
}
