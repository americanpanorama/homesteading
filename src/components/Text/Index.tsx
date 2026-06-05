import React from 'react';
import { useURLParams } from '../../hooks';
import { TextType } from '../../index.d';
import About from './About/Index';
import IndigenousDispossession from './IndigenousDispossession/Index';
import Introduction from './Introduction/Index';
import * as Styled from './styled';

const textComponents: { [index in TextType]: React.ReactElement } = {
    about: <About />,
    dispossession: <IndigenousDispossession />,
    introduction: <Introduction />,
    sources: <About />,
};

const Text = () => {
    const { text } = useURLParams();
    const activeText: TextType = (text as TextType) || 'introduction';

    return (
        <Styled.LongformContainer id='main-content'>
            {textComponents[activeText]}
        </Styled.LongformContainer>
    );
};

export default Text;
