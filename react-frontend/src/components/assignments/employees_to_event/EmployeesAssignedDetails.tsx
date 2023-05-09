import {Card, CardActions, CardContent, IconButton} from "@mui/material";
import {Container} from "@mui/system";
import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {BACKEND_API_URL} from "../../../constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Event} from "../../../models/Event";
import axios from "axios";
import {Employee} from "../../../models/Employee";
import {Assignment} from "../../../models/Assignment";

export const EmployeesAssignedDetails = () => {
    const {eventID, assignmentID} = useParams();
    const [employeeAssignment, setEmployeeAssignment] = useState<Assignment>();
    const [employee, setEmployee] = useState<Employee>();
    const [companyEvent, setCompanyEvent] = useState<Event>();

    const styles = {
        foreign: {
            width: '500px',
            margin: '0px 10px 10px 20px',
            padding: '20px',
            border: 'dotted 0.2px grey'
        },
    }

    useEffect(() => {
        axios.get(`${BACKEND_API_URL}/events/${eventID}/employees-assigned/${assignmentID}`)
            .then((response) => response.data)
            .then((data) => {
                setEmployeeAssignment(data);
                setEmployee(data.employee);
                setCompanyEvent(data.event);
            })
    }, [eventID]);


    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{mr: 3}} to={`/events/${eventID}/employees-assigned`}>
                        <ArrowBackIcon/>
                    </IconButton>{" "}
                    <h1>Event Assignment Details</h1>
                    <p>Event:</p>
                    <div style={styles.foreign}>
                        <p>Name: {companyEvent?.name}</p>
                        <p>Details: {companyEvent?.details}</p>
                        <p>Date: {companyEvent?.date}</p>
                        <p>Importance: {companyEvent?.importance}</p>
                        <p>Business trip: {companyEvent?.business_trip ? "true" : "false"}</p>
                    </div>
                    <p>Employee:</p>
                    <div style={styles.foreign}>
                        <p>Name: {employee?.name}</p>
                        <p>Job: {employee?.job}</p>
                        <p>Hire date: {employee?.hire_date}</p>
                        <p>Salary: {Number(employee?.salary)}</p>
                        <p>On leave: {employee?.salary ? "true" : "false"}</p>
                    </div>
                    <p>Event summary: {employeeAssignment?.event_summary}</p>
                    <p>Event outcome: {employeeAssignment?.event_outcome}</p>
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