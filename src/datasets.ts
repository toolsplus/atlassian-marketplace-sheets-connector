import { JsonDataTransformer } from "./json/jsonDataTransformer";
import { churnBenchmarkJsonDataTransformer } from "./json/churnBenchmark";
import { salesBenchmarkJsonDataTransformer } from "./json/salesBenchmark";
import { evaluationsBenchmarkJsonDataTransformer } from "./json/evaluationBenchmark";
import { arrPartnerMetricJsonDataTransformer } from "./json/arrPartnerMetricTransformer";
import { mrrPartnerMetricJsonDataTransformer } from "./json/mrrPartnerMetricTransformer";

export interface ApiEndpoint {
  readonly method: GoogleAppsScript.URL_Fetch.HttpMethod;
  readonly url: (vendorId: string) => string;
  readonly payload?: GoogleAppsScript.URL_Fetch.Payload;
}

export interface CsvDatasetDescriptor {
  readonly key: string;
  readonly type: "csv";
  readonly apiEndpoint: ApiEndpoint;
}

export interface JsonDatasetDescriptor {
  readonly key: string;
  readonly type: "json";
  readonly apiEndpoint: ApiEndpoint;
  readonly dataTransformer: JsonDataTransformer;
}

export type DatasetDescriptor = CsvDatasetDescriptor | JsonDatasetDescriptor;

export const datasets = [
  {
    key: "transactions",
    type: "csv",
    apiEndpoint: {
      method: "get",
      url: (vendorId: string) => `/rest/2/vendors/${vendorId}/reporting/sales/transactions/export`,
    },
  },
  {
    key: "licenses",
    type: "csv",
    apiEndpoint: {
      method: "get",
      url: (vendorId: string) => `/rest/2/vendors/${vendorId}/reporting/licenses/export`,
    },
  },
  {
    key: "feedback",
    type: "csv",
    apiEndpoint: {
      method: "get",
      url: (vendorId: string) => `/rest/2/vendors/${vendorId}/reporting/feedback/details/export`,
    },
  },
  {
    key: "cloudLicenseChurns",
    type: "csv",
    apiEndpoint: {
      method: "get",
      url: (vendorId: string) =>
        `/rest/2/vendors/${vendorId}/reporting/sales/metrics/churn/details/export`,
    },
  },
  {
    key: "cloudLicenseRenewals",
    type: "csv",
    apiEndpoint: {
      method: "get",
      url: (vendorId: string) =>
        `/rest/2/vendors/${vendorId}/reporting/sales/metrics/renewal/details/export`,
    },
  },
  {
    key: "cloudLicenseConversions",
    type: "csv",
    apiEndpoint: {
      method: "get",
      url: (vendorId: string) =>
        `/rest/2/vendors/${vendorId}/reporting/sales/metrics/conversion/details/export`,
    },
  },
  {
    key: "churnBenchmark",
    type: "json",
    apiEndpoint: {
      method: "get",
      url: (vendorId: string) =>
        `/rest/2/vendors/${vendorId}/reporting/sales/metrics/churn/benchmark`,
    },
    dataTransformer: churnBenchmarkJsonDataTransformer,
  },
  {
    key: "salesBenchmark",
    type: "json",
    apiEndpoint: {
      method: "get",
      url: (vendorId: string) => `/rest/2/vendors/${vendorId}/reporting/benchmark/sales`,
    },
    dataTransformer: salesBenchmarkJsonDataTransformer,
  },
  {
    key: "evaluationsBenchmark",
    type: "json",
    apiMethod: "get",
    apiEndpoint: {
      method: "get",
      url: (vendorId: string) => `/rest/2/vendors/${vendorId}/reporting/benchmark/evaluations`,
    },
    dataTransformer: evaluationsBenchmarkJsonDataTransformer,
  },
  {
    key: "arrPartnerMetric",
    type: "json",
    apiMethod: "post",
    apiEndpoint: {
      method: "post",
      url: (vendorId: string) => `/rest/2/vendors/${vendorId}/partner-metrics`,
      payload: {
        attributes: [
          {
            name: "APP_KEY",
          },
          {
            name: "APP_NAME",
          },
          {
            name: "GRACE_PERIOD_IN_DAYS",
          },
        ],
        metrics: {
          metricFields: [
            {
              name: "ARR",
            },
          ],
        },
      },
    },
    dataTransformer: arrPartnerMetricJsonDataTransformer,
  },
  {
    key: "mrrPartnerMetric",
    type: "json",
    apiEndpoint: {
      method: "post",
      url: (vendorId: string) => `/rest/2/vendors/${vendorId}/partner-metrics`,
      payload: {
        attributes: [
          {
            name: "APP_KEY",
          },
          {
            name: "APP_NAME",
          },
          {
            name: "GRACE_PERIOD_IN_DAYS",
          },
          {
            name: "SUBSCRIPTION",
          },
        ],
        metrics: {
          metricSets: [
            {
              name: "RECURRING_REVENUE",
            },
          ],
          metricFields: [
            {
              name: "OPENING_MRR",
            },
            {
              name: "CLOSING_MRR",
            },
            {
              name: "NEW_MRR",
            },
            {
              name: "EXPANSION_MRR",
            },
            {
              name: "CONTRACTION_MRR",
            },
            {
              name: "REACTIVATED_MRR",
            },
            {
              name: "EXPIRED_MRR",
            },
          ],
        },
      },
    },
    dataTransformer: mrrPartnerMetricJsonDataTransformer,
  },
] as const;

export type DatasetKey = typeof datasets[number]["key"];
