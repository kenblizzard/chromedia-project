import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import AnimeSearchPage from './AnimeSearchPage';
import AnimeDetailsPage from './AnimeDetailsPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" index element={<AnimeSearchPage />}/>
        <Route path="/:animeId" element={<AnimeDetailsPage />}/>
      </Routes>
    </Router>
  );
}

export default App;
