import axios, { AxiosError, AxiosResponse } from "axios";
import store from "@/store/index";

export const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL || "http://127.0.0.1:3000/";

const httpClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 1000, // indicates, 1000ms ie. 1 second
  headers: {
    "Content-Type": "application/json",
  },
});

const authInterceptor = (config: any) => {
  config.headers["Authorization"] = "Bearer " + store.state.user.token;
  return config;
};

const alertError = (error: AxiosError) => {
  console.error(error.response?.status, error.message);
  store.dispatch(
    "alert/error",
    error.message + " " + (error.response?.status ?? ""),
    { root: true }
  );
};

httpClient.interceptors.request.use(authInterceptor);

// interceptor to catch errors
const errorInterceptor = (error: AxiosError) => {
  // check if it's a server error
  if (!error.response) {
    alertError(error);
    return Promise.reject(error);
  }

  // all the other error responses
  switch (error.response.status) {
    case 400:
      alertError(error);
      break;

    case 401: // authentication error, logout the user
      alertError(error);
      store.dispatch("user/logout");
      break;

    default:
      alertError(error);
  }
  return Promise.reject(error);
};

// Interceptor for responses
const responseInterceptor = (response: AxiosResponse) => {
  switch (response.status) {
    case 200:
      // yay!
      break;
    // any other cases
    default:
    // default case
  }

  return response;
};

httpClient.interceptors.response.use(responseInterceptor, errorInterceptor);

export default httpClient;
