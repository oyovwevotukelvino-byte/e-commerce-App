import React, { useState } from "react";
import Register from "./Register";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    const credentials = { email, password };

    fetch("https://api.escuelajs.co/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem("token", data.access_token); // ✅ save token
          setMessage("Login successful!");
          onLogin(data.access_token); // pass token back to App
        } else {
          setMessage("Login failed. Try again.");
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("Login failed. Try again.");
      });
  };

  if (showRegister) {
    return (
      <Register
        onSwitchToLogin={() => setShowRegister(false)}
      />
    );
  }

  return (
    <div className="login">
      <div className="login-inputs">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
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
          <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
        <p className="switch-text">
          Don't have an account?{" "}
          <button type="button" onClick={() => setShowRegister(true)} className="link-btn">
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
