import React from "react";
import * as Styled from "./styled";

interface TooltipProps {
  text: string | React.ReactNode;
}

const Tooltip = ({ text }: TooltipProps) => {
  const [open, setOpen] = React.useState(false);
  const closeTimeoutRef = React.useRef<number | undefined>();
  const pointerInsideRef = React.useRef(false);
  const focusInsideRef = React.useRef(false);
  const tooltipId = React.useId();
  const hasText = typeof text === "string" ? text.trim().length > 0 : !!text;

  const clearCloseTimeout = () => {
    if (typeof closeTimeoutRef.current !== "undefined") {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = undefined;
    }
  };

  const openTooltip = () => {
    clearCloseTimeout();
    setOpen(true);
  };

  const scheduleCloseTooltip = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      if (!pointerInsideRef.current && !focusInsideRef.current) {
        setOpen(false);
      }
      closeTimeoutRef.current = undefined;
    }, 150);
  };

  React.useEffect(() => () => clearCloseTimeout(), []);

  return (
    <Styled.Container
      onMouseEnter={() => {
        pointerInsideRef.current = true;
        openTooltip();
      }}
      onMouseLeave={() => {
        pointerInsideRef.current = false;
        scheduleCloseTooltip();
      }}
      onFocusCapture={() => {
        focusInsideRef.current = true;
        openTooltip();
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          focusInsideRef.current = false;
          scheduleCloseTooltip();
        }
      }}
    >
      <Styled.IconButton
        type="button"
        aria-label="More information"
        aria-describedby={hasText ? tooltipId : undefined}
      >
        i
      </Styled.IconButton>
      {hasText && (
        <Styled.Bubble
          id={tooltipId}
          role="tooltip"
          $open={open}
        >
          {text}
        </Styled.Bubble>
      )}
    </Styled.Container>
  );
};

export default Tooltip;
