import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { CONTENT_ID } from "../../../../apollo/querys/contents";
import { useRouter } from "next/router";
import { CREATE_CONTENT } from "../../../../apollo/Mutations/content";
import { MODULES } from "../../../../apollo/querys/modules";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { Autocomplete } from "@material-ui/lab";
import { CREATE_LESSON } from "../../../../apollo/Mutations/lesson";
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

    const [createMutation, resultCreate] = useMutation(CREATE_CONTENT);
    const [createLesson, resultCreateLesson] = useMutation(CREATE_LESSON);
    const [readme, setReadme] = useState(`### Escribe el Readme`);
    const [values, setValues] = useState({
        topicName: "",
        durationTime: "",
        moduleId: parseInt(id),
        link: "",
    });

    const modules = useQuery(MODULES);

    const { topicName, durationTime, link } = values;

    const handleInputChange = ({ target }) => {
        setValues({
            ...values,
            [target.name]: target.value,
        });
    };

    const [execute, { data, refetch }] = useLazyQuery(CONTENT_ID);

    useEffect(() => {
        if (id) {
            execute({ variables });
        }
    }, [id]);

    useEffect(() => {
        if (data) {
            setReadme(data?.contents[0]?.readme);
        }
    }, [data]);

    const handleCreate = async () => {
        const variables = {
            ...values,
            durationTime: parseInt(values.durationTime),
            moduleId: parseInt(id),
            readme,
            link: `https://player.vimeo.com/video/${values.link}`,
        };
        console.log(variables, "variables");
        await createMutation({
            variables: variables,
        });
    };

    useEffect(() => {
        if (resultCreate.data) {
            const id = resultCreate?.data?.createContent?.id;
            console.log(id, "id del useEffect");
            if (id) {
                createLesson({
                    variables: {
                        link: `https://player.vimeo.com/video/${values.link}`,
                        contentId: id,
                    },
                });
            }
            return router.push("/admin/modules/");
        }
    }, [resultCreate]);

    console.log(resultCreate, "resultCreate");

    const handleModuleInputChange = function (e) {
        setValues({
            ...values,
            moduleId: parseInt(e.value),
        });
    };

    useEffect(() => {
        if (!resultCreate.loading && resultCreate.called) {
            modules.refetch();
        }
    }, [resultCreate, refetch]);

    useEffect(() => {
        if (!resultCreateLesson.loading && resultCreateLesson.called) {
            modules.refetch();
        }
    }, [refetch, resultCreateLesson]);

    const [selectedTab, setSelectedTab] = useState("write");

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
            <form>
                <InputBox>
                    <TextField
                        label="Tema de la clase"
                        variant="outlined"
                        id="Clase"
                        placeholder="Tema de la clase"
                        type="text"
                        name="topicName"
                        value={topicName}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                    />
                    <TextField
                        label="Duracion"
                        variant="outlined"
                        id="Duracion"
                        placeholder="Duracion"
                        type="text"
                        name="durationTime"
                        value={durationTime}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                    />
                    <TextField
                        label="Link de la clase"
                        variant="outlined"
                        id="Link"
                        placeholder="Link de la clase"
                        type="text"
                        name="link"
                        value={link}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                    />
                </InputBox>
                {modules.data?.modules ? (
                    <AutocompleteBox
                        name={"Modulo"}
                        options={modules.data?.modules.map((opt) => ({
                            label: opt.name,
                            value: opt.id,
                        }))}
                        getOptionLabel={(option) => option.label}
                        onChange={(_, e) => handleModuleInputChange(e)}
                        value={(() =>
                            modules.data?.modules.find((op) => op.id === values.moduleId))()}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={"Modulo"}
                                type="text"
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                placeholder="Seleccionar el Modulo"
                            />
                        )}
                    />
                ) : (
                    ""
                )}
                <ButtonBox>
                    <Button variant="contained" color="primary" onClick={handleCreate}>
                        Crear
                    </Button>
                </ButtonBox>
            </form>
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

const ButtonBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 3rem;
`;

const InputBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const AutocompleteBox = styled(Autocomplete)`
    max-width: 30rem;
    margin: auto;
`;
