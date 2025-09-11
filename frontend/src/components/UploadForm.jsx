import React, { useState } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadForm() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    year: "",
    branch: "",
    subjectCode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataWithFile = new FormData();
      formDataWithFile.append("email", formData.email);
      formDataWithFile.append("year", formData.year);
      formDataWithFile.append("branch", formData.branch);
      formDataWithFile.append("subjectcode", formData.subjectCode);
      formDataWithFile.append("file", file);

      const response = await axios.post(
        "https://pyqapp.onrender.com/student/upload-files",
        formDataWithFile
      );
      console.log(response.data.message);
      if (response.data.status === 1) {
        alert("✅ File uploaded successfully");
        navigate("/");
      } else {
        alert("⚠️ Try again after some time");
        window.location.reload(true);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("❌ Please provide necessary details");
      window.location.reload(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", background: "#f8f9fa" }}
    >
      <Card
        style={{
          width: "480px",
          padding: "30px",
          borderRadius: "15px",
          border: "none",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Card.Body>
          <h2
            className="text-center mb-4"
            style={{ fontWeight: "600", color: "#0d6efd" }}
          >
            Student File Upload
          </h2>
          <Form onSubmit={handleUpload}>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label style={{ fontWeight: "500" }}>
                Email Address
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter college email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{ borderRadius: "10px", padding: "12px" }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGroupYear">
              <Form.Label style={{ fontWeight: "500" }}>Select Year</Form.Label>
              <Form.Select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                style={{ borderRadius: "10px", padding: "12px" }}
              >
                <option value="">Select Year</option>
                <option value="1">1st</option>
                <option value="2">2nd</option>
                <option value="3">3rd</option>
                <option value="4">4th</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGroupBranch">
              <Form.Label style={{ fontWeight: "500" }}>Branch</Form.Label>
              <Form.Control
                type="text"
                name="branch"
                placeholder="Branch"
                value={formData.branch}
                onChange={handleInputChange}
                required
                style={{ borderRadius: "10px", padding: "12px" }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGroupCode">
              <Form.Label style={{ fontWeight: "500" }}>
                Subject Code
              </Form.Label>
              <Form.Control
                type="text"
                name="subjectCode"
                placeholder="Optional"
                value={formData.subjectCode}
                onChange={handleInputChange}
                style={{ borderRadius: "10px", padding: "12px" }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGroupFile">
              <Form.Label style={{ fontWeight: "500" }}>Select File</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
                style={{ borderRadius: "10px", padding: "10px" }}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-100"
              style={{
                borderRadius: "10px",
                padding: "12px",
                fontWeight: "500",
                fontSize: "16px",
              }}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UploadForm;
