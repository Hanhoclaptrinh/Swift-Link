import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { AnalyticsDetail } from './pages/AnalyticsDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-agent-950">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics/:code" element={<AnalyticsDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
