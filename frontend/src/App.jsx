import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserHome from "./Pages/UserHome";
import { Analytics } from "@vercel/analytics/next";
import { GlobalStateProvider } from "./GlobalStateContext";
import Login from "./Pages/Login";

const App = () => {
  const token = localStorage.getItem("access_token");

  return (
    <GlobalStateProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              token ? <Navigate to="/Home" replace /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/Home" element={<UserHome />} />
        </Routes>
      </Router>
      <Analytics />
    </GlobalStateProvider>
  );
};

export default App;