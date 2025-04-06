'use client'

import { groupSchedules } from "@/libs/utils";
import { Restaurant } from "@/types/restaurant";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react"
import { CardLoading } from "./loading";
import { BackendFetch } from "@/commonds/fetch-api";

export default function RestaurantCard() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [data, setData] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [shouldFetch, setShouldFetch] = useState<boolean>(true);
    const listDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    const [filters, setFilters] = useState({
        name: searchParams.get("name") || "",
        day: searchParams.get("day") || "",
        time: searchParams.get("time") || "",
    });

    const fetchRestaurants = useCallback(async () => {
        if (!shouldFetch) return;

        setLoading(true);
        setShouldFetch(false);

        try {
            const params = new URLSearchParams(
                Object.fromEntries(Object.entries(filters).filter(([value]) => value))
            ).toString();

            const response = await BackendFetch<Restaurant[]>(`/restaurants?${params}`, {
                method: "GET",
            });
            if (response.status !== 200) throw new Error("Failed to fetch restaurants");

            setData(response?.data?.data || []);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [filters, shouldFetch]);

    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        const params = new URLSearchParams(
            Object.fromEntries(Object.entries(filters).filter(([value]) => value))
        ).toString();

        router.push(`?${params}`, { scroll: false });
        setShouldFetch(true);
    };

    const handleClearFilters = () => {
        const resetFilters = { name: "", day: "", time: "" };
        setFilters(resetFilters);
        setError('')
        router.push("?", { scroll: false });
        setShouldFetch(true);
    };

    return (
        <div className="flex flex-col gap-8 container mx-auto md:px-0 px-4">
            <h2 className="text-2xl font-bold">Find your favorite restaurant</h2>
            <div className="flex flex-wrap gap-6">
                <input
                    type="text"
                    name="name"
                    placeholder="Restaurant Name"
                    value={filters.name}
                    onChange={handleChange}
                    className="px-4 py-2 border rounded w-full md:w-auto"
                />

                <select name="day" value={filters.day} onChange={handleChange} className="px-4 py-2 border rounded">
                    <option value="">Select Day</option>
                    {listDay.map((day) => (
                        <option key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </select>

                <input
                    type="time"
                    name="time"
                    value={filters.time}
                    onChange={handleChange}
                    className="px-4 py-2 border rounded"
                />
                <div className="flex gap-2">
                    <button
                        onClick={handleSearch}
                        className="cursor-pointer bg-green-800 text-white px-6 py-3 rounded-md"
                    >
                        Search
                    </button>
                    <button
                        onClick={handleClearFilters}
                        className="cursor-pointer bg-red-800 text-white px-6 py-3 rounded-md"
                    >
                        Clear
                    </button>
                </div>
            </div>


            {loading
                ? <CardLoading />
                : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {
                            data.map((restaurant) => (
                                <div key={restaurant.id} className="border p-4 rounded-lg shadow-md mb-4 flex flex-col h-full min-h-44 justify-between">
                                    <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                                    <div>
                                        <p className="text-gray-700 font-medium mt-2">Operating Hours:</p>
                                        <ul className="mt-1 text-gray-600">
                                            {groupSchedules(restaurant.schedules).map((schedule, index) => (
                                                <li key={index}>
                                                    {schedule.days}: {schedule.time}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
            {!loading && data.length === 0 ? (<p>No restaurants found.</p>) : null}
            {error && <p className="text-red-900">Error: {error}</p>}
        </div >
    );
}
