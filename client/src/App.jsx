// src/App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <div>
      {/* You can add Navbar/Header here */}
      <Outlet />
      {/* You can add Footer here */}
    </div>
  );
};

export default App;
