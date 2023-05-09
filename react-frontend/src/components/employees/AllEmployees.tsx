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
import {Employee} from "../../models/Employee";
import {BACKEND_API_URL, ITEMS_PER_PAGE} from "../../constants";
import axios from "axios";
import {EmployeeFilterBySalary} from "./EmployeeFilterBySalary";

export const AllEmployees = () => {
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [salaryToFilter, setSalaryToFilter] = useState(0);
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
        axios.get(`${BACKEND_API_URL}/employees?page=${currentPage}`)
            .then((response) => response.data)
            .then((data) => {
                setEmployees(data.results);
                setNumberOfItems(data.count);
                setLoading(false);
            });
    }, []);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);

        setLoading(true);
        fetch(`${BACKEND_API_URL}/employees?page=${newPage}`)
            .then((response) => response.json())
            .then((data) => {
                setEmployees(data.results);
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
        {!loading && employees.length > 0 &&
            <div style={{width: "1200px"}}>
                <span>Pages: </span>
                {currentPage > 1 && (
                    <button style={styles.pagination} onClick={() => handlePageChange(currentPage - 1)}>
                        Previous
                    </button>
                )}
                {pageNumbers[0] > 1 && (
                    <>
                        <button style={styles.pagination} onClick={() => handlePageChange(1)}>1</button>
                        {pageNumbers[0] > 2 && <span style={{margin: "3px"}}>...</span>}
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

        <h1>All employees</h1>

        {loading && <CircularProgress/>}
        {!loading && employees.length === 0 && <p>No employees found</p>}
        {!loading && <IconButton component={Link} sx={{mr: 3}} to={`/employees/add`}>
            <Tooltip title="Add a new employee" arrow>
                <AddIcon color="inherit"/>
            </Tooltip>
        </IconButton>}
        {!loading && <Button
            variant="contained"
            component={Link}
            sx={{mr: 3, position: "absolute", top: 165, left: 500, background: "#571236", fontSize: 10}}
            to={`/employees/by-avg-event-outcome`}>
            <p>View <i>Employees by average event outcome</i> stat</p>
        </Button>}
        {!loading && employees.length > 0 && <Container sx={{position: "absolute", left: 830, top: 160}}>
            <form onSubmit={EmployeeFilterBySalary}>
                <TextField
                    id="filter"
                    label="Filter by salary bigger than..."
                    variant="outlined"
                    sx={{mb: 2, width: 300}}
                    onChange={(event) => setSalaryToFilter(Number(event.target.value))}
                />
                <IconButton component={Link} sx={{mr: 3}} to={`/employees/salary-bigger-than/${salaryToFilter}`}>
                    <Tooltip title="Filter by salary" arrow>
                        <SearchIcon color="inherit"/>
                    </Tooltip>
                </IconButton>
            </form>
        </Container>}
        {!loading && employees.length > 0 && <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">#</TableCell>
                        <TableCell align="left">
                            Name
                        </TableCell>
                        <TableCell align="left">
                            Job
                        </TableCell>
                        <TableCell align="left">
                            Hire date
                        </TableCell>
                        <TableCell align="left">
                            Salary
                        </TableCell>
                        <TableCell align="left">
                            On leave
                        </TableCell>
                        <TableCell align="left">
                            Number of events assigned
                        </TableCell>
                        <TableCell align="center">Operations</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.map((employee, index) => <TableRow key={employee.id}>
                        <TableCell component="th" scope="row">
                            {index + 1}
                        </TableCell>
                        <TableCell align="left">{employee.name}</TableCell>
                        <TableCell align="left">{employee.job}</TableCell>
                        <TableCell align="left">{employee.hire_date}</TableCell>
                        <TableCell align="left">{employee.salary}</TableCell>
                        <TableCell align="left">{String(employee.on_leave)}</TableCell>
                        <TableCell align="left">{employee.events == undefined ? 0 : employee.events.length}</TableCell>
                        <TableCell align="right">
                            <IconButton
                                component={Link}
                                sx={{mr: 3}}
                                to={`/employees/${employee.id}/details`}>
                                <Tooltip title="View employee details" arrow>
                                    <ReadMoreIcon color="primary"/>
                                </Tooltip>
                            </IconButton>

                            <IconButton component={Link} sx={{mr: 3}} to={`/employees/${employee.id}/edit`}>
                                <EditIcon/>
                            </IconButton>

                            <IconButton component={Link} sx={{mr: 3}}
                                        to={`/employees/${employee.id}/delete`}>
                                <DeleteForeverIcon sx={{color: "red"}}/>
                            </IconButton>
                        </TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </TableContainer>}
    </Container>;
}