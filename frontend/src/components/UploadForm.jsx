import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
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
        setError("⚠️ Could not load Teachers. Please try again later.");
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
  toast.success("✅ File uploaded successfully");
        navigate("/");
      } else {
  toast.error("⚠️ Try again after some time");
        window.location.reload(true);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
  toast.error("❌ Please provide necessary details");
      window.location.reload(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Card className="elevated-card" style={{ width: "520px", padding: "28px" }}>
        <Card.Body>
          <h2 className="text-center mb-4 fw-semibold brand-gradient">Homework Upload</h2>
          <Form onSubmit={handleUpload}>
            <Form.Group className="mb-3" controlId="formGroupCollege">
              <Form.Label style={{ fontWeight: "500" }}>Select Teacher</Form.Label>
              <Form.Select
                name="college"
                value={formData.college}
                onChange={handleInputChange}
                required
                style={{ borderRadius: "10px", padding: "12px" }}
              >
                <option value="">-- Select Teacher --</option>
                {colleges.map((clg, index) => (
                  <option key={index} value={clg}>
                    {clg}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="formGroupYear">
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
            </Form.Group> */}


            <Form.Group className="mb-3" controlId="formGroupCode">
              <Form.Label style={{ fontWeight: "500" }}>
                Homework Code
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

            {/* ✅ Homework Type Dropdown */}
            {/* <Form.Group className="mb-3" controlId="formGroupExamType">
              <Form.Label style={{ fontWeight: "500" }}>Homework Type</Form.Label>
              <Form.Select
                name="examType"
                value={formData.examType}
                onChange={handleInputChange}
                required
                style={{ borderRadius: "10px", padding: "12px" }}
              >
                <option value="">Select Homework Type</option>
                <option value="2">Mid Semester</option>
                <option value="1">End Semester</option>
              </Form.Select>
            </Form.Group> */}

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
              className="btn-primary-edu"
              type="submit"
              disabled={loading}
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
