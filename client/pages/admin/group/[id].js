import React, { useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Tabla } from "../../../components/Tabla";
import { ADD_USER_TO_GROUP, REMOVE_USER_OF_GROUP } from "../../../apollo/Mutations/users";
import { GROUPS } from "../../../apollo/querys/groups";
import Router, { useRouter } from "next/router";

function GroupStudentPP() {
    const router = useRouter();
    const { id } = router.query;
    const variables = { where: { id: parseInt(id) } };

    const {
        loading: queryLoading,
        error,
        data,
    } = useQuery(GROUPS, {
        variables,
    });

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const dataTable = useMemo(() => {
        if (data) {
            const grupo = data?.groups[0];
            return {
                students: grupo?.students?.map((e) => {
                    return {
                        id: e.id,
                        email: e.email,
                        familyName: capitalizeFirstLetter(e.familyName),
                        givenName: capitalizeFirstLetter(e.givenName),
                    };
                }),
            };
        }
    }, [data]);

    const [addUsersToGroups, { loading: addLoading }] = useMutation(ADD_USER_TO_GROUP);

    const [removeUserOfGroup, { loading: removeLoading }] = useMutation(REMOVE_USER_OF_GROUP);

    const loading = useMemo(
        () => queryLoading || addLoading || removeLoading,
        [queryLoading, addLoading, removeLoading]
    );

    const tableData = useMemo(
        () => ({
            loading,
            error,
            data: dataTable?.students,
            columns: [
                { key: "givenName", label: "Nombre", align: "left" },
                { key: "familyName", label: "Apellido", align: "left" },
                { key: "email", label: "Mail", align: "left" },
            ],
            addButtonLabel: "Invitar",
            actions: {
                view: {
                    onSubmit: async (id) => {
                        Router.push(`/profile/${id}`);
                    },
                },
                delete: {
                    initialValues: {
                        studentId: "",
                    },

                    onSubmit: async (values) => {
                        const datos = {
                            variables: {
                                ...values,
                                id: id,
                                userId: values,
                            },
                        };
                        await removeUserOfGroup({
                            variables: {
                                id: parseInt(datos.variables.id),
                                userId: parseInt(datos.variables.userId),
                            },
                        });
                    },
                },
                create: {
                    initialValues: {
                        studentId: "",
                        id: id,
                    },
                    inputs: [{ key: "studentId", label: "studentId" }],
                    onSubmit: async (values) => {
                        const datos = {
                            variables: {
                                ...values,
                            },
                        };
                        await addUsersToGroups({
                            variables: {
                                id: parseInt(datos.variables.id),
                                group: { studentId: parseInt(datos.variables.studentId) },
                            },
                        });
                    },
                    submitButtonLabel: "Invitar",
                    title: "Invitar estudiante",
                },
            },
        }),
        [loading, error, data, id, removeUserOfGroup, addUsersToGroups]
    );

    return (
        tableData && (
            <div style={{ height: "50vh", width: "100%" }}>
                <Tabla loading={loading} data={tableData} />
            </div>
        )
    );
}

export default GroupStudentPP;

GroupStudentPP.renderData = {
    authRequired: true,
    currentView: "Cohortes",
};
