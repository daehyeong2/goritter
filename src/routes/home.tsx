import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Home = () => {
  const navigate = useNavigate();
  const logOut = () => {
    auth.signOut();
    navigate(0);
  };
  return (
    <>
      <h1>Home</h1>
      <button onClick={logOut}>Log Out</button>
    </>
  );
};

export default Home;
