import { Schedule } from "@/types/restaurant";

export const groupSchedules = (schedules: Schedule[]) => {
    const dayOrder: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
  
    schedules.sort((a, b) => dayOrder[a.day_of_week] - dayOrder[b.day_of_week]);
  
    const grouped: { days: string[]; open_time: string; close_time: string }[] = [];
  
    for (const schedule of schedules) {
      const lastGroup = grouped[grouped.length - 1];
  
      if (
        lastGroup &&
        lastGroup.open_time === schedule.open_time &&
        lastGroup.close_time === schedule.close_time
      ) {
        lastGroup.days.push(schedule.day_of_week);
      } else {
        grouped.push({
          days: [schedule.day_of_week],
          open_time: schedule.open_time,
          close_time: schedule.close_time,
        });
      }
    }
  
    return grouped.map(({ days, open_time, close_time }) => ({
      days: days.length > 1 ? `${days[0]}-${days[days.length - 1]}` : days[0],
      time: `${formatTime(open_time)} - ${formatTime(close_time)}`,
    }));
  };
  
  // Function to format time
export const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const formattedHours = ((hours + 11) % 12) + 1;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  };
  