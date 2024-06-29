// ExamPreviewPage.js
import React, { useState, useEffect } from 'react';
import styles from './ExamPreview.module.css'; // Import CSS module

import examData from './examData.json'; // Import exam data

function ExamPreviewPage() {
  const [exam, setExam] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Fetch exam data from file (you can use any method here to read the data)
    setExam(examData);
  }, []);

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setEditMode(prevMode => !prevMode);
  };

  // Function to edit exam data (add, edit, delete questions)
  const editExam = () => {
    // Add your editing logic here
    // For example, open a modal or switch to an editing interface
  };

  return (
    <div className={styles.examContainer}>
      {exam ? (
        <div>
          <h1 className={styles.examTitle}>{exam.examName}</h1>
          {editMode ? (
            <div>
              {/* Editing Interface */}
              <h2>Editing Exam</h2>
              {/* Add editing controls here */}
            </div>
          ) : (
            <div>
              {/* Exam Preview */}
              {exam.questions.map(question => (
                <div className={styles.question} key={question.id}>
                  <h2>{question.question}</h2>
                  <ul className={styles.optionsList}>
                    {question.options.map(option => (
                      <li className={styles.option} key={option}>{option}</li>
                    ))}
                  </ul>
                  <p className={styles.correctAnswer}>Correct Answer: {question.correctAnswer}</p>
                </div>
              ))}
            </div>
          )}
          <button className={styles.editButton} onClick={toggleEditMode}>
            {editMode ? 'Cancel Edit' : 'Edit Exam'}
          </button>
        </div>
      ) : (
        <p>Loading exam data...</p>
      )}
    </div>
  );
}

export default ExamPreviewPage;
