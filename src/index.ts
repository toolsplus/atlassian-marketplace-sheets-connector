import { datasetKeys, getFirstVendorId, loadDataset } from "./MarketplaceService";
import {
  Credentials,
  getLogin,
  isUserLoggedIn,
  Login,
  logInUser,
  logoutUser,
} from "./LoginService";

const onOpen = (): void => {
  const ui = SpreadsheetApp.getUi();
  const isLoggedIn = isUserLoggedIn();

  if (isLoggedIn) {
    ui.createAddonMenu()
      .addItem("Load datasets", "loadDatasets")
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

export const loadAllDatasets = (): string => {
  const loadSingleDataset = (datasetKey: string, login: Login) => {
    Logger.log(`Starting to load '${datasetKey}' dataset`);
    const csvData = loadDataset(datasetKey, login);

    if (csvData) {
      const thisSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const maybeDatasetSheet = thisSpreadsheet.getSheetByName(datasetKey);
      const datasetSheet = maybeDatasetSheet
        ? maybeDatasetSheet
        : thisSpreadsheet.insertSheet(datasetKey);
      datasetSheet.getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData);
      Logger.log(`Loading of '${datasetKey}' complete`);
    } else {
      Logger.log(`Loading of '${datasetKey}' failed`);
    }
  };

  const login = getLogin();

  if (!login) {
    const message =
      "Failed to load datasets because you are not logged in. Go to Add-ons > Atlassian Marketplace > Login to log in.";
    Logger.log(message);
    return message;
  }

  if (!login.username || !login.apiToken || !login.vendorId) {
    const message =
      "Failed to load datasets because username, password or vendorId is missing. Try to log out and log back in by going to to Add-ons > Atlassian Marketplace > Logout.";
    Logger.log(message);
    return message;
  }

  Logger.log(`Starting to load ${datasetKeys.length} datasets`);

  for (const datasetKey of datasetKeys) {
    loadSingleDataset(datasetKey, login);
  }

  const successMessage = `Loading of ${datasetKeys.length} datasets complete`;
  Logger.log(successMessage);
  return successMessage;
};

interface CustomNodeJsGlobal extends NodeJS.Global {
  onOpen: () => void;
  login: () => void;
  logout: () => void;
  loadDatasets: () => void;
  loadAllDatasets: () => string;
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
