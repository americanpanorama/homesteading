import styled from "styled-components";
import * as Constants from "../../../Constants";

export const Hamburger = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
    span {
        width: 30px;
        height: 3px;
        background-color: ${Constants.colors.accentColor};
        display: block;
        margin: 3px auto;
        -webkit-transition: all 0.3s ease-in-out;
        -ms-transition: all 0.3s ease-in-out;
        -o-transition: all 0.3s ease-in-out;
        transition: all 0.3s ease-in-out;
    }
    &.is-open {
        span:nth-child(2){
            opacity: 0;
        }
        span:nth-child(1){
            -webkit-transform: translateY(6px) rotate(45deg);
            -ms-transform: translateY(6px) rotate(45deg);
            -o-transform: translateY(6px) rotate(45deg);
            transform: translateY(6px) rotate(45deg);
        }
        span:nth-child(3){
            -webkit-transform: translateY(-6px) rotate(-45deg);
            -ms-transform: translateY(-6px) rotate(-45deg);
            -o-transform: translateY(-6px) rotate(-45deg);
            transform: translateY(-6px) rotate(-45deg);
        }
    }

  @media ${Constants.devices.desktop} {
    display: none;
  }
`;