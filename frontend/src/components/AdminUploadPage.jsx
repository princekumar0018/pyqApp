import React, { useState } from "react";
import { Container, Form, Button, Spinner, Alert, Card } from "react-bootstrap";
import Cookies from "js-cookie";
import axios from "axios";

const AdminUploadPage = () => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [year, setYear] = useState("");
  const [examType, setExamType] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = Cookies.get("token"); // ✅ assuming token is stored in localStorage

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleFilenameChange = (e) => setFilename(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);
  const handleExamTypeChange = (e) => setExamType(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", filename.toUpperCase());
      formData.append("year", year);
      formData.append("examType", examType);

      const response = await axios.post(
        `${BACKEND_URL}/adminupload/upload-files`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setSubmitSuccess(true);
        setFilename("");
        setYear("");
        setExamType("");
        setFile(null);
      }
    } catch (err) {
      console.error(err);
      setSubmitError("An error occurred while uploading the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card
        style={{
          maxWidth: "500px",
          padding: "30px",
          borderRadius: "15px",
          border: "none",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          className="text-center mb-4"
          style={{ fontWeight: "600", color: "#0d6efd" }}
        >
          Admin Upload
        </h2>

        <Form onSubmit={handleSubmit}>
          {/* Filename */}
          <Form.Group controlId="formFilename" className="mb-3">
            <Form.Label style={{ fontWeight: "500" }}>Filename</Form.Label>
            <Form.Control
              type="text"
              value={filename}
              onChange={handleFilenameChange}
              placeholder="Enter filename"
              style={{
                borderRadius: "10px",
                padding: "12px",
                border: "1px solid #ced4da",
              }}
            />
          </Form.Group>

          {/* Year (2022, 2023, 2024, 2025) */}
          <Form.Group controlId="formYear" className="mb-3">
            <Form.Label style={{ fontWeight: "500" }}>Year</Form.Label>
            <Form.Select
              value={year}
              onChange={handleYearChange}
              style={{
                borderRadius: "10px",
                padding: "12px",
                border: "1px solid #ced4da",
              }}
            >
              <option value="">Select year</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </Form.Select>
          </Form.Group>

          {/* Exam Type */}
          <Form.Group controlId="formExamType" className="mb-3">
            <Form.Label style={{ fontWeight: "500" }}>Exam Type</Form.Label>
            <Form.Select
              value={examType}
              onChange={handleExamTypeChange}
              style={{
                borderRadius: "10px",
                padding: "12px",
                border: "1px solid #ced4da",
              }}
            >
              <option value="">Select exam type</option>
              <option value="1">End Sem</option>
              <option value="2">Mid Sem</option>
            </Form.Select>
          </Form.Group>

          {/* File Upload */}
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label style={{ fontWeight: "500" }}>Choose File</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              style={{
                borderRadius: "10px",
                padding: "10px",
              }}
            />
          </Form.Group>

          {/* Submit Button */}
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            style={{
              borderRadius: "10px",
              padding: "12px",
              fontWeight: "500",
              fontSize: "16px",
            }}
            disabled={!file || !filename || !year || !examType || loading}
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

        {/* Success & Error Alerts */}
        {submitSuccess && (
          <Alert
            variant="success"
            className="mt-3 text-center"
            style={{ borderRadius: "10px" }}
          >
            ✅ File uploaded successfully!
          </Alert>
        )}
        {submitError && (
          <Alert
            variant="danger"
            className="mt-3 text-center"
            style={{ borderRadius: "10px" }}
          >
            ❌ {submitError}
          </Alert>
        )}
      </Card>
    </Container>
  );
};

export default AdminUploadPage;
