import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Tabla } from "../../components/Tabla";
import { COHORTES, COUNT_COHORTES } from "../../apollo/querys/cohortes";
import { CREATE_COHORTE, DELETE_COHORTE, EDIT_COHORTE } from "../../apollo/Mutations/cohortes";
import { ADD_USER_TO_COHORTE } from "../../apollo/Mutations/users";
import { getUserRol } from "../../apollo/querys/users";
import AlumnsModal from "./cohortesUtils/AlumnsModal";
import Groups from "./cohortesUtils/groups";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import Router from "next/router";
import { AnimatePresence } from "framer-motion";

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
function Cohortes() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const {
        loading,
        error,
        data: preData,
        refetch,
    } = useQuery(COHORTES, { variables: { limit: rowsPerPage, offset: rowsPerPage * page } });

    const handleChangePage = (e, page) => {
        setPage(page);
        refetch({
            limit: rowsPerPage,
            offset: rowsPerPage * page,
        });
    };
    const onChangeRowsPerPage = (e) => {
        setRowsPerPage(e.target.value);
        refetch({
            limit: rowsPerPage,
            offset: rowsPerPage * page,
        });
        refetch();
    };

    useEffect(() => {
        refetch();
    }, [preData]);

    const { data: count } = useQuery(COUNT_COHORTES);
    const instructors = useQuery(getUserRol, {
        variables: { role: "instructor" },
    });
    const [createMutation, { data: resultCreate, loading: loadingCreate, called: calledCreate }] =
        useMutation(CREATE_COHORTE);
    const [deleteMutation, { data: resultDelete, loading: loadingDelete, called: calledDelete }] =
        useMutation(DELETE_COHORTE);
    const [updateMutation, { data: resultUpdate, loading: loadingUpdate, called: calledUpdate }] =
        useMutation(EDIT_COHORTE);
    const [addUsertoCohorte, resultAdd] = useMutation(ADD_USER_TO_COHORTE);

    const { refetch: refetchRoles } = useQuery(getUserRol, {
        variables: { role: "instructor" },
    });

    useEffect(() => {
        if (!loadingCreate && calledCreate) {
            refetch();
        }
    }, [resultCreate, refetch]);

    useEffect(() => {
        if (!loadingUpdate && calledUpdate) {
            refetch();
        }
    }, [resultUpdate, refetch]);

    useEffect(() => {
        if (!loadingDelete && calledDelete) {
            refetch();
        }
    }, [resultDelete, refetch]);

    useEffect(() => {
        if (resultCreate) {
            const cohorteId = resultCreate?.createCohorte?.id;
            const userId = resultCreate?.createCohorte?.instructor?.id;
            return addUsertoCohorte({
                variables: { cohorteId: parseInt(cohorteId), userId: parseInt(userId) },
            });
        }
        refetchRoles();
    }, [resultCreate]);

    useEffect(() => {
        if (resultUpdate) {
            const cohorteId = resultUpdate?.editCohorte?.id;
            const userId = resultUpdate?.editCohorte?.instructor?.id;
            return addUsertoCohorte({
                variables: { cohorteId: parseInt(cohorteId), userId: parseInt(userId) },
            });
        }
        refetch();
    }, [resultUpdate]);

    const data = useMemo(() => {
        if (Array.isArray(preData?.cohortes)) {
            return preData.cohortes.map((item) => {
                return {
                    ...item,
                    name: item.name.toUpperCase(),
                    instructorDisplay: `${capitalizeFirstLetter(item.instructor.givenName) || ""} ${
                        capitalizeFirstLetter(item.instructor.familyName) || ""
                    }`,
                    instructor: item.instructor.id,
                    groups: Array.isArray(item.groups) ? item.groups.length : 0,
                    alumns: Array.isArray(item.users) ? item.users.length : 0,
                    users: item.users,
                };
            });
        } else return preData;
    }, [preData]);

    const tableData = useMemo(
        () => ({
            loading,
            error,
            data: data,
            columns: [
                { key: "name", label: "Nombre del cohorte", align: "left" },
                { key: "instructorDisplay", label: "Instructor", align: "left" },
                {
                    key: "groups",
                    label: "Grupos",
                    align: "left",
                    component: (cohorte) => <GroupsComponent cohorte={cohorte} data={data} />,
                },
                {
                    key: "alumns",
                    label: "Alumnos",
                    align: "left",
                    component: (cohorte) => <AlumnsComponent cohorte={cohorte} data={data} />,
                },
            ],
            addButtonLabel: "Agregar cohorte",
            actions: {
                create: {
                    initialValues: {
                        name: "",
                        instructor: undefined,
                        startDate: new Date(),
                    },
                    inputs: [
                        { key: "name", label: "Nombre" },
                        {
                            key: "instructor",
                            label: "Instructor",
                            type: "select",
                            options: (() => {
                                return instructors.data?.getUserRol
                                    ? instructors.data.getUserRol.map(
                                          ({ givenName, familyName, id }) => ({
                                              value: id,
                                              label: `${givenName} ${familyName}`,
                                          })
                                      )
                                    : [];
                            })(),
                        },
                        { key: "startDate", label: "Fecha de inicio", type: "date" },
                    ],
                    onSubmit: async (values) => {
                        await createMutation({
                            variables: {
                                ...values,
                                instructor: parseInt(values.instructor),
                            },
                        });
                        refetch();
                    },
                    submitButtonLabel: "Crear",
                    title: "Crear cohorte",
                },
                update: {
                    inputs: [
                        { key: "name", label: "Nombre" },
                        {
                            key: "instructor",
                            label: "Instructor",
                            type: "select",
                            options: (() => {
                                return instructors.data?.getUserRol
                                    ? instructors.data.getUserRol.map(
                                          ({ givenName, familyName, id }) => ({
                                              value: id,
                                              label: `${givenName} ${familyName}`,
                                          })
                                      )
                                    : [];
                            })(),
                        },
                        { key: "startDate", label: "Fecha de inicio", type: "date" },
                    ],
                    onSubmit: async (values) => {
                        await updateMutation({
                            variables: {
                                ...values,
                                instructor: parseInt(values.instructor),
                            },
                        });
                        refetch();
                    },
                    submitButtonLabel: "Enviar cambios",
                    title: "Editar cohorte",
                },
                delete: {
                    onSubmit: async (id) => {
                        await deleteMutation({
                            variables: {
                                id: parseInt(id),
                            },
                        });
                        refetch();
                    },
                },
                view: {
                    onSubmit: (id) => {
                        Router.push("/admin/cohorte/" + id);
                    },
                },
            },
        }),
        [
            data,
            Router.push,
            error,
            loading,
            createMutation,
            refetch,
            deleteMutation,
            updateMutation,
            instructors.data,
        ]
    );

    return (
        <div style={{ height: "calc(100vh - 65px)" }}>
            {tableData && (
                <AnimatePresence exit={{ opacity: 0 }}>
                    <Tabla
                        data={tableData}
                        count={count?.countCohortes}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={onChangeRowsPerPage}
                    />
                </AnimatePresence>
            )}
        </div>
    );
}

function AlumnsComponent({ data, cohorte }) {
    const [show, setShow] = useState(false);
    const { refetch } = useQuery(COHORTES);
    return (
        <>
            <Button
                onClick={() => {
                    setShow(true);
                    refetch();
                }}>
                {cohorte.alumns}
            </Button>
            <Dialog
                open={show}
                onClose={() => {
                    setShow(false);
                    refetch();
                }}
                fullWidth
                maxWidth="md">
                <DialogTitle>Alumnos</DialogTitle>
                <DialogContent>
                    <AlumnsModal data={data} users={cohorte.users} cohorte={cohorte} />
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
function GroupsComponent({ cohorte, data }) {
    const [show, setShow] = useState(false);
    const { refetch } = useQuery(COHORTES);

    return (
        <>
            <Button onClick={() => setShow(true)}>{cohorte.groups}</Button>
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
                    <Groups cohorte={cohorte} data={data} />
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

export default Cohortes;

Cohortes.renderData = {
    authRequired: true,
    currentView: "Cohortes",
};
