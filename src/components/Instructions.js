import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Instructions.css";

// Function to start the test by making an API call
const startTest = async (testId, userId) => {
  try {
    const response = await fetch("/api/startTest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,  // Get the userId from localStorage or another source
        testId: testId,  // Test ID from URL
      }),
    });

    const data = await response.json();
    if (data.success) {
      console.log("Test start time saved successfully!");
    } else {
      console.error("Failed to save start time");
    }
  } catch (error) {
    console.error("Error starting the test:", error);
  }
};

const Instructions = () => {
  const navigate = useNavigate();
  const { testId } = useParams(); // Extract testId from the URL

  // Get the user ID from localStorage (assuming it's saved there during login)
  const userId = localStorage.getItem("userId"); // You can replace this with your actual logic for fetching the userId

  // If userId is not found in localStorage, we can set a fallback or redirect
  if (!userId) {
    // Redirect to login page if userId is not found
    navigate(`/test/${testId}`);
  }

  const [isStartingTest, setIsStartingTest] = useState(false); // Track if the test is starting
  const [error, setError] = useState(null); // Track error message

  // Handle the "Start Test" button click
  const handleStartTest = async () => {
    if (!userId) {
      setError("User is not authenticated. Please log in again.");
      return;
    }

    setIsStartingTest(true); // Set to true when the test is being started

    try {
      // Call the startTest function to save the start time
      await startTest(testId, userId);

      // Navigate to the test page after successfully saving start time
      navigate(`/test/${testId}`);
    } catch (error) {
      setError("Failed to start the test. Please try again.");
    } finally {
      setIsStartingTest(false); // Reset loading state after API call
    }
  };

  return (
    <div className="instructions-container">
      <h2>Test Instructions</h2>
      <p>1. The test duration is 40 minutes.</p>
      <p>2. Questions are multiple-choice.</p>
      <p>3. Do not refresh the page during the test.</p>

      {error && <p className="error-message">{error}</p>} {/* Display error message */}

      <button onClick={handleStartTest} disabled={isStartingTest}>
        {isStartingTest ? "Starting Test..." : "Start Test"}
      </button>
    </div>
  );
};

export default Instructions;
