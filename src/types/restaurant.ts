export type Schedule = {
    id?: number;
    restaurant_id?: string;
    day_of_week: string;
    open_time: string;
    close_time: string;
  };
  
export type Restaurant = {
    id?: string;
    name: string;
    schedules: Schedule[];
  };