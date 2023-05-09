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
import {Assignment} from "../../../models/Assignment";

export const EmployeesAssignedAdd = () => {
	const navigate = useNavigate();
	const {eventID} = useParams();

	const [employees, setEmployees] = useState<Employee[]>([]);
	const [companyEvent, setCompanyEvent] = useState<Event>();

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

	const [assignedEmployee, setAssignedEmployee] = useState<Assignment>({
		employee_id: -1,
		employee: temp_employee,
		event_id: Number(eventID),
		event: temp_event,
		event_summary: "",
		event_outcome: 0
    });

	 useEffect(() => {
        axios.get(`${BACKEND_API_URL}/events/${eventID}`)
            .then((response) => response.data)
            .then((data) => {
                setCompanyEvent(data);
            });
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

	const addEmployeeAssigned = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			console.log(assignedEmployee);
			await axios.post(`${BACKEND_API_URL}/events/${eventID}/employees-assigned`, assignedEmployee,  {
                    headers: {
                        'Content-Type': 'application/json'
                    }
			});
			navigate(`/events/${eventID}/employees-assigned`);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/events/${eventID}/employees-assigned`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<form onSubmit={addEmployeeAssigned}>
						<TextField
							id="event"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							value={companyEvent?.name || ""}
						/>

						<Autocomplete
                            id="employee"
							sx={{ mb: 2 }}
                            options={employees}
                            renderInput={(params) => <TextField {...params} label="Employee" variant="outlined"/>}
                            getOptionLabel={(option) => `${option.name}, ${option.job}`}
                            filterOptions={(x) => x}

                            onInputChange={handleInputChange}
                            onChange={(event, value) => {
                                if (value) {
                                    if (value.id !== undefined) {
                                        setAssignedEmployee({...assignedEmployee, employee_id: value.id});
                                    }
                                }
                            }}
                        />

						<TextField
							id="event_summary"
							label="Event summary"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setAssignedEmployee({ ...assignedEmployee, event_summary: event.target.value })}
						/>
						<TextField
							id="event_outcome"
							label="Event outcome"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setAssignedEmployee({ ...assignedEmployee, event_outcome: Number(event.target.value) })}
						/>

						<Button type="submit">Assign employee to event</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};