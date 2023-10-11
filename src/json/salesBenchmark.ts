import { JsonDataTransformer } from "./jsonDataTransformer";

export interface SalesBenchmarkPerAppPerMonth {
  date: string;
  sale: number;
  previousMonthSale: number;
  salesMoMGrowth: number;
  salesPercentile: number;
  salesMoMGrowthBenchmarkAllAppsOnBaseProduct: number;
  salesMoMGrowthBenchmarkBaseProduct: number;
  salesYTD: number;
  salesYTDLastYear: number;
  salesYTDYoYGrowth: number;
  salesYTDPercentile: number;
  salesYTDYoYGrowthBenchmarkAllAppsOnBaseProduct: number;
  salesYTDYoYGrowthBenchmarkBaseProduct: number;
}

export interface CloudSalesBenchmarkPerApp {
  name: string;
  addonKey: string;
  salesBenchmarkPerMonth: SalesBenchmarkPerAppPerMonth[];
}

export interface CloudSalesBenchmark {
  addons: CloudSalesBenchmarkPerApp[];
}

export const salesBenchmarkJsonDataTransformer: JsonDataTransformer = (
  data: CloudSalesBenchmark
) => {
  const headerRow: string[] = [
    "appKey",
    "appName",
    "date",
    "sale",
    "previousMonthSale",
    "salesMoMGrowth",
    "salesPercentile",
    "salesMoMGrowthBenchmarkAllAppsOnBaseProduct",
    "salesMoMGrowthBenchmarkBaseProduct",
    "salesYTD",
    "salesYTDLastYear",
    "salesYTDYoYGrowth",
    "salesYTDPercentile",
    "salesYTDYoYGrowthBenchmarkAllAppsOnBaseProduct",
    "salesYTDYoYGrowthBenchmarkBaseProduct",
  ];
  const dataRows = data.addons.flatMap((perApp) => {
    const appKey = perApp.addonKey;
    const appName = perApp.name;
    return perApp.salesBenchmarkPerMonth.map((perMonth) => {
      return [
        appKey,
        appName,
        perMonth.date,
        perMonth.sale,
        perMonth.previousMonthSale || "",
        perMonth.salesMoMGrowth || "",
        perMonth.salesPercentile || "",
        perMonth.salesMoMGrowthBenchmarkAllAppsOnBaseProduct || "",
        perMonth.salesMoMGrowthBenchmarkBaseProduct || "",
        perMonth.salesYTD || "",
        perMonth.salesYTDLastYear || "",
        perMonth.salesYTDYoYGrowth || "",
        perMonth.salesYTDPercentile || "",
        perMonth.salesYTDYoYGrowthBenchmarkAllAppsOnBaseProduct || "",
        perMonth.salesYTDYoYGrowthBenchmarkBaseProduct || "",
      ].map(String);
    });
  });
  return [headerRow, ...dataRows];
};
