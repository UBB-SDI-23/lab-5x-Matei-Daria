import {Event} from "./Event"

export interface Employee {
    id?: number;
    name: string;
    job: string;
    hire_date: string;
    salary: number;
    on_leave: boolean;
    avg_outcome?: number;
    events?: Event[];
}