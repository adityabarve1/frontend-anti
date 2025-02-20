import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./TechnicalTests.css";

const TechnicalTests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const token = localStorage.getItem("token"); // Retrieve token from local storage

  useEffect(() => {
    const fetchTests = async () => {
      try {
        if (!token) {
          console.error("No token found. Redirecting to login...");
          navigate("/login");
          return;
        }

        const response = await API.get("/technicaltests", {
          headers: { Authorization: `Bearer ${token}` }, // Send token
        });

        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, [navigate, token]);

  return (
    <div className="tests-container">
      <h2>Available Technical Tests</h2>
      {tests.length === 0 ? (
        <p>No tests available</p>
      ) : (
        tests.map((test, index) => (
          <div key={index} className="test-card">
            <h4>{test.testName}</h4>
            <p>Duration: {test.duration} min</p>
            <button onClick={() => navigate(`/technicaltests/${test._id}/instructions`)}>View Instructions</button>
          </div>
        ))
      )}
    </div>
  );
};

export default TechnicalTests;
