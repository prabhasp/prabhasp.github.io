import * as React from "react";
import styled from "styled-components";
import "../global.css";

const Main = styled.main`
  color: #232129;
  padding: 96px;
  font-family: -apple-system, Roboto, sans-serif, serif;
`;
const Code = styled.code`
  color: #8a6534;
  padding: 4px;
  background-color: #fff4db;
  font-size: 1.25rem;
  border-radius: 4px;
  padding: 20px;
  margin-left: -20px;
`;
const List = styled.ul`
  margin-bottom: 96px;
  padding-left: 0;
`;
const ListItem = styled.li`
  font-weight: 300;
  font-size: 24px;
  max-width: 560px;
  margin-bottom: 30px;
`;
const Link = styled.a`
  color: #8954a8;
  font-weight: bold;
  font-size: 16px;
  vertical-align: 5%;
`;
const Description = styled.p`
  color: #232129;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 0;
  line-height: 1.25;
`;

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
    <Main>
      <Code>@prabhasp </Code>
      <br />
      <br />
      <List>
        {links.map(link => (
          <ListItem key={link.url} style={{ color: link.color }}>
            <Link href={link.url}>{link.text}</Link>
            {link.description.map(line => (
              <Description key={line}>{line}</Description>
            ))}
          </ListItem>
        ))}
      </List>
    </Main>
  );
};

export default IndexPage;

export const Head = () => <title>Home Page</title>;
