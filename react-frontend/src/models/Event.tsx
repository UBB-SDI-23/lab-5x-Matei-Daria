import {Location} from "./Location"
import {Employee} from "./Employee";

export interface Event {
    id?: number;
    name: string;
    details: string;
    date: string;
    importance: string;
    business_trip: boolean;
    location_id?: number;
    location?: Location;
    avg_salary_participants?: number;
    employees?: Employee[];
}