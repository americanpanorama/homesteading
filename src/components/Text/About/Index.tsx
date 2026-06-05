import React from 'react';
import Sources from '../Sources/Index';
import * as Styled from '../styled';

type AboutSection = 'sources' | 'citation' | 'contact' | 'credits';

const aboutSections: { id: AboutSection; label: string }[] = [
    { id: 'sources', label: 'Sources' },
    { id: 'citation', label: 'Citation' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'credits', label: 'Credits' },
];

const objToday = new Date();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const todayString = `${months[objToday.getMonth()]} ${objToday.getDate()}, ${objToday.getFullYear()}`;

const sendContactForm = (
    evt: React.SyntheticEvent,
    onSuccess: () => void,
) => {
    evt.preventDefault();

    const target = evt.target as typeof evt.target & {
        name: { value: string};
        email: { value: string};
        message: { value: string};
    }

    var xhr = new XMLHttpRequest(),
        params = [
            encodeURIComponent('Form_ID') + '=' + encodeURIComponent('homesteading_contact_us'),
            encodeURIComponent('Owner_ID') + '=' + encodeURIComponent('rnelson2'),
            encodeURIComponent('send_submit') + '=' + encodeURIComponent('data'),
            encodeURIComponent('send_submit_to') + '=' + encodeURIComponent('rnelson2'),
            encodeURIComponent('project') + '=' + encodeURIComponent('homesteading_contact_form'),
            encodeURIComponent('name') + '=' + encodeURIComponent(target.name.value),
            encodeURIComponent('email') + '=' + encodeURIComponent(target.email.value),
            encodeURIComponent('message') + '=' + encodeURIComponent(target.message.value)
        ].join('&');

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            onSuccess();
        }
    };

    xhr.open("POST", 'https://webapps.richmond.edu/URPoster/URPoster.php');
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);

    return false;
}

const About = () => {
    const [activeSection, setActiveSection] = React.useState<AboutSection>('sources');
    const [messageSent, setMessageSent] = React.useState(false);

    const citations = [
        {
            style: 'Chicago',
            citation: <>Julius Wilm, Robert K. Nelson, and Justin Madron, “Homesteading,” <cite>American Panorama</cite>, ed. Robert K. Nelson and Edward L. Ayers, accessed {todayString}, https://dsl.richmond.edu/panorama/homesteading/.</>,
        },
        {
            style: 'APA',
            citation: <>Wilm, J., Nelson, R. K., & Madron, J. (n.d.). Homesteading. In R. K. Nelson & E. L. Ayers (Eds.), <cite>American Panorama</cite>. Digital Scholarship Lab, University of Richmond. Retrieved {todayString}, from https://dsl.richmond.edu/panorama/homesteading/</>,
        },
        {
            style: 'MLA',
            citation: <>Wilm, Julius, Robert K. Nelson, and Justin Madron. “Homesteading.” <cite>American Panorama</cite>, edited by Robert K. Nelson and Edward L. Ayers, Digital Scholarship Lab, University of Richmond, https://dsl.richmond.edu/panorama/homesteading/. Accessed {todayString}.</>,
        },
    ];

    return (
        <React.Fragment>
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

                {activeSection === 'citation' && (
                    <React.Fragment>
                        <h3>Citation</h3>
                        <Styled.CitationGrid>
                            {citations.map(item => (
                                <React.Fragment key={item.style}>
                                    <Styled.CitationStyle>{item.style}</Styled.CitationStyle>
                                    <Styled.CitationText>{item.citation}</Styled.CitationText>
                                </React.Fragment>
                            ))}
                        </Styled.CitationGrid>
                    </React.Fragment>
                )}

                {activeSection === 'contact' && (
                    <Styled.ContactSection>
                        <h3>Contact Us</h3>
                        <Styled.ContactFormContainer>
                            {messageSent ? (
                                <Styled.ContactFormIntro>We have received your message. Thank you for contacting us.</Styled.ContactFormIntro>
                            ) : (
                                <>
                                    <Styled.ContactFormIntro>We very much welcome feedback, comments, and suggestions.</Styled.ContactFormIntro>
                                    <Styled.ContactForm
                                        name='redlining_contact_us'
                                        onSubmit={evt => sendContactForm(evt, () => setMessageSent(true))}
                                    >
                                        <label htmlFor='name'>Name</label>
                                        <input id='name' type='text' maxLength={50} name='name' />
                                        <label htmlFor='email'>Email</label>
                                        <input id='email' type='email' maxLength={50} name='email' />
                                        <label htmlFor='message'>Message</label>
                                        <textarea id='message' name="message" cols={60} />
                                        <input type="submit" value='Send message' />
                                    </Styled.ContactForm>
                                </>
                            )}
                        </Styled.ContactFormContainer>
                    </Styled.ContactSection>
                )}

                {activeSection === 'credits' && (
                    <React.Fragment>
                        <h3>Credits</h3>
                        <p>
                            <strong>Julius Wilm</strong> amassed all of the data and wrote the introduction for <cite>Land Acquisition and Dispossession: Mapping the Homestead Act, 1863-1912</cite>. <strong>Robert K. Nelson</strong> developed and designed the web application. <strong>Justin Madron</strong>, with some assistance from <strong>Nathaniel Ayers</strong>, georectified the General Land Office maps.
                        </p>
                    </React.Fragment>
                )}
            </Styled.AboutPanel>
        </React.Fragment>
    );
};

export default About;
