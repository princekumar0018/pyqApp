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

  return (
    <>
      <NAV />
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "90vh" }}
      >
        <Card
          style={{
            width: "420px",
            padding: "30px",
            borderRadius: "15px",
            border: "none",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <h2 className="mb-4" style={{ fontWeight: "600", color: "#0d6efd" }}>
            Welcome
          </h2>
          <p className="mb-4 text-muted">Choose an option to continue</p>
          <div className="d-grid gap-3">
            <Button
              onClick={handlePreviousYearPaper}
              size="lg"
              style={{
                borderRadius: "10px",
                padding: "12px",
                fontWeight: "500",
              }}
            >
              📘 Previous Year Paper
            </Button>
            <Button
              onClick={handleUploadPaper}
              variant="success"
              size="lg"
              style={{
                borderRadius: "10px",
                padding: "12px",
                fontWeight: "500",
              }}
            >
              ⬆️ Upload New Paper
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default Home;
