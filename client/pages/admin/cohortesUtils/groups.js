import React, { useEffect, useMemo, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Tabla } from "../../../components/Tabla";
import Router from "next/router";
import { CREATE_GROUP, DELETE_GROUP } from "../../../apollo/Mutations/groups";
import { ADD_GROUP_TO_COHORTE } from "../../../apollo/Mutations/cohortes";
import { GROUPS, COUNT_GROUPS } from "../../../apollo/querys/groups";

function Groups({ className, cohorte, data: componentData, loading: componentLoading, onRefetch }) {
    const [execute, { loading: queryLoading, error, data: preData, refetch: preRefetch }] =
        useLazyQuery(GROUPS);

    const [executeCount, { data: count }] = useLazyQuery(COUNT_GROUPS);

    const [createGroup, { loading: createLoading }] = useMutation(CREATE_GROUP);

    const [deleteMutation, { loading: deleteLoading, data: message }] = useMutation(DELETE_GROUP);

    const [addGroupToCohorte, { loading: addLoading }] = useMutation(ADD_GROUP_TO_COHORTE);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const onChangePage = (_, page) => {
        setPage(page);
    };
    const onChangeRowsPerPage = (e) => {
        setRowsPerPage(e.target.value);
    };

    const variables = useMemo(
        () => ({
            where: cohorte ? { cohorteId: cohorte.id } : undefined,
            limit: rowsPerPage,
            offset: rowsPerPage * page,
        }),
        [rowsPerPage, page, cohorte]
    );

    useEffect(() => {
        if (cohorte) {
            execute({
                variables,
            });
            executeCount({ variables });
        }
    }, [cohorte, execute, executeCount, variables]);

    const loading = useMemo(
        () => queryLoading || componentLoading || createLoading || addLoading || deleteLoading,
        [queryLoading, componentLoading, createLoading, addLoading, deleteLoading]
    );

    const data = useMemo(
        () =>
            preData?.groups.map((grupo) => {
                const grupototal = { ...grupo, qty: grupo?.students?.length };
                return grupototal;
            }) /* || componentData?.cohortes[0].groups */,
        [preData, componentData]
    );

    const tableData = useMemo(
        () => ({
            loading,
            error,
            data: data,
            columns: [
                { key: "name", label: "Nombre", align: "left" },
                { key: "type", label: "Tipo de grupo", align: "left" },
                { key: "qty", label: "Cant Alumnos", align: "left" },
            ],
            addButtonLabel: "Crear grupo",
            actions: {
                view: {
                    onSubmit: (id) => Router.push(`/admin/group/${id}`),
                },
                create: {
                    initialValues: {
                        name: "",
                        type: "standup",
                    },
                    onSubmit: async (values) => {
                        const result = await createGroup({
                            variables: values,
                        });
                        if (result?.data?.createGroup?.id) {
                            await addGroupToCohorte({
                                variables: {
                                    cohorteId: cohorte.id,
                                    groupId: [result.data.createGroup.id],
                                },
                            });
                        }
                        if (cohorte) preRefetch();
                        else onRefetch && onRefetch();
                    },
                    inputs: [{ key: "name", label: "Nombre" }],
                },
                delete: {
                    onSubmit: async (values) => {
                        await deleteMutation({ variables: { id: values } });
                        if (cohorte) preRefetch();
                        else onRefetch && onRefetch();
                    },
                },
            },
        }),
        [data, error, loading, createGroup, addGroupToCohorte, onRefetch, preRefetch, cohorte]
    );

    return (
        tableData && (
            <div className={className} style={{ height: "50vh", width: "100%" }}>
                <Tabla
                    loading={loading}
                    data={tableData}
                    count={count?.countGroups}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onChangePage={onChangePage}
                    onChangeRowsPerPage={onChangeRowsPerPage}
                />
            </div>
        )
    );
}

export default Groups;
