import {Button, Card, CardActions, CardContent, IconButton} from "@mui/material";
import {Container} from "@mui/system";
import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {BACKEND_API_URL} from "../../constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Event} from "../../models/Event";
import {Location} from "../../models/Location"
import axios from "axios";

export const EventDetails = () => {
    const {eventID} = useParams();
    const [companyEvent, setCompanyEvent] = useState<Event>();
    const [location, setLocation] = useState<Location>();

    const styles = {
        location: {
            width: '500px',
            margin: '0px 10px 10px 20px',
            padding: '20px',
            border: 'dotted 0.2px grey'
        },
    }

    useEffect(() => {
        axios.get(`${BACKEND_API_URL}/events/${eventID}`)
            .then((response) => response.data)
            .then((data) => {
                setCompanyEvent(data);
                setLocation(data.location);
            })
    }, [eventID]);


    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{mr: 3}} to={`/events`}>
                        <ArrowBackIcon/>
                    </IconButton>{" "}
                    <h1>Event Details</h1>
                    <Button
                        variant="contained"
                        component={Link}
                        sx={{mr: 3, position: "absolute", top: 150, left: 800, background: "#571236"}}
                        to={`/events/${companyEvent?.id}/employees-assigned`}>
                        <p>View employees assigned to this event</p>
                    </Button>
                    <p>Name: {companyEvent?.name}</p>
                    <p>Details: {companyEvent?.details}</p>
                    <p>Date: {companyEvent?.date}</p>
                    <p>Importance: {companyEvent?.importance}</p>
                    <p>Business trip: {(companyEvent?.business_trip)? "true":"false"}</p>
                    <p>Location:</p>
                    <div style={styles.location}>
                        <p>Street: {location?.street}</p>
                        <p>Number: {location?.number}</p>
                        <p>City: {location?.city}</p>
                        <p>Building name: {location?.building_name}</p>
                        <p>Details: {location?.details}</p>
                    </div>
                </CardContent>
                <CardActions>
                    <IconButton component={Link} sx={{mr: 3}} to={`/events/${eventID}/edit`}>
                        <EditIcon/>
                    </IconButton>

                    <IconButton component={Link} sx={{mr: 3}} to={`/events/${eventID}/delete`}>
                        <DeleteForeverIcon sx={{color: "red"}}/>
                    </IconButton>
                </CardActions>
            </Card>
        </Container>
    );
};