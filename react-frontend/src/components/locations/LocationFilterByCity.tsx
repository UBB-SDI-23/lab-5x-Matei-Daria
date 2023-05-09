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
    Tooltip,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {Location} from "../../models/Location";
import {BACKEND_API_URL, ITEMS_PER_PAGE} from "../../constants";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const LocationFilterByCity = () => {
    const {city} = useParams();
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState<Location[]>([]);

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

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/locations/in-city/${city}?page=${currentPage}`)
            .then((response) => response.data)
            .then((data) => {
                setLocations(data.results);
                setNumberOfItems(data.count);
                setLoading(false);
            });
    }, [city]);

     const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);

        setLoading(true);
        fetch(`${BACKEND_API_URL}/locations/in-city/${city}?page=${newPage}`)
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

    return (
        <Container>
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