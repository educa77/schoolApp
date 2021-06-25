import React, { useEffect, useMemo, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Tabla } from "../../../components/Tabla";
import Router from "next/router";
import { CREATE_GROUP, DELETE_GROUP } from "../../../apollo/Mutations/groups";
import { ADD_GROUP_TO_COHORTE } from "../../../apollo/Mutations/cohortes";
import { GROUPS, COUNT_GROUPS } from "../../../apollo/querys/groups";
import { USER_GROUPS } from "../../../apollo/querys/users";

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function Groups({ id }) {
    const [executeUG, { data: dataUG, refetch: fetchAll }] = useLazyQuery(USER_GROUPS);

    useEffect(() => {
        executeUG({ variables: { id: id } });
    }, [executeUG]);

    const preData = useMemo(() => {
        if (dataUG) {
            const preData = dataUG?.users;
            const { groups } = preData[0];
            return groups;
        }
    }, [dataUG]);

    const [execute, { loading: queryLoading, error }] = useLazyQuery(GROUPS);

    const [executeCount, { data: count }] = useLazyQuery(COUNT_GROUPS);

    const [createGroup, { loading: createLoading, called: createCalled }] =
        useMutation(CREATE_GROUP);

    const [addGroupToCohorte, { loading: loadingAdd, called: calledAdd }] =
        useMutation(ADD_GROUP_TO_COHORTE);

    useEffect(() => {
        if (!loadingAdd && calledAdd) fetchAll();
    }, [addGroupToCohorte]);

    useEffect(() => {
        if (!createLoading && createCalled) fetchAll();
    }, [createGroup]);

    const [deleteMutation, { loading: deleteLoading }] = useMutation(DELETE_GROUP);

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
            where: id ? { cohorteId: id } : undefined,
            limit: rowsPerPage,
            offset: rowsPerPage * page,
        }),
        [rowsPerPage, page, id]
    );

    useEffect(() => {
        if (id) {
            execute({
                variables,
            });
            executeCount({ variables });
        }
    }, [id, execute, executeCount, variables]);

    const loading = useMemo(
        () => queryLoading || createLoading || loadingAdd || deleteLoading,
        [queryLoading, createLoading, loadingAdd, deleteLoading]
    );

    const data = useMemo(() => {
        return preData?.map((grupo) => {
            const dato = {
                id: grupo.id,
                name: capitalizeFirstLetter(grupo.name),
                qty: grupo.students?.length,
                type: capitalizeFirstLetter(grupo.type),
            };
            return dato;
        });
    }, [preData]);

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
                        studentId: id,
                    },
                    onSubmit: async (values) => {
                        await createGroup({
                            variables: values,
                        });
                        fetchAll();
                    },
                    inputs: [{ key: "name", label: "Nombre" }],
                },
                delete: {
                    onSubmit: async (values) => {
                        await deleteMutation({ variables: { id: values } });
                        fetchAll();
                    },
                },
            },
        }),
        [data, error, loading, createGroup, addGroupToCohorte, fetchAll, id]
    );

    return (
        tableData && (
            <div style={{ height: "50vh", width: "100%" }}>
                <Tabla
                    loading={loading}
                    data={tableData}
                    count={count?.countGroups || undefined}
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
