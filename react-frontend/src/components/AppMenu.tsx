import { Box, AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';

export const AppMenu = () => {
	const location = useLocation();
	const path = location.pathname;

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" sx={{ marginBottom: "20px", background: "#571236" }}>
				<Toolbar>
					<IconButton
						component={Link}
						to="/"
						size="large"
						edge="start"
						color="inherit"
						aria-label="event"
						sx={{ mr: 2 }}>
						<EventIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ mr: 5 }}>
						Company Events Manager
					</Typography>
					<Button
						variant={path.startsWith("/locations") ? "outlined" : "text"}
						to="/locations"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<PlaceIcon />}>
						Locations
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
};