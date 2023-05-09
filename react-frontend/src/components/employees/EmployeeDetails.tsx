import {Button, Card, CardActions, CardContent, IconButton} from "@mui/material";
import {Container} from "@mui/system";
import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {BACKEND_API_URL} from "../../constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import {Employee} from "../../models/Employee";

export const EmployeeDetails = () => {
    const {employeeID} = useParams();
    const [employee, setEmployee] = useState<Employee>();

    useEffect(() => {
        axios.get(`${BACKEND_API_URL}/employees/${employeeID}`)
            .then((response) => response.data)
            .then((data) => {
                setEmployee(data);
            })
    }, [employeeID]);

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{mr: 3}} to={`/employees`}>
                        <ArrowBackIcon/>
                    </IconButton>{" "}
                     <Button
                        variant="contained"
                        component={Link}
                        sx={{mr: 3, position: "absolute", top: 150, left: 800, background: "#571236"}}
                        to={`/employees/${employee?.id}/events-assigned`}>
                        <p>View events assigned to this employee</p>
                    </Button>
                    <h1>Employee Details</h1>
                    <p>Name: {employee?.name}</p>
                    <p>Job: {employee?.job}</p>
                    <p>Hire date: {employee?.hire_date}</p>
                    <p>Salary: {employee?.salary}</p>
                    <p>On leave: {String(employee?.on_leave)}</p>
                </CardContent>
                <CardActions>
                    <IconButton component={Link} sx={{mr: 3}} to={`/employees/${employeeID}/edit`}>
                        <EditIcon/>
                    </IconButton>

                    <IconButton component={Link} sx={{mr: 3}} to={`/employees/${employeeID}/delete`}>
                        <DeleteForeverIcon sx={{color: "red"}}/>
                    </IconButton>
                </CardActions>
            </Card>
        </Container>
    );
};