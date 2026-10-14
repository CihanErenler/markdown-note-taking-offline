import Logo from "./Logo";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const onLightPage = useLocation().pathname === "/about";
  const navigate = useNavigate();

  return (
    <header className="absolute inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-6 sm:px-12 lg:px-24">
      <Link to="/" aria-label="NoteDown home">
        <Logo className={onLightPage ? "text-text" : "text-white"} />
      </Link>
      <nav className="flex items-center gap-6">
        <NavLink
          to="/about"
          className={`text-sm font-medium transition-colors ${
            onLightPage ? "text-mute hover:text-text" : "text-fog hover:text-white"
          }`}
        >
          About
        </NavLink>
        <button
          onClick={() => navigate("/notes")}
          className={`h-9 rounded-lg px-4 text-sm font-medium transition-colors ${
            onLightPage
              ? "bg-text text-surface hover:opacity-85"
              : "border border-white/15 text-white hover:bg-white/10"
          }`}
        >
          Open app
        </button>
      </nav>
    </header>
  );
};

export default Header;
