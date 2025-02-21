import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Dashboard.css";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        API.get("/auth/profile", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
            .then((res) => setUser(res.data))
            .catch(() => navigate("/login"));
    }, [navigate]);

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <h2>Dashboard</h2>
                <div className="nav-buttons">
                    <button onClick={() => navigate("/profile")}>Profile</button>
                    <button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>Logout</button>
                </div>
            </nav>

            <div className="options">
                <button onClick={() => navigate("/aptitude-tests")}>Aptitude Test</button>
                <button onClick={() => navigate("/technical-tests")}>Technical Round</button>
                {/* Add the Result button here if needed */}
                <button onClick={() => navigate("/results")}>Results</button>
            </div>
        </div>
    );
};

export default Dashboard;
