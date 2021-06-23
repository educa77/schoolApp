import { ProgressBarWrapper, ProgressBar } from "./styles";

export default function Preloader({ maxWidth, height, light, className, inline }) {
    return (
        <ProgressBarWrapper
            className={className}
            maxWidth={maxWidth}
            height={height}
            light={light}
            inline={inline}>
            <ProgressBar light={light} />
        </ProgressBarWrapper>
    );
}
