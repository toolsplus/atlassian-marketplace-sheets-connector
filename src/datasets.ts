import { JsonDataTransformer } from "./json/jsonDataTransformer";
import { churnBenchmarkJsonDataTransformer } from "./json/churnBenchmark";
import { salesBenchmarkJsonDataTransformer } from "./json/salesBenchmark";
import { evaluationsBenchmarkJsonDataTransformer } from "./json/evaluationBenchmark";

export interface CsvDatasetDescriptor {
  readonly key: string;
  readonly type: "csv";
  readonly apiEndpoint: (vendorId: string) => string;
}

export interface JsonDatasetDescriptor {
  readonly key: string;
  readonly type: "json";
  readonly apiEndpoint: (vendorId: string) => string;
  readonly dataTransformer: JsonDataTransformer;
}

export type DatasetDescriptor = CsvDatasetDescriptor | JsonDatasetDescriptor;

export const datasets = [
  {
    key: "transactions",
    type: "csv",
    apiEndpoint: (vendorId: string) =>
      `/rest/2/vendors/${vendorId}/reporting/sales/transactions/export`,
  },
  {
    key: "licenses",
    type: "csv",
    apiEndpoint: (vendorId: string) => `/rest/2/vendors/${vendorId}/reporting/licenses/export`,
  },
  {
    key: "feedback",
    type: "csv",
    apiEndpoint: (vendorId: string) =>
      `/rest/2/vendors/${vendorId}/reporting/feedback/details/export`,
  },
  {
    key: "cloudLicenseChurns",
    type: "csv",
    apiEndpoint: (vendorId: string) =>
      `/rest/2/vendors/${vendorId}/reporting/sales/metrics/churn/details/export`,
  },
  {
    key: "cloudLicenseRenewals",
    type: "csv",
    apiEndpoint: (vendorId: string) =>
      `/rest/2/vendors/${vendorId}/reporting/sales/metrics/renewal/details/export`,
  },
  {
    key: "cloudLicenseConversions",
    type: "csv",
    apiEndpoint: (vendorId: string) =>
      `/rest/2/vendors/${vendorId}/reporting/sales/metrics/conversion/details/export`,
  },
  {
    key: "churnBenchmark",
    type: "json",
    apiEndpoint: (vendorId: string) =>
      `/rest/2/vendors/${vendorId}/reporting/sales/metrics/churn/benchmark`,
    dataTransformer: churnBenchmarkJsonDataTransformer,
  },
  {
    key: "salesBenchmark",
    type: "json",
    apiEndpoint: (vendorId: string) => `/rest/2/vendors/${vendorId}/reporting/benchmark/sales`,
    dataTransformer: salesBenchmarkJsonDataTransformer,
  },
  {
    key: "evaluationsBenchmark",
    type: "json",
    apiEndpoint: (vendorId: string) =>
      `/rest/2/vendors/${vendorId}/reporting/benchmark/evaluations`,
    dataTransformer: evaluationsBenchmarkJsonDataTransformer,
  },
] as const;

export type DatasetKey = typeof datasets[number]["key"];
