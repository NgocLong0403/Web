import "./App.css";
import HomePage from "./Components/Home/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import NavBar from "./Components/NavBar/NavBar";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import ChangePassword from "./Components/ChangePassword/ChangePassword";
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.auth.login.currentUser);
  console.log("check:", user);
  const id = user?._id;
  return (
    <Router>
      <NavBar />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword id={id} />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
