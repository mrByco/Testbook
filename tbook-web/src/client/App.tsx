import * as React from 'react';
import { useState, useEffect } from 'react';
import {Navbar} from "./components/navbar/Navbar";
import {DisplaySheet} from "./components/display-sheet/DisplaySheet";

import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#5e92f3',
			main: '#1565c0',
			dark: '#003c8f',
			contrastText: '#fff',
		},
		secondary: {
			light: '#ff5983',
			main: '#f50057',
			dark: '#bb002f',
			contrastText: '#000',
		},
	},
});

const App = (props: AppProps) => {
	const [navbarOptions, setNavbarOptions] = useState({});

	return (
		<main>
			<MuiThemeProvider theme={theme}>
				<Navbar {...navbarOptions}/>
				<DisplaySheet onSetNavbarOptions={setNavbarOptions}/>
			</MuiThemeProvider>
		</main>
	);
};


interface AppProps {}

export default App;
