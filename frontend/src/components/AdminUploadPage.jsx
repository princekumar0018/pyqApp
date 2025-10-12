import React, { useState } from "react";
import { Container, Form, Button, Spinner, Card } from "react-bootstrap";
import toast from 'react-hot-toast';
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
        toast.success('✅ File uploaded successfully!');
        setFilename("");
        setYear("");
        setExamType("");
        setFile(null);
      }
    } catch (err) {
      console.error(err);
      const msg = "An error occurred while uploading the file.";
      setSubmitError(msg);
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="elevated-card" style={{ maxWidth: "560px", padding: "28px" }}>
        <h2 className="text-center mb-4 fw-semibold brand-gradient">Admin Upload</h2>

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
            <Form.Label style={{ fontWeight: "500" }}>Homework Type</Form.Label>
            <Form.Select
              value={examType}
              onChange={handleExamTypeChange}
              style={{
                borderRadius: "10px",
                padding: "12px",
                border: "1px solid #ced4da",
              }}
            >
              <option value="">Select homework type</option>
              <option value="1">Final</option>
              <option value="2">Mid</option>
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
          <Button type="submit" className="w-100 btn-primary-edu" style={{ borderRadius: "10px", padding: "12px" }} disabled={!file || !filename || !year || !examType || loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </Form>

        {/* Success & error are now shown via toasts */}
      </Card>
    </Container>
  );
};

export default AdminUploadPage;
