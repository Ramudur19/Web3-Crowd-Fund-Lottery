import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="navbar">
      <h2 className="logo" onClick={() => navigate("/")}>CrowdFund</h2>
      <ul className="navLinks">
        {!isLoggedIn ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/create">Create Campaign</Link></li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </li>
            <li
              className="profile-link"
              onClick={handleProfileClick}
              title="Go to Profile"
            >
              {user?.username || "User"}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;