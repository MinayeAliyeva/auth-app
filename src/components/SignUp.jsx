import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signUp } from "../control/authSlice";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch=useDispatch();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signUp({ username, password }));
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">SignUp</button>
      </form>
    </div>
  );
}

export default SignUp;
