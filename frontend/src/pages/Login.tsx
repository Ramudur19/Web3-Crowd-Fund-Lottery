import React, { useState } from "react";
import "./pages.css";
import { useMetaMaskAuth } from "../Hooks/useMetaMaskAuth";

const Login = () => {
  const { account, connectWallet } = useMetaMaskAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Logged in with Email: ${email}`);
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <form onSubmit={handleFormLogin} className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <hr />
      <button onClick={connectWallet} className="metamaskBtn">
        {account ? `Connected: ${account.slice(0, 6)}...` : "Login with MetaMask"}
      </button>
    </div>
  );
};

export default Login;