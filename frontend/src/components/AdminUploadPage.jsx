import React, { useState } from "react";
import { Container, Form, Button, Spinner, Card } from "react-bootstrap";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";

const AdminUploadPage = () => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = Cookies.get("token"); // Assuming auth token is stored in cookies

  // Handlers
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleFilenameChange = (e) => setFilename(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !filename.trim()) {
      toast.error("⚠️ Please provide both filename and file before uploading.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", filename.trim().toUpperCase());

      const response = await axios.post(
        `${BACKEND_URL}/adminupload/upload-files`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("✅ File uploaded successfully!");
        setFilename("");
        setFile(null);
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      toast.error("❌ Error while uploading. Please try again.");
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
        className="shadow-lg"
        style={{
          maxWidth: "560px",
          padding: "28px",
          borderRadius: "14px",
          border: "1px solid #e0e0e0",
        }}
      >
        <h2 className="text-center mb-4 fw-semibold text-primary">
          📤 Admin Homework Upload
        </h2>

        <Form onSubmit={handleSubmit}>
          {/* Filename */}
          <Form.Group controlId="formFilename" className="mb-3">
            <Form.Label style={{ fontWeight: "500" }}>Filename</Form.Label>
            <Form.Control
              type="text"
              value={filename}
              onChange={handleFilenameChange}
              placeholder="Enter filename (e.g., SCIENCE_HOMEWORK)"
              required
              style={{
                borderRadius: "10px",
                padding: "12px",
                border: "1px solid #ced4da",
              }}
            />
          </Form.Group>

          {/* File Upload */}
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label style={{ fontWeight: "500" }}>Choose File</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              required
              style={{
                borderRadius: "10px",
                padding: "10px",
              }}
            />
          </Form.Group>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-100 btn-primary-edu"
            style={{
              borderRadius: "10px",
              padding: "12px",
              backgroundColor: "#007bff",
              border: "none",
              fontWeight: "500",
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
      </Card>
    </Container>
  );
};

export default AdminUploadPage;
