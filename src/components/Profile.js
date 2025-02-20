import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Profile.css";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({});
    const token = localStorage.getItem("token");
    const navigate = useNavigate(); // React Router hook for navigation

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await API.get("/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
                setUpdatedUser(response.data); // Set initial form values
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false);
            }
        };

        if (token) fetchUserData();
    }, [token]);

    const handleChange = (e) => {
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put("/user/update-profile", updatedUser, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(updatedUser);
            setEditMode(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };

    if (loading) return <p>Loading profile...</p>;

    return (
        <div className="profile-container">
            <h2>User Profile</h2>

            {editMode ? (
                <form onSubmit={handleSubmit} className="profile-form">
                    <label>Name:</label>
                    <input type="text" name="name" value={updatedUser.name || ""} onChange={handleChange} required />

                    <label>Roll No:</label>
                    <input type="text" name="rollNo" value={updatedUser.rollNo || ""} onChange={handleChange} required />

                    <label>Class:</label>
                    <input type="text" name="studentClass" value={updatedUser.studentClass || ""} onChange={handleChange} required />

                    <label>Backlogs:</label>
                    <input type="number" name="backlogs" value={updatedUser.backlogs || 0} onChange={handleChange} required />

                    <label>CGPA:</label>
                    <input type="number" step="0.01" name="cgpa" value={updatedUser.cgpa || 0} onChange={handleChange} required />

                    <label>Password (Leave blank if unchanged):</label>
                    <input type="password" name="password" placeholder="New Password" onChange={handleChange} />

                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                </form>
            ) : (
                <div className="profile-details">
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Roll No:</strong> {user?.rollNo}</p>
                    <p><strong>Class:</strong> {user?.studentClass}</p>
                    <p><strong>Backlogs:</strong> {user?.backlogs}</p>
                    <p><strong>CGPA:</strong> {user?.cgpa}</p>
                    <button onClick={() => setEditMode(true)}>Edit Profile</button>
                </div>
            )}

            {/* Back to Dashboard Button */}
            <button className="back-button" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
            </button>
        </div>
    );
};

export default Profile;
