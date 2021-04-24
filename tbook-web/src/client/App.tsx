import * as React from 'react';
import { useState, useEffect } from 'react';
import {Navbar} from "./components/navbar/Navbar";

/* HOOK REACT EXAMPLE */
const App = (props: AppProps) => {
	const [greeting, setGreeting] = useState<string>('');

	useEffect(() => {
		async function getGreeting() {
			try {
				const res = await fetch('/api/hello/ds');
				const greeting = await res.json();
				setGreeting(greeting);
			} catch (error) {
				console.log(error);
			}
		}
		getGreeting();
	}, []);

	return (
		<main>
			<Navbar/>
			<h3>{greeting}</h3>
		</main>
	);
};


interface AppProps {}

export default App;
