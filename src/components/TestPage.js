import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "./TestPage.css";

const TestPage = () => {
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

    parseInt(localStorage.getItem("timeLeft")) || 30 * 60 //timer
  );
  const [submitted, setSubmitted] = useState(false);
  const [warning, setWarning] = useState(""); // To show warning messages

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await API.get(`/tests/${testId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const shuffledQuestions = [...response.data.questions].sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
      } catch (error) {
        console.error("Error fetching test:", error);
      }
    };

    fetchQuestions();
  }, [testId, token]);

  useEffect(() => {
    localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex);
    localStorage.setItem("timeLeft", timeLeft);
  }, [selectedAnswers, currentQuestionIndex, timeLeft]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;
        clearInterval(timer);
        if (!submitted) handleSubmit(); // Auto-submit if time runs out
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

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

    const unansweredQuestions = questions.filter(q => !selectedAnswers[q.id]);

    if (unansweredQuestions.length > 0) {
      setWarning(`You must answer all ${questions.length} questions before submitting.`);
      return;
    }

    setSubmitted(true);
    try {
      const payload = { answers: selectedAnswers };
      await API.post(`/tests/${testId}/submit`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("selectedAnswers");
      localStorage.removeItem("currentQuestionIndex");
      localStorage.removeItem("timeLeft");

      navigate("/thank-you");
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
      {/* Sidebar Question Navigation */}
      <div className="question-sidebar">
        <h3>Time Left: {formatTime(timeLeft)}</h3>
        {questions.map((question, index) => (
          <button
            key={question.id}
            className={`question-btn ${
              selectedAnswers[question.id] ? "answered" : currentQuestionIndex === index ? "visited" : ""
            }`}
            onClick={() => handleQuestionClick(index)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={submitted}
        >
          Submit
        </button>
        {warning && <p className="warning-text">{warning}</p>}
      </div>

      {/* Main Test Section */}
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
          {currentQuestionIndex > 0 && (
            <button onClick={handlePrevious}>Previous</button>
          )}
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

export default TestPage;
