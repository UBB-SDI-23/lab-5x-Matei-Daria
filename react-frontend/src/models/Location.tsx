import {Event} from "./Event";

export interface Location {
    id?: number;
    street: string;
    number: string;
    city: string;
    building_name: string;
    details: string;
    events?: Event[];
}