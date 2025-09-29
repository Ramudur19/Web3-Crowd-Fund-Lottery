import React, { useState } from "react";
import "./pages.css";
import { useMetaMaskAuth } from "../Hooks/useMetaMaskAuth";

const Signup = () => {
  const { account, connectWallet } = useMetaMaskAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Account created for ${username}`);
  };

  return (
    <div className="container">
      <h2>Signup</h2>

      <form onSubmit={handleSignup} className="form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

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

        <button type="submit">Signup</button>
      </form>

      <hr />
      <button onClick={connectWallet} className="metamaskBtn">
        {account ? `Connected: ${account.slice(0, 6)}...` : "Signup with MetaMask"}
      </button>
    </div>
  );
};

export default Signup;
