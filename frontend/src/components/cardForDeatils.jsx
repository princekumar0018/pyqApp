import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { FaCopy, FaCheck } from "react-icons/fa"; // Import FaCopy and FaCheck icons

function CardForDetails() {
  const [details, setDetails] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);
  const [openCard, setOpenCard] = useState({}); // Track which card is open
  const [copiedFiles, setCopiedFiles] = useState({}); // Track which files have been copied

  // Function to fetch data
  async function fetchDetails() {
    try {
      const response = await axios.post(
        "https://pyqapp.onrender.com/adminverifydownload/"
      );
      console.log(response.data); // Log the response to verify structure

      // Extract the unverifiedFiles array from the response
      const unverifiedFiles = response.data.unverifiedFiles || [];
      setDetails(unverifiedFiles);
    } catch (e) {
      console.error("Error fetching data:", e);
      setError("Failed to fetch details");
    }
  }

  // Toggle visibility of card details
  const toggleCard = (id) => {
    setOpenCard((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Copy filename to clipboard
  const copyToClipboard = (filename) => {
    navigator.clipboard
      .writeText(filename)
      .then(() => {
        setCopiedFiles((prev) => ({
          ...prev,
          [filename]: true, // Mark this file as copied
        }));
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        alert("Failed to copy filename.");
      });
  };

  // Fetch details on component mount
  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div className="container mt-3">
      <h1>Unverified Files</h1>
      {error && <p className="text-danger">{error}</p>}
      <div className="row g-3">
        {details.map((file) => (
          <div className="col-md-4" key={file._id}>
            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title>
                    <Button
                      variant="link"
                      onClick={() => toggleCard(file._id)}
                      aria-controls={`collapse-${file._id}`}
                      aria-expanded={!!openCard[file._id]}
                      style={{ textDecoration: "none", fontSize: "1.2rem" }}
                    >
                      {file.filename || "Unknown"}
                    </Button>
                  </Card.Title>
                  <Button
                    variant="link"
                    onClick={() => copyToClipboard(file.filename)}
                    style={{
                      fontSize: "1.2rem",
                      padding: "0",
                      marginRight: "10px",
                    }}
                  >
                    {copiedFiles[file.filename] ? <FaCheck /> : <FaCopy />}
                  </Button>
                </div>
              </Card.Body>
              <Collapse in={!!openCard[file._id]}>
                <div id={`collapse-${file._id}`}>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item>
                      Uploaded By: {file.metadata.email || "Unknown"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Year: {file.metadata.year || "Unknown"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Subject Code: {file.metadata.subjectcode || "Unknown"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Branch: {file.metadata.branch || "Unknown"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Upload Date:{" "}
                      {new Date(file.uploadDate).toLocaleString() || "Unknown"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Verified: {file.metadata.verified ? "Yes" : "No"}
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              </Collapse>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardForDetails;

// import React, { useEffect } from 'react';
// import axios from 'axios';
// import Card from 'react-bootstrap/Card';
// import ListGroup from 'react-bootstrap/ListGroup';

// let filename, year, subjectCode, senderEmail, senderBranch, uploadDate;

// async function automatically() {
//     try {
//         // Sending a POST request
//         let response = await axios.post('https://pyqapp.onrender.com/adminverifydownload/');

//         // Accessing the data from the response
//         const data = response.data;

//         // Assigning values to variables
//         filename = data.filename;
//         year = data.metadata?.year || "Unknown"; // Use optional chaining for safety
//         subjectCode = data.metadata?.subjectCode || "Unknown";
//         senderEmail = data.sender?.email || "Unknown";
//         senderBranch = data.sender?.branch || "Unknown";
//         uploadDate = data.uploadDate || "Unknown";

//         console.log({ filename, year, subjectCode, senderEmail, senderBranch, uploadDate });
//     } catch (e) {
//         console.error('Error fetching data:', e);
//     }
// }

// function CardForDetails() {
//     // Use useEffect to call automatically when the component mounts
//     useEffect(() => {
//         automatically();
//     }, []); // Empty dependency array ensures it runs only on mount

//     return (
//         <Card style={{ width: '18rem' }}>
//             <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
//             <Card.Body>
//                 <Card.Title>File Name :{}</Card.Title>
//                 <Card.Text>
//                     Some quick example text to build on the card title and make up the
//                     bulk of the card's content.
//                 </Card.Text>
//             </Card.Body>
//             <ListGroup className="list-group-flush">
//                 <ListGroup.Item>Cras justo odio</ListGroup.Item>
//                 <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
//                 <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
//             </ListGroup>
//         </Card>
//     );
// }

// export default CardForDetails;
