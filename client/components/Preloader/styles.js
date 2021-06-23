import styled, { keyframes } from "styled-components";
import { colors } from "../../styles/Theme";

export const ProgressBarWrapper = styled.article`
    overflow: hidden;
    width: 100%;
    max-width: ${({ maxWidth }) => (maxWidth > 0 ? maxWidth + "px" : "100%")};
    height: ${({ height }) => (height > 0 ? height + "px" : "4px")};
    background-color: ${({ light }) => (light ? "rgba(255,255,255,0.5)" : colors.darkGray)};
    display: ${({ inline }) => (inline ? "inline-block" : "block")};
    margin: ${({ inline }) => (inline ? "0" : "20px auto")};
`;

const ProgressAnimationSmall = keyframes`
    0% { left: -100%; width: 100%; }
    100% { left: 100%; width: 10%; }
`;
const ProgressAnimationLarge = keyframes`
    0% { left: -150%; width: 100%; }
    100% { left: 100%; width: 10%; }
`;

export const ProgressBar = styled.div`
    position: relative;
    width: 100%;
    height: 100%;

    &:before {
        content: "";
        position: absolute;
        height: 100%;
        background-color: ${(props) => (props.light ? colors.white : colors.red)};
        animation: ${ProgressAnimationSmall} 1.5s infinite ease-out;
    }

    &:after {
        content: "";
        position: absolute;
        height: 100%;
        background-color: ${(props) => (props.light ? colors.white : colors.red)};
        animation: ${ProgressAnimationLarge} 1.5s infinite ease-in;
    }
`;
