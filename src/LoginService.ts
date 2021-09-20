export interface Credentials {
  readonly username: string;
  readonly apiToken: string;
}

export interface Login extends Credentials {
  readonly vendorId: string;
}

const LOGIN_PROPERTY_KEY = "LOGIN";

export const getLogin = (): Login | null => {
  const storedProperty = PropertiesService.getUserProperties().getProperty(LOGIN_PROPERTY_KEY);
  return storedProperty ? JSON.parse(storedProperty) : null;
};

export const isUserLoggedIn = (): boolean => {
  const login = getLogin();
  return !!(
    login &&
    login.username &&
    login.username !== "" &&
    login.apiToken &&
    login.apiToken !== ""
  );
};

export const logInUser = (login: Login): void => {
  const serializedLogin = JSON.stringify(login);
  PropertiesService.getUserProperties().setProperty(LOGIN_PROPERTY_KEY, serializedLogin);
};

export const logoutUser = (): void => {
  PropertiesService.getUserProperties().deleteProperty(LOGIN_PROPERTY_KEY);
};
