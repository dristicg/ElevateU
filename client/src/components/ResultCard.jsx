// src/components/ResultCard.jsx
import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './ResultCard.css';

const ResultCard = ({ icon, title, children }) => {
  const [isOpen, setIsOpen] = useState(title === 'Summary');

  return (
    <div className="result-card">
      <div className="card-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="card-title">
          {icon}
          <span>{title}</span>
        </div>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </div>
      {isOpen && <div className="card-content">{children}</div>}
    </div>
  );
};

export default ResultCard;
