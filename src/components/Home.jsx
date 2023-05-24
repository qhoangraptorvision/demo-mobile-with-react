import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { decrement, increment } from "../slices/auth";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <h1>Home PAGE</h1>
      <p>Is Auth {JSON.stringify(isAuth)}</p>
      <p>TOKEN: {JSON.stringify(token)}</p>
      {/* <p>Value test {value}</p>
      <button onClick={() => dispatch(increment())}>Increment Value</button> */}
    </>
  );
};

export default Home;
