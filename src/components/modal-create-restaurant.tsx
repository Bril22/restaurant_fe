import { useCreateRestaurantList, useUpdateRestaurantList } from "@/commonds/query";
import { Restaurant } from "@/types/restaurant";
import { useState } from "react";

interface Props {
    restaurant?: Restaurant | null;
    onClose: () => void;
}

const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export default function RestaurantDialog({ restaurant, onClose }: Props) {
    const [form, setForm] = useState<Restaurant>({
        name: restaurant?.name || "",
        schedules: restaurant?.schedules || daysOfWeek.map((day) => ({
            day_of_week: day,
            open_time: "",
            close_time: ""
        }))
    });

    const handleTimeFocus = (index: number, field: "open_time" | "close_time") => {
        if (!form.schedules[index][field]) {
            handleScheduleChange(index, field, "00:00");
        }
    };

    const handleTimeBlur = (index: number, field: "open_time" | "close_time") => {
        if (form.schedules[index][field] === "00:00") {
            handleScheduleChange(index, field, "");
        }
    };

    const { mutateAsync: createAsync } = useCreateRestaurantList();
    const { mutateAsync: updateAsync } = useUpdateRestaurantList(restaurant?.id ?? "");

    const handleCreateRestaurant = async (payload: Restaurant) => {
        try {
            await createAsync(payload)
        } catch (error) {
            console.log('error:', error)
        }
    }

    const handleUpdateRestaurant = async (payload: Restaurant) => {
        try {
            await updateAsync(payload)
        } catch (error) {
            console.log('error:', error)
        }
    }

    const handleScheduleChange = (index: number, field: "open_time" | "close_time", value: string) => {
        const newSchedules = [...form.schedules];
        newSchedules[index][field] = value;
        setForm({ ...form, schedules: newSchedules });
    };

    const handleSubmit = async () => {
        const filteredSchedules = form.schedules.filter(
            (s) => s.open_time.trim() !== "" && s.close_time.trim() !== ""
        );

        const payload = {
            name: form.name,
            schedules: filteredSchedules,
        };

        if (restaurant?.id) {
            handleUpdateRestaurant(payload)
        } else {
            handleCreateRestaurant(payload)
        }

        onClose();
    };

    return (
        <div className="relative z-10 focus:outline-none" >
            <div
                className="fixed inset-0 bg-black/60 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center">
                    <div
                        className="bg-white w-full rounded-xl p-8 max-w-xl backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 z-50"
                    >
                        <h2 className="text-xl font-semibold mb-4">{restaurant ? "Edit Restaurant" : "Create Restaurant"}</h2>
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold">Restaurant Name</p>
                            <input
                                type="text"
                                placeholder="Restaurant Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full p-2 border mb-4"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="font-semibold">Operational Time</p>
                            {form.schedules.map((schedule, index) => (
                                <div key={schedule.day_of_week} className="mb-3">
                                    <p className="font-medium">{schedule.day_of_week}</p>
                                    <div className="flex gap-2 mt-1">
                                        <input
                                            type="time"
                                            value={schedule.open_time}
                                            onFocus={() => handleTimeFocus(index, "open_time")}
                                            onBlur={() => handleTimeBlur(index, "open_time")}
                                            onChange={(e) => handleScheduleChange(index, "open_time", e.target.value)}
                                            className="w-1/2 p-2 border"
                                        />
                                        <input
                                            type="time"
                                            value={schedule.close_time}
                                            onFocus={() => handleTimeFocus(index, "close_time")}
                                            onBlur={() => handleTimeBlur(index, "close_time")}
                                            onChange={(e) => handleScheduleChange(index, "close_time", e.target.value)}
                                            className="w-1/2 p-2 border"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
                                Cancel
                            </button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
