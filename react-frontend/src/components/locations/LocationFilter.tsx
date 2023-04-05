import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Container,
    IconButton,
    Tooltip,
} from "@mui/material";
import React from "react";
import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import {Location} from "../../models/Location";
import {BACKEND_API_URL} from "../../constants";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const LocationFilter = () => {
    const {city} = useParams();
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/locations/in-city/${city}`)
            .then((response) => response.data)
            .then((data) => {
                setLocations(data);
                setLoading(false);
            });
    }, [city]);

    return (
        <Container>
            <IconButton component={Link} sx={{mr: 3}} to={`/locations`}>
                <ArrowBackIcon/>
            </IconButton>{" "}

            <h1>All locations in {city}</h1>

            {loading && <CircularProgress/>}

            {!loading && locations.length === 0 && <p>No locations found in {city}</p>}

            {!loading && locations.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">#</TableCell>
                                <TableCell align="left">Street</TableCell>
                                <TableCell align="left">Number</TableCell>
                                <TableCell align="left">City</TableCell>
                                <TableCell align="left">Building name</TableCell>
                                <TableCell align="left">Details</TableCell>
                                <TableCell align="center">Operations</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {locations.map((location, index) => (
                                <TableRow key={location.id}>
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="left">{location.street}</TableCell>
                                    <TableCell align="left">{location.number}</TableCell>
                                    <TableCell align="left">{location.city}</TableCell>
                                    <TableCell align="left">{location.building_name}</TableCell>
                                    <TableCell align="left">{location.details}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            component={Link}
                                            sx={{mr: 3}}
                                            to={`/locations/${location.id}/details`}>
                                            <Tooltip title="View location details" arrow>
                                                <ReadMoreIcon color="primary"/>
                                            </Tooltip>
                                        </IconButton>

                                        <IconButton component={Link} sx={{mr: 3}} to={`/locations/${location.id}/edit`}>
                                            <EditIcon/>
                                        </IconButton>

                                        <IconButton component={Link} sx={{mr: 3}}
                                                    to={`/locations/${location.id}/delete`}>
                                            <DeleteForeverIcon sx={{color: "red"}}/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}