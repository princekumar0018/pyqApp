import React from "react";
import { Navbar, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const NAV = () => {
  const navigate = useNavigate();

  function handleAdmin() {
    navigate("/admin");
  }

  return (
    <div>
      <Navbar fixed="top" bg="dark" expand="lg" className="shadow">
        <Navbar.Brand
          className="text-white w-100 text-center fw-bold fs-4"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Previous Year Paper App
        </Navbar.Brand>
        <Button
          onClick={handleAdmin}
          variant="outline-light"
          className="ms-auto me-3"
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
          Admin Login
        </Button>
      </Navbar>
    </div>
  );
};

export default NAV;
