import React from "react";
import { Button, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NAV from "./navbar";

const AdminContent = ({ handleContent }) => {
  const navigate = useNavigate();

  function handleDownload() {
    handleContent(2);
  }

  function handleUpload() {
    handleContent(3);
  }

  function handleEvaluate() {
    navigate("/evaluate")
  }

  function handleMeet() {
    navigate("/meet")
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
            Admin Panel
          </h2>

          <div className="d-grid gap-3">
            <Button
              onClick={handleDownload}
              size="lg"
              style={{
                borderRadius: "10px",
                padding: "12px",
                fontWeight: "500",
              }}
            >
              📥 Student Homework
            </Button>

            <Button
              onClick={handleUpload}
              variant="success"
              size="lg"
              style={{
                borderRadius: "10px",
                padding: "12px",
                fontWeight: "500",
              }}
            >
              ⬆️ Upload Homework
            </Button>

            <Button
              onClick={handleEvaluate}
              variant="info"
              size="lg"
              style={{
                borderRadius: "10px",
                padding: "12px",
                fontWeight: "500",
                color: "white",
              }}
            >
              🧠 Check Homework(AI)
            </Button>

            <Button
              onClick={handleMeet}
              variant="dark"
              size="lg"
              style={{
                borderRadius: "10px",
                padding: "12px",
                fontWeight: "500",
                color: "white",
              }}
            >
              Ⓜ️ Take Class
            </Button>

          </div>
        </Card>
      </Container>
    </>
  );
};

export default AdminContent;
