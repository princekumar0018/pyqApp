import React, { useState } from "react";
import { Container, Form, Button, Spinner, Alert, Card } from "react-bootstrap";
import axios from "axios";

const AdminUploadPage = () => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFilenameChange = (e) => {
    setFilename(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", filename.toUpperCase());
      const response = await axios.post(
        "https://pyqapp.onrender.com/adminupload/upload-files",
        formData
      );
      console.log(response);
      setSubmitSuccess(true);
    } catch (err) {
      console.log(err);
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
            disabled={!file || !filename || loading}
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
