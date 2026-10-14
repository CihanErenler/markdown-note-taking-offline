import { useNavigate } from "react-router-dom";
import Button from "../Components/Button";
import { LogoMark } from "../Components/Logo";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-5 bg-paper px-6 text-center">
      <LogoMark size={48} />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">This page does not exist</h1>
        <p className="mt-2 text-mute">The link may be old, or the address was typed wrong.</p>
      </div>
      <Button action={() => navigate("/")}>Go back home</Button>
    </div>
  );
};

export default NotFound;
