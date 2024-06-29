import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CourseSelect from './CourseSelect';
import ExamSelect from './ExamSelect';
import StudentResults from './StudentResults';
import './ExamResults.css';

function ExamResults({ language, isDarkMode, Role, userId }) {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [courses, setCourses] = useState([]);
    const [exams, setExams] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("userId: ", userId)
                console.log("Role: ",Role)
                let response;
                if (Role === 'student') {
                    response = await axios.get(`https://learning-flax-omega.vercel.app/api/student/${userId}/courses`);
                } else if (Role === 'instructor') {
                    response = await axios.get(`https://learning-flax-omega.vercel.app/api/instructor/${userId}/courses`);
                }
                console.log('API response:', response.data); // Log the response
                if (Array.isArray(response.data)) {
                    setCourses(response.data);
                } else {
                    console.error('Expected array but got:', response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [userId, Role]);

    const handleCourseSelect = (courseId) => {
        setSelectedCourse(courseId);
        axios.get(`https://learning-flax-omega.vercel.app/api/exams/${courseId}`)
            .then(response => {
                setExams(response.data);
                setSelectedExam('');
                setStudents([]);
            })
            .catch(error => {
                console.error('Error fetching exams:', error);
            });
    };

    const handleExamSelect = (examId) => {
        setSelectedExam(examId);
        axios.get(`https://learning-flax-omega.vercel.app/api/exam-results/${examId}`)
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error('Error fetching exam results:', error);
            });
    };
    console.log("students:",students);

    return (
        <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
            <h1>{language === 'En' ? 'Exam Results' : 'نتائج الامتحانات'}</h1>
            <div className="select-container">
                <CourseSelect courses={courses} onSelect={handleCourseSelect} language={language} />
                <ExamSelect exams={exams} onSelect={handleExamSelect} language={language} />
            </div>
            <StudentResults students={students} language={language} />
        </div>
    );
}

export default ExamResults;
