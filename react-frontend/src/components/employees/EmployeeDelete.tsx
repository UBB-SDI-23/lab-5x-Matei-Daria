import {Button, Card, CardActions, CardContent, Container, IconButton} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import {BACKEND_API_URL} from "../../constants";

export const EmployeeDelete = () => {
	const { employeeID } = useParams();
	const navigate = useNavigate();

	const handleDelete = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		await axios.delete(`${BACKEND_API_URL}/employees/${employeeID}`);
		navigate("/employees");
	};

	const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		navigate("/employees");
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/employees`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					Are you sure you want to delete this employee? This cannot be undone.
				</CardContent>
				<CardActions>
					<Button onClick={handleDelete}>Delete</Button>
					<Button onClick={handleCancel}>Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};