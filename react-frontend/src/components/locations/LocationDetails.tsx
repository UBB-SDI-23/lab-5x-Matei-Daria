import { Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Location } from "../../models/Location";
import axios from "axios";

export const LocationDetails = () => {
	const { locationID } = useParams();
	const [location, setLocation] = useState<Location>();

	useEffect(() => {
		axios.get(`${BACKEND_API_URL}/locations/${locationID}`)
			.then((response) => response.data)
			.then((data) => {setLocation(data);})
	},[locationID]);

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/locations`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<h1>Location Details</h1>
					<p>Street: {location?.street}</p>
					<p>Number: {location?.number}</p>
					<p>City: {location?.city}</p>
                    <p>Building name: {location?.building_name}</p>
					<p>Details: {location?.details}</p>
				</CardContent>
				<CardActions>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/locations/${locationID}/edit`}>
						<EditIcon />
					</IconButton>

					<IconButton component={Link} sx={{ mr: 3 }} to={`/locations/${locationID}/delete`}>
						<DeleteForeverIcon sx={{ color: "red" }} />
					</IconButton>
				</CardActions>
			</Card>
		</Container>
	);
};