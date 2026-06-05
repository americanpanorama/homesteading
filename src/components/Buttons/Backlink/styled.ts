import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as Constants from '../../../Constants';

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid ${Constants.colors.accentColor};
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  color: ${Constants.colors.accentColor};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700 !important;

  &:hover {
    background-color: ${Constants.colors.accentColor};
    color: ${Constants.colors.whiteColor};
    border-color: ${Constants.colors.accentColor};
  }
`;