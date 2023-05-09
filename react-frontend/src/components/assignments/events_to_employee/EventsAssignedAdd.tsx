import {Autocomplete, Button, Card, CardActions, CardContent, IconButton, TextField} from "@mui/material";
import {Container} from "@mui/system";
import React, {useCallback, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {BACKEND_API_URL} from "../../../constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {debounce} from "lodash";
import axios from "axios";
import {Employee} from "../../../models/Employee";
import {Event} from "../../../models/Event";
import {Location} from "../../../models/Location";

export const EventsAssignedAdd = () => {
    const navigate = useNavigate();
    const {employeeID} = useParams();

    const [companyEvents, setCompanyEvents] = useState<Event[]>([]);
    const [employee, setEmployee] = useState<Employee>();


    const temp_employee: Employee = {
        name: "",
        job: "",
        hire_date: "",
        salary: 0,
        on_leave: false,
    }

    const temp_location: Location = {
        street: "",
        number: "",
        city: "",
        building_name: "",
        details: ""
    }

    const temp_event: Event = {
        name: "",
        details: "",
        date: "",
        importance: "",
        business_trip: false,
        location_id: -1,
        location: temp_location
    }


    const [assignedEvent, setAssignedEvent] = useState({
        employee_id: Number(employeeID),
        employee: temp_employee,
        event_id: -1,
        event: temp_event,
        event_summary: "",
        event_outcome: 0
    });

    useEffect(() => {
        axios.get(`${BACKEND_API_URL}/employees/${employeeID}`)
            .then((response) => response.data)
            .then((data) => {
                setEmployee(data);
            });
    }, [employeeID]);
    const fetchSuggestions = async (query: string) => {
        try {
            const response = await axios.get<Event[]>(
                `${BACKEND_API_URL}/events/autocomplete?query=${query}`
            );
            const data = await response.data;
            setCompanyEvents(data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), []);

    useEffect(() => {
        return () => {
            debouncedFetchSuggestions.cancel();
        };
    }, [debouncedFetchSuggestions]);

    const handleInputChange = (event: any, value: any, reason: any) => {
        console.log("input", value, reason);

        if (reason === "input") {
            debouncedFetchSuggestions(value);
        }
    };

    const addEventAssigned = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios.post(`${BACKEND_API_URL}/employees/${employeeID}/events-assigned`, assignedEvent, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            navigate(`/employees/${employeeID}/events-assigned`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{mr: 3}} to={`/employees/${employeeID}/events-assigned`}>
                        <ArrowBackIcon/>
                    </IconButton>{" "}
                    <form onSubmit={addEventAssigned}>
                        <TextField
                            id="companyEvent"
                            variant="outlined"
                            fullWidth
                            sx={{mb: 2}}
                            value={employee?.name || ""}
                        />

                        <Autocomplete
                            id="event"
                            sx={{mb: 2}}
                            options={companyEvents}
                            renderInput={(params) => <TextField {...params} label="Event" variant="outlined"/>}
                            getOptionLabel={(option) => `${option.name}`}
                            filterOptions={(x) => x}

                            onInputChange={handleInputChange}
                            onChange={(event, value) => {
                                if (value) {
                                    if (value.id !== undefined) {
                                        setAssignedEvent({...assignedEvent, event_id: value.id});
                                    }
                                }
                            }}
                        />

                        <TextField
                            id="event_summary"
                            label="Event summary"
                            variant="outlined"
                            fullWidth
                            sx={{mb: 2}}
                            onChange={(event) => setAssignedEvent({
                                ...assignedEvent,
                                event_summary: event.target.value
                            })}
                        />
                        <TextField
                            id="event_outcome"
                            label="Event outcome"
                            variant="outlined"
                            fullWidth
                            sx={{mb: 2}}
                            onChange={(event) => setAssignedEvent({
                                ...assignedEvent,
                                event_outcome: Number(event.target.value)
                            })}
                        />

                        <Button type="submit">Assign event to employee</Button>
                    </form>
                </CardContent>
                <CardActions></CardActions>
            </Card>
        </Container>
    );
};