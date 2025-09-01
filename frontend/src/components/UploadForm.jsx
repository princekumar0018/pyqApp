import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UploadForm() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        year: '',
        branch: '',
        subjectCode: '',
    });
    const [loading, setLoading] = useState(false);

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
            formDataWithFile.append('email', formData.email);
            formDataWithFile.append('year', formData.year);
            formDataWithFile.append('branch', formData.branch);
            formDataWithFile.append('subjectcode', formData.subjectCode);
            formDataWithFile.append('file', file);

            const response = await axios.post(
                "http://localhost:5000/student/upload-files",
                formDataWithFile
            );
            console.log(response.data.message);
            if (response.data.status === 1) {
                alert("File uploaded successfully");
                navigate('/');
            } else {
                alert("Try again after some time");
                window.location.reload(true);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert("Please provide necessary details");
            window.location.reload(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center "
        >
            <Card style={{ width: '450px', padding: '30px' }}>
                <Card.Body>
                    {/* <h2 className="text-center mb-4">Upload File</h2> */}
                    <Form>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Please enter college email address"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupYear">
                            <Form.Label>Select Year</Form.Label>
                            <Form.Select
                                name="year"
                                aria-label="Select Year"
                                value={formData.year}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Year</option>
                                <option value="1">1st</option>
                                <option value="2">2nd</option>
                                <option value="3">3rd</option>
                                <option value="4">4th</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupBranch">
                            <Form.Label>Branch</Form.Label>
                            <Form.Control
                                type="text"
                                name="branch"
                                placeholder="Branch"
                                value={formData.branch}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupCode">
                            <Form.Label>Subject Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="subjectCode"
                                placeholder="Optional"
                                value={formData.subjectCode}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupFile">
                            <Form.Label>Select File</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                required
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={handleUpload}
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default UploadForm;
