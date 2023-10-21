import { JsonDataTransformer } from "./jsonDataTransformer";

export interface ArrTimeSeriesRecord {
  date: string;
  appName: string;
  appKey: string;
  gracePeriodInDays: string;
  arr: number;
}

export interface ReportingMetricTimeSeries {
  records: ArrTimeSeriesRecord[];
}

export const arrPartnerMetricJsonDataTransformer: JsonDataTransformer = (
  data: ReportingMetricTimeSeries
) => {
  const headerRow: string[] = ["date", "appName", "appKey", "gracePeriodInDays", "arr"];
  const dataRows = data.records.map((r) => {
    return [r.date, r.appName, r.appKey, r.gracePeriodInDays, r.arr].map(String);
  });
  return [headerRow, ...dataRows];
};
