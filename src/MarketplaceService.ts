import { Credentials, Login } from "./LoginService";
import { CsvDatasetDescriptor, JsonDatasetDescriptor } from "./datasets";

const API_BASE_URL = "https://marketplace.atlassian.com";
const GET_VENDORS_ENDPOINT = "/rest/2/vendors";

interface FetchOptions {
  method: GoogleAppsScript.URL_Fetch.HttpMethod;
  relativeApiEndpoint: string;
  extraParams?: Record<string, string>;
  payload?: GoogleAppsScript.URL_Fetch.Payload;
}

const fetchData = ({ method, relativeApiEndpoint, extraParams, payload }: FetchOptions) => (
  credentials: Credentials
) => {
  const extraQueryParams = Object.entries(extraParams || {})
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const url = `${API_BASE_URL}${relativeApiEndpoint}?accept=csv&${extraQueryParams}`;
  const authPlain = `${credentials.username}:${credentials.apiToken}`;
  const authBase64 = Utilities.base64Encode(authPlain);
  const options = {
    method,
    headers: {
      Authorization: `Basic ${authBase64}`,
      ...(payload && { "Content-Type": "application/json" }),
    },
    muteHttpExceptions: true, // If true the fetch doesn't throw an exception if the response code indicates failure
    payload: JSON.stringify(payload),
  };
  return UrlFetchApp.fetch(url, options);
};

export const getFirstVendorId = (credentials: Credentials): string | null => {
  const response = fetchData({
    method: "get",
    relativeApiEndpoint: GET_VENDORS_ENDPOINT,
    extraParams: { forThisUser: "true" },
  })(credentials);
  const data = JSON.parse(response.getContentText());
  if (data && data.count > 0) {
    const firstVendor = data._embedded.vendors[0];
    const vendorId = firstVendor._links.self.href.match(/\d+$/)[0];
    Logger.log(`Selected vendor ${firstVendor.name} with id ${vendorId}`);
    return vendorId;
  } else {
    Logger.log(
      `Failed to fetch vendor details for the currently logged in user: ${credentials.username}`
    );
    return null;
  }
};

export const loadCsvDataset = (
  dataset: CsvDatasetDescriptor,
  login: Login
): string[][] | undefined => {
  const parseCsv = (csvRawData: string) => {
    // Fix the bug on Utilities.parseCsv() google script function which does not allow newlines in csv strings
    // https://gist.github.com/simonjamain/7e23b898527655609e5ff012f412dd50
    const sanitizedCsvRawData = csvRawData.replace(/(["'])(?:(?=(\\?))\2[\s\S])*?\1/g, (e) =>
      e.replace(/\r?\n|\r/g, " ")
    );
    try {
      return Utilities.parseCsv(sanitizedCsvRawData);
    } catch (exception) {
      Logger.log(`Failed to parse CSV raw data: ${exception}`, { exception, csvRawData });
    }
  };

  const response = fetchData({
    method: dataset.apiEndpoint.method,
    relativeApiEndpoint: dataset.apiEndpoint.url(login.vendorId),
    payload: dataset.apiEndpoint.payload,
  })(login);
  return parseCsv(response.getContentText());
};

export const loadJsonDatasetAsCsv = (
  dataset: JsonDatasetDescriptor,
  login: Login
): string[][] | undefined => {
  const transformJsonToCsv = (jsonRawData: unknown) => {
    try {
      return dataset.dataTransformer(jsonRawData);
    } catch (exception) {
      Logger.log(`Failed to transform JSON raw data to CSV: ${exception}`, {
        exception,
        jsonRawData,
      });
    }
  };
  const response = fetchData({
    method: dataset.apiEndpoint.method,
    relativeApiEndpoint: dataset.apiEndpoint.url(login.vendorId),
    payload: dataset.apiEndpoint.payload,
  })(login);
  return transformJsonToCsv(JSON.parse(response.getContentText()));
};
