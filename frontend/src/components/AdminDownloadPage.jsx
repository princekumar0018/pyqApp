import React, { useState } from "react";
import axios from "axios";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import CardForDetails from "./cardForDeatils";
import Cookies from "js-cookie";

const AdminDownloadPage = () => {
  const [filename, setFilename] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = Cookies.get("token");

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // ✅ Validate and format filename
    const formattedFilename = filename.trim();
    if (!formattedFilename) {
      setError("Please enter a valid filename.");
      setLoading(false);
      return;
    }

    try {
      // ✅ Correct axios.post structure (only one config object)
      const response = await axios.post(
        `${BACKEND_URL}/admindownload/search-files`,
        { filename: formattedFilename },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // ✅ Moved here
        }
      );

      // ✅ Check if response contains data
      if (response && response.data) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        // ✅ Auto-download file
        const link = document.createElement("a");
        link.href = url;
        link.download = formattedFilename.endsWith(".pdf")
          ? formattedFilename
          : `${formattedFilename}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      } else {
        setError("PDF file not found on the server.");
      }
    } catch (error) {
      console.error("❌ Error occurred while downloading:", error);
      if (error.response && error.response.status === 404) {
        setError("File not found on the server.");
      } else if (error.response && error.response.status === 401) {
        setError("Unauthorized access. Please log in again.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-primary fw-semibold">Admin Download Page</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="filename" className="mb-3">
          <Form.Label>Enter filename:</Form.Label>
          <Form.Control
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Enter filename (e.g. RahulHomework_PK007.pdf)"
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Downloading...
            </>
          ) : (
            "Download"
          )}
        </Button>
      </Form>

      {error && (
        <Alert variant="danger" className="mt-3 text-center">
          {error}
        </Alert>
      )}

      <hr className="my-5" />

      <CardForDetails />
    </div>
  );
};

export default AdminDownloadPage;
