import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Button = styled.span`
  margin-top: 30px;
  background-color: white;
  padding: 10px 20px;
  border-radius: 15px;
  border: none;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: black;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

const GithubButton = () => {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg" />
      Continue with Github
    </Button>
  );
};

export default GithubButton;
