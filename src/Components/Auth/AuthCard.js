import React from "react";
import styled from "styled-components";

const AuthCard = ({ children }) => {
  return <StyledAuthCard>{children}</StyledAuthCard>;
};

const StyledAuthCard = styled.div`
  background-color: ${(props) => props.theme.bg1};
  border-radius: 20px;
  position: absolute;
  width: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 30px 30px 30px;
  z-index: 2;
`;

export default AuthCard;
