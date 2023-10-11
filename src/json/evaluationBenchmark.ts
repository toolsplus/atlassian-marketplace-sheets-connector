import { JsonDataTransformer } from "./jsonDataTransformer";

export interface EvaluationsBenchmarkPerAppPerMonth {
  date: string;
  evaluationCount: number;
  previousMonthEvaluationCount: number;
  evaluationMoMGrowth: number;
  evaluationPercentile: number;
  evaluationMoMGrowthBenchmarkAllAppsOnBaseProduct: number;
  evaluationCountYTD: number;
  evaluationCountYTDLastYear: number;
  evaluationYTDYoYGrowth: number;
  evaluationYTDPercentile: number;
  evaluationYTDYoYGrowthBenchmarkAllAppsOnBaseProduct: number;
}

export interface CloudEvaluationsBenchmarkPerApp {
  name: string;
  addonKey: string;
  evaluationBenchmarkPerAppPerMonth: EvaluationsBenchmarkPerAppPerMonth[];
}

export interface CloudEvaluationsBenchmark {
  addons: CloudEvaluationsBenchmarkPerApp[];
}

export const evaluationsBenchmarkJsonDataTransformer: JsonDataTransformer = (
  data: CloudEvaluationsBenchmark
) => {
  const headerRow: string[] = [
    "appKey",
    "appName",
    "date",
    "evaluationCount",
    "previousMonthEvaluationCount",
    "evaluationMoMGrowth",
    "evaluationPercentile",
    "evaluationMoMGrowthBenchmarkAllAppsOnBaseProduct",
    "evaluationCountYTD",
    "evaluationCountYTDLastYear",
    "evaluationYTDYoYGrowth",
    "evaluationYTDPercentile",
    "evaluationYTDYoYGrowthBenchmarkAllAppsOnBaseProduct",
  ];
  const dataRows = data.addons.flatMap((perApp) => {
    const appKey = perApp.addonKey;
    const appName = perApp.name;
    return perApp.evaluationBenchmarkPerAppPerMonth.map((perMonth) => {
      return [
        appKey,
        appName,
        perMonth.date,
        perMonth.evaluationCount,
        perMonth.previousMonthEvaluationCount,
        perMonth.evaluationMoMGrowth,
        perMonth.evaluationPercentile,
        perMonth.evaluationMoMGrowthBenchmarkAllAppsOnBaseProduct,
        perMonth.evaluationCountYTD,
        perMonth.evaluationCountYTDLastYear,
        perMonth.evaluationYTDYoYGrowth,
        perMonth.evaluationYTDPercentile,
        perMonth.evaluationYTDYoYGrowthBenchmarkAllAppsOnBaseProduct,
      ].map(String);
    });
  });
  return [headerRow, ...dataRows];
};
