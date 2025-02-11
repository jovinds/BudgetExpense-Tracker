import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

function Signup() {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [userName, setuserName] = useState("");
  const [password, setpassword] = useState("");
  const [showAlert, setShowAlert] = useState(null);
  const navigate = useNavigate();

  const handleShowAlert = (message, variant = "success") => {
    setShowAlert({ message, variant });
    setTimeout(() => {
      setShowAlert(null);
    }, 3000);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setShowAlert(null);

    if (!firstName || !lastName) {
      handleShowAlert("Please complete your full name", "warning");
      return;
    }

    if (!userName) {
      handleShowAlert("Please provide a Username", "warning");
      return;
    }

    if (!password) {
      handleShowAlert("Please provide a password", "warning");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, userName, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        handleShowAlert(data.error || "Registration failed.", "danger");
        setuserName("");
        return;
      }

      handleShowAlert("Registration successful! Redirecting ...");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      handleShowAlert("Network error. Please try again later.", "danger");
    }
  };

  return (
    <div className="signupContainer">
    <form className="login-form" onSubmit={handleSignup}>
      <h1>Sign up</h1>
      {showAlert && (
        <Alert variant={showAlert.variant}>{showAlert.message}</Alert>
      )}
      <div className="form-input-material">
        <label htmlFor="firstname">First Name: </label>
        <input
          type="text"
          name="username"
          id="firstname"
          placeholder=" "
          className="form-control-material"
          value={firstName}
          onChange={(event) => {
            setfirstName(event.target.value);
          }}
        />
      </div>
      <div className="form-input-material">
        <label htmlFor="lastname">Last Name: </label>
        <input
          type="text"
          name="username"
          id="lastname"
          placeholder=" "
          className="form-control-material"
          value={lastName}
          onChange={(event) => {
            setlastName(event.target.value);
          }}
        />
      </div>
      <div className="form-input-material">
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder=" "
          className="form-control-material"
          value={userName}
          onChange={(event) => {
            setuserName(event.target.value);
          }}
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
            setpassword(event.target.value);
          }}
        />
      </div>
      <button type="submit" className="btn btn-primary btn-ghost">
        Register
      </button>
      <h4
        onClick={() => {
          navigate("/");
        }}
      >
        Log in
      </h4>
    </form>
  </div>
  );
}

export default Signup;
