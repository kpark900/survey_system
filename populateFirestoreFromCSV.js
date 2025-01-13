// File: populateFirestoreFromCSV.js
// Version: 1.0.1
// AI Information: ChatGPT 4o
//
// Description:
// This script reads a CSV file containing survey questions and populates a Firestore database.
// It requires the Firebase Admin SDK and access to a valid service account key.
//
// Usage:
// 1. Place this file in your project root.
// 2. Ensure you have a valid Firebase service account key and set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable.
// 3. Run the script using `node populateFirestoreFromCSV.js`.

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import Papa from 'papaparse';

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountKey.json';
const csvFilePath = './docs/questions-english.csv';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(firebaseApp);

const validateQuestionData = (row, index) => {
  const cleanedData = {
    serial: parseInt(row.Serial, 10) || index + 1,
    coreCompetency: row['Core Competency'] || 'Uncategorized',
    subFactor: row['Sub-Factor'] || 'General',
    questionText: row['Diagnostic Question'] || `Question ${index + 1}`,
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    createdAt: new Date().toISOString(),
  };

  if (!cleanedData.questionText || cleanedData.questionText.trim() === '') {
    throw new Error(`Row ${index + 1}: Question text is required`);
  }

  if (!cleanedData.coreCompetency || cleanedData.coreCompetency.trim() === '') {
    throw new Error(`Row ${index + 1}: Core Competency is required`);
  }

  if (!cleanedData.subFactor || cleanedData.subFactor.trim() === '') {
    throw new Error(`Row ${index + 1}: Sub-Factor is required`);
  }

  return cleanedData;
};

const populateQuestionsFromCSV = async () => {
  try {
    console.log('Starting CSV import...');

    if (!existsSync(csvFilePath)) {
      throw new Error(`CSV file not found at: ${csvFilePath}`);
    }

    const csvContent = readFileSync(csvFilePath, 'utf8');
    const { data, errors } = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      console.warn('CSV parsing warnings:', errors);
    }

    if (data.length === 0) {
      throw new Error('CSV file is empty or improperly formatted.');
    }

    console.log(`Found ${data.length} rows in CSV.`);

    const validatedData = data.map((row, index) => validateQuestionData(row, index));

    const batchSize = 500;
    for (let i = 0; i < validatedData.length; i += batchSize) {
      const batch = db.batch();
      const chunk = validatedData.slice(i, i + batchSize);

      chunk.forEach((question) => {
        const docRef = db.collection('questions').doc(`q${question.serial}`);
        batch.set(docRef, question);
      });

      await batch.commit();
      console.log(`Processed questions ${i + 1} to ${i + chunk.length}.`);
    }

    console.log('Questions loaded successfully from CSV.');
  } catch (error) {
    console.error('Error loading questions from CSV:', error);
    process.exit(1);
  }
};

populateQuestionsFromCSV();
