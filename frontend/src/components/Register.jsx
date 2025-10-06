import React, { useState } from "react";
import { Form, Button, Spinner, Card } from "react-bootstrap";
import axios from "axios";
import "../App.css";

const Register = ({ handleRegister }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [college, setCollege] = useState(""); // ✅ new state
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await axios.post(BACKEND_URL + "/user/register/", {
				email,
				password,
				college, // ✅ added
			});

			if (response.data.status === 200) {
				handleRegister();
			} else {
				setError(response.data.message);
			}
		} catch (error) {
			console.error("Register error:", error);
			setError("An error occurred during Register");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="d-flex align-items-center justify-content-center">
			<Card style={{ width: "400px", padding: "20px" }}>
				<Card.Body>
					<h2 className="text-center mb-4">Admin Register</h2>
					{error && <p className="text-danger text-center">{error}</p>}
					<Form onSubmit={handleSubmit}>

						{/* ✅ New College Field */}
						<Form.Group controlId="formCollege" className="mt-3">
							<Form.Label>College Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter College Name"
								value={college}
								onChange={(e) => setCollege(e.target.value)}
								required
							/>
						</Form.Group>

						<Form.Group controlId="formBasicEmail">
							<Form.Label>Email address</Form.Label>
							<Form.Control
								type="email"
								placeholder="Enter email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</Form.Group>

						<Form.Group controlId="formBasicPassword" className="mt-3">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</Form.Group>

						<Button
							variant="primary"
							className="w-100 mt-4"
							type="submit"
							disabled={loading}
						>
							{loading ? (
								<Spinner
									as="span"
									animation="border"
									size="sm"
									role="status"
									aria-hidden="true"
								/>
							) : (
								"Register"
							)}
						</Button>
					</Form>
				</Card.Body>
			</Card>
		</div>
	);
};

export default Register;
