import React, { useState } from 'react';
import { Container, Form, Button, Spinner, Alert, Card } from 'react-bootstrap'; // Added Card for the box
import axios from 'axios';

const AdminUploadPage = () => {
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState('');
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
            formData.append('file', file);
            formData.append('filename', filename.toUpperCase());
            const response = await axios.post('http://localhost:5000/adminupload/upload-files', formData);
            console.log(response);
            setSubmitSuccess(true);
        } catch (err) {
            console.log(err);
            setSubmitError('An error occurred while uploading the file.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ maxWidth: '500px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <h1 className="text-center mb-4">Admin Upload</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formFilename" className="mb-2">
                        <Form.Label>Filename:</Form.Label>
                        <Form.Control type="text" value={filename} onChange={handleFilenameChange} />
                    </Form.Group>

                    <Form.Group controlId="formFile" className="mb-2">
                        <Form.Label>Choose File:</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100" disabled={!file || !filename || loading}>
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" /> Uploading...
                            </>
                        ) : (
                            'Upload'
                        )}
                    </Button>
                </Form>
                {submitSuccess && <Alert variant="success" className="mt-3">File uploaded successfully!</Alert>}
                {submitError && <Alert variant="danger" className="mt-3">{submitError}</Alert>}
            </Card>
        </Container>
    );
};

export default AdminUploadPage;