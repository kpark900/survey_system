/**
 * File Name: StudentSurveyView.js
 * Version: 1.2.0
 * AI Information: ChatGPT 4o
 *
 * Description:
 * This script renders a visually enhanced student survey interface with a modern color scheme,
 * improved layout, and responsive design.
 */

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const SurveyQuestion = ({ question, index, onAnswer }) => {
  const options = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    onAnswer(index, option);
  };

  return (
    <div className="mb-8">
      <p className="font-semibold text-lg mb-4 text-gray-800">
        {index + 1}. {question}
      </p>
      <div className="flex flex-wrap gap-3">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(option)}
            className={`px-4 py-2 rounded-lg transition-all border focus:ring-2 ${
              selected === option
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'
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
  const [essentialQuestions, setEssentialQuestions] = useState([]);
  const [optionalQuestions, setOptionalQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/questions-english.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const csvData = await response.text();
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const essential = result.data
              .filter((row) => row.type === 'essential')
              .map((row) => row.question);
            const optional = result.data
              .filter((row) => row.type === 'optional')
              .map((row) => row.question);

            setEssentialQuestions(essential);
            setOptionalQuestions(optional);
            setLoading(false);
          },
        });
      } catch (error) {
        setError('Failed to load questions. Please try again later.');
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

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
    alert('Thank you for completing the survey!');
    console.log('Survey Answers:', answers);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading questions...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Student Core Competency Survey
        </h1>

        {/* Essential Questions Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Essential Questions</h2>
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
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Optional Questions</h2>
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
        <div className="mt-10 text-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSurveyView;
