import React from "react";
import * as Styled from "./styled";
import { useClaimsAndPatentsTypes } from "../../../../hooks";
import Gradient from "./Gradient";

const IndianLandsLegend = () => {
  const { acresLabel } = useClaimsAndPatentsTypes();
  return (
    <Styled.Container>
        <Styled.ColumnTitle>{`Percent of area ${acresLabel}`}</Styled.ColumnTitle>
        <div>
          <Gradient />
        </div>
    </Styled.Container>
  );
};

export default IndianLandsLegend;