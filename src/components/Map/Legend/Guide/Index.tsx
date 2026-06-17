import React, { useRef, useContext, useState } from 'react';
import ArrowLeft from '../../../Buttons/ArrowLeft';
import ControllingTheMap from './Sections/ControllingtheMap/Index';
import Definitions from './Sections/Definitions';
import Districts from './Sections/Districts';
import * as Styled from './styled';
import {DimensionsContext} from '../../../../DimensionsContext';

const Guide = ({ setIsGuideOpen }: { setIsGuideOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const definitionsRef = useRef<HTMLDivElement>(null);
  const controllingTheMapRef = useRef<HTMLDivElement>(null);
  const districtsRef = useRef<HTMLDivElement>(null);
  const dimensions = useContext(DimensionsContext);

  const scrollIntoView = (ref: React.RefObject<HTMLDivElement>) => {
    const content = contentRef.current;
    const section = ref.current;

    if (content && section) {
      const top = section.getBoundingClientRect().top
        - content.getBoundingClientRect().top
        + content.scrollTop;

      content.scrollTo({ top, behavior: "smooth" });
    }
  };

  const [activeMenuItem, setActiveMenuItem] = useState<'definitions' | 'controllingTheMap' | 'districts' | null>(null);

  return (
    <Styled.Container>
        <Styled.Menu>
        <Styled.CloseMenu
          onClick={() => {
            setIsGuideOpen(false);
          }}
        >
          <ArrowLeft /> Close
        </Styled.CloseMenu>
        <Styled.MenuItem $active={activeMenuItem === 'definitions'} onClick={() => { scrollIntoView(definitionsRef); setActiveMenuItem('definitions'); }}>Definitions</Styled.MenuItem>
        <Styled.MenuItem $active={activeMenuItem === 'controllingTheMap'} onClick={() => { scrollIntoView(controllingTheMapRef); setActiveMenuItem('controllingTheMap'); }}>Controlling the map</Styled.MenuItem>
          <Styled.MenuItem $active={activeMenuItem === 'districts'} onClick={() => { scrollIntoView(districtsRef); setActiveMenuItem('districts'); }}>Homesteading Activity in a district, state, or territory</Styled.MenuItem>
        </Styled.Menu>

      <Styled.Content ref={contentRef} $mapHeight={dimensions.mapDimensions.height}>
        {dimensions.isMobile && (
          <Styled.CloseMenu onClick={() => setIsGuideOpen(false)}>
              <ArrowLeft /> Close
            </Styled.CloseMenu>
        )}
        <Styled.SectionContainer
          $active={!activeMenuItem || activeMenuItem === 'definitions'}
          ref={definitionsRef}
        >
          <Definitions />
        </Styled.SectionContainer>
        <Styled.SectionContainer
          $active={!activeMenuItem || activeMenuItem === 'controllingTheMap'}
          ref={controllingTheMapRef}
        >
          <ControllingTheMap />
        </Styled.SectionContainer>
        <Styled.SectionContainer
          $active={!activeMenuItem || activeMenuItem === 'districts'}
          ref={districtsRef}
        >
          <Districts />
        </Styled.SectionContainer>

      </Styled.Content>
    </Styled.Container>
  );
}

export default Guide;
