import { Button, Card, CardActions, CardContent, IconButton, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { Location } from "../../models/Location"
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

export const LocationAdd = () => {
	const navigate = useNavigate();

	const [location, setLocation] = useState<Location>({
		street: "",
        number: "",
        city: "",
        building_name: "",
        details: ""
    });

	const addLocation = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			await axios.post(`${BACKEND_API_URL}/locations`, location);
			navigate("/locations");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/locations`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<form onSubmit={addLocation}>
						<TextField
							id="street"
							label="Street"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setLocation({ ...location, street: event.target.value })}
						/>
						<TextField
							id="number"
							label="Number"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setLocation({ ...location, number: event.target.value })}
						/>
						<TextField
							id="city"
							label="City"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setLocation({ ...location, city: event.target.value })}
						/>
						<TextField
							id="building_name"
							label="Building_Name"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setLocation({ ...location, building_name: event.target.value })}
						/>
						<TextField
							id="details"
							label="Details"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setLocation({ ...location, details: event.target.value })}
						/>

						<Button type="submit">Add Location</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};