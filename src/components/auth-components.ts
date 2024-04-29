import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0;
`;

export const Title = styled.h1`
  font-size: 42px;
`;

export const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 15px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    border: 1px solid white;
    background-color: rgba(255, 255, 255, 0.05);
    color: white;
    &:hover {
      opacity: 0.85;
    }
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
  margin-bottom: 3px;
`;

export const Switcher = styled.span`
  font-size: 14px;
  margin-bottom: 8px;
  a {
    color: #0984e3;
    text-align: left;
    &:hover {
      text-decoration: none;
    }
  }
`;

export interface ErrorMap {
  [key: string]: string;
}
