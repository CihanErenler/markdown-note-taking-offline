import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { BiShow, BiHide } from "react-icons/bi";
import { BiSearchAlt2 } from "react-icons/bi";
import { useEditorContext } from "../Context/EditorContext";

const Input = ({
  value,
  action,
  placeholder,
  disabled,
  focused,
  type,
  name,
  danger,
}) => {
  const [showPass, setShowPass] = useState(false);
  const input = useRef(null);
  const { toggleSearch } = useEditorContext();

  useEffect(() => {
    if (focused) {
      input.current.select();
    }
  }, [focused]);

  return (
    <StyledInput type={type}>
      <div className="input-wrapper">
        <input
          ref={input}
          value={value}
          className={danger ? "danger" : ""}
          name={name}
          onChange={action}
          placeholder={placeholder}
          disabled={disabled}
          type="text"
          suggested="current-password"
          onFocus={() => toggleSearch(true)}
          onBlur={() => toggleSearch(false)}
        />
        {type === "password" ? (
          <span onClick={() => setShowPass(!showPass)}>
            {!showPass ? (
              <BiHide size={26} color="gray" />
            ) : (
              <BiShow size={26} color="gray" />
            )}
          </span>
        ) : (
          ""
        )}
        {type === "search" ? (
          <span className="search-icon" onClick={() => setShowPass(!showPass)}>
            <BiSearchAlt2 size={22} color="gray" />
          </span>
        ) : (
          ""
        )}
      </div>
    </StyledInput>
  );
};

const StyledInput = styled.div`
  .input-wrapper {
    position: relative;
    margin-bottom: 20px;

    span {
    }

    input {
      border: 1px solid ${(props) => props.theme.inputBorder};
      height: ${(props) => (props.type === "search" ? "30px" : "45px")};
      width: 100%;
      border-radius: 6px;
      padding: 0 40px 0 12px;
      font-size: 15px;
      transition: all 0.3s ease;
      background-color: ${(props) =>
        props.type === "search" ? props.theme.bg1 : props.theme.inputBg};

      ::-moz-selection {
        color: ${(props) => props.theme.bg1};
        background: ${(props) => props.theme.primary};
      }

      ::selection {
        color: ${(props) => props.theme.bg1};
        background: ${(props) => props.theme.primary};
      }

      :focus {
        outline: none;
        border-color: ${(props) => props.theme.primary};
        box-shadow: 0px 0px 0px 3px ${(props) => props.theme.inputBorderFocus};
        background-color: ${(props) =>
          props.type === "search" ? props.theme.bg1 : props.theme.inputBg};
      }

      ::placeholder {
        font-size: ${(props) => (props.type === "search" ? "14px" : "16px")};
      }
    }

    .danger {
      border-color: red !important;
    }
  }

  span.search-icon {
    background-color: #eee;
    height: 28px;
    width: 29px;
    cursor: pointer;
    position: absolute;
    top: 50%;
    right: 1px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0 6px 6px 0;
  }
`;

export default Input;
