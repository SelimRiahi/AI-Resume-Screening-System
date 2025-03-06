import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const signUpUser = async () => {
    console.log("Sign Up button clicked");
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name: "John Doe",
        email,
        password,
      });
      console.log(response.data);
      setMessage("Sign up successful");
      navigate("/login"); // Navigate to login page after successful sign-up
    } catch (error) {
      console.error(error.response.data.message);
      setMessage("Sign up failed");
    }
  };

  const loginUser = async () => {
    console.log("Login button clicked");
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      console.log(response.data);
      // Save the token and role in local storage or state
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      setMessage("Login successful");
      if (response.data.role === "recruiter") {
        navigate("/recruiter-dashboard"); // Navigate to recruiter dashboard
      } else {
        navigate("/hello"); // Navigate to hello page for candidates
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Login failed");
      }
    }
  };

  return (
    <div>
      <h2>Auth Component</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signUpUser}>Sign Up</button>
      <button onClick={loginUser}>Login</button>
      <p>{message}</p>
    </div>
  );
};

export default AuthComponent;
