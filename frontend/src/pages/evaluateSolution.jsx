import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";

const EvaluateSolution = () => {
    const [modelFile, setModelFile] = useState(null);
    const [studentFile, setStudentFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [revealing, setRevealing] = useState(false); 
    const [displayedText, setDisplayedText] = useState(""); 
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const token = Cookies.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);
        setDisplayedText("");
        setRevealing(false);

        if (!modelFile || !studentFile) {
            setError("Please upload both files before submitting.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("model", modelFile);
            formData.append("student", studentFile);

            const response = await axios.post(
                `${BACKEND_URL}/tools/evaluate`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            let data = response.data;

            // ✅ Try to parse JSON safely (frontend parsing)
            let parsed;
            try {
                if (typeof data === "string") {
                    parsed = JSON.parse(data);
                } else if (typeof data.result === "string") {
                    parsed = JSON.parse(data.result);
                } else {
                    parsed = data.result || data;
                }
            } catch (err) {
                console.warn("⚠️ Frontend JSON parsing failed, showing raw:", err.message);
                parsed = { raw: data };
            }

            // ✅ Store parsed data and start slow reveal
            setResult(parsed);
            setRevealing(true);
        } catch (err) {
            console.error(err);
            setError("Error evaluating the solutions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(JSON.stringify(result, null, 2));
            alert("✅ JSON copied to clipboard!");
        }
    };

    // 🧠 Highlight any line with "marks"
    const highlightMarks = (jsonText) => {
        return jsonText
            .split("\n")
            .map((line) => {
                if (line.toLowerCase().includes("marks")) {
                    return `<span style="color:red; font-weight:bold;">${line}</span>`;
                }
                return line;
            })
            .join("\n");
    };

    // 💭 Slowly reveal JSON lines (frontend animation)
    useEffect(() => {
        if (revealing && result) {
            const jsonString = JSON.stringify(result, null, 2);
            const jsonLines = jsonString.split("\n");

            const revealLines = async () => {
                setDisplayedText("");
                for (let i = 0; i < jsonLines.length; i++) {
                    setDisplayedText((prev) => prev + jsonLines[i] + "\n");
                    await new Promise((resolve) => setTimeout(resolve, 40)); // typing delay
                }
                setRevealing(false);
            };

            revealLines();
        }
    }, [revealing, result]);

    return (
        <Container
            className="d-flex flex-column align-items-center"
            style={{ minHeight: "90vh", paddingTop: "40px", paddingBottom: "40px" }}
        >
            <Card
                style={{
                    width: "500px",
                    padding: "30px",
                    borderRadius: "15px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    border: "none",
                }}
            >
                <h3 className="text-center mb-4" style={{ color: "#0d6efd" }}>
                    🧠 Evaluate Paper
                </h3>

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="modelFile" className="mb-3">
                        <Form.Label>Model Solution (Reference)</Form.Label>
                        <Form.Control
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setModelFile(e.target.files[0])}
                        />
                    </Form.Group>

                    <Form.Group controlId="studentFile" className="mb-3">
                        <Form.Label>Student Solution (To Compare)</Form.Label>
                        <Form.Control
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setStudentFile(e.target.files[0])}
                        />
                    </Form.Group>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <div className="d-grid">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        animation="border"
                                        size="sm"
                                        className="me-2"
                                    />
                                    Evaluating...
                                </>
                            ) : (
                                "Submit for Evaluation"
                            )}
                        </Button>
                    </div>
                </Form>
            </Card>

            {(loading || result) && (
                <div
                    style={{
                        marginTop: "50px",
                        width: "95%",
                        maxWidth: "1100px",
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>🧩 Raw Response (JSON)</h5>
                        {result && (
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleCopy}
                                disabled={revealing}
                            >
                                Copy JSON
                            </Button>
                        )}
                    </div>

                    {loading && (
                        <div className="text-center p-4">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">
                                Analyzing responses... Please wait.
                            </p>
                        </div>
                    )}

                    {result && (
                        <pre
                            style={{
                                backgroundColor: "#f8f9fa",
                                padding: "25px",
                                borderRadius: "12px",
                                fontSize: "1rem",
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                maxHeight: "700px",
                                overflowY: "auto",
                                border: "1px solid #dee2e6",
                                transition: "all 0.3s ease-in-out",
                            }}
                            dangerouslySetInnerHTML={{
                                __html: highlightMarks(displayedText),
                            }}
                        />
                    )}
                </div>
            )}
        </Container>
    );
};

export default EvaluateSolution;
