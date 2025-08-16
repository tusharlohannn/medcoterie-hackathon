import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import UserHome from "./Pages/UserHome";
import { GlobalStateProvider } from "./GlobalStateContext";
import "./main.scss";
import Login from './Pages/Login';

createRoot(document.getElementById('root')).render(
  <GlobalStateProvider>
    <Router>
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/Home" element={<UserHome />} />
        </Routes>
      </>
    </Router>
  </GlobalStateProvider>
)
