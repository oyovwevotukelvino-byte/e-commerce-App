import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function Register({ onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

   const userData = {
     name,
     email,
     password,
     avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  };
    fetch("https://api.escuelajs.co/api/v1/users/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        if (data.id) {
          setMessage("Registration successful! Please login.");
          // Clear form
          setName("");
          setEmail("");
          setPassword("");
          // Switch to login after successful registration
          setTimeout(() => {
            onSwitchToLogin();
          }, 1500);
        } else {
          setMessage(data.message || "Registration failed. Try again.");
        }
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
        setMessage("Registration failed. Try again.");
      });
  };

  return (
    <div className="register">
      <div className="register-inputs">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
              aria-label={showPassword ? "Hide password" : "Show password"}
           >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Register"}
          </button>
        </form>
        {message && <p>{message}</p>}
        <p className="switch-text">
          Already have an account?{" "}
          <button type="button" onClick={onSwitchToLogin} className="link-btn">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;

