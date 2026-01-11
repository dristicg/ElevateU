// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import App from './App'; // Layout wrapper if you're using one
import ResumeAnalyzer from './pages/ResumeAnalyzer';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* If you use a layout component like App.jsx */}
        <Route path="/" element={<App />}>
          {/* Render analyzer at the root as the index route so the page isn't blank */}
          <Route index element={<ResumeAnalyzer />} />
          <Route path="analyze" element={<ResumeAnalyzer />} />
        </Route>

        {/* If no layout, you can directly render */}
        {/* <Route path="/analyze" element={<ResumeAnalyzer />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
