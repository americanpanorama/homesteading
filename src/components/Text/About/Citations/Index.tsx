import React from "react";
import * as Styled from "./styled";

const objToday = new Date();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const todayString = `${months[objToday.getMonth()]} ${objToday.getDate()}, ${objToday.getFullYear()}`;

type CitationItem = {
  style: string;
  citation: React.ReactNode;
  copyText: string;
};

const copyTextToClipboard = async (text: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};

const Citations = () => {
  const [copiedStyle, setCopiedStyle] = React.useState<string | null>(null);
  const resetTimeout = React.useRef<number | undefined>();

  React.useEffect(() => {
    return () => {
      if (resetTimeout.current) {
        window.clearTimeout(resetTimeout.current);
      }
    };
  }, []);

  const citations: CitationItem[] = [
    {
      style: "Chicago",
      citation: (
        <>
          Julius Wilm, Robert K. Nelson, and Justin Madron, “Homesteading,” <cite>American Panorama</cite>, ed. Robert K. Nelson and Edward L. Ayers, accessed {todayString}, https://dsl.richmond.edu/panorama/homesteading/.
        </>
      ),
      copyText: `Julius Wilm, Robert K. Nelson, and Justin Madron, “Homesteading,” American Panorama, ed. Robert K. Nelson and Edward L. Ayers, accessed ${todayString}, https://dsl.richmond.edu/panorama/homesteading/.`,
    },
    {
      style: "APA",
      citation: (
        <>
          Wilm, J., Nelson, R. K., & Madron, J. (n.d.). Homesteading. In R. K. Nelson & E. L. Ayers (Eds.), <cite>American Panorama</cite>. Digital Scholarship Lab, University of Richmond. Retrieved {todayString}, from https://dsl.richmond.edu/panorama/homesteading/
        </>
      ),
      copyText: `Wilm, J., Nelson, R. K., & Madron, J. (n.d.). Homesteading. In R. K. Nelson & E. L. Ayers (Eds.), American Panorama. Digital Scholarship Lab, University of Richmond. Retrieved ${todayString}, from https://dsl.richmond.edu/panorama/homesteading/`,
    },
    {
      style: "MLA",
      citation: (
        <>
          Wilm, Julius, Robert K. Nelson, and Justin Madron. “Homesteading.” <cite>American Panorama</cite>, edited by Robert K. Nelson and Edward L. Ayers, Digital Scholarship Lab, University of Richmond, https://dsl.richmond.edu/panorama/homesteading/. Accessed {todayString}.
        </>
      ),
      copyText: `Wilm, Julius, Robert K. Nelson, and Justin Madron. “Homesteading.” American Panorama, edited by Robert K. Nelson and Edward L. Ayers, Digital Scholarship Lab, University of Richmond, https://dsl.richmond.edu/panorama/homesteading/. Accessed ${todayString}.`,
    },
  ];

  const handleCopyCitation = async (item: CitationItem) => {
    await copyTextToClipboard(item.copyText);
    setCopiedStyle(item.style);

    if (resetTimeout.current) {
      window.clearTimeout(resetTimeout.current);
    }

    resetTimeout.current = window.setTimeout(() => {
      setCopiedStyle(null);
    }, 2000);
  };

  return (
    <React.Fragment>
      <h3>Citation</h3>
      <Styled.CitationGrid>
        {citations.map(item => (
          <React.Fragment key={item.style}>
            <Styled.CitationStyle>{item.style}</Styled.CitationStyle>
            <Styled.CitationText>{item.citation}</Styled.CitationText>
            <Styled.CitationAction>
              <Styled.CopyButton
                type="button"
                aria-label={`Copy ${item.style} citation`}
                title={copiedStyle === item.style ? 'Copied' : `Copy ${item.style} citation`}
                $copied={copiedStyle === item.style}
                onClick={() => handleCopyCitation(item)}
              >
                {copiedStyle === item.style ? (
                  <Styled.CopyIcon viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </Styled.CopyIcon>
                ) : (
                  <Styled.CopyIcon viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="9" y="9" width="11" height="11" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </Styled.CopyIcon>
                )}
              </Styled.CopyButton>
            </Styled.CitationAction>
          </React.Fragment>
        ))}
      </Styled.CitationGrid>
    </React.Fragment>
  );
};

export default Citations;
