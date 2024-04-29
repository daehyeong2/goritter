import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Error,
  ErrorMap,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";
import GithubButton from "../components/github-btn";

const errors: ErrorMap = {
  "auth/email-already-in-use": "이미 존재하는 이메일입니다.",
  "auth/weak-password": "비밀번호의 길이는 6자리 이상이어야 합니다.",
};

const CreateAccount = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(credentials.user, { displayName: name });
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(errors[e.code]);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>Join 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          required
          disabled={isLoading}
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
          disabled={isLoading}
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
          disabled={isLoading}
        />
        {error ? <Error>{error}</Error> : null}
        <Input
          type="submit"
          value={isLoading ? "계정 생성 중.." : "계정 생성하기"}
          disabled={isLoading}
        />
      </Form>
      <Switcher>
        이미 계정이 있으신가요?{" "}
        <Link to="/login">계정에 로그인 하세요 &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
};

export default CreateAccount;
