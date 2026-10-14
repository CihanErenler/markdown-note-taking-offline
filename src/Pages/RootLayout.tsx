import { Outlet, useLocation } from "react-router";
import Header from "../Components/Header";

const RootLayout = () => {
  const location = useLocation();

  return (
    <section>
      {location.pathname !== "/notes" ? <Header /> : ""}
      <main className="h-screen print:h-auto">
        <Outlet />
      </main>
    </section>
  );
};

export default RootLayout;
