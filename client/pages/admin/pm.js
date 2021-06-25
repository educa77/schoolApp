import React, { useMemo, useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { Tabla } from "../../components/Tabla";
import { getUserRol } from "../../apollo/querys/users";
import { ADD_ROLE } from "../../apollo/Mutations/role";
import CohortesModal from "./cohortesUtils/cohortesModal";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import Groups from "./cohortesUtils/groupsModal";

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function PM() {
    const [exectureGUR, { loading, error, data, refetch }] = useLazyQuery(getUserRol);

    useEffect(() => {
        exectureGUR({
            variables: { role: "pm" },
        });
    }, [exectureGUR]);

    const [addRoleMutation, resultAddRole] = useMutation(ADD_ROLE);

    useEffect(() => {
        if (!resultAddRole.loading && resultAddRole.called) {
            refetch();
        }
    }, [resultAddRole, refetch]);

    const tableData = useMemo(
        () => ({
            loading,
            error,
            data: data
                ? data.getUserRol.map((user) => {
                      return {
                          __typename: user.__typename,
                          familyName: capitalizeFirstLetter(user.familyName),
                          givenName: capitalizeFirstLetter(user.givenName),
                          id: user.id,
                          roles: user.roles,
                          cohortes: user.cohortes.length,
                          groups: user.groups.length,
                      };
                  })
                : undefined,
            /*data: data ? data.getUserRol : undefined,*/
            columns: [
                { key: "givenName", label: "Nombre", align: "left" },
                { key: "familyName", label: "Apellido", align: "left" },
                {
                    key: "cohortes",
                    label: "Cohortes",
                    align: "left",
                    component: (data) => <CohorteNames data={data} />,
                },
                {
                    key: "groups",
                    label: "Grupos",
                    align: "left",
                    component: (cohorte) => <GroupsComponent cohorte={cohorte} />,
                },
            ],
            addButtonLabel: "Agregar PM",
            actions: {
                create: {
                    initialValues: {
                        email: "",
                    },
                    inputs: [{ key: "email", label: "Email" }],
                    onSubmit: async (values) => {
                        const data = {
                            variables: {
                                ...values,
                                roleName: "pm",
                            },
                        };
                        await addRoleMutation(data);
                    },
                    submitButtonLabel: "Añadir",
                    title: "Añadir PM",
                },
                delete: {
                    onSubmit: (id) => alert(id),
                },
            },
        }),
        [addRoleMutation, data, error, loading]
    );

    return (
        tableData && (
            <div>
                <Tabla data={tableData} />
            </div>
        )
    );
}

function CohorteNames({ data }) {
    const [show, setShow] = useState(false);
    const [exectureGUR, { refetch }] = useLazyQuery(getUserRol);

    useEffect(() => {
        exectureGUR({
            variables: { role: "pm" },
        });
    }, [exectureGUR]);
    return (
        <>
            <Button
                onClick={() => {
                    setShow(true);
                    refetch();
                }}>
                {data.cohortes}
            </Button>
            <Dialog
                open={show}
                onClose={() => {
                    setShow(false);
                    refetch();
                }}
                fullWidth
                maxWidth="md">
                <DialogTitle>Cohortes</DialogTitle>
                <DialogContent>
                    <CohortesModal id={data.id} />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setShow(false);
                            refetch();
                        }}
                        color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
function GroupsComponent({ cohorte }) {
    const [show, setShow] = useState(false);
    const [exectureGUR, { refetch }] = useLazyQuery(getUserRol);

    useEffect(() => {
        exectureGUR({
            variables: { role: "pm" },
        });
    }, [exectureGUR]);

    return (
        <>
            <Button
                onClick={() => {
                    setShow(true);
                    refetch();
                }}>
                {cohorte.groups}
            </Button>
            <Dialog
                open={show}
                onClose={() => {
                    setShow(false);
                    refetch();
                }}
                fullWidth
                maxWidth="md">
                <DialogTitle>Groups</DialogTitle>
                <DialogContent>
                    <Groups id={cohorte.id} />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setShow(false);
                            refetch();
                        }}
                        color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default PM;

PM.renderData = {
    authRequired: true,
    currentView: "PM",
};
