import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

import { useEffect } from "react";
import axios from "axios";
import { useAppState, setUser, removeUser } from "./store";
import Home from "./components/Home";
import Login from "./components/Login";

const Routers = () => {
	const { state, dispatch } = useAppState();

	useEffect(() => {
		axios
			.get(import.meta.env.VITE_SERVER_URL + "/auth/getuser", {
				withCredentials: true,
			})
			.then((res) => {
				if (res.data.user) {
					setUser(dispatch, res.data.user);
				} else {
					removeUser(dispatch);
				}
			})
			.catch((e) => {
				console.log(e);
			});
	}, []);

	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={state.user ? <Home /> : <Navigate to="/login" />}
				/>
				<Route
					path="/login"
					element={state.user ? <Navigate to="/" /> : <Login />}
				/>
			</Routes>
		</Router>
	);
};

export default Routers;
