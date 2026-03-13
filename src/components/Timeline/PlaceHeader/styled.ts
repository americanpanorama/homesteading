import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors } from '../../../Constants';

export const Container = styled.h3`
  background-color: ${colors.insetHeaderBGcolor};
  height: 46px;
  margin: 0;
  font-size: 28px;
`;

export const ClearLink = styled(Link)`
  color: var(--light-color);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
