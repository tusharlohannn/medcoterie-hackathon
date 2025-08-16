import { useState } from "react";
import axios from "axios";
import Header from "../Components/Header";
import "./styles/Login.scss";
import { useGlobalState } from "../GlobalStateContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { baseUrl } = useGlobalState();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("access_token", response.data.token);
      localStorage.setItem("user_id", response.data.user.id);
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("user_email", response.data.user.email);
      navigate("/Home");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/api/auth/register`, {
        full_name: fullName,
        username,
        email,
        password,
      });

      console.log("Registered successfully!", response?.data);
      setMode("login"); // switch back to login after registration
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header isLoggedIn={false} />
      <div className="loginPageContainer">
        <div className="left-section">
          <div className="left-section-top">
            <p className="loginHeader">
              {mode === "login" ? "Login" : "Sign Up"}
            </p>
            <div className="loginInputs">
              {mode === "register" && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </>
              )}
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {mode === "login" && <a className="forgotPassword">Forgot Password?</a>}
              {error && <p className="errorMessage">{error}</p>}
            </div>
          </div>

          <div className="left-section-bottom">
            <button
              className="loginButton"
              onClick={mode === "login" ? handleLogin : handleRegister}
              disabled={loading}
            >
              {loading
                ? mode === "login"
                  ? "Logging in..."
                  : "Registering..."
                : mode === "login"
                  ? "Login"
                  : "Sign Up"}
            </button>
            <p className="signUpButton">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <span onClick={() => setMode("register")}>Sign Up here</span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span onClick={() => setMode("login")}>Login here</span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="right-section">
          <img src="/resources/doctors.png" alt="Doctors" />
        </div>
      </div>
    </>
  );
}

export default Login;
