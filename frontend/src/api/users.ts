import { AxiosRequestConfig, AxiosResponse } from "axios";
import httpClient from "./index";

const END_POINT = "/user/";

const getAllUsers = (): Promise<AxiosResponse> => httpClient.get(END_POINT);

const getUser = (user_id: string): Promise<AxiosResponse> =>
  httpClient.get(END_POINT + user_id);

const getSearch = (query: string): Promise<AxiosResponse> =>
  httpClient.post(`${END_POINT}search/`, { query: query });

const updateUser = (payload: {
  email: string;
  firstname: string;
  lastname: string;
}): Promise<AxiosResponse> => httpClient.patch(`${END_POINT}me`, payload);

const upload = (data: FormData): Promise<AxiosResponse> => {
  const config: AxiosRequestConfig = {
    headers: {
      crossdomain: true,
      "Content-Type": "undefined",
    },
  };
  return httpClient.post(`${END_POINT}upload/`, data, config);
};

export { getAllUsers, getUser, getSearch, updateUser, upload };
