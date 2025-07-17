import { BASE_APIS_URL } from '../enum/global.enum';

export const API_URL = {
  AUTH: {
    LOGIN: `${BASE_APIS_URL.UNSECURED}/auth/login`,
    REGISTER: `${BASE_APIS_URL.UNSECURED}/auth/register`,
    FORGOT_PASSWORD: `${BASE_APIS_URL.UNSECURED}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_APIS_URL.UNSECURED}/auth/reset-password`,
  },
};
