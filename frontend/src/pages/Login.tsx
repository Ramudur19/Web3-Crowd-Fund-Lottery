import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMetaMaskAuth } from "../Hooks/useMetaMaskAuth";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import "./pages.css";

const Login = () => {
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const { account, connectWallet } = useMetaMaskAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setIsLoggedIn(true);
      setUser(res.data.user);
      navigate("/");

    } catch (err: any) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleFormLogin} className="form">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>

      <hr />
      <button onClick={connectWallet} className="metamaskBtn">
        {account ? `Connected: ${account.slice(0, 6)}...` : "Connect MetaMask"}
      </button>
    </div>
  );
};

export default Login;