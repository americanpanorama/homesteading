import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as Constants from '../Constants';

export const MobileDrawer = styled.div<{ $open: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 12000;
  display: flex;
  flex-direction: column;
  max-height: min(78vh, calc(100vh - 116px));
  background-color: rgba(255, 255, 250, 0.98);
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.14);
  transform: translateY(${({ $open }) => ($open ? '0' : '102%')});
  transition: transform 240ms ease;
  overflow: hidden;
`;

export const MobileDrawerHeader = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 16px 0;
`;

export const MobileDrawerHandle = styled.div`
  width: 44px;
  height: 5px;
  border-radius: 999px;
  background-color: rgba(0, 0, 0, 0.2);
`;

export const MobileDrawerContent = styled.div`
  overflow-y: auto;
  padding: 8px 16px calc(152px + env(safe-area-inset-bottom));
`;

export const MobileBottomBar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 12500;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: linear-gradient(to top, rgba(255, 255, 250, 0.98), rgba(255, 255, 250, 0.94));
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.08);
`;

export const MobileBottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const MobilePrimaryButton = styled.button`
  flex: 1 1 auto;
  min-width: 0;
  border: 0;
  border-radius: 999px;
  padding: 12px 18px;
  background-color: ${Constants.colors.accentColor};
  color: ${Constants.colors.whiteColor};
  font-family: ${Constants.fonts.sansSerif};
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
`;

export const MobileSelectionCard = styled.div`
  display: grid;
  gap: 8px;
  padding: 10px 5px;
  background-color: rgba(255, 255, 255, 0.96);
`;

export const MobileSelectionActions = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 8px;
`;

const MobileActionBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  border-radius: 999px;
  font-family: ${Constants.fonts.sansSerif};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1;
  text-decoration: none;
  text-transform: uppercase;
`;

export const MobileBackLink = styled(Link)`
  ${MobileActionBase}
  flex: 0 0 auto;
  min-width: 0;
  justify-content: flex-start;
  padding: 0 14px;
  border: 1px solid rgba(0, 0, 0, 0.14);
  background-color: rgba(255, 255, 255, 0.98);
  color: ${Constants.colors.lightColor};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const MobileActionButton = styled.button`
  ${MobileActionBase}
  flex: 0 0 auto;
  padding: 0 16px;
  border: 0;
  background-color: ${Constants.colors.accentColor};
  color: ${Constants.colors.whiteColor};
  cursor: pointer;
`;

export const MobileSelectionTitle = styled.h2`
  margin: 0;
  color: ${Constants.colors.lightColor};
  font-family: ${Constants.fonts.sansSerif};
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.05;
`;

export const MobileSelectionSummary = styled.p`
  margin: 0;
  color: ${Constants.colors.lightColor};
  font-family: ${Constants.fonts.sansSerif};
  font-size: 0.82rem;
  line-height: 1.18;
`;
