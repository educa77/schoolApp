import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { CONTENT_ID } from "../../../../apollo/querys/contents";
import { useRouter } from "next/router";
import styled from "styled-components";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

function ContentDetail() {
    const router = useRouter();
    const { id } = router.query;

    const variables = {
        id: id && parseInt(id),
    };

    const [readme, setReadme] = useState();

    const [execute, { data }] = useLazyQuery(CONTENT_ID);

    useEffect(() => {
        if (id) {
            execute({ variables });
        }
    }, []);

    useEffect(() => {
        if (data) {
            console.log(data, "data");
            setReadme(data.contents[0]?.readme);
        }
    }, [data]);

    const [selectedTab, setSelectedTab] = useState("preview");

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true,
    });

    return (
        <Container>
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
                generateMarkdownPreview={(markdown) =>
                    Promise.resolve(converter.makeHtml(markdown))
                }
            />
            <div style={{ padding: "50px 0 0 0" }} />
        </Container>
    );
}

export default ContentDetail;

ContentDetail.renderData = {
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
