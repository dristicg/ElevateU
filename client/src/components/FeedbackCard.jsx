import React from "react";

const FeedbackCard = ({ title, items }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mb-4 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
      {Array.isArray(items) ? (
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">{items}</p>
      )}
    </div>
  );
};

export default FeedbackCard;
