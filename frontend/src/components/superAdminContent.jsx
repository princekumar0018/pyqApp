import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ make sure this is imported once in your app

const SuperAdminContent = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = Cookies.get("token");

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/superadmin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setColleges(res.data.allSubscribers);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerify = async (email) => {
    try {
      const res = await axios.put(
        `${BACKEND_URL}/superadmin/toggle`,
        { subscriberEmailId: email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) fetchColleges();
    } catch (error) {
      console.error("Error toggling verification:", error);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const verified = colleges.filter((c) => c.verified);
  const unverified = colleges.filter((c) => !c.verified);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border" variant="primary" size="sm" />
        <span className="ms-2 text-muted">Loading Colleges...</span>
      </div>
    );

  // 🔹 Compact Bootstrap Card
  const CollegeCard = ({ college, verified }) => (
    <Card
      style={{
        width: "13rem",
        minWidth: "13rem",
        marginRight: "10px",
        borderRadius: "10px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
      className="text-center"
    >
      <Card.Body style={{ padding: "20px" }}>
        <Card.Title style={{ fontSize: "1.5rem", fontWeight: "1000" }}>
          {college.name}
        </Card.Title>
        <Card.Subtitle
          className="mb-2 text-muted"
          style={{ fontSize: "1.3rem" }}
        >
          {college.email}
        </Card.Subtitle>
        <Card.Text style={{ fontSize: "1rem", color: "#6c757d" }}>
          Added on: {new Date(college.createdAt).toLocaleDateString("en-IN")}
        </Card.Text>
        <Button
          variant={verified ? "outline-danger" : "outline-success"}
          size="sm"
          onClick={() => toggleVerify(college.email)}
        >
          {verified ? "Unverify" : "Verify"}
        </Button>
      </Card.Body>
    </Card>
  );

  return (
    <div className="p-4">
      {/* ✅ Verified Colleges */}
      <section className="mb-4">
        <h2 className="fw-bold text-success mb-2"> Verified Colleges</h2>
        {verified.length === 0 ? (
          <p className="text-muted small">No verified colleges.</p>
        ) : (
          <div
            className="d-flex flex-row overflow-auto pb-2"
            style={{ gap: "10px" }}
          >
            {verified.map((college) => (
              <CollegeCard
                key={college._id}
                college={college}
                verified={true}
              />
            ))}
          </div>
        )}
      </section>

      {/* ❌ Unverified Colleges */}
      <section>
        <h2 className="fw-semibold text-danger mb-2"> Unverified Colleges</h2>
        {unverified.length === 0 ? (
          <p className="text-muted small">No unverified colleges.</p>
        ) : (
          <div
            className="d-flex flex-row overflow-auto pb-2"
            style={{ gap: "20px" }}
          >
            {unverified.map((college) => (
              <CollegeCard
                key={college._id}
                college={college}
                verified={false}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SuperAdminContent;
