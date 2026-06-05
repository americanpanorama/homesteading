import React from "react";
import * as Styled from "./styled";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Hamburger = ({ isOpen, setIsOpen }: Props) => {
  return (
    <Styled.Hamburger
      type="button"
      aria-label={isOpen ? "Close site navigation" : "Open site navigation"}
      aria-expanded={isOpen}
      aria-controls="site-nav-list"
      onClick={() => setIsOpen(current => !current)}
    >
      <span></span>
      <span></span>
      <span></span>
    </Styled.Hamburger>
  );
};

export default Hamburger;
