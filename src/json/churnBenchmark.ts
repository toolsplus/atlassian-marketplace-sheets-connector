import { JsonDataTransformer } from "./jsonDataTransformer";

export interface ChurnBenchmarkPerMonth {
  year: string;
  month: string;
  churnedLicenses: number;
  totalLicenses: number;
  churnRate: number;
  isolatedChurnRate: number;
  churnRateBenchmark: number;
  isolatedChurnRateBenchmark: number;
}

export interface CloudChurnBenchmarkPerApp {
  appName: string;
  appKey: string;
  churnBenchmarkPerMonth: ChurnBenchmarkPerMonth[];
}

export interface ChurnBenchmark {
  churnBenchmarkPerApp: CloudChurnBenchmarkPerApp[];
}

export const churnBenchmarkJsonDataTransformer: JsonDataTransformer = (data: ChurnBenchmark) => {
  const headerRow: string[] = [
    "appKey",
    "appName",
    "year",
    "month",
    "yearMonthDate",
    "churnedLicenses",
    "totalLicenses",
    "churnRate",
    "isolatedChurnRate",
    "churnRateBenchmark",
    "isolatedChurnRateBenchmark",
  ];
  const dataRows = data.churnBenchmarkPerApp.flatMap((perApp) => {
    const appKey = perApp.appKey;
    const appName = perApp.appName;
    return perApp.churnBenchmarkPerMonth.map((perMonth) => {
      return [
        appKey,
        appName,
        perMonth.year,
        perMonth.month,
        `${perMonth.year}-${perMonth.month}-01`,
        perMonth.churnedLicenses,
        perMonth.totalLicenses,
        perMonth.churnRate,
        perMonth.isolatedChurnRate,
        perMonth.churnRateBenchmark,
        perMonth.isolatedChurnRateBenchmark,
      ].map(String);
    });
  });
  return [headerRow, ...dataRows];
};
