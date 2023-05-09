import {Button, Card, CardActions, CardContent, Container, IconButton} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import {BACKEND_API_URL} from "../../constants";

export const EventDelete = () => {
	const { eventID } = useParams();
	const navigate = useNavigate();

	const handleDelete = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		await axios.delete(`${BACKEND_API_URL}/events/${eventID}`);
		navigate("/events");
	};

	const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		navigate("/events");
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/events`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					Are you sure you want to delete this event? This cannot be undone.
				</CardContent>
				<CardActions>
					<Button onClick={handleDelete}>Delete</Button>
					<Button onClick={handleCancel}>Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};