import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useEditorContext } from "../Context/EditorContext";
import remarkGfm from "remark-gfm";
import styled from "styled-components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import dark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";
import { BsFullscreenExit, BsFullscreen } from "react-icons/bs";

const Preview = () => {
  const {
    code,
    fullscreen,
    toggleFullscreen,
    handleScroll,
    scrollPercentage,
    scrollingView,
    setScrollingView,
  } = useEditorContext();
  const previewRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && scrollingView === "edit") {
      previewRef.current.scrollTop =
        (contentRef.current.offsetHeight / 100) * scrollPercentage;
    }
  }, [scrollPercentage]);

  useEffect(() => {
    const handleOnScroll = (e) => {
      if (scrollingView !== "preview") {
        setScrollingView("preview");
      }
      const topValue = e.target.scrollTop;
      const percentage = (topValue / contentRef.current.offsetHeight) * 100;
      handleScroll(percentage);
    };

    const handleMouseEnter = () => {
      previewRef.current.addEventListener("scroll", handleOnScroll);
    };

    const handleMouseLeave = () => {
      previewRef.current.removeEventListener("scroll", handleOnScroll);
    };

    previewRef.current.addEventListener("mouseenter", handleMouseEnter);
    previewRef.current.addEventListener("mouseleave", handleMouseLeave);
  }, []);

  return (
    <StyledPreview ref={previewRef}>
      <section ref={contentRef}>
        <span
          className="toggle-btn"
          onClick={() => toggleFullscreen("preview")}
        >
          {fullscreen !== "preview" ? (
            <BsFullscreen size={16} />
          ) : (
            <BsFullscreenExit size={16} />
          )}
        </span>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, "")}
                  style={dark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {code.code}
        </ReactMarkdown>
      </section>
    </StyledPreview>
  );
};

const StyledPreview = styled.div`
  padding: 20px;
  font-size: 14px;
  height: calc(100vh - 55px);
  overflow: auto;
  position: relative;

  .toggle-btn {
    background-color: ${(props) => props.theme.bg1};
    border: 1px solid #e3e0e0;
    border-radius: 4px;
    position: fixed;
    top: 60px;
    right: 5px;
    z-index: 99;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    :hover {
      border-color: ${(props) => props.theme.textSelect};
      background-color: ${(props) => props.theme.bg3};
      color: ${(props) => props.theme.textSelect};
    }

    ::before {
      position: absolute;
      content: "Toggle Fullscreen";
      top: 3px;
      left: -125px;
      background-color: ${(props) => props.theme.sidebarBg};
      color: ${(props) => props.theme.bg1};
      padding: 4px;
      border-radius: 4px;
      visibility: hidden;
      opacity: 0;
      transition: all 0.5s ease;
      transition-delay: 1s;
      font-size: 12px;
      display: block;
      width: 120px;
      text-align: center;
    }

    :hover::before {
      visibility: visible;
      opacity: 1;
    }
  }

  a {
    text-decoration: none;
    color: ${(prosp) => prosp.theme.primary};
  }

  p,
  hr,
  ul,
  ol,
  blockquote {
    margin-bottom: 10px;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  h3 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  h4 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  h5 {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }

  h6 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  ol,
  ul {
    padding: 20px 20px 0 20px;
  }

  hr {
    border: 0.1px solid ${(props) => props.theme.inputBorder};
  }

  pre {
    background-color: #f7f7f7;
    border: 1px solid #ddd;
    padding: 10px;
    overflow: auto;
    font-family: Consolas, Monaco, monospace;
    margin-bottom: 6px;
    border-radius: 6px;
  }

  blockquote {
    background-color: #f4f4f4;
    border-left: 4px solid #3498db;
    padding: 10px;
    margin: 10px 0;
    background-color: #f7f7f7;
    font-style: italic;
  }

  img {
    max-width: 35%;
  }

  blockquote p {
    margin-bottom: 0;
  }

  blockquote h1 {
    margin-bottom: 0;
  }
  blockquote h2 {
    margin-bottom: 0;
  }
  blockquote h3 {
    margin-bottom: 0;
  }
  blockquote h4 {
    margin-bottom: 0;
  }
  blockquote h5 {
    margin-bottom: 0;
  }
  blockquote h6 {
    margin-bottom: 0;
  }

  /* Reset some default styles */
  table {
    border-collapse: collapse;
    width: 100%;
    max-width: 800px; /* Set a maximum width for responsiveness */
    margin: 0 auto;
  }

  table,
  th,
  td {
    border: 1px solid #e0e0e0;
  }

  /* Header Row */
  th {
    background-color: #f5f5f5;
    color: #333;
    font-weight: bold;
    padding: 10px;
    text-align: left;
  }

  /* Alternate Row Colors */
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  /* Cells */
  td {
    padding: 10px;
  }

  /* Hover Effect */
  tr:hover {
    background-color: #e0e0e0;
  }

  /* Responsive Styling */
  @media (max-width: 600px) {
    table {
      border: 0;
      width: 100%;
    }
    table,
    th,
    td {
      border: none;
    }
    th,
    td {
      padding: 8px;
      display: block;
      text-align: center;
    }
    th {
      font-weight: bold;
      border-bottom: 1px solid #ccc;
    }
  }

  .task-list-item {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 6px;

    input[type="checkbox"] {
      display: flex;
      align-items: center;
      width: 22px;
      margin-right: 10px;
      position: relative;

      ::before {
        display: block;
        content: "";
        width: 20px;
        height: 20px;
        border: 1px solid ${(props) => props.theme.textColorLighter};
        border-radius: 3px;
        background-color: ${(props) => props.theme.bg2};
      }

      :checked {
        ::before {
          background-color: dodgerblue;
          border-color: dodgerblue;
        }

        ::after {
          content: "";
          position: absolute;
          height: 13px;
          width: 7px;
          top: 50%;
          left: 5px;
          border-bottom: 3px solid #fff;
          border-right: 3px solid #fff;
          transform: rotate(45deg) translate(-50%, -50%);
        }
      }
    }
  }

  pre > div {
    border-radius: 8px;
    font-size: 14px;
  }
`;

export default Preview;
