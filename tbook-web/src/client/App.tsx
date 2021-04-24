import * as React from 'react';
import { useState, useEffect } from 'react';
import {Navbar} from "./components/navbar/Navbar";

/* HOOK REACT EXAMPLE */
const App = (props: AppProps) => {
	const [greeting, setGreeting] = useState<string>('');

	useEffect(() => {
		async function getGreeting() {
			try {
				const res = await fetch('/api/hello');
				const greeting = await res.json();
				setGreeting(greeting);
			} catch (error) {
				console.log(error);
			}
		}
		getGreeting();
	}, []);

	return (
		<main className="container-fluid my-5">
			<h3>{greeting}</h3>
			<Navbar/>
		</main>
	);
};


interface AppProps {}

export default App;
