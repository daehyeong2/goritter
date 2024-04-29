import { auth } from "../firebase";

const Home = () => {
  const logOut = () => {
    auth.signOut();
  };
  return (
    <>
      <h1>Home</h1>
      <button onClick={logOut}>Log Out</button>
    </>
  );
};

export default Home;
