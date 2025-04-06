import { groupSchedules } from "@/libs/utils";
import { Restaurant } from "@/types/restaurant";

interface Props {
    data: Restaurant[];
    isLoading: boolean;
    isError: boolean;
    onEdit: (restaurant: Restaurant) => void;
    onDelete: (id: string) => void;
}

export default function RestaurantTable({ data, isLoading, isError, onEdit, onDelete }: Props) {
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p className="text-red-500">Failed to load restaurants</p>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border">Name</th>
                        <th className="py-2 px-4 border">Operation Hours</th>
                        {/* <th className="py-2 px-4 border">Last Update</th> */}
                        <th className="py-2 px-4 border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((restaurant) => (
                        <tr key={restaurant.id} className="text-center">
                            <td className="py-2 px-4 border">{restaurant.name}</td>
                            <td className="py-2 px-4 border">
                                {groupSchedules(restaurant.schedules).map((schedule, index) => (
                                    <p key={index}>
                                        {schedule.days}: {schedule.time}
                                    </p>
                                ))}
                            </td>
                            {/* <td className="py-2 px-4 border">{new Date(restaurant.updatedAt).toLocaleString()}</td> */}
                            <td className="py-2 px-4 border">
                                <button
                                    className="cursor-pointer bg-blue-800 text-white px-2 py-1 rounded mr-2"
                                    onClick={() => onEdit(restaurant)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="cursor-pointer bg-red-900 text-white px-2 py-1 rounded"
                                    onClick={() => onDelete(restaurant.id!)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
