import {Container, CssBaseline, Typography} from "@mui/material";
import React from "react";

export const AppHome = () => {
	return (
		<React.Fragment>
			<CssBaseline />

			<Container maxWidth="xl">
				<Typography variant="h1" component="h1" gutterBottom>
					Welcome to the Company Events Manager App!
				</Typography>
				<Typography variant="h4">
					Use the menu above to navigate.
				</Typography>
			</Container>
		</React.Fragment>
	);
};