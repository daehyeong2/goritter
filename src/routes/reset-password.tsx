import React, { useState } from "react";
import {
  Error,
  ErrorMap,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import styled from "styled-components";

const errors: ErrorMap = {
  "auth/invalid-email": "등록되지 않은 계정입니다.",
};

const Message = styled.span`
  font-weight: 600;
  color: #00b894;
  margin-bottom: 3px;
`;

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setEmail(value);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      return;
    }
    setError("");
    setMessage("");
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setMessage("이메일을 전송했습니다.");
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
      <Title>비밀번호 재설정</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          type="email"
          placeholder="재설정할 계정의 이메일을 입력하세요."
          required
          disabled={isLoading}
        />
        {error ? <Error>{error}</Error> : null}
        {message ? <Message>{message}</Message> : null}
        <Input
          type="submit"
          value="이메일 보내기"
          required
          disabled={isLoading}
        />
      </Form>
      <Switcher>
        <Link to="/login">로그인하러 가기 &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
};

export default ResetPassword;
