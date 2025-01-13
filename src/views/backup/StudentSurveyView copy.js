/**
 * File Name: StudentSurveyView.js
 * Version: 1.0.0
 * AI Information: ChatGPT 4o
 *
 * Description:
 * This script renders a student survey with two sections:
 * 1. Essential Questions: 12 required questions.
 * 2. Optional Questions: 18 self-assessment questions for six core competency categories.
 *
 * Usage:
 * 1. Place this script in the `src/components` folder of your React project.
 * 2. Import and use it in your main application file (`src/index.js` or `src/App.js`).
 *    Example:
 *      import StudentSurveyView from './components/StudentSurveyView';
 *      <StudentSurveyView />
 * 3. Ensure that TailwindCSS is configured in your project.
 * 4. Run the application using `npm start` or `yarn start`.
 */

import React, { useState } from 'react';

const SurveyQuestion = ({ question, index, onAnswer }) => {
  const options = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    onAnswer(index, option);
  };

  return (
    <div className="mb-6">
      <p className="font-semibold text-lg">
        {index + 1}. {question}
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(option)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selected === option
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-blue-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

const StudentSurveyView = () => {
  // Define 12 essential questions
  const essentialQuestions = [
    "How satisfied are you with your overall learning experience?",
    "How would you rate the quality of instruction in your courses?",
    "Do you feel supported by your instructors?",
    "How do you rate the availability of learning resources?",
    "How often do you engage with course materials outside of class?",
    "How effectively are your assessments aligned with the course objectives?",
    "Do you feel the feedback you receive helps you improve?",
    "How comfortable are you reaching out to instructors for help?",
    "How well do you understand the grading criteria?",
    "How would you rate the pace of the course?",
    "Do you feel your workload is manageable?",
    "How satisfied are you with your overall academic progress?",
  ];

  // Define 18 optional questions for self-assessment in six core competency categories
  const optionalQuestions = [
    "How confident are you in your research skills?",
    "How often do you participate in class discussions?",
    "How well do you collaborate in group projects?",
    "How effectively do you manage your time?",
    "How confident are you in solving complex problems?",
    "How well do you apply theoretical concepts to practical situations?",
    "How frequently do you seek out learning opportunities beyond the classroom?",
    "How well do you set personal learning goals?",
    "How effectively do you manage stress during challenging situations?",
    "How do you rate your communication skills in academic settings?",
    "How often do you reflect on your learning process?",
    "How confident are you in your ability to work independently?",
    "How would you rate your ability to adapt to new learning environments?",
    "How effectively do you take notes during lectures?",
    "How well do you utilize feedback for improvement?",
    "How confident are you in your leadership abilities?",
    "How would you rate your ability to balance academics with personal life?",
    "How well do you contribute to team success?",
  ];

  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionIndex, answer, section) => {
    setAnswers((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [questionIndex]: answer,
      },
    }));
  };

  const handleSubmit = () => {
    console.log('Survey Answers:', answers);
    alert('Thank you for completing the survey!');
    // Add API integration to save responses
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Student Core Competency Survey
        </h1>

        {/* Essential Questions Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Essential Questions</h2>
          {essentialQuestions.map((question, index) => (
            <SurveyQuestion
              key={index}
              question={question}
              index={index}
              onAnswer={(answer) => handleAnswer(index, answer, 'essential')}
            />
          ))}
        </div>

        {/* Optional Questions Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Optional Questions</h2>
          {optionalQuestions.map((question, index) => (
            <SurveyQuestion
              key={index}
              question={question}
              index={index + essentialQuestions.length} // Continue numbering
              onAnswer={(answer) => handleAnswer(index, answer, 'optional')}
            />
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSurveyView;
