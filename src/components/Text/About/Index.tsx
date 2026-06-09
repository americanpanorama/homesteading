import React from 'react';
import Sources from './Sources/Index';
import * as Styled from './styled';
import Citations from './Citations/Index';
import ContactUs from './Contact/Index';
import Credits from './Credits/Index';

type AboutSection = 'sources' | 'citation' | 'contact' | 'credits';

const aboutSections: { id: AboutSection; label: string }[] = [
    { id: 'sources', label: 'Sources' },
    { id: 'citation', label: 'Citation' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'credits', label: 'Credits' },
];

const About = () => {
    const [activeSection, setActiveSection] = React.useState<AboutSection>('sources');

    return (
        <Styled.LongformContainer id='main-content'>
            <Styled.AboutMenu role='tablist' aria-label='About sections'>
                {aboutSections.map(section => {
                    const selected = activeSection === section.id;

                    return (
                        <Styled.AboutMenuButton
                            key={section.id}
                            id={`about-tab-${section.id}`}
                            type='button'
                            role='tab'
                            aria-selected={selected}
                            aria-controls={`about-panel-${section.id}`}
                            $selected={selected}
                            onClick={() => setActiveSection(section.id)}
                        >
                            {section.label}
                        </Styled.AboutMenuButton>
                    );
                })}
            </Styled.AboutMenu>

            <Styled.AboutPanel
                id={`about-panel-${activeSection}`}
                role='tabpanel'
                aria-labelledby={`about-tab-${activeSection}`}
            >
                {activeSection === 'sources' && <Sources />}
                {activeSection === 'citation' && <Citations />}
                {activeSection === 'contact' && <ContactUs />}
                {activeSection === 'credits' && <Credits />}
            </Styled.AboutPanel>
        </Styled.LongformContainer>
    );
};

export default About;
