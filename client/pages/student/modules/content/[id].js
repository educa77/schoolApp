import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

import { useLazyQuery } from "@apollo/client";
import { CONTENT_ID } from "../../../../apollo/querys/contents";

const ContentDetailStudent = () => {
  const router = useRouter();
  const { id } = router.query;
  const [readme, setReadme] = useState("### Escribe el Readme");
  const [values, setValues] = useState({
    topicName: "",
    durationTime: "",
    moduleId: 0,
    link: "",
  });
  const [selectedTab, setSelectedTab] = useState("preview");
  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });
  const { link } = values;

  const [execute, { data }] = useLazyQuery(CONTENT_ID);

  useEffect(() => {
    if (id) {
      execute({ variables: { id: parseInt(id) } });
    }
  }, [execute, id]);

  useEffect(() => {
    if (id) {
      if (data) {
        setReadme(data.contents[0].readme);
        setValues((state) => {
          return {
            ...state,
            link: data.contents[0]?.lessons[0]?.link,
            topicName: data.contents[0]?.topicName,
            durationTime: data.contents[0]?.durationTime,
            moduleId: data.contents[0]?.moduleId,
          };
        });
      }
    }
  }, [data, id]);

  return (
    (data && (
      <Container>
        <div style={{ padding: "50px 0 0 0" }} />
        <iframe
          /* X-Frame-Options */
          title="Video"
          src={link}
          width="640"
          height="360"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen></iframe>

        <ReactMde
          value={readme}
          onChange={setReadme}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          childProps={{
            writeButton: {
              tabIndex: -1,
            },
          }}
          generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown))}
        />
        <div style={{ padding: "50px 0 0 0" }} />
      </Container>
    )) ||
    null
  );
};

export default ContentDetailStudent;

ContentDetailStudent.renderData = {
  authRequired: true,
  currentView: "Modulos",
};

const Container = styled.div`
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 4rem - 1px);
  height: 100%;
  margin-left: 3.8rem;
`;
