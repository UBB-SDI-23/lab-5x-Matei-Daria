import {Autocomplete, Button, Card, CardActions, CardContent, IconButton, TextField} from "@mui/material";
import {Container} from "@mui/system";
import React, {useCallback, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {BACKEND_API_URL} from "../../../constants";
import {Event} from "../../../models/Event"
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import {debounce} from "lodash";
import {Employee} from "../../../models/Employee";
import {Assignment} from "../../../models/Assignment";
import {Location} from "../../../models/Location";


export const EventsAssignedUpdate = () => {
    const navigate = useNavigate();
    const {employeeID, assignmentID} = useParams();

    const [assignmentDetails, setAssignmentDetails] = useState<Assignment>();
    const [eventDetails, setEventDetails] = useState<Event>();
    const [employeeDetails, setEmployeeDetails] = useState<Employee>();

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


    const [eventAssignment, setEventAssignment] = useState<Assignment>(
        {
            id: Number(assignmentID),
            employee_id: Number(employeeID),
            employee: temp_employee,
            event_id: -1,
            event: temp_event,
            event_summary: "",
            event_outcome: 0
        }
    );
    const [companyEvents, setCompanyEvents] = useState<Event[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_API_URL}/employees/${employeeID}/events-assigned/${assignmentID}`)
            .then((response) => response.data)
            .then((data) => {
                setAssignmentDetails(data);
                setEventDetails(data.event);
                setEmployeeDetails(data.employee);
            })
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

    const putEmployeeAssignment = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios.put(`${BACKEND_API_URL}/employees/${employeeID}/events-assigned/${assignmentID}`, eventAssignment).then((response) => (console.log(response.data)));
            navigate(`/employees/${employeeID}/events-assigned`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container>
            <IconButton component={Link} sx={{mr: 3}} to={`/employees/${employeeID}/events-assigned`}>
                <ArrowBackIcon/>
            </IconButton>{" "}
            <h1>Event assignment Edit</h1>
            <Container sx={{display: "flex"}}>
                <Card>
                    <CardContent>
                        <h3>This is the employee assignment that will be edited:</h3>
                        <p>Employee: {employeeDetails?.name + ", " + employeeDetails?.job}</p>
                        <p>Event: {eventDetails?.name}</p>
                        <p>Event summary: {assignmentDetails?.event_summary}</p>
                        <p>Event outcome: {assignmentDetails?.event_outcome}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <form>
                            <TextField
                                id="employee"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                value={employeeDetails?.name + ", " + employeeDetails?.job}
                            />
                            <Autocomplete
                                id="event"
                                options={companyEvents}
                                renderInput={(params) => <TextField {...params} label="Event" variant="outlined"/>}
                                getOptionLabel={(option) => `${option.name}`}
                                filterOptions={(x) => x}
                                sx={{mb: 2}}
                                onInputChange={handleInputChange}
                                onChange={(event, value) => {
                                    // @ts-ignore
                                    setEventAssignment({...eventAssignment, event_id: value.id})
                                }}
                            />
                            <TextField
                                id="event_summary"
                                label="Event summary"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={(event) => setEventAssignment({
                                    ...eventAssignment,
                                    event_summary: event.target.value
                                })}
                            />
                            <TextField
                                id="event_outcome"
                                label="Event outcome"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={(event) => setEventAssignment({
                                    ...eventAssignment,
                                    event_outcome: Number(event.target.value)
                                })}
                            />

                            <Button onClick={putEmployeeAssignment} type="submit">Edit Event</Button>
                        </form>
                    </CardContent>
                    <CardActions></CardActions>
                </Card>
            </Container>
        </Container>
    );
};