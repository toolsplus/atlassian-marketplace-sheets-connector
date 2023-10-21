import { getFirstVendorId, loadCsvDataset, loadJsonDatasetAsCsv } from "./MarketplaceService";
import {
  Credentials,
  getLogin,
  isUserLoggedIn,
  Login,
  logInUser,
  logoutUser,
} from "./LoginService";
import { DatasetDescriptor, DatasetKey, datasets } from "./datasets";

const onOpen = (): void => {
  const ui = SpreadsheetApp.getUi();
  const isLoggedIn = isUserLoggedIn();

  if (isLoggedIn) {
    const singleDatasetLoaderMenu = ui.createMenu("Load single dataset");
    for (const dataset of datasets) {
      singleDatasetLoaderMenu.addItem(dataset.key, `load${dataset.key}`);
    }

    ui.createAddonMenu()
      .addItem("Load all datasets", "loadDatasets")
      .addSubMenu(singleDatasetLoaderMenu)
      .addSeparator()
      .addItem("Logout", "logout")
      .addToUi();
  } else {
    ui.createAddonMenu().addItem("Login", "login").addToUi();
  }
};

const login = (): void => {
  const ui = SpreadsheetApp.getUi();

  const usernameInputResult = ui.prompt(
    "Login",
    "Please enter your Atlassian account email address",
    ui.ButtonSet.OK_CANCEL
  );

  if (usernameInputResult.getSelectedButton() === ui.Button.OK) {
    const apiTokenInputResult = ui.prompt(
      "Login",
      "Please enter the API token for your Atlassian account. If you do not have a token you can generate one at https://id.atlassian.com/manage/api-tokens",
      ui.ButtonSet.OK_CANCEL
    );

    if (apiTokenInputResult.getSelectedButton() === ui.Button.OK) {
      const credentials: Credentials = {
        username: usernameInputResult.getResponseText(),
        apiToken: apiTokenInputResult.getResponseText(),
      };

      const vendorId = getFirstVendorId(credentials);

      if (vendorId) {
        logInUser({ ...credentials, vendorId });
        ui.alert(
          "Login success",
          `You have successfully logged in and data will be fetched from the vendor with id ${vendorId}.`,
          GoogleAppsScript.Base.ButtonSet.OK
        );
      } else {
        Logger.log("Failed to determine vendor id from API response", { vendorId });
        ui.alert(
          "Login failed",
          "Failed to determine vendor from API response",
          GoogleAppsScript.Base.ButtonSet.OK
        );
      }
    }
  }
};

const logout = (): void => {
  const ui = SpreadsheetApp.getUi();

  const confirmationResult = ui.prompt(
    "Logout",
    "Are you sure that you want to log out?",
    ui.ButtonSet.YES_NO
  );

  if (confirmationResult.getSelectedButton() === ui.Button.YES) {
    logoutUser();
  }
};

export const loadDatasets = (): void => {
  const ui = SpreadsheetApp.getUi();
  const result = loadAllDatasets();
  ui.prompt(result);
};

// Single dataset loaders
// function name must match the UI menu configuration which is load{dataset.key}
const loadDatasetByKey = (key: DatasetKey): void => {
  const ui = SpreadsheetApp.getUi();
  const result = loadDataset(key);
  ui.prompt(result);
};
const loadtransactions = (): void => loadDatasetByKey("transactions");
const loadlicenses = (): void => loadDatasetByKey("licenses");
const loadfeedback = (): void => loadDatasetByKey("feedback");
const loadcloudLicenseChurns = (): void => loadDatasetByKey("cloudLicenseChurns");
const loadcloudLicenseRenewals = (): void => loadDatasetByKey("cloudLicenseRenewals");
const loadcloudLicenseConversions = (): void => loadDatasetByKey("cloudLicenseConversions");
const loadchurnBenchmark = (): void => loadDatasetByKey("churnBenchmark");
const loadsalesBenchmark = (): void => loadDatasetByKey("salesBenchmark");
const loadevaluationsBenchmark = (): void => loadDatasetByKey("evaluationsBenchmark");
const loadarrPartnerMetric = (): void => loadDatasetByKey("arrPartnerMetric");
const loadmrrPartnerMetric = (): void => loadDatasetByKey("mrrPartnerMetric");

const loadSingleDataset = (dataset: DatasetDescriptor, login: Login) => {
  Logger.log(`Starting to load '${dataset.key}' dataset`);
  const data =
    dataset.type === "csv" ? loadCsvDataset(dataset, login) : loadJsonDatasetAsCsv(dataset, login);

  if (data) {
    const thisSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const maybeDatasetSheet = thisSpreadsheet.getSheetByName(dataset.key);
    const datasetSheet = maybeDatasetSheet
      ? maybeDatasetSheet
      : thisSpreadsheet.insertSheet(dataset.key);
    datasetSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
    Logger.log(`Loading of '${dataset.key}' complete`);
  } else {
    Logger.log(`Loading of '${dataset.key}' failed`);
  }
};

const loadDataset = (key: DatasetKey): string => {
  const login = getLogin();

  if (!login) {
    const message =
      "Failed to load dataset: You are not logged in. Go to Add-ons > Atlassian Marketplace > Login to log in.";
    Logger.log(message);
    return message;
  }

  if (!login.username || !login.apiToken || !login.vendorId) {
    const message =
      "Failed to load dataset: Username, password or vendorId is missing. Try to log out and log back in by going to to Add-ons > Atlassian Marketplace > Logout.";
    Logger.log(message);
    return message;
  }

  const dataset = datasets.find((d) => d.key === key);

  if (dataset) {
    Logger.log(`Starting to load ${key} dataset`);
    loadSingleDataset(dataset, login);
    const successMessage = `Loading of ${key} dataset complete`;
    Logger.log(successMessage);
    return successMessage;
  } else {
    const datasetNotFoundMessage = `Failed to find dataset for key ${key}`;
    Logger.log(datasetNotFoundMessage);
    return datasetNotFoundMessage;
  }
};

export const loadAllDatasets = (): string => {
  const login = getLogin();

  if (!login) {
    const message =
      "Failed to load datasets: You are not logged in. Go to Add-ons > Atlassian Marketplace > Login to log in.";
    Logger.log(message);
    return message;
  }

  if (!login.username || !login.apiToken || !login.vendorId) {
    const message =
      "Failed to load datasets: Username, password or vendorId is missing. Try to log out and log back in by going to to Add-ons > Atlassian Marketplace > Logout.";
    Logger.log(message);
    return message;
  }

  Logger.log(`Starting to load ${datasets.length} datasets`);

  for (const dataset of datasets) {
    loadSingleDataset(dataset, login);
  }

  const successMessage = `Loading of ${datasets.length} datasets complete`;
  Logger.log(successMessage);
  return successMessage;
};

interface CustomNodeJsGlobal extends NodeJS.Global {
  onOpen: () => void;
  login: () => void;
  logout: () => void;
  loadDatasets: () => void;
  loadAllDatasets: () => string;
  loadtransactions: () => void;
  loadlicenses: () => void;
  loadfeedback: () => void;
  loadcloudLicenseChurns: () => void;
  loadcloudLicenseRenewals: () => void;
  loadcloudLicenseConversions: () => void;
  loadchurnBenchmark: () => void;
  loadsalesBenchmark: () => void;
  loadevaluationsBenchmark: () => void;
  loadarrPartnerMetric: () => void;
  loadmrrPartnerMetric: () => void;
}

declare const global: CustomNodeJsGlobal;

// Add functions to global object such that they are picked up by the
// gas-webpack-plugin and available in App Script.
// https://github.com/fossamagna/gas-webpack-plugin
global.onOpen = onOpen;
global.login = login;
global.logout = logout;
global.loadDatasets = loadDatasets;
global.loadAllDatasets = loadAllDatasets;
global.loadtransactions = loadtransactions;
global.loadlicenses = loadlicenses;
global.loadfeedback = loadfeedback;
global.loadcloudLicenseChurns = loadcloudLicenseChurns;
global.loadcloudLicenseRenewals = loadcloudLicenseRenewals;
global.loadcloudLicenseConversions = loadcloudLicenseConversions;
global.loadchurnBenchmark = loadchurnBenchmark;
global.loadsalesBenchmark = loadsalesBenchmark;
global.loadevaluationsBenchmark = loadevaluationsBenchmark;
global.loadarrPartnerMetric = loadarrPartnerMetric;
global.loadmrrPartnerMetric = loadmrrPartnerMetric;
