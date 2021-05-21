import { AxiosRequestConfig, AxiosResponse } from "axios";
import httpClient from "./index";

const END_POINT = "/service/";

const getTimeline = (count = 20): Promise<AxiosResponse> =>
  httpClient.get(END_POINT + "random/" + count);

const deleteService = (serviceId: string): Promise<AxiosResponse> =>
  httpClient.delete(END_POINT + serviceId);

const create = (payload: {
  name: string;
  description: string;
  price: number;
  tags: Array<string>;
}): Promise<AxiosResponse> => httpClient.post(`${END_POINT}`, payload);

const update = (
  serviceId: string,
  payload: {
    photo?: string;
    name?: string;
    description?: string;
    price?: number;
    tags?: Array<string>;
  }
): Promise<AxiosResponse> =>
  httpClient.patch(`${END_POINT}${serviceId}`, payload);

const upload = (serviceId: string, data: FormData): Promise<AxiosResponse> => {
  const config: AxiosRequestConfig = {
    headers: {
      crossdomain: true,
      "Content-Type": "undefined",
    },
  };
  return httpClient.post(`${END_POINT}upload/${serviceId}`, data, config);
};

export { getTimeline, create, update, upload, deleteService };
