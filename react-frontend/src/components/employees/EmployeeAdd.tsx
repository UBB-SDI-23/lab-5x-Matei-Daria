import {Button, Card, CardActions, CardContent, IconButton, TextField} from "@mui/material";
import {Container} from "@mui/system";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {BACKEND_API_URL} from "../../constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import {Employee} from "../../models/Employee";

export const EmployeeAdd = () => {
    const navigate = useNavigate();

    const [employee, setEmployee] = useState<Employee>({
        name: "",
        job: "",
        hire_date: "",
        salary: 0,
        on_leave: false,
    });

    const addEmployee = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios.post(`${BACKEND_API_URL}/employees`, employee);
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
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{mr: 3}} to={`/employees`}>
                        <ArrowBackIcon/>
                    </IconButton>{" "}
                    <form onSubmit={addEmployee}>
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
                            helperText={onLeaveError}
                        />

                        <Button type="submit">Add Employee</Button>
                    </form>
                </CardContent>
                <CardActions></CardActions>
            </Card>
        </Container>
    );
};