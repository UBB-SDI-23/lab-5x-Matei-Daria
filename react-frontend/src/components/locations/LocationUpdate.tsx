import {Button, Card, CardActions, CardContent, IconButton, TextField} from "@mui/material";
import {Container} from "@mui/system";
import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {BACKEND_API_URL} from "../../constants";
import {Location} from "../../models/Location"
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

export const LocationUpdate = () => {
    const navigate = useNavigate();
    const {locationID} = useParams();

    const [locationDetails, setLocationDetails] = useState<Location>();

    useEffect(() => {
        axios.get(`${BACKEND_API_URL}/locations/${locationID}`)
            .then((response) => response.data)
            .then((data) => {
                setLocationDetails(data);
            })
    }, [locationID]);

    const [location, setLocation] = useState<Location>({
        street: "",
        number: "",
        city: "",
        building_name: "",
        details: "",
        events: []
    });

    const putLocation = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            setLocation({...location, events: locationDetails?.events});
            await axios.put(`${BACKEND_API_URL}/locations/${locationID}`, location);
            navigate("/locations");
        } catch (error) {
            console.log(error);
        }
    };

    const [numberError, setNumberError] = useState('');

    function handleNumberChange(event: any) {
        const input = event.target.value;
        const regex = /^[a-zA-Z0-9]+$/;
        if (regex.test(input)) {
            setNumberError('');
            setLocation({...location, number: input});
        } else {
            setNumberError("Address number cannot have spaces.");
        }
    }

    return (
        <Container>
            <IconButton component={Link} sx={{mr: 3}} to={`/locations`}>
                <ArrowBackIcon/>
            </IconButton>{" "}
            <h1>Location Edit</h1>
            <Container sx={{display: "flex"}}>
                <Card>
                    <CardContent>
                        <h3>This is the location that will be edited:</h3>
                        <p>Street: {locationDetails?.street}</p>
                        <p>Number: {locationDetails?.number}</p>
                        <p>City: {locationDetails?.city}</p>
                        <p>Building name: {locationDetails?.building_name}</p>
                        <p>Details: {locationDetails?.details}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <form>
                            <TextField
                                id="street"
                                label="Street"
                                variant="outlined"
                                defaultValue={locationDetails?.street}
                                fullWidth
                                sx={{mb: 2}}
                                onChange={(event) => setLocation({...location, street: event.target.value})}
                            />
                            <TextField
                                id="number"
                                label="Number"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={handleNumberChange}
                                error={!!numberError}
                                helperText={numberError}/>
                            <TextField
                                id="city"
                                label="City"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={(event) => setLocation({...location, city: event.target.value})}
                            />
                            <TextField
                                id="building_name"
                                label="Building Name"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={(event) => setLocation({...location, building_name: event.target.value})}
                            />
                            <TextField
                                id="details"
                                label="Details"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={(event) => setLocation({...location, details: event.target.value})}
                            />

                            <Button onClick={putLocation} type="submit">Edit Location</Button>
                        </form>
                    </CardContent>
                    <CardActions></CardActions>
                </Card>
            </Container>
        </Container>
    );
};