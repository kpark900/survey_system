// src/views/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config.js';
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
} from 'firebase/firestore';
import { CSVLink } from 'react-csv';

const AdminDashboard = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        coreCompetency: '',
        questionText: '',
        options: ['1', '2', '3', '4', '5'],
    });
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            const querySnapshot = await getDocs(collection(db, 'questions'));
            const fetchedQuestions = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setQuestions(fetchedQuestions);
        };

        const fetchResponses = async () => {
            const querySnapshot = await getDocs(collection(db, 'responses'));
            const fetchedResponses = querySnapshot.docs.map((doc) => doc.data());
            setResponses(fetchedResponses);
        };

        fetchQuestions();
        fetchResponses();
    }, []);

    const handleAddQuestion = async () => {
        if (!newQuestion.coreCompetency || !newQuestion.questionText) {
            alert('Core Competency and Question Text are required.');
            return;
        }
        try {
            await addDoc(collection(db, 'questions'), newQuestion);
            setQuestions((prev) => [...prev, newQuestion]);
            setNewQuestion({ coreCompetency: '', questionText: '', options: ['1', '2', '3', '4', '5'] });
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            await deleteDoc(doc(db, 'questions', id));
            setQuestions((prev) => prev.filter((q) => q.id !== id));
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const handleEditQuestion = async (id, updatedQuestion) => {
        try {
            await updateDoc(doc(db, 'questions', id), updatedQuestion);
            setQuestions((prev) =>
                prev.map((q) => (q.id === id ? { ...q, ...updatedQuestion } : q))
            );
        } catch (error) {
            console.error('Error editing question:', error);
        }
    };

    const headers = [
        { label: 'Question ID', key: 'id' },
        { label: 'Core Competency', key: 'coreCompetency' },
        { label: 'Question Text', key: 'questionText' },
    ];

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            {/* Add Question */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Add New Question</h2>
                <input
                    type="text"
                    placeholder="Core Competency"
                    value={newQuestion.coreCompetency}
                    onChange={(e) =>
                        setNewQuestion((prev) => ({ ...prev, coreCompetency: e.target.value }))
                    }
                    className="block w-full p-2 mb-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Question Text"
                    value={newQuestion.questionText}
                    onChange={(e) =>
                        setNewQuestion((prev) => ({ ...prev, questionText: e.target.value }))
                    }
                    className="block w-full p-2 mb-2 border rounded"
                />
                <button
                    onClick={handleAddQuestion}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Question
                </button>
            </div>

            {/* List of Questions */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Manage Questions</h2>
                {questions.map((q) => (
                    <div key={q.id} className="mb-4 p-4 border rounded">
                        <p className="font-semibold">{q.coreCompetency}</p>
                        <p>{q.questionText}</p>
                        <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {/* Export Responses */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Export Responses</h2>
                <CSVLink
                    data={responses}
                    headers={headers}
                    filename="responses.csv"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Export Responses
                </CSVLink>
            </div>
        </div>
    );
};

export default AdminDashboard;

