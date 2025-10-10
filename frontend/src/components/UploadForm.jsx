import React, { useState, useEffect } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadForm() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    year: "",
    subjectCode: "",
    college: "",
    examType: "", // ✅ Added new field
  });
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // fetch colleges from API
  useEffect(() => {
    async function fetchColleges() {
      try {
        const res = await axios.get(BACKEND_URL + "/tools/colleges");

        if (Array.isArray(res.data.value) && res.data.value[0]?.name) {
          setColleges(res.data.value.map((c) => c.name));
        } else if (Array.isArray(res.data)) {
          setColleges(res.data);
        } else {
          setColleges([]);
        }
      } catch (err) {
        console.error("Error fetching colleges:", err);
        setError("⚠️ Could not load colleges. Please try again later.");
      }
    }
    fetchColleges();
  }, [BACKEND_URL]);

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
      formDataWithFile.append("year", formData.year);
      formDataWithFile.append("subjectcode", formData.subjectCode);
      formDataWithFile.append("college", formData.college);
      formDataWithFile.append("examType", formData.examType); // ✅ Added exam type
      formDataWithFile.append("file", file);

      const response = await axios.post(
        BACKEND_URL + "/student/upload-files",
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
            {/* College Dropdown */}
            <Form.Group className="mb-3" controlId="formGroupCollege">
              <Form.Label style={{ fontWeight: "500" }}>Select College</Form.Label>
              <Form.Select
                name="college"
                value={formData.college}
                onChange={handleInputChange}
                required
                style={{ borderRadius: "10px", padding: "12px" }}
              >
                <option value="">-- Select College --</option>
                {colleges.map((clg, index) => (
                  <option key={index} value={clg}>
                    {clg}
                  </option>
                ))}
              </Form.Select>
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
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </Form.Select>
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

            {/* ✅ Exam Type Dropdown */}
            <Form.Group className="mb-3" controlId="formGroupExamType">
              <Form.Label style={{ fontWeight: "500" }}>Exam Type</Form.Label>
              <Form.Select
                name="examType"
                value={formData.examType}
                onChange={handleInputChange}
                required
                style={{ borderRadius: "10px", padding: "12px" }}
              >
                <option value="">Select Exam Type</option>
                <option value="2">Mid Semester</option>
                <option value="1">End Semester</option>
              </Form.Select>
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

            {error && <p className="text-danger mt-3 text-center">{error}</p>}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UploadForm;
