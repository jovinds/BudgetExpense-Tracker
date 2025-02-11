import Dashboard from "./pages/Dashboard";
import Login from "./pages/login";
import Signup from "./pages/signup";
import { Routes, Route, Navigate } from "react-router-dom";
import "./Styles/Login.css";
import "./Styles/Signup.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login></Login>} />
        <Route path="/signup" element={<Signup></Signup>} />
        <Route path="/dashboard/:userID" element={<Dashboard></Dashboard>} />
      </Routes>
    </>
  );
}

export default App;
