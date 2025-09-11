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
  const [loading, setLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const pdfRef = useRef(null);

  // scroll into view when PDF loads
  useEffect(() => {
    if (pdfFile && pdfRef.current) {
      pdfRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [pdfFile]);

  async function handleDownload(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const filename = subjectCode.trim().toUpperCase();
      const response = await axios.post(
        "https://pyqapp.onrender.com/search/search-files",
        { filename },
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
      const filename = subjectCode.trim().toUpperCase();
      const response = await axios.post(
        "https://pyqapp.onrender.com/search/search-files",
        { filename },
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
      setError("⚠️ Server error, please try again later.");
    } finally {
      setViewLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "50px",
      }}
    >
      <div className="d-flex justify-content-center">
        <Card
          className="p-4"
          style={{
            maxWidth: "600px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            background: "rgba(255,255,255,0.95)",
          }}
        >
          <h1 className="mb-4 text-center">📘 Previous Year Paper</h1>
          <Form>
            <Form.Group controlId="subjectCode">
              <Form.Label>Subject Code /Name of file</Form.Label>
              <Form.Control
                type="text"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="Enter Subject Code"
                required
              />
            </Form.Group>

            <Row className="mt-4">
              <Col>
                <Button
                  variant="primary"
                  onClick={handleView}
                  className="w-100"
                  disabled={loading || viewLoading}
                >
                  {viewLoading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    "View"
                  )}
                </Button>
              </Col>
              <Col>
                <Button
                  variant="success"
                  onClick={handleDownload}
                  className="w-100"
                  disabled={loading || viewLoading}
                >
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
