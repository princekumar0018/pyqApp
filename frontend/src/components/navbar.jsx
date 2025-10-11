import React from "react";
import { Navbar, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const NAV = () => {
  const navigate = useNavigate();

  function handleAdminLogin() {
    navigate("/admin/login");
  }

  function handleAdminRegister() {
    navigate("/admin/register");
  }

  return (
    <Navbar fixed="top" bg="dark" expand="lg" className="shadow px-3">
      <Container className="d-flex justify-content-between align-items-center">
        {/* Left Spacer (keeps brand centered) */}
        <div style={{ width: "120px" }}></div>

        <Navbar.Brand
          className="text-white fw-bold fs-4 text-center mx-auto"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Virtual Classroom
        </Navbar.Brand>

        {/* Right Buttons */}
        <div className="d-flex">
          <Button
            onClick={handleAdminLogin}
            variant="outline-light"
            className="me-2"
            style={{
              border: "2px solid white",
              transition: "all 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => (
              (e.target.style.backgroundColor = "white"),
              (e.target.style.color = "black")
            )}
            onMouseLeave={(e) => (
              (e.target.style.backgroundColor = "transparent"),
              (e.target.style.color = "white")
            )}
          >
            Teacher Login
          </Button>

          <Button
            onClick={handleAdminRegister}
            variant="outline-light"
            style={{
              border: "2px solid white",
              transition: "all 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => (
              (e.target.style.backgroundColor = "white"),
              (e.target.style.color = "black")
            )}
            onMouseLeave={(e) => (
              (e.target.style.backgroundColor = "transparent"),
              (e.target.style.color = "white")
            )}
          >
            Teacher Register
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default NAV;
