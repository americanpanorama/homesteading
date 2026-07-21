import styled from 'styled-components';
import * as Constants from '../../../Constants';

export const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 14px;
  padding: 16px 0;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  color: ${Constants.colors.lightColor};
  font-family: ${Constants.fonts.sansSerif};
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const Select = styled.select`
  min-height: 38px;
  max-width: 260px;
  border: 1px solid rgba(0, 0, 0, 0.24);
  border-radius: 4px;
  padding: 0 32px 0 10px;
  background-color: ${Constants.colors.whiteColor};
  color: ${Constants.colors.lightColor};
  font-family: ${Constants.fonts.sansSerif};
  font-size: 1rem;
`;

export const ToggleRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  color: ${Constants.colors.lightColor};
  font-family: ${Constants.fonts.sansSerif};
  font-size: 0.95rem;
`;

export const ToggleInput = styled.input`
  width: 18px;
  height: 18px;
  margin: 0;
`;

export const ToggleText = styled.span`
  line-height: 1.2;
`;

export const DownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  box-sizing: border-box;
  border: 0;
  border-radius: 4px;
  padding: 0 14px;
  background: ${Constants.colors.accentColor};
  color: ${Constants.colors.whiteColor};
  font-family: ${Constants.fonts.sansSerif};
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
`;
