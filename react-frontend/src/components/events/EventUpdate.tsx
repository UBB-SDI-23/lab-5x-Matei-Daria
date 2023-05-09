import {Autocomplete, Button, Card, CardActions, CardContent, IconButton, TextField} from "@mui/material";
import {Container} from "@mui/system";
import React, {useCallback, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {BACKEND_API_URL} from "../../constants";
import {Event} from "../../models/Event"
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import {Location} from "../../models/Location";
import {debounce} from "lodash";


export const EventUpdate = () => {
    const navigate = useNavigate();
    const {eventID} = useParams();

    const [eventDetails, setEventDetails] = useState<Event>();
    const [locations, setLocations] = useState<Location[]>([]);
    const [eventDetailsLocation, seteventDetailsLocation] = useState<Location>();

    const temp_location: Location = {
        street: "",
        number: "",
        city: "",
        building_name: "",
        details: ""
    }

    const [companyEvent, setCompanyEvent] = useState({
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

    useEffect(() => {
        axios.get(`${BACKEND_API_URL}/events/${eventID}`)
            .then((response) => response.data)
            .then((data) => {
                console.log(data)
                setEventDetails(data);
                seteventDetailsLocation(data.location);
            })
    }, [eventID]);

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

    const putEvent = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            if (companyEvent.location_id == -1) { // @ts-ignore
                setCompanyEvent({...companyEvent, location_id: null});
            }
            // @ts-ignore
            setCompanyEvent({...companyEvent, avg_salary_participants: eventDetails?.avg_salary_participants});
            // @ts-ignore
            setCompanyEvent({...companyEvent, employees: eventDetails?.employees});
            console.log(companyEvent)
            await axios.put(`${BACKEND_API_URL}/events/${eventID}`, companyEvent).then((response) => (console.log(response.data)));
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
            setCompanyEvent({...companyEvent, importance: input});
        } else {
            setImportanceError("Importance must be either 1 (high), 2 (medium), or 3 (low).");
        }
    }

    const [businessTripError, setBusinessTripError] = useState('');

    function handleBusinessTripChange(event: any) {
        const input = event.target.value;
        const regex = /^(true|false)$/;
        if (regex.test(input)) {
            setBusinessTripError('');
            setCompanyEvent({...companyEvent, business_trip: input == 'true'});
        } else {
            setBusinessTripError("Business trip must be either 'true' or 'false'.");
        }
    }

    return (
        <Container>
            <IconButton component={Link} sx={{mr: 3}} to={`/events`}>
                <ArrowBackIcon/>
            </IconButton>{" "}
            <h1>Event Edit</h1>
            <Container sx={{display: "flex"}}>
                <Card>
                    <CardContent>
                        <h3>This is the event that will be edited:</h3>
                        <p>Name: {eventDetails?.name}</p>
                        <p>Details: {eventDetails?.details}</p>
                        <p>Date: {eventDetails?.date}</p>
                        <p>Importance: {eventDetails?.importance}</p>
                        <p>Business trip: {(eventDetails?.business_trip) ? "true" : "false"}</p>
                        <p>Location: {eventDetailsLocation==undefined ?  "" : (eventDetailsLocation?.street + ", " + eventDetailsLocation?.number + ", " + eventDetailsLocation?.city)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <form>
                            <TextField
                                id="name"
                                label="Name"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={(event) => setCompanyEvent({...companyEvent, name: event.target.value})}
                            />
                            <TextField
                                id="details"
                                label="Details"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={(event) => setCompanyEvent({...companyEvent, details: event.target.value})}
                            />
                            <TextField
                                id="date"
                                label="Date"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={(event) => setCompanyEvent({...companyEvent, date: event.target.value})}
                            />
                            <TextField
                                id="importance"
                                label="Importance"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={handleImportanceChange}
                                error={!!importanceError}
                                helperText={importanceError}/>
                            <TextField
                                id="business_trip"
                                label="Business trip"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
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
                                    // @ts-ignore
                                    setCompanyEvent({...companyEvent, location_id: value.id})
                                }}
                            />

                            <Button onClick={putEvent} type="submit">Edit Event</Button>
                        </form>
                    </CardContent>
                    <CardActions></CardActions>
                </Card>
            </Container>
        </Container>
    );
};