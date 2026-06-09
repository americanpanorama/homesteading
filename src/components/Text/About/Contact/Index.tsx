import React, { useState } from 'react';
import * as Styled from './styled';

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

const ContactUs = () => {
  const [messageSent, setMessageSent] = React.useState(false);
  return (
    <div>
      <h3>Contact Us</h3>
      <div>
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
      </div>
    </div>
  );
};

export default ContactUs;