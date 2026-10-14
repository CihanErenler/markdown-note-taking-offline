import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import {
  BsDownload,
  BsKeyboard,
  BsLink45Deg,
  BsMarkdown,
  BsMoon,
  BsWifiOff,
} from "react-icons/bs";
import Button from "../Components/Button";

const features: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: <BsWifiOff />,
    title: "Works offline",
    text: "Everything is stored in your browser. There is no account to make and no server to wait for.",
  },
  {
    icon: <BsMarkdown />,
    title: "Markdown that renders as you type",
    text: "Tables, task lists and highlighted code blocks show up in the preview straight away.",
  },
  {
    icon: <BsLink45Deg />,
    title: "Notes that link to each other",
    text: "Type [[ to link to another note. Each note lists the notes that point back to it.",
  },
  {
    icon: <BsDownload />,
    title: "Your notes can leave",
    text: "Export everything as a zip of plain .md files, and import it again whenever you like.",
  },
  {
    icon: <BsKeyboard />,
    title: "Fast from the keyboard",
    text: "Press Cmd or Ctrl and K to search, run commands, or jump to any note.",
  },
  {
    icon: <BsMoon />,
    title: "Light and dark",
    text: "It follows your system until you choose a theme yourself.",
  },
];

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <section className="h-full overflow-auto bg-paper px-6 pb-16 pt-28 sm:px-12 lg:px-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">
          A note-taking app that lives on your device
        </h1>
        <p className="mt-5 text-lg leading-8 text-mute">
          NoteDown is built for writing things down quickly in markdown. Your
          notes are saved in your browser, so they stay private, and you can
          take a copy of them any time.
        </p>
      </div>

      <dl className="mt-14 grid max-w-4xl gap-x-2 gap-y-2 sm:grid-cols-2 ">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white p-5 rounded-lg shadow-sm"
          >
            <dt className="flex items-center gap-2.5 font-semibold">
              <span className="text-accent">{feature.icon}</span>
              {feature.title}
            </dt>
            <dd className="mt-1.5 pl-[1.65rem] text-sm leading-6 text-mute">
              {feature.text}
            </dd>
          </div>
        ))}
      </dl>

      <Button className="mt-14" action={() => navigate("/notes")}>
        Start taking notes
      </Button>
    </section>
  );
};

export default AboutPage;
