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
    <Navbar fixed="top" expand="lg" className="edu-navbar px-3">
      <Container fluid className="align-items-center">
        <Navbar.Brand className="fw-bold fs-4 brand-gradient me-auto">
          Virtual Classroom
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="topnav" />
        <Navbar.Collapse id="topnav" className="justify-content-end">
          <div className="d-flex gap-2">
            <Button onClick={handleAdminLogin} className="btn-outline-edu">
              Teacher Login
            </Button>
            <Button onClick={handleAdminRegister} className="btn-outline-edu">
              Teacher Register
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NAV;
