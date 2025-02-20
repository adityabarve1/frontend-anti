import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CodingRoundPage.css";

const CodingRoundPage = () => {
  const navigate = useNavigate();
  const [codingCompleted, setCodingCompleted] = useState(false);

  // Reset state on page reload
  useEffect(() => {
    localStorage.removeItem("codingCompleted");
  }, []);

  const handleCheckboxChange = () => {
    setCodingCompleted((prev) => !prev);
  };

  const handleFinalSubmit = () => {
    if (codingCompleted) {
      navigate("/thank-you");
    } else {
      alert("Please confirm that you have completed the Coding Round.");
    }
  };

  const handleStartCoding = () => {
    window.open("https://www.hackerrank.com/csi-career-quest-ptc-coding-round", "_blank");
  };

  return (
    <div className="coding-round-container">
      <h2>Thanks for completing Technical Round Part 1!</h2>
      <p>Let's move to the next part: The Coding Round.</p>

      <button className="start-coding-btn" onClick={handleStartCoding}>
        Start Coding Round
      </button>

      <div className="confirmation-section">
        <input
          type="checkbox"
          id="codingCompleted"
          checked={codingCompleted}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="codingCompleted">I have completed the Coding Round</label>
      </div>

      <button className="submit-btn" onClick={handleFinalSubmit}>
        Submit
      </button>
    </div>
  );
};

export default CodingRoundPage;
