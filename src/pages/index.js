import * as React from "react";

const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif"
};
const codeStyles = {
  color: "#8A6534",
  padding: 4,
  backgroundColor: "#FFF4DB",
  fontSize: "1.25rem",
  borderRadius: 4
};
const listStyles = {
  marginBottom: 96,
  paddingLeft: 0
};
const listItemStyles = {
  fontWeight: 300,
  fontSize: 24,
  maxWidth: 560,
  marginBottom: 30
};

const linkStyle = {
  color: "#8954A8",
  fontWeight: "bold",
  fontSize: 16,
  verticalAlign: "5%"
};

const descriptionStyle = {
  color: "#232129",
  fontSize: 14,
  marginTop: 10,
  marginBottom: 0,
  lineHeight: 1.25
};

const links = [
  {
    text: "Reduct",
    url: "https://reduct.video",
    description: [
      "Like Google Docs, but for recorded video (of people talking).",
      "Where I spend most of my time these days."
    ],
    color: "#E95800"
  },
  {
    text: "Stanford Design program",
    url: "https://designprogram.stanford.edu/",
    description: [
      "Stanford's graduate program in design.",
      "Where I last spent almost all of my time. :)"
    ],
    color: "#BC027F"
  },
  {
    text: "UNICEF Innovation Labs Kosovo",
    url: "https://www.facebook.com/KosovoInnovations/",
    description: [
      "Youth doing amazing things in Kosovo.",
      "Innovations Lab for UNICEF that I helped kickstart."
    ],
    color: "#1099A8"
  },
  {
    text: "Formhub",
    url: "https://www.youtube.com/watch?v=jqpmMpkIXSQ",
    description: [
      "Mobile data collection platform I helped build at Columbia University.",
      "The project has since shut down, but the code is still available on GitHub."
    ]
  }
];

const IndexPage = () => {
  return (
    <main style={pageStyles}>
      <p>
        <code style={codeStyles}>@prabhasp</code>
      </p>
      <br />
      <br />
      <ul style={listStyles}>
        {links.map(link => (
          <li key={link.url} style={{ ...listItemStyles, color: link.color }}>
            <span>
              <a style={linkStyle} href={link.url}>
                {link.text}
              </a>
              {link.description.map(line => (
                <p key={line} style={descriptionStyle}>
                  {line}
                </p>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default IndexPage;

export const Head = () => <title>Home Page</title>;
