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
import AddIcon from "@mui/icons-material/Add";
import {Event} from "../../../models/Event";
import {BACKEND_API_URL, ITEMS_PER_PAGE} from "../../../constants";
import axios from "axios";
import {Assignment} from "../../../models/Assignment";

export const AllEmployeesAssigned = () => {
    const [loading, setLoading] = useState(false);
    const [employeesAssigned, setEmployeesAssigned] = useState<Assignment[]>([]);
    const {eventID} = useParams();
    const [companyEvent, setCompanyEvent] = useState<Event>();

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
        axios.get(`${BACKEND_API_URL}/events/${eventID}/employees-assigned?page=${currentPage}`)
            .then((response) => response.data)
            .then((data) => {
                setEmployeesAssigned(data.results);
                setNumberOfItems(data.count);
                setLoading(false);
            });
    }, [eventID]);

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/events/${eventID}`)
            .then((response) => response.data)
            .then((data) => {
                setCompanyEvent(data);
                setLoading(false);
            });
    }, []);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);

        setLoading(true);
        fetch(`${BACKEND_API_URL}/events/${eventID}/employees-assigned?page=${newPage}`)
            .then((response) => response.json())
            .then((data) => {
                setEmployeesAssigned(data.results);
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
        {!loading && employeesAssigned.length > 0 &&
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

        <h1>All employees assigned to event "{companyEvent?.name}"</h1>

        {loading && <CircularProgress/>}
        {!loading && employeesAssigned.length === 0 && <p>No employees assigned to this event</p>}
        {!loading && <IconButton component={Link} sx={{mr: 3}} to={`/events/${eventID}/employees-assigned/add`}>
            <Tooltip title="Add a new employee to this event" arrow>
                <AddIcon color="inherit"/>
            </Tooltip>
        </IconButton>}
        {!loading && employeesAssigned.length > 0 && <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">#</TableCell>
                        <TableCell align="left">
                            Employee
                        </TableCell>
                        <TableCell align="left">
                            Event summary
                        </TableCell>
                        <TableCell align="left">
                            Event outcome
                        </TableCell>
                        <TableCell align="center">Operations</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employeesAssigned.map((employeeAssigned, index) => <TableRow key={employeeAssigned.id}>
                        <TableCell component="th" scope="row">
                            {index + 1}
                        </TableCell>
                        <TableCell align="left">{employeeAssigned.employee.name}</TableCell>
                        <TableCell align="left">{employeeAssigned.event_summary}</TableCell>
                        <TableCell align="left">{employeeAssigned.event_outcome}</TableCell>
                        <TableCell align="right">
                            <IconButton
                                component={Link}
                                sx={{mr: 3}}
                                to={`/events/${eventID}/employees-assigned/${employeeAssigned.id}/details`}>
                                <Tooltip title="View employee assignment details" arrow>
                                    <ReadMoreIcon color="primary"/>
                                </Tooltip>
                            </IconButton>

                            <IconButton component={Link} sx={{mr: 3}}
                                        to={`/events/${eventID}/employees-assigned/${employeeAssigned.id}/edit`}>
                                <EditIcon/>
                            </IconButton>

                            <IconButton component={Link} sx={{mr: 3}}
                                        to={`/events/${eventID}/employees-assigned/${employeeAssigned.id}/delete`}>
                                <DeleteForeverIcon sx={{color: "red"}}/>
                            </IconButton>
                        </TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </TableContainer>}
    </Container>;
}