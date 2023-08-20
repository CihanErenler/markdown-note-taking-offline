import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Header from "../Components/Header";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { useEditorContext } from "../Context/EditorContext";
import { toast } from "react-toastify";

const RootLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchData, clearState } = useEditorContext();

  return (
    <StyledRootElement>
      {location.pathname !== "/notes" ? <Header /> : ""}
      <main>
        <Outlet />
      </main>
    </StyledRootElement>
  );
};

const StyledRootElement = styled.section`
  main {
    height: 100vh;
  }
`;

export default RootLayout;
