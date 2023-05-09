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

export const EventsAssignedDetails = () => {
    const {employeeID, assignmentID} = useParams();
    const [eventAssignment, setEventAssignment] = useState<Assignment>();
    const [companyEvent, setCompanyEvent] = useState<Event>();
    const [employee, setEmployee] = useState<Employee>();
    

    const styles = {
        foreign: {
            width: '500px',
            margin: '0px 10px 10px 20px',
            padding: '20px',
            border: 'dotted 0.2px grey'
        },
    }

    useEffect(() => {
        axios.get(`${BACKEND_API_URL}/employees/${employeeID}/events-assigned/${assignmentID}`)
            .then((response) => response.data)
            .then((data) => {
                setEventAssignment(data);
                setCompanyEvent(data.event);
                setEmployee(data.employee);
            })
    }, [employeeID]);


    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{mr: 3}} to={`/employees/${employeeID}/events-assigned`}>
                        <ArrowBackIcon/>
                    </IconButton>{" "}
                    <h1>Employee Assignment Details</h1>
                    <p>Employee:</p>
                    <div style={styles.foreign}>
                        <p>Name: {employee?.name}</p>
                        <p>Job: {employee?.job}</p>
                        <p>Hire date: {employee?.hire_date}</p>
                        <p>Salary: {Number(employee?.salary)}</p>
                        <p>On leave: {employee?.salary ? "true" : "false"}</p>
                    </div>
                    <p>Event:</p>
                    <div style={styles.foreign}>
                        <p>Name: {companyEvent?.name}</p>
                        <p>Details: {companyEvent?.details}</p>
                        <p>Date: {companyEvent?.date}</p>
                        <p>Importance: {companyEvent?.importance}</p>
                        <p>Business trip: {companyEvent?.business_trip ? "true" : "false"}</p>
                    </div>
                    <p>Event summary: {eventAssignment?.event_summary}</p>
                    <p>Event outcome: {eventAssignment?.event_outcome}</p>
                </CardContent>
                <CardActions>
                    <IconButton component={Link} sx={{mr: 3}} to={`/employees/${employeeID}/events-assigned`}>
                        <EditIcon/>
                    </IconButton>

                    <IconButton component={Link} sx={{mr: 3}} to={`/employees/${employeeID}/events-assigned`}>
                        <DeleteForeverIcon sx={{color: "red"}}/>
                    </IconButton>
                </CardActions>
            </Card>
        </Container>
    );
};