import {Button, Card, CardActions, CardContent, IconButton, TextField} from "@mui/material";
import {Container} from "@mui/system";
import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {BACKEND_API_URL} from "../../constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import {Employee} from "../../models/Employee";

export const EmployeeUpdate = () => {
    const navigate = useNavigate();
    const {employeeID} = useParams();

    const [employeeDetails, setEmployeeDetails] = useState<Employee>();

    useEffect(() => {
        axios.get(`${BACKEND_API_URL}/employees/${employeeID}`)
            .then((response) => response.data)
            .then((data) => {
                setEmployeeDetails(data);
            })
    }, [employeeID]);

    const [employee, setEmployee] = useState<Employee>({
        name: "",
        job: "",
        hire_date: "",
        salary: 0,
        on_leave: false,
    });

    const putEmployee = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios.put(`${BACKEND_API_URL}/employees/${employeeID}`, employee);
            navigate("/employees");
        } catch (error) {
            console.log(error);
        }
    };

    const [onLeaveError, setOnLeaveError] = useState('');

    function handleOnLeaveChange(event: any) {
        const input = event.target.value;
        const regex = /^(true|false)$/;
        if (regex.test(input)) {
            setOnLeaveError('');
            setEmployee({...employee, on_leave: input == "true"});
        } else {
            setOnLeaveError("On leave must be either 'true' or 'false'.");
        }
    }

    const [salaryError, setSalaryError] = useState('');

    function handleSalaryChange(event: any) {
        const input = event.target.value;
        const regex = /^\d{4}$/;
        if (regex.test(input)) {
            setSalaryError('');
            setEmployee({...employee, salary: Number(input)});
        } else {
            setSalaryError("Salary must be between 1000 and 10000!");
        }
    }

    return (
        <Container>
            <IconButton component={Link} sx={{mr: 3}} to={`/employees`}>
                <ArrowBackIcon/>
            </IconButton>{" "}
            <h1>Employee Edit</h1>
            <Container sx={{display: "flex"}}>
                <Card>
                    <CardContent>
                        <h3>This is the employee that will be edited:</h3>
                        <p>Name: {employeeDetails?.name}</p>
                        <p>Job: {employeeDetails?.job}</p>
                        <p>Hire date: {employeeDetails?.hire_date}</p>
                        <p>Salary: {employeeDetails?.salary}</p>
                        <p>On leave: {employeeDetails?.on_leave ? "true" : "false"}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <form>
                            <TextField
                                id="name"
                                label="Name"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={(event) => setEmployee({...employee, name: event.target.value})}
                            />
                            <TextField
                                id="job"
                                label="Job"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={(event) => setEmployee({...employee, job: event.target.value})}
                            />
                            <TextField
                                id="hire_date"
                                label="Hire date"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={(event) => setEmployee({...employee, hire_date: event.target.value})}
                            />
                            <TextField
                                id="salary"
                                label="Salary"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={handleSalaryChange}
                                error={!!salaryError}
                                helperText={salaryError}/>
                            <TextField
                                id="on_leave"
                                label="On leave"
                                variant="outlined"
                                fullWidth
                                sx={{mb: 2}}
                                onChange={handleOnLeaveChange}
                                error={!!onLeaveError}
                                helperText={onLeaveError}/>

                            <Button onClick={putEmployee} type="submit">Edit Employee</Button>
                        </form>
                    </CardContent>
                    <CardActions></CardActions>
                </Card>
            </Container>
        </Container>
    );
};