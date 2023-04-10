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
    Tooltip, TextField,
} from "@mui/material";
import React from "react";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from '@mui/icons-material/Search';
import {Location} from "../../models/Location";
import {BACKEND_API_URL} from "../../constants";
import axios from "axios";
import {LocationFilter} from "./LocationFilter";
import SortTwoToneIcon from '@mui/icons-material/SortTwoTone';

export const AllLocations = () => {
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState<Location[]>([]);
    const [cityToFilter, setCityToFilter] = useState("");
    const sortLocations = (sortingAttr: string) => {
        const sorted = [...locations].sort((a: Location, b: Location) => {

            if (sortingAttr == "street") {
                if (a.street < b.street)
                    return -1;
                return 1;
            }

            if (sortingAttr == "number") {
                if (a.number < b.number)
                    return -1;
                return 1;
            }

            if (sortingAttr == "city") {
                if (a.city < b.city)
                    return -1;
                return 1;
            }

            if (sortingAttr == "building_name") {
                if (a.building_name < b.building_name)
                    return -1;
                return 1;
            }

            if (sortingAttr == "details") {
                if (a.details < b.details)
                    return -1;
                return 1;
            }

            return 0;
        })
        setLocations(sorted);
    }

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/locations`)
            .then((response) => response.data)
            .then((data) => {
                setLocations(data);
                setLoading(false);
            });
    }, []);

    return <Container>
        <h1>All locations</h1>

        {loading && <CircularProgress/>}
        {!loading && locations.length === 0 && <p>No locations found</p>}
        {!loading && locations.length > 0 && <Container sx={{position: "absolute", left: 930, top: 100}}>
                <form onSubmit={LocationFilter}>
                    <TextField
                        id="filter"
                        label="Filter by city"
                        variant="outlined"
                        sx={{mb: 2}}
                        onChange={(event) => setCityToFilter(event.target.value)}
                    />
                    <IconButton component={Link} sx={{mr: 3}} to={`/locations/in-city/${cityToFilter}`}>
                        <Tooltip title="Filter by city" arrow>
                            <SearchIcon color="inherit"/>
                        </Tooltip>
                    </IconButton>
                </form>
            </Container>}
        {!loading && <IconButton component={Link} sx={{mr: 3}} to={`/locations/add`}>
                <Tooltip title="Add a new location" arrow>
                    <AddIcon color="inherit"/>
                </Tooltip>
            </IconButton>}
        {!loading && locations.length > 0 && <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">#</TableCell>
                            <TableCell align="left">
                                Street
                                <IconButton onClick={() => {sortLocations("street");}}>
                                    <Tooltip title="Sort by street" arrow>
                                        <SortTwoToneIcon color="inherit"/>
                                    </Tooltip>
                                </IconButton>
                            </TableCell>
                            <TableCell align="left">
                                Number
                                <IconButton onClick={() => {sortLocations("number");}}>
                                    <Tooltip title="Sort by number" arrow>
                                        <SortTwoToneIcon color="inherit"/>
                                    </Tooltip>
                                </IconButton>
                            </TableCell>
                            <TableCell align="left">
                                City
                                <IconButton onClick={() => {sortLocations("city");}}>
                                    <Tooltip title="Sort by city" arrow>
                                        <SortTwoToneIcon color="inherit"/>
                                    </Tooltip>
                                </IconButton>
                            </TableCell>
                            <TableCell align="left">
                                Building name
                                <IconButton onClick={() => {sortLocations("building_name");}}>
                                    <Tooltip title="Sort by building name" arrow>
                                        <SortTwoToneIcon color="inherit"/>
                                    </Tooltip>
                                </IconButton>
                            </TableCell>
                            <TableCell align="left">
                                Details
                                <IconButton onClick={() => {sortLocations("details");}}>
                                    <Tooltip title="Sort by details" arrow>
                                        <SortTwoToneIcon color="inherit"/>
                                    </Tooltip>
                                </IconButton>
                            </TableCell>
                            <TableCell align="center">Operations</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {locations.map((location, index) => <TableRow key={location.id}>
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
                            </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>}
    </Container>;
}