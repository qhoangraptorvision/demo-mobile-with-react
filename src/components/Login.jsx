import { useMutation } from "@apollo/client";
import { useState } from "react";
import { LOGIN_QUERY } from "../gql/login";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../slices/auth";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { loading, error }] = useMutation(LOGIN_QUERY);
  const [formBody, setFormBody] = useState({
    email: "",
    password: "",
  });

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormBody({ ...formBody, [name]: value });
  };

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      console.log("formBody", formBody);
      const res = await login({
        variables: {
          ...formBody,
        },
      });
      console.log("🚀 ~ res:", res);
      if (res?.data?.login?.success) {
        const token = res.data.login.token;
        localStorage.setItem("token", token);
        dispatch(setToken(token));
        navigate("/");
      }
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }
  };

  return (
    <>
      <h1>Login PAGE</h1>

      {loading && <h3>LOADING ...</h3>}
      {error && <h3>{JSON.stringify(error)}</h3>}

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Email: </label>
          <input
            type="text"
            id="email"
            name="email"
            required
            onChange={handleChangeForm}
          />
        </div>
        <br />
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            onChange={handleChangeForm}
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
