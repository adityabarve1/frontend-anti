import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
 // Ensure the logo is placed inside 'src/assets/'

const Home = () => {
  const navigate = useNavigate();

  

  return (
    <div className="home-container">
      {/* Left Section: Logo & Heading */}
      <div className="left-section">
        <img src="https://media.licdn.com/dms/image/v2/D4D0BAQF2uOXDJIPOiA/company-logo_200_200/company-logo_200_200/0/1707470727396?e=1747872000&v=beta&t=ME76NOSCzieBIfMoSrsWOYgHQjVbcvQpbBRb7bzLtQQ" alt="CSI Club Logo" className="logo" />

        <h1>Welcome to CSI Career Quest</h1>
        <p>Test your knowledge and get placed in top companies!</p>
      </div>

      {/* Curved Vertical Divider */}
      <div className="curved-divider"></div>

      {/* Right Section: Test Selection Buttons */}
      <div className="right-section">
        <div className="home-buttons">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
