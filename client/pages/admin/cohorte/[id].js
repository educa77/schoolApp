import React, { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { COHORTE_BY_ID } from "../../../apollo/querys/cohortes";
import { ADD_USER_TO_COHORTE, DELETE_USER_TO_COHORTE } from "../../../apollo/Mutations/cohortes";
import Groups from "../cohortesUtils/groups";
import Alumns from "../cohortesUtils/Alumns";
import { Card, CardContent, CardHeader, Grid } from "@material-ui/core";
import { useRouter } from "next/router";
import styled from "styled-components";

function CohortesDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [resultCreate] = useMutation(ADD_USER_TO_COHORTE);
  const [resultDelete] = useMutation(DELETE_USER_TO_COHORTE);

  const variables = { id: parseInt(id) };
  const { loading, data, refetch, called } = useQuery(COHORTE_BY_ID, {
    variables,
  });

  useEffect(() => {
    if (!loading && called) {
      refetch();
    }
  }, [data, refetch]);

  useEffect(() => {
    if (!resultCreate.loading && resultCreate.called) {
      refetch();
    }
  }, [resultCreate, refetch]);

  useEffect(() => {
    if (!resultDelete.loading && resultDelete.called) {
      refetch();
    }
  }, [resultDelete, refetch]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <ContainerBox>
      {data && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card variant="outlined">
              <CardHeader title="Información" />
              <CardContent>
                <div
                  style={{
                    height: "50vh",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <CohorteDetailItem>
                    <p>Nombre del cohorte: </p>
                    <span>{data && data.cohortes[0].name.toUpperCase()}</span>
                  </CohorteDetailItem>
                  <CohorteDetailItem>
                    <p>Nombre del instructor: </p>
                    <span>
                      {data &&
                        capitalizeFirstLetter(data.cohortes[0].instructor.givenName) +
                          " " +
                          capitalizeFirstLetter(data.cohortes[0].instructor.familyName)}
                    </span>
                  </CohorteDetailItem>
                  <CohorteDetailItem>
                    <p>Fecha de inicio: </p>
                    <span>
                      {data && new Date(Number(data.cohortes[0].startDate)).toLocaleDateString()}
                    </span>
                  </CohorteDetailItem>
                  <CohorteDetailItem>
                    <p>Cantidad de alumnos: </p>
                    <span>{data && data.cohortes[0].users?.length}</span>
                  </CohorteDetailItem>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card variant="outlined" style={{ position: "relative" }}>
              <CardHeader title="Grupos" />
              <CardContent>
                <Groups cohorte={data && data.cohortes[0]} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card variant="outlined" style={{ position: "relative" }}>
              <CardHeader title="Alumnos" />
              <CardContent>
                <Alumns ide={id} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </ContainerBox>
  );
}

export default CohortesDetail;

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

const ContainerBox = styled.div`
  display: flex;
  margin-left: 3.7rem;
`;

CohortesDetail.renderData = {
  authRequired: true,
  currentView: "Cohortes",
};
