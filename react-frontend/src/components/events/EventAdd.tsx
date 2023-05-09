import {Autocomplete, Button, Card, CardActions, CardContent, IconButton, TextField} from "@mui/material";
import {Container} from "@mui/system";
import React, {useCallback, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {BACKEND_API_URL} from "../../constants";
import {Location} from "../../models/Location"
import {Event} from "../../models/Event";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {debounce} from "lodash";
import axios from "axios";
import {Employee} from "../../models/Employee";

export const EventAdd = () => {
	const navigate = useNavigate();

	const [locations, setLocations] = useState<Location[]>([]);

	 const temp_location: Location = {
        street: "",
        number: "",
        city: "",
        building_name: "",
        details: ""
    }

	const [companyEvent, setCompanyEvent] = useState<Event>({
		name: "",
        details: "",
        date: "",
        importance: "",
        business_trip: false,
		location_id: -1,
		location: temp_location,
		avg_salary_participants: 0,
    	employees: []
    });
	 const fetchSuggestions = async (query: string) => {
        try {
			const response = await axios.get<Location[]>(
				`${BACKEND_API_URL}/locations/autocomplete?query=${query}`
			);
			const data = await response.data;
			setLocations(data);
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

	const addEvent = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			if (companyEvent.location_id == -1)
				{ // @ts-ignore
					setCompanyEvent({...companyEvent, location_id: null});
				}
			console.log(companyEvent)
			await axios.post(`${BACKEND_API_URL}/events`, companyEvent,  {
                    headers: {
                        'Content-Type': 'application/json'
                    }
			});
			navigate("/events");
		} catch (error) {
			console.log(error);
		}
	};

	const [importanceError, setImportanceError] = useState('');
	function handleImportanceChange(event: any) {
		const input = event.target.value;
		const regex = /^[1-3]$/;
		if (regex.test(input)) {
			setImportanceError('');
			setCompanyEvent({ ...companyEvent, importance: input});
		}
		else {
			setImportanceError("Importance must be either 1 (high), 2 (medium), or 3 (low).");
		}
	}

	const [businessTripError, setBusinessTripError] = useState('');
	function handleBusinessTripChange(event: any) {
		const input = event.target.value;
		const regex = /^(true|false)$/;
		if (regex.test(input)) {
			setBusinessTripError('');
			setCompanyEvent({ ...companyEvent, business_trip: input == 'true' });
		}
		else {
			setBusinessTripError("Business trip must be either 'true' or 'false'.");
		}
	}


	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/events`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<form onSubmit={addEvent}>
						<TextField
							id="name"
							label="Name"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setCompanyEvent({ ...companyEvent, name: event.target.value })}
						/>
						<TextField
							id="details"
							label="Details"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setCompanyEvent({ ...companyEvent, details: event.target.value })}
						/>
						<TextField
							id="date"
							label="Date"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setCompanyEvent({ ...companyEvent, date: event.target.value })}
						/>
						<TextField
							id="importance"
							label="Importance"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={handleImportanceChange}
							error={!!importanceError}
							helperText={importanceError}
						/>
						<TextField
							id="business_trip"
							label="Business trip"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={handleBusinessTripChange}
							error={!!businessTripError}
							helperText={businessTripError}
						/>

						 <Autocomplete
                            id="location"
                            options={locations}
                            renderInput={(params) => <TextField {...params} label="Location" variant="outlined"/>}
                            getOptionLabel={(option) => `${option.street}, ${option.number}, ${option.city}`}
                            filterOptions={(x) => x}

                            onInputChange={handleInputChange}
                            onChange={(event, value) => {
                                if (value) {
                                    if (value.id !== undefined) {
										setCompanyEvent({...companyEvent, location_id: value.id});
                                    }
                                }
                            }}
                        />

						<Button type="submit">Add Event</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};