import * as React from 'react';
import { useState, useEffect } from 'react';
import {Navbar} from "./components/navbar/Navbar";
import {DisplaySheet} from "./components/display-sheet/DisplaySheet";

/* HOOK REACT EXAMPLE */
const App = (props: AppProps) => {
	return (
		<main>
			<Navbar/>
			<DisplaySheet/>
		</main>
	);
};


interface AppProps {}

export default App;
