import { AxiosResponse } from "axios";
import httpClient from "./index";

const END_POINT = "/account";

const login = (payload: {
  email: string;
  password: string;
}): Promise<AxiosResponse> => httpClient.post(`${END_POINT}/login`, payload);

const changePassword = (payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<AxiosResponse> => {
  console.log(payload);
  return httpClient.post(`${END_POINT}/change-password`, payload);
};

export { login, changePassword };
