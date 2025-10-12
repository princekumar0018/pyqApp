import React, { useEffect, useState } from "react";
import { Form, Button, Spinner, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";   // ✅ import
import "../App.css";
import toast from 'react-hot-toast';

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("dtu@dtu.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Auto-show a toast for judges/demos when opening this page
  useEffect(() => {
    toast.success("Demo credentials are pre-filled click Login to enter.");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(BACKEND_URL + "/user/login/", {
        email,
        password,
      });

      if (response.data.status === 200) {
        // ✅ Save token in cookies (expires in 7 days)
        if (response.data.token) {
          Cookies.set("token", response.data.token, { expires: 7, secure: true });
        }

        if (response.data.superAdmin) {
          navigate("/superadmin");
        } else {
          handleLogin();
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <Card className="elevated-card" style={{ width: "420px", padding: "24px" }}>
        <Card.Body>
          <h2 className="text-center mb-4 brand-gradient">Teacher Login</h2>
          {error && <p className="text-danger text-center">{error}</p>}
          <Form>
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

            <Button className="w-100 mt-4 btn-primary-edu" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Login"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
