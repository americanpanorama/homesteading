import React from "react";
import * as Styled from "./styled";
import { useHasIndianLandsTypes } from "../../../../hooks/map";

const IndianLandsLegend = () => {
  const { hasUncededLands, hasReservations, hasOpenRes } = useHasIndianLandsTypes();

  return (
    <Styled.Container>
      <Styled.IndianLandsLabel>Indian Lands</Styled.IndianLandsLabel>
      <Styled.UncededSwatch />
      <Styled.Label $dimmed={!hasUncededLands}>Unceded Lands</Styled.Label>
      <Styled.ReservationSwatch />
      <Styled.Label $dimmed={!hasReservations}>Reservations</Styled.Label>
      <Styled.ReservationOpenedSwatch />
      <Styled.Label $dimmed={!hasOpenRes}>Reservations opened to homesteading</Styled.Label>
    </Styled.Container>
  );
};

export default IndianLandsLegend;
