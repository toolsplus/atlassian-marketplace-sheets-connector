import { JsonDataTransformer } from "./jsonDataTransformer";

export interface MrrTimeSeriesRecord {
  date: string;
  appName: string;
  appKey: string;
  gracePeriodInDays: string;
  subscription: string;
  openingMrr: number;
  newMrr: number;
  expiredMrr: number;
  reactivatedMrr: number;
  expansionMrr: number;
  contractionMrr: number;
  closingMrr: number;
}

export interface ReportingMetricTimeSeries {
  records: MrrTimeSeriesRecord[];
}

export const mrrPartnerMetricJsonDataTransformer: JsonDataTransformer = (
  data: ReportingMetricTimeSeries
) => {
  const headerRow: string[] = [
    "date",
    "appName",
    "appKey",
    "gracePeriodInDays",
    "subscription",
    "openingMrr",
    "newMrr",
    "expiredMrr",
    "reactivatedMrr",
    "expansionMrr",
    "contractionMrr",
    "closingMrr",
  ];
  const dataRows = data.records.map((r) => {
    return [
      r.date,
      r.appName,
      r.appKey,
      r.gracePeriodInDays,
      r.subscription,
      r.openingMrr,
      r.newMrr,
      r.expiredMrr,
      r.reactivatedMrr,
      r.expansionMrr,
      r.contractionMrr,
      r.closingMrr,
    ].map(String);
  });
  return [headerRow, ...dataRows];
};
