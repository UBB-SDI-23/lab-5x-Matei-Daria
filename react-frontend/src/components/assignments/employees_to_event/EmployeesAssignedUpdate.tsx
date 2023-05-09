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

export const EmployeesAssignedUpdate = () => {
    const navigate = useNavigate();
    const {eventID, assignmentID} = useParams();

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

    const [employeeAssignment, setEmployeeAssignment] = useState<Assignment>(
        {
            id: Number(assignmentID),
            employee_id: -1,
            employee: temp_employee,
            event_id: Number(eventID),
            event: temp_event,
            event_summary: "",
            event_outcome: 0
        }
    );
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_API_URL}/events/${eventID}/employees-assigned/${assignmentID}`)
            .then((response) => response.data)
            .then((data) => {
                setAssignmentDetails(data);
                setEmployeeDetails(data.employee);
                setEventDetails(data.event);
            })
    }, [eventID]);

    const fetchSuggestions = async (query: string) => {
        try {
            const response = await axios.get<Employee[]>(
				`${BACKEND_API_URL}/employees/autocomplete?query=${query}`
			);
			const data = await response.data;
			setEmployees(data);
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
            await axios.put(`${BACKEND_API_URL}/events/${eventID}/employees-assigned/${assignmentID}`, employeeAssignment).then((response) => (console.log(response.data)));
            navigate(`/events/${eventID}/employees-assigned`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container>
            <IconButton component={Link} sx={{mr: 3}} to={`/events/${eventID}/employees-assigned`}>
                <ArrowBackIcon/>
            </IconButton>{" "}
            <h1>Event assignment Edit</h1>
            <Container sx={{display: "flex"}}>
                <Card>
                    <CardContent>
                        <h3>This is the event assignment that will be edited:</h3>
                        <p>Event: {eventDetails?.name}</p>
                        <p>Employee: {employeeDetails?.name + ", " + employeeDetails?.job}</p>
                        <p>Event summary: {assignmentDetails?.event_summary}</p>
                        <p>Event outcome: {assignmentDetails?.event_outcome}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <form>
                            <TextField
                                id="company_event"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                value={eventDetails?.name}
                            />
                            <Autocomplete
                                id="employee"
                                options={employees}
                                renderInput={(params) => <TextField {...params} label="Employee" variant="outlined"/>}
                                getOptionLabel={(option) => `${option.name}, ${option.job}`}
                                filterOptions={(options, state) => options.filter((option) => option.name.toLowerCase().includes(state.inputValue.toLowerCase()))}
                                sx={{mb: 2}}
                                onInputChange={handleInputChange}
                                onChange={(event, value) => {
                                    // @ts-ignore
                                    setEmployeeAssignment({...employeeAssignment, employee_id: value.id})
                                }}
                            />
                            <TextField
                                id="event_summary"
                                label="Event summary"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={(event) => setEmployeeAssignment({
                                    ...employeeAssignment,
                                    event_summary: event.target.value
                                })}
                            />
                            <TextField
                                id="event_outcome"
                                label="Event outcome"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={(event) => setEmployeeAssignment({
                                    ...employeeAssignment,
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