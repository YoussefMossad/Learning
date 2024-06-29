import { useState } from 'react';
import './TakeExam.css';
import quizData from './quizQuestions.json';

const TakeExam = ({ isDarkMode }) => {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCourseSelect = (courseId) => {
    setSelectedCourseId(courseId);
    setSelectedQuizId('');
    setQuizQuestions([]);
    setStudentAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
  };

  const handleQuizSelect = (quizId) => {
    setSelectedQuizId(quizId);
    const course = quizData.find(course => course.courseId === selectedCourseId);
    const quiz = course?.quizzes.find(quiz => quiz.quizId === quizId);
    setQuizQuestions(quiz ? quiz.questions : []);
    setStudentAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
  };

  const handleAnswerSelect = (questionId, answer) => {
    setStudentAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    quizQuestions.forEach(question => {
      if (studentAnswers[question.questionId] === question.correctAnswer) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const studentScore = calculateScore();
    const totalScore = quizQuestions.length;
    alert(`Your score: ${studentScore}/${totalScore}`);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className={`quiz-result ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="select-container">
        <h2>Select Course</h2>
        <select onChange={(e) => handleCourseSelect(e.target.value)} disabled={isSubmitted}>
          <option value="">-- Select Course --</option>
          {quizData.map((course, index) => (
            <option key={index} value={course.id}>
              {course.courseName}
            </option>
          ))}
        </select>

        <h2>Select Quiz</h2>
        <select onChange={(e) => handleQuizSelect(e.target.value)} disabled={!selectedCourseId || isSubmitted}>
          <option value="">-- Select Quiz --</option>
          {selectedCourseId && quizData
            .find(course => course.courseId === selectedCourseId)
            ?.quizzes.map((quiz, index) => (
              <option key={index} value={quiz.quizId}>
                {quiz.quizName}
              </option>
            ))}
        </select>
      </div>

      <div className="questions-container">
        {quizQuestions.length > 0 && (
          <div>
            <div className="question-item">
              <p>{quizQuestions[currentQuestionIndex].questionText}</p>
              {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  className={`answer-button ${studentAnswers[quizQuestions[currentQuestionIndex].questionId] === option ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(quizQuestions[currentQuestionIndex].questionId, option)}
                  disabled={isSubmitted}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="navigation-buttons">
              <button onClick={handleBack} disabled={currentQuestionIndex === 0 || isSubmitted}>Back</button>
              {currentQuestionIndex < quizQuestions.length - 1 ? (
                <button onClick={handleNext} disabled={isSubmitted}>Next</button>
              ) : (
                <button onClick={handleSubmit} disabled={isSubmitted}>Submit</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeExam;
