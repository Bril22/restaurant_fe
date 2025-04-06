export enum StorageToken {
    ACCESS_TOKEN = "access_token",
  }
  

export interface ResponseDataInterface<DATA> {
    // response array data
    datas?: DATA[];
    // response object data
    data?: DATA;
    count?: number;
    page?: number;
    limit?: number;
    countPage?: number;
    access_token?: string;
    next_page_url?: string | null;
    prev_page_url?: string | null;
    per_page?: number;
    total?: number
    schedules?: string[]
  }

export interface ResponseInterface<DATA> {
    status: number;
    message: string | string[];
    data?: ResponseDataInterface<DATA>;
    success?: boolean;
}