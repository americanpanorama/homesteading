import React from "react";
import * as Styled from "./styled";

interface TooltipProps {
  text: string;
}

const Tooltip = ({ text }: TooltipProps) => {
  const [open, setOpen] = React.useState(false);
  const tooltipId = React.useId();
  const hasText = text.trim().length > 0;

  return (
    <Styled.Container>
      <Styled.IconButton
        type="button"
        aria-label="More information"
        aria-describedby={hasText ? tooltipId : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
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
