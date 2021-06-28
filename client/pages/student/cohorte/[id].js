import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";

import { Card, CardContent, CardHeader, Grid } from "@material-ui/core";
import styled from "styled-components";

import { COHORTE_BY_ID } from "../../../apollo/querys/cohortes";
//import Groups from "pages/alumnos/Cohortes/groups";
import Alumns from "../../admin/cohortesUtils/Alumns";

const capitalizeFirstLetter = (string) => {
    if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

function CohortesDetailAlumno() {
    const router = useRouter();
    const { id } = router.query;

    const [ideElected, setIdElected] = useState();

    const variables = { id: parseInt(id) };

    const [execute, { data }] = useLazyQuery(COHORTE_BY_ID);

    useEffect(() => {
        if (id) {
            execute(variables);
        }
    }, [id]);

    const handleCohorte = (id) => {
        setIdElected(id);
    };

    return (
        (data && (
            <div style={{ paddingTop: "1rem", width: "100%", paddingLeft: "3.2rem" }}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardHeader title="Información" />
                            <CardContent>
                                <div
                                    style={{
                                        maxHeight: "100vh",
                                        width: "100%",
                                        display: "flex",
                                    }}>
                                    <CohorteDetailItem>
                                        <p>Nombre del cohorte: </p>
                                        {data.cohortes.map((el) => {
                                            return (
                                                <CohorteSpan onClick={() => handleCohorte(el.id)}>
                                                    {el.name.toUpperCase()}
                                                </CohorteSpan>
                                            );
                                        })}
                                    </CohorteDetailItem>
                                    <CohorteDetailItem>
                                        <p>Nombre del instructor: </p>
                                        {data.cohortes.map((el) => (
                                            <span>
                                                {capitalizeFirstLetter(el.instructor.givenName) +
                                                    " " +
                                                    capitalizeFirstLetter(el.instructor.familyName)}
                                            </span>
                                        ))}
                                    </CohorteDetailItem>
                                    <CohorteDetailItem>
                                        <p>Fecha de inicio: </p>
                                        {data.cohortes.map((el) => (
                                            <span>
                                                {data &&
                                                    new Date(
                                                        Number(el.startDate)
                                                    ).toLocaleDateString()}
                                            </span>
                                        ))}
                                    </CohorteDetailItem>
                                    <CohorteDetailItem>
                                        <p>Cantidad de alumnos: </p>
                                        {data.cohortes.map((el) => (
                                            <span>{data.cohortes[0].users.length}</span>
                                        ))}
                                    </CohorteDetailItem>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                    {ideElected && data && (
                        <Grid item xs={12}>
                            <Card variant="outlined" style={{ position: "relative" }}>
                                <CardHeader
                                    title={`Alumnos del ${capitalizeFirstLetter(
                                        data.cohortes.find((el) => el.id === ideElected)?.name
                                    )}`}
                                />
                                <CardContent>
                                    <Alumns ide={ideElected} />
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </div>
        )) ||
        null
    );
}

export default CohortesDetailAlumno;

CohortesDetailAlumno.renderData = {
    authRequired: true,
    currentView: "Cohortes",
};

const CohorteDetailItem = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 5px 5px 5px;
    width: 90%;
    p {
        font-size: 130%;
        margin-bottom: 10px;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
    }
    span {
        font-size: 100%;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }
`;

const CohorteSpan = styled.span`
    cursor: pointer;
`;
