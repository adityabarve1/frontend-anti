import React from "react";
import { useNavigate } from "react-router-dom";
import "./ThankYou.css"; // Import CSS

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="thank-you-container">
      <h2>🎉 Thank You for Taking the Test! 🎉</h2>
      <p>Your responses have been recorded successfully.</p>
      <p>We will process the results and inform you soon.</p>

      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default ThankYou;
