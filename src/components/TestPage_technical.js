import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "./TestPage_technical.css";

const TechnicalTestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    parseInt(localStorage.getItem("currentQuestionIndex")) || 0
  );
  const [selectedAnswers, setSelectedAnswers] = useState(
    JSON.parse(localStorage.getItem("selectedAnswers")) || {}
  );
  const [timeLeft, setTimeLeft] = useState(
    parseInt(localStorage.getItem("timeLeft")) || 30 * 60 // 20-minute timer
  );
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await API.get(`/technicaltests/${testId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Shuffle questions randomly
        const shuffledQuestions = [...response.data.questions].sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
      } catch (error) {
        console.error("Error fetching test:", error);
      }
    };

    if (testId && token) {
      fetchQuestions();
    }
  }, [testId, token]);

  useEffect(() => {
    localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex);
    localStorage.setItem("timeLeft", timeLeft);
  }, [selectedAnswers, currentQuestionIndex, timeLeft]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async () => {
    if (submitted) return; // Prevent multiple submissions
    setSubmitted(true);
    try {
      const payload = { answers: selectedAnswers };
      await API.post(`/technicaltests/${testId}/submit`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("selectedAnswers");
      localStorage.removeItem("currentQuestionIndex");
      localStorage.removeItem("timeLeft");

      navigate("/coding-round");
    } catch (error) {
      console.error("Error submitting test:", error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (questions.length === 0) return <p>Loading test...</p>;

  return (
    <div className="test-container">
      <div className="question-sidebar">
        <h3>Time Left: {formatTime(timeLeft)}</h3>
        {questions.map((question, index) => (
          <button
            key={question.id}
            className={`question-btn ${
              selectedAnswers[question.id]
                ? "answered"
                : currentQuestionIndex === index
                ? "visited"
                : ""
            }`}
            onClick={() => handleQuestionClick(index)}
          >
            {index + 1}
          </button>
        ))}
        <button className="submit-btn" onClick={handleSubmit} disabled={submitted}>
          Submit
        </button>
      </div>

      <div className="question-section">
        <h3>Question {currentQuestionIndex + 1}</h3>
        <p>{questions[currentQuestionIndex].question}</p>
        <div className="options">
          {questions[currentQuestionIndex].options.map((option, index) => (
            <label key={index} className="option-label">
              <input
                type="radio"
                name={`question-${questions[currentQuestionIndex].id}`}
                checked={selectedAnswers[questions[currentQuestionIndex].id] === option}
                onChange={() => handleAnswerSelect(questions[currentQuestionIndex].id, option)}
              />
              {option}
            </label>
          ))}
        </div>

        <div className="navigation-buttons">
          {currentQuestionIndex > 0 && <button onClick={handlePrevious}>Previous</button>}
          {currentQuestionIndex < questions.length - 1 ? (
            <button onClick={handleNext}>Next</button>
          ) : (
            <button onClick={handleSubmit} disabled={submitted}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalTestPage;
