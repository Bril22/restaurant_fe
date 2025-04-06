"use client";

import { useEffect, useState } from "react";
import RestaurantDialog from "@/components/modal-create-restaurant";
import RestaurantTable from "@/components/table-restaurant";
import { useDeleteRestaurantList, useGetRestaurantList } from "@/commonds/query";
import { Restaurant } from "@/types/restaurant";
import { useRouter, useSearchParams } from "next/navigation";

export default function RestaurantList() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const page = Number(searchParams.get("page") || 1); const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const setPage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };
    const { data, isLoading, isError, refetch } = useGetRestaurantList()
    const dataList = data?.data?.data;
    const totalPages = data?.data ? Math.ceil(data.data.total! / data.data.per_page!) : 1;
    const { mutateAsync: deleteAsync } = useDeleteRestaurantList();
    const handleDelete = async (id: string) => {
        await deleteAsync(id);
    };

    useEffect(() => {
        refetch();
    }, [selectedRestaurant?.id, refetch]);

    return (
        <div className="p-6 max-w-5xl mx-auto flex flex-col gap-12">
            <h1 className="md:text-5xl text-3xl font-bold">Admin Page</h1>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Restaurant List</h1>
                <button
                    className="cursor-pointer bg-green-900 text-white px-4 py-2 rounded-md"
                    onClick={() => setIsEditing(true)}
                >
                    Create Restaurant
                </button>
            </div>

            <RestaurantTable
                data={dataList || []}
                isLoading={isLoading}
                isError={isError}
                onEdit={(restaurant) => {
                    setSelectedRestaurant(restaurant);
                    setIsEditing(true);
                }}
                onDelete={handleDelete}
            />

            <div className="flex justify-between mt-4">
                <button
                    disabled={page <= 1}
                    className="cursor-pointer px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>

                <span>Page {page} of {totalPages}</span>
                <button
                    disabled={page >= totalPages}
                    className="cursor-pointer px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    onClick={() => setPage(page + 1)}                >
                    Next
                </button>
            </div>

            {isEditing && (
                <RestaurantDialog
                    restaurant={selectedRestaurant}
                    onClose={() => {
                        setIsEditing(false);
                        setSelectedRestaurant(null);
                    }}
                />
            )}
        </div>
    );
}
