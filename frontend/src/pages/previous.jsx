import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import { pdfjs } from "react-pdf";
import PdfView from "../components/PdfView";
import "../App.css"; // local CSS

// Configure worker for PDF rendering
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const Previous = () => {
  const [subjectCode, setSubjectCode] = useState("");
  const [college, setCollege] = useState("");
  const [colleges, setColleges] = useState([]); // list from API
  const [year, setYear] = useState("");
  const [examType, setExamType] = useState(""); // 1 = End Sem, 2 = Mid Sem
  const [loading, setLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const pdfRef = useRef(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // scroll into view when PDF loads
  useEffect(() => {
    if (pdfFile && pdfRef.current) {
      pdfRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [pdfFile]);

  // fetch colleges on mount
  useEffect(() => {
    async function fetchColleges() {
      try {
        const res = await axios.get(BACKEND_URL + "/tools/colleges");

        if (Array.isArray(res.data.value) && res.data.value[0]?.name) {
          setColleges(res.data.value.map((c) => c.name));
        } else {
          setColleges([]);
        }
      } catch (err) {
        console.error("Error fetching colleges:", err);
        setError("⚠️ Could not load Teachers List. Please try again later.");
      }
    }
    fetchColleges();
  }, [BACKEND_URL]);

  async function handleDownload(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const filename = subjectCode.trim().toUpperCase();
      const response = await axios.post(
        BACKEND_URL + "/search/search-files",
        { college, filename, year, examType: examType },
        { responseType: "blob" }
      );

      if (response.data.size > 0) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${filename}.pdf`);
        link.click();
        URL.revokeObjectURL(url);
      } else {
        setError("❌ No PDF found for this subject code.");
      }
    } catch (err) {
      console.error("Download error:", err);
      setError("❌ No PDF found for this subject code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleView(e) {
    e.preventDefault();
    setError("");
    setViewLoading(true);

    try {
      const filename = subjectCode.toUpperCase();
      const response = await axios.post(
        BACKEND_URL + "/search/search-files",
        { college, filename, year, examType },
        { responseType: "blob" }
      );

      if (response.data.size > 0) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        setPdfFile(blob);
      } else {
        setError("❌ No PDF found for this subject code.");
      }
    } catch (err) {
      console.error("View error:", err);
      setError("❌ No PDF found for this subject code.");
    } finally {
      setViewLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: "80px" }}>
      <div className="d-flex justify-content-center">
        <Card className="p-4 elevated-card" style={{ maxWidth: "640px" }}>
          <h1 className="mb-4 text-center brand-gradient">📘 Homework</h1>
          <Form>
            <Form.Group controlId="subjectCode" className="mb-3">
              <Form.Label>Homework Code</Form.Label>
              <Form.Control
                type="text"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="Enter Homework Code"
                required
              />
            </Form.Group>

            <Form.Group controlId="college" className="mb-3">
              <Form.Label>Select Teacher</Form.Label>
              <Form.Select
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                required
              >
                <option value="">-- Select Teacher --</option>
                {colleges.map((clg, index) => (
                  <option key={index} value={clg}>
                    {clg}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* <Row>
              <Col>
                <Form.Group controlId="year" className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Enter Year (e.g. 2023)"
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="examType" className="mb-3">
                  <Form.Label>Exam Type</Form.Label>
                  <Form.Select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    required
                  >
                    <option value="">-- Select Exam --</option>
                    <option value="1">End Sem</option>
                    <option value="2">Mid Sem</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row> */}

            <Row className="mt-4">
              <Col>
                <Button onClick={handleView} className="w-100 btn-primary-edu" disabled={loading || viewLoading}>
                  {viewLoading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    "View"
                  )}
                </Button>
              </Col>
              <Col>
                <Button onClick={handleDownload} className="w-100 btn-success-edu" disabled={loading || viewLoading}>
                  {loading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    "Download"
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
          {error && <p className="text-danger mt-3 text-center">{error}</p>}
        </Card>
      </div>

      {pdfFile && (
        <div ref={pdfRef} className="mt-5">
          <PdfView pdf={pdfFile} />
        </div>
      )}
    </div>
  );
};

export default Previous;
