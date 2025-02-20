import React, { useState, useEffect } from "react";
import API from "../api";
import * as XLSX from "xlsx";
import "./AdminResults.css";

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch available tests (test names)
    API.get("/tests", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Include the token for authentication
    })
      .then((res) => {
        setAvailableTests(res.data);
      })
      .catch((error) => {
        console.error("Error fetching tests:", error);
        setError("Failed to fetch tests.");
      });
  }, []);

  const handleTestSelect = async (e) => {
    const testId = e.target.value;
    setSelectedTest(testId);
    setResults([]);
    setError("");
    setLoading(true);

    if (testId) {
      try {
        const res = await API.get(`/test/${testId}/results`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Include the token for authentication
        });
        setResults(res.data.detailedResults);
      } catch (error) {
        console.error("Error fetching test results:", error);
        setError("Failed to fetch test results.");
      }
    }
    setLoading(false);
  };

  const downloadResultsAsExcel = () => {
    if (!selectedTest || results.length === 0) {
      setError("No results available to download.");
      return;
    }

    const data = results.map((result, index) => ({
      Rank: index + 1, // Rank is based on index in sorted results
      RollNo: result.rollNo,
      Name: result.name,
      Class: result.studentClass,
      TotalMarks: result.score, // Ensure this is being correctly passed and displayed
      CompletionTime: result.completionTime !== null 
        ? result.completionTime.toFixed(2) 
        : "N/A", // Show completion time in minutes
    }));

    // Sorting the data by RollNo, then by Class
    const sortedData = data.sort((a, b) => 
      a.RollNo.localeCompare(b.RollNo) || a.Class.localeCompare(b.Class)
    );

    const ws = XLSX.utils.json_to_sheet(sortedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");

    XLSX.writeFile(wb, `${selectedTest}_Results.xlsx`);
  };

  return (
    <div className="container">
      <h2>Leaderboard</h2>

      <select 
        onChange={handleTestSelect} 
        value={selectedTest} 
        disabled={loading}
      >
        <option value="">Select Test</option>
        {availableTests.map((test) => (
          <option key={test._id} value={test._id}>
            {test.testName}
          </option>
        ))}
      </select>

      <button
        className="download-btn"
        onClick={downloadResultsAsExcel}
        disabled={!selectedTest || results.length === 0}
      >
        Download Results
      </button>

      {error && <p className="error-message">{error}</p>}

      <table className="results-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Roll No</th>
            <th>Name</th>
            <th>Class</th>
            <th>Total Marks</th>
            <th>Completion Time (Minutes)</th>
          </tr>
        </thead>
        <tbody>
          {results.length > 0 ? (
            results.map((result, index) => (
              <tr key={index}>
                <td>{index + 1}</td> {/* Display rank based on index */}
                <td>{result.rollNo}</td>
                <td>{result.name}</td>
                <td>{result.studentClass}</td>
                <td>{result.score}</td> {/* Ensure score is correctly displayed */}
                <td>{result.completionTime !== null ? result.completionTime.toFixed(2) : "N/A"}</td> {/* Display completion time */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No results found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminResults;
