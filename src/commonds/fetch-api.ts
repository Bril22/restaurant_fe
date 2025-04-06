import { type ResponseInterface } from "@/types/response";
import axios, { AxiosRequestConfig } from "axios";
export const BackendFetch = async <T>(
  url: string,
  r: AxiosRequestConfig
): Promise<ResponseInterface<T>> => {
  const data = await axios(process.env.NEXT_PUBLIC_API_URL + url, r);
  return data.data;
};
