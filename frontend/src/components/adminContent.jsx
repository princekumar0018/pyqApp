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
      <Container fluid className="hero-wrap">
        <Card className="elevated-card p-4 text-center" style={{ width: "520px" }}>
          <h2 className="mb-3 fw-semibold brand-gradient">Admin Panel</h2>

          <div className="admin-actions d-grid gap-3">
            <Button onClick={handleDownload} size="lg" className="btn-primary-edu" style={{ borderRadius: "10px", padding: "12px" }}>
              📥 Student Homework
            </Button>

            <Button onClick={handleUpload} size="lg" className="btn-success-edu" style={{ borderRadius: "10px", padding: "12px" }}>
              ⬆️ Upload Homework
            </Button>

            <Button onClick={handleEvaluate} size="lg" className="btn-accent-edu" style={{ borderRadius: "10px", padding: "12px" }}>
              🧠 Check Homework (AI)
            </Button>

            <Button onClick={handleMeet} size="lg" className="btn-dark-edu" style={{ borderRadius: "10px", padding: "12px" }}>
              Ⓜ️ Take Class
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default AdminContent;
