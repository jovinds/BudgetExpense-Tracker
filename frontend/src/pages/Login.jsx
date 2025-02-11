import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

function Login() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(null);
  const navigate = useNavigate();

  const handleShowAlert = (message, variant = "success") => {
    setShowAlert({ message, variant });
    setTimeout(() => {
      setShowAlert(null);
    }, 3000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setShowAlert(null);

    if (!userName || !password) {
      handleShowAlert("Please fill in all the fields.", "warning");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        handleShowAlert(data.error || "Login failed.", "danger");
        return;
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("jwtToken", data.token);
        handleShowAlert("Login successful! Redirecting..");
        setTimeout(() => {
          navigate(`/dashboard/${data.userId}`);
        }, 3000);
      } else {
        handleShowAlert("Login failed. No token recieved.", "danger");
      }
    } catch (error) {
      handleShowAlert("An unexpected error occured.", "danger");
    }
  };

  return (
    <div className="loginContainer">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Login</h1>
        {showAlert && (
          <Alert variant={showAlert.variant}>{showAlert.message}</Alert>
        )}
        <div className="form-input-material">
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            placeholder=" "
            className="form-control-material"
            value={userName}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            required
          />
        </div>
        <div className="form-input-material">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder=" "
            className="form-control-material"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            required
          />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
        <h4
          onClick={() => {
            navigate("/signup");
          }}
        >
          Register
        </h4>
      </form>
    </div>
  );
}

export default Login;
