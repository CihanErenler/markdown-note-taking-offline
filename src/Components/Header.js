import React from "react";
import styled from "styled-components";
import logoLight from "../Assets/logo-light.svg";
import logo from "../Assets/logo.svg";
import { Link, NavLink, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  return (
    <StyledHeader pathname={location.pathname}>
      <Link to="/">
        <img
          src={location.pathname === "/about" ? logo : logoLight}
          alt="header-logo"
        />
      </Link>
      <nav className="navigation">
        <ul className="navbar-list">
          <li className="navbar-list-item">
            <NavLink to="/about">About</NavLink>
          </li>
        </ul>
      </nav>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  padding: 0 100px;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  height: 60px;
  position: absolute;
  border-bottom: 1px solid
    ${(props) =>
      props.pathname === "/" ||
      props.pathname === "/login" ||
      props.pathname === "/register" ||
      props.pathname === "/about"
        ? "transparent"
        : props.theme.inputBorder};
  z-index: 9999;

  .navbar-list {
    list-style: none;
    display: flex;
    align-items: center;
  }

  img {
    width: 150px;
  }

  a {
    text-decoration: none;
    font-weight: 500;
    color: ${(props) =>
      props.pathname === "/about" ? props.theme.textColor : props.theme.bg1};
    transition: all 0.3s ease;

    :last-child {
      padding-left: 40px;
    }

    :hover {
      color: ${(props) => props.theme.primary};
    }
  }
`;

export default Header;
