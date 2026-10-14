import { BsCheck2 } from "react-icons/bs";
import { useNavigate } from "react-router";
import Button from "../Components/Button";
import HeroDemo from "../Components/HeroDemo";

const promises = ["Works offline", "No account", "Notes stay on this device"];

const gridLines =
  "[background-image:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_30%_20%,black,transparent_70%)]";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-full overflow-auto bg-ink-abyss text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 ${gridLines}`} />
        <div className="absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-accent/30 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-spark/10 blur-[110px]" />
      </div>

      <div className="relative grid min-h-full items-center gap-14 px-6 pb-16 pt-28 sm:px-12 lg:grid-cols-[1fr_1.1fr] lg:px-24">
        <div className="max-w-xl">
          <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Write down what you think
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-fog">
            NoteDown is a markdown note-taking app that helps you take notes quickly. It renders
            markdown in real time, so you see what you write as you write it.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button variant="hero" action={() => navigate("/notes")}>
              Start taking note
            </Button>
            <button
              onClick={() => navigate("/about")}
              className="h-12 rounded-lg px-4 text-base font-medium text-fog transition-colors hover:text-white"
            >
              How it works
            </button>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fog">
            {promises.map((promise) => (
              <li key={promise} className="flex items-center gap-1.5">
                <BsCheck2 className="text-spark" />
                {promise}
              </li>
            ))}
          </ul>
        </div>

        <HeroDemo />
      </div>
    </div>
  );
};

export default WelcomePage;
