'use client'
import { ResponseInterface, StorageToken } from "@/types/response";
import { useSearchParams } from "next/navigation";
import { BackendFetch } from "./fetch-api";
import { Restaurant } from "@/types/restaurant";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryClient } from "@/components/query-client";
import { AxiosError } from "axios";

export function useGetRestaurantList() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name") || "";
  const day = searchParams.get("day") || "";
  const time = searchParams.get("time") || "";
  const page = searchParams.get("page") || "1";
  const sort = searchParams.get("sort") || "updated_at";
  const order = searchParams.get("order") || "desc";
  const filter: Partial<Record<string, string>> = {};
  if (name) filter["keyword"] = name;
  if (day) filter["day"] = day;
  if (time) filter["time"] = time;

  const params: Record<string, string | number> = {
    page: Number(page),
    per_page: 5,
    sort,
    order,
  };

  return useQuery({
    queryKey: ["restaurants", page, name, day, time, sort],
    queryFn: async () => {
      return await BackendFetch<Restaurant[]>(`/restaurants`, {
        method: "GET",
        params,
      });
    },
  });
}

export function useCreateRestaurantList() {
  const mutationFn = async (data: Restaurant) => {
    const response = await BackendFetch(`/restaurants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem(StorageToken.ACCESS_TOKEN)}`,
      },
      data: JSON.stringify(data),
    });

    return response;
  };

  return useMutation({
    mutationFn,
    onSuccess: (list) => {
      toast(`${list.message}`, { type: "success" });
      Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["restaurants"],
        }),
      ]);
    },
    onError: (error: AxiosError<ResponseInterface<Restaurant>>) => {
      const errorMessage =
        error?.response?.data?.data?.schedules?.[0] ||
        error?.response?.data?.message ||
        "An unexpected error occurred";
      toast(`${errorMessage}`, { type: "error" });
    },
  });
}

export function useUpdateRestaurantList(id: string) {
  const mutationFn = async (data: Restaurant) => {
    return await BackendFetch(`/restaurants/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem(StorageToken.ACCESS_TOKEN)}`,
      },
      data: JSON.stringify(data),
    });
  }
  return useMutation({
    mutationFn,
    onSuccess: (list) => {
      toast(`${list.message}`, { type: "success" });
      Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["restaurants"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["restaurants", id],
        }),
      ]);
    },
    onError: (error: AxiosError<ResponseInterface<Restaurant>>) => {
      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred";
      toast(`${errorMessage}`, { type: "error" });
    },
  });
}

export function useDeleteRestaurantList() {
  const mutationFn = async (id: string) => {
    return await BackendFetch(`/restaurants/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem(StorageToken.ACCESS_TOKEN)}`,
      },
    });
  }
  return useMutation({
    mutationFn,
    onSuccess: (list) => {
      toast(`${list.message}`, { type: "success" });
      Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["restaurants"],
        }),
      ]);
    },
    onError: (error: AxiosError<ResponseInterface<Restaurant>>) => {
      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred";
      toast(`${errorMessage}`, { type: "error" });
    },
  });
}