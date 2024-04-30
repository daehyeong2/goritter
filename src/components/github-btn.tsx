import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Error, ErrorMap } from "./auth-components";
import { useState } from "react";
import { FirebaseError } from "firebase/app";

const errors: ErrorMap = {
  "auth/account-exists-with-different-credential":
    "다른 방식으로 생성된 계정이 이미 존재합니다.",
};

const Button = styled.span`
  margin-top: 20px;
  margin-bottom: 10px;
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
  const [error, setError] = useState("");
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(errors[e.code]);
      }
    }
  };
  return (
    <>
      <Button onClick={onClick}>
        <Logo src="/github-logo.svg" />
        Continue with Github
      </Button>
      <Error>{error}</Error>
    </>
  );
};

export default GithubButton;
