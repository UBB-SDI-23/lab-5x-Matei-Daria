import {Event} from "./Event"
import {Employee} from "./Employee"

export interface Assignment {
    id?: number;
    employee_id: number,
    employee: Employee,
    event_id: number,
    event: Event,
    event_summary?: string,
    event_outcome?: number
}