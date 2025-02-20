import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rollNo: "",
    studentClass: "", // Updated to 'studentClass'
    backlogs: "",
    cgpa: "",
    resume: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFormData({ ...formData, resume: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        form.append(key, formData[key]);
      }
    });

    alert("Registeration Done successfully!");
    navigate("/login");
    console.log("Sending Data:", Object.fromEntries(form.entries())); // Debugging
  

    try {
      await API.post("/auth/register", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err); // Logging error response
      alert(err.response?.data?.msg || "Error Registering");
    }
    alert("Registeration Done successfully!");
    navigate("/login");
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="rollNo"
          placeholder="Roll No"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="studentClass" // Updated to 'studentClass'
          placeholder="Class"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="backlogs"
          placeholder="Active Backlogs"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.1"
          name="cgpa"
          placeholder="CGPA"
          onChange={handleChange}
          required
        />

        {/* Upload Resume Section */}
        <label className="resume-label">Upload Resume (PDF only)</label>
        <input
          type="file"
          name="resume"
          accept="application/pdf"
          onChange={handleFileChange}
          required
        />

        <button type="submit">Register</button>

        {/* Already Registered? Login Here */}
        <p className="login-link">
          Already registered? <span onClick={() => navigate("/login")}>Login here</span>
        </p>
      </form>
    </div>
  );
};

export default Register;
