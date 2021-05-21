import { AxiosResponse } from "axios";
import httpClient from "./index";

const END_POINT = "/tags/";

const getAll = (): Promise<AxiosResponse> => httpClient.get(END_POINT);

export { getAll };
