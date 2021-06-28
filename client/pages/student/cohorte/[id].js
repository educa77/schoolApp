import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";

import { Card, CardContent, CardHeader, Grid } from "@material-ui/core";
import styled from "styled-components";

import { COHORTE_BY_ID } from "../../../apollo/querys/cohortes";
import { USER_STUDENT_COHORTES } from "../../../apollo/querys/users";
import Groups from "./grouputils/groups";
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

  const [execute, { data }] = useLazyQuery(USER_STUDENT_COHORTES);

  useEffect(() => {
    if (id) {
      return execute({ variables: { id: parseInt(id) } });
    }
  }, [id, execute]);

  console.log(data, "data");

  const handleCohorte = (id) => {
    setIdElected(id);
  };

  const [executeCID, { data: preData }] = useLazyQuery(COHORTE_BY_ID);

  useEffect(() => {
    if (ideElected) {
      executeCID({ variables: { id: ideElected } });
    }
  }, [ideElected, executeCID]);

  console.log(preData, "preData");

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
                    <p>Cohortes Inscriptos </p>
                    {data.users[0]?.cohortes.map((el) => {
                      return (
                        <CohorteSpan onClick={() => handleCohorte(el.id)}>
                          {el.name.toUpperCase()}
                        </CohorteSpan>
                      );
                    })}
                  </CohorteDetailItem>
                </div>
              </CardContent>
            </Card>
          </Grid>
          {preData && (
            <>
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title={`Datos del ${capitalizeFirstLetter(
                      data.users[0].cohortes.find((el) => el.id === ideElected)?.name
                    )}`}
                  />
                  <CardContentDatos>
                    <CohorteDetailItem>
                      <p>Nombre del instructor: </p>
                      {preData.cohortes.map((el) => (
                        <span>
                          {capitalizeFirstLetter(el.instructor.givenName) +
                            " " +
                            capitalizeFirstLetter(el.instructor.familyName)}
                        </span>
                      ))}
                    </CohorteDetailItem>
                    <CohorteDetailItem>
                      <p>Fecha de inicio: </p>
                      {preData.cohortes.map((el) => (
                        <span>{new Date(Number(el.startDate)).toLocaleDateString()}</span>
                      ))}
                    </CohorteDetailItem>
                    <CohorteDetailItem>
                      <p>Cantidad de alumnos: </p>
                      {preData.cohortes.map((el) => (
                        <span>{el.users.length}</span>
                      ))}
                    </CohorteDetailItem>
                  </CardContentDatos>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card variant="outlined" style={{ position: "relative" }}>
                  <CardHeader title="Grupos inscripto" />
                  <CardContent>
                    <Groups id={id} />
                  </CardContent>
                  ;
                </Card>
              </Grid>
            </>
          )}
          {ideElected && data && id && (
            <Grid item xs={12}>
              <Card variant="outlined" style={{ position: "relative" }}>
                <CardHeader
                  title={`Alumnos del ${capitalizeFirstLetter(
                    data.users[0].cohortes.find((el) => el.id === ideElected)?.name
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

const CardContentDatos = styled(CardContent)`
  display: flex;
`;
