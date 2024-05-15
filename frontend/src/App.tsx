// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import SelectedMovie from './selectedMovie';
import SelectedMetaData from './selectedmetadata';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/selectedMovie" element={<SelectedMovie />} />
        <Route path="/selectedmetadata" element={<SelectedMetaData/>} />
        <Route path="/home" element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;
