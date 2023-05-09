import {
    Button,
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
import {Link} from "react-router-dom";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import {Event} from "../../models/Event";
import {Location} from "../../models/Location"
import {BACKEND_API_URL, ITEMS_PER_PAGE} from "../../constants";
import axios from "axios";

export const AllEvents = () => {
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);

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
        axios.get(`${BACKEND_API_URL}/events?page=${currentPage}`)
            .then((response) => response.data)
            .then((data) => {
                setEvents(data.results);
                setNumberOfItems(data.count);
                setLoading(false);
            });
    }, []);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);

        setLoading(true);
        fetch(`${BACKEND_API_URL}/events?page=${newPage}`)
            .then((response) => response.json())
            .then((data) => {
                setEvents(data.results);
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
        {!loading && events.length > 0 &&
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

        <h1>All events</h1>

        {loading && <CircularProgress/>}
        {!loading && events.length === 0 && <p>No events found</p>}
        {!loading && <IconButton component={Link} sx={{mr: 3}} to={`/events/add`}>
            <Tooltip title="Add a new event" arrow>
                <AddIcon color="inherit"/>
            </Tooltip>
        </IconButton>}
        {!loading && <Button
            variant="contained"
            component={Link}
            sx={{mr: 3, position: "absolute", top: 170, left: 850, background: "#571236", fontSize: 10}}
            to={`/events/by-avg-salary-of-participants`}>
            <p>View <i>Event by average salary of participants</i> stat</p>
        </Button>}
        {!loading && events.length > 0 && <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">#</TableCell>
                        <TableCell align="left">
                            Name
                        </TableCell>
                        <TableCell align="left">
                            Details
                        </TableCell>
                        <TableCell align="left">
                            Date
                        </TableCell>
                        <TableCell align="left">
                            Importance
                        </TableCell>
                        <TableCell align="left">
                            Business trip
                        </TableCell>
                        <TableCell align="left">
                            Location
                        </TableCell>
                        <TableCell align="left">
                            Number of employees assigned
                        </TableCell>
                        <TableCell align="center">Operations</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((event, index) => <TableRow key={event.id}>
                        <TableCell component="th" scope="row">
                            {index + 1}
                        </TableCell>
                        <TableCell align="left">{event.name}</TableCell>
                        <TableCell align="left">{event.details}</TableCell>
                        <TableCell align="left">{event.date}</TableCell>
                        <TableCell align="left">{event.importance}</TableCell>
                        <TableCell align="left">{event.business_trip ? "true" : "false"}</TableCell>
                        <TableCell align="left">
                            {
                                event.location==undefined ? "" : (event.location.street + ", " + event.location.number + ", "  + event.location.city)
                            }
                        </TableCell>
                        <TableCell align="left">{event.employees == undefined ? 0 : event.employees.length}</TableCell>
                        <TableCell align="right">
                            <IconButton
                                component={Link}
                                sx={{mr: 3}}
                                to={`/events/${event.id}/details`}>
                                <Tooltip title="View event details" arrow>
                                    <ReadMoreIcon color="primary"/>
                                </Tooltip>
                            </IconButton>

                            <IconButton component={Link} sx={{mr: 3}} to={`/events/${event.id}/edit`}>
                                <EditIcon/>
                            </IconButton>

                            <IconButton component={Link} sx={{mr: 3}}
                                        to={`/events/${event.id}/delete`}>
                                <DeleteForeverIcon sx={{color: "red"}}/>
                            </IconButton>
                        </TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </TableContainer>}
    </Container>;
}