import {Button, Card, CardActions, CardContent, Container, IconButton} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import {BACKEND_API_URL} from "../../../constants";

export const EmployeesAssignedDelete = () => {
	const { eventID, assignmentID } = useParams();
	const navigate = useNavigate();

	const handleDelete = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		await axios.delete(`${BACKEND_API_URL}/events/${eventID}/employees-assigned/${assignmentID}`);
		navigate(`/events/${eventID}/employees-assigned`);
	};

	const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		navigate(`/events/${eventID}/employees-assigned`);
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/events/${eventID}/employees-assigned`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					Are you sure you want to delete this employee from this event? This cannot be undone.
				</CardContent>
				<CardActions>
					<Button onClick={handleDelete}>Delete</Button>
					<Button onClick={handleCancel}>Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};