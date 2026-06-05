import React from 'react';
import { Link } from 'react-router-dom';
import * as Styled from './styled';

const Masthead = () => {
  return (
    <Styled.Container data-phone-chrome='masthead'>
      <Link to='/'>
        <h1>
          <Styled.Acquisition>Land Acquisition</Styled.Acquisition>
          <Styled.And>&</Styled.And>
          <Styled.Dispossession>Dispossession</Styled.Dispossession>
        </h1>
      </Link>
    </Styled.Container>
  );
}

export default Masthead;
