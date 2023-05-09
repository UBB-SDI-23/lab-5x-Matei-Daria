import {Button, Card, CardActions, CardContent, Container, IconButton} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import {BACKEND_API_URL} from "../../../constants";

export const EventsAssignedDelete = () => {
	const { employeeID, assignmentID } = useParams();
	const navigate = useNavigate();

	const handleDelete = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		await axios.delete(`${BACKEND_API_URL}/employees/${employeeID}/events-assigned/${assignmentID}`);
		navigate(`/employees/${employeeID}/events-assigned`);
	};

	const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		navigate(`/employees/${employeeID}/events-assigned`);
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/employees/${employeeID}/events-assigned`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					Are you sure you want to delete this event from this employee? This cannot be undone.
				</CardContent>
				<CardActions>
					<Button onClick={handleDelete}>Delete</Button>
					<Button onClick={handleCancel}>Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};