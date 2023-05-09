import {AppBar, Box, Button, IconButton, Toolbar, Typography} from "@mui/material";
import {Link, useLocation} from "react-router-dom";
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

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
					<Button
						variant={path.startsWith("/events") ? "outlined" : "text"}
						to="/events"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<CalendarMonthIcon />}>
						Events
					</Button>
					<Button
						variant={path.startsWith("/employees") ? "outlined" : "text"}
						to="/employees"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<BadgeIcon />}>
						Employees
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
};