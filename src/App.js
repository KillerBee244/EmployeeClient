import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
// import Countries from "./pages/Countries";
import CountryRoutes from "./country/CountryRoutes";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        {/* MENU DỌC BÊN TRÁI */}
        <div className="sidebar">
          <h2 className="logo">My React App</h2>
          <nav>
            <ul>
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    isActive ? "menu-item active" : "menu-item"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/countries"
                  className={({ isActive }) =>
                    isActive ? "menu-item active" : "menu-item"
                  }
                >
                  Countries
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* NỘI DUNG BÊN PHẢI */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/countries" element={<CountryRoutes />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
