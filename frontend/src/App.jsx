import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Flashcards from './pages/Flashcards';
import AIAssistant from './pages/AIAssistant';
import QuizGenerator from './pages/QuizGenerator';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/assistant" element={<AIAssistant />} />
          <Route path="/quiz" element={<QuizGenerator />} />
          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
