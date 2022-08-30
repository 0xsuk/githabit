import { useState } from "react";
import { login } from "./utils/httpClient";

function Login({ setSid }) {
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    let res = await login(password);
    res = await res.json();
    if (res.error) {
      alert(res.error);
      return;
    }
    setSid(res.data);
    localStorage.setItem("sid", res.data);
  };
  return (
    <>
      <div id="login">
        <h2>Login</h2>
        <input
          type="text"
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>login</button>
      </div>
    </>
  );
}

export default Login;
