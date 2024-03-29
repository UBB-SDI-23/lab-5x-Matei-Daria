import {
    CircularProgress,
    Container,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from '@mui/icons-material/Search';
import {Location} from "../../models/Location";
import {BACKEND_API_URL, ITEMS_PER_PAGE} from "../../constants";
import axios from "axios";
import {LocationFilterByCity} from "./LocationFilterByCity";
import SortTwoToneIcon from '@mui/icons-material/SortTwoTone';

export const AllLocations = () => {
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState<Location[]>([]);
    const [cityToFilter, setCityToFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [numberOfItems, setNumberOfItems] = useState(ITEMS_PER_PAGE);
    const totalPages = Math.ceil(numberOfItems / ITEMS_PER_PAGE);

    const styles = {
        pagination: {
            color: "#571236",
            background: "white",
            border: "solid",
            borderColor: "#571236",
            margin: "15px",
            padding: "5px 15px 5px 15px",
            borderRadius: "12px"
        }
    }

    const sortLocations = (sortingAttr: string) => {
        const sorted = [...locations].sort((a: Location, b: Location) => {

            // @ts-ignore
            if (a[sortingAttr] < b[sortingAttr])
                return -1;
            return 1;

        })
        setLocations(sorted);
    }

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/locations?page=${currentPage}`)
            .then((response) => response.data)
            .then((data) => {
                setLocations(data.results);
                setNumberOfItems(data.count);
                console.log(data.results);
                setLoading(false);
            });
    }, []);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);

        setLoading(true);
        fetch(`${BACKEND_API_URL}/locations?page=${newPage}`)
            .then((response) => response.json())
            .then((data) => {
                setLocations(data.results);
                setLoading(false);
            });
    };

    const pageNumbers = [];
    for (
        let i = Math.max(1, currentPage - 5);
        i <= Math.min(totalPages, currentPage + 5);
        i++
    ) {
        pageNumbers.push(i);
    }


    return <Container>
        {!loading && locations.length > 0 &&
            <div style={{width: "1200px"}}>
                <span>Pages: </span>
                {currentPage > 1 && (
                    <button style={styles.pagination} onClick={() => handlePageChange(currentPage - 1)}>
                        Previous
                    </button>
                )}
                {pageNumbers[0] > 1 && (
                    <>
                        <button style={styles.pagination} onClick={() => handlePageChange(1)}>1
                        </button>
                        {pageNumbers[0] > 2 && <span style={styles.pagination}>...</span>}
                    </>
                )}
                {pageNumbers.map((pageNumber) => (
                    <button
                        style={{
                            borderColor: currentPage === pageNumber ? "white" : "#571236",
                            backgroundColor: currentPage === pageNumber ? "#571236" : "white",
                            color: currentPage === pageNumber ? "white" : "#571236",
                            pointerEvents: currentPage === pageNumber ? "none" : "auto",
                            border: "solid",
                            margin: "15px",
                            padding: "5px 15px 5px 15px",
                            borderRadius: "12px"
                        }}
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                ))}
                {pageNumbers[pageNumbers.length - 1] <= totalPages - 1 && (
                    <>
                        {pageNumbers[pageNumbers.length - 1] <= totalPages - 2 && (
                            <span>...</span>
                        )}
                        <button style={styles.pagination} onClick={() => handlePageChange(totalPages)}>
                            {totalPages}
                        </button>
                    </>
                )}
                {currentPage < totalPages && (
                    <button style={styles.pagination} onClick={() => handlePageChange(currentPage + 1)}>
                        Next
                    </button>
                )}
            </div>}

        <h1>All locations</h1>

        {loading && <CircularProgress/>}
        {!loading && locations.length === 0 && <p>No locations found</p>}
        {!loading && locations.length > 0 && <Container sx={{position: "absolute", left: 930, top: 140}}>
            <form onSubmit={LocationFilterByCity}>
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
                            <IconButton onClick={() => {
                                sortLocations("street");
                            }}>
                                <Tooltip title="Sort by street" arrow>
                                    <SortTwoToneIcon color="inherit"/>
                                </Tooltip>
                            </IconButton>
                        </TableCell>
                        <TableCell align="left">
                            Number
                            <IconButton onClick={() => {
                                sortLocations("number");
                            }}>
                                <Tooltip title="Sort by number" arrow>
                                    <SortTwoToneIcon color="inherit"/>
                                </Tooltip>
                            </IconButton>
                        </TableCell>
                        <TableCell align="left">
                            City
                            <IconButton onClick={() => {
                                sortLocations("city");
                            }}>
                                <Tooltip title="Sort by city" arrow>
                                    <SortTwoToneIcon color="inherit"/>
                                </Tooltip>
                            </IconButton>
                        </TableCell>
                        <TableCell align="left">
                            Building name
                            <IconButton onClick={() => {
                                sortLocations("building_name");
                            }}>
                                <Tooltip title="Sort by building name" arrow>
                                    <SortTwoToneIcon color="inherit"/>
                                </Tooltip>
                            </IconButton>
                        </TableCell>
                        <TableCell align="left">
                            Details
                            <IconButton onClick={() => {
                                sortLocations("details");
                            }}>
                                <Tooltip title="Sort by details" arrow>
                                    <SortTwoToneIcon color="inherit"/>
                                </Tooltip>
                            </IconButton>
                        </TableCell>
                        <TableCell align="left">Number of events</TableCell>
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
                        <TableCell align="left">{location.events == undefined ? 0 : location.events.length}</TableCell>
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