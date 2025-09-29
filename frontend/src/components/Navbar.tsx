import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // For styling

const Navbar: React.FC = () => {
  // Mock login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <nav className="navbar">
      <h2>CrowdFund</h2>
      <ul className = "navLinks">
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/login" onClick={handleLogin}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create">Create Campaign</Link>
            </li>
            <li>
              <button onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;