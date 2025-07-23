import { BASE_APIS_URL } from '../enum/global.enum';

export const API_URL = {
  AUTH: {
    AUTH: `${BASE_APIS_URL.UNSECURED}/auth`,
    LOGIN: `login`,
    REFRESH_TOKEN: `refresh-token`,
    LOGOUT: `logout`,
    FORGOT_PASSWORD: `forgot-password`,
    RESET_PASSWORD: `reset-password`,
  },
  USERS: {
    GET_ALL: `${BASE_APIS_URL.SECURED}/users`,
    CREATE: `${BASE_APIS_URL.UNSECURED}/users/create`,
  },
};
