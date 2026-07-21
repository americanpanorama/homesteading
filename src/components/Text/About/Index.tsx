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
    const tabRefs = React.useRef<Record<AboutSection, HTMLButtonElement | null>>({
        sources: null,
        citation: null,
        contact: null,
        credits: null,
    });

    const selectSection = (section: AboutSection, focus = false) => {
        setActiveSection(section);

        if (focus) {
            window.requestAnimationFrame(() => {
                tabRefs.current[section]?.focus();
            });
        }
    };

    const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, section: AboutSection) => {
        const currentIndex = aboutSections.findIndex(item => item.id === section);
        let nextIndex = currentIndex;

        if (event.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % aboutSections.length;
        } else if (event.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + aboutSections.length) % aboutSections.length;
        } else if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = aboutSections.length - 1;
        } else {
            return;
        }

        event.preventDefault();
        selectSection(aboutSections[nextIndex].id, true);
    };

    return (
        <Styled.LongformContainer id='main-content'>
            <Styled.AboutMenu role='tablist' aria-label='About sections'>
                {aboutSections.map(section => {
                    const selected = activeSection === section.id;

                    return (
                        <Styled.AboutMenuButton
                            key={section.id}
                            id={`about-tab-${section.id}`}
                            ref={element => {
                                tabRefs.current[section.id] = element;
                            }}
                            type='button'
                            role='tab'
                            aria-selected={selected}
                            aria-controls={`about-panel-${section.id}`}
                            tabIndex={selected ? 0 : -1}
                            $selected={selected}
                            onClick={() => selectSection(section.id)}
                            onKeyDown={event => handleTabKeyDown(event, section.id)}
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
                tabIndex={0}
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
