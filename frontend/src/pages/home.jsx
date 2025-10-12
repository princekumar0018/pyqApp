import React from "react";
import NAV from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container } from "react-bootstrap";

const Home = () => {
  const navigate = useNavigate();

  function handlePreviousYearPaper() {
    navigate("/previous");
  }

  function handleUploadPaper() {
    navigate("/upload");
  }

  function handleMeet() {
    navigate("/meet");
  }

  return (
    <>
      <NAV />
      <Container fluid className="hero-wrap">
        <Card className="elevated-card p-4 text-center" style={{ width: "440px" }}>
          <h2 className="mb-2 fw-semibold brand-gradient">Welcome</h2>
          <p className="mb-4">Choose an option to continue</p>
          <div className="d-grid gap-3 home-actions">
            <Button onClick={handlePreviousYearPaper} size="lg" className="btn-primary-edu" style={{ borderRadius: "10px", padding: "12px" }}>
              📘 Download Homework
            </Button>
            <Button onClick={handleUploadPaper} size="lg" className="btn-success-edu" style={{ borderRadius: "10px", padding: "12px" }}>
              ⬆️ Upload Homework
            </Button>
            <Button onClick={handleMeet} size="lg" className="btn-accent-edu" style={{ borderRadius: "10px", padding: "12px" }}>
              Ⓜ️ Class Meet
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default Home;
