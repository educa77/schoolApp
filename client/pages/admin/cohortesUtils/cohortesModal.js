import React, { useMemo, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { Tabla } from "../../../components/Tabla";
import { USER_COHORTES } from "../../../apollo/querys/users";
import { useRouter } from "next/router";

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function PMModal({ id }) {
    const [executeUC, { data: dataUC, refetch: fetchAll, loading, error }] =
        useLazyQuery(USER_COHORTES);

    useEffect(() => {
        executeUC({ variables: { id: id } });
    }, [executeUC, id]);

    const preData = useMemo(() => {
        if (dataUC) {
            const preData = dataUC?.users;
            const { cohortes } = preData[0];
            return cohortes;
        }
    }, [dataUC]);

    const data = useMemo(() => {
        return preData?.map((cohorte) => {
            const dato = {
                id: cohorte.id,
                name: capitalizeFirstLetter(cohorte.name),
            };
            return dato;
        });
    }, [preData]);

    const router = useRouter();

    const tableData = useMemo(
        () => ({
            loading,
            error,
            data: data,
            columns: [
                { key: "id", label: "ID", align: "left" },
                { key: "name", label: "Nombre", align: "left" },
            ],
            addButtonLabel: "Agregar Cohorte",
            actions: {
                create: {
                    initialValues: {
                        email: "",
                    },
                    inputs: [{ key: "email", label: "Email" }],
                    onSubmit: async (values) => {},
                    submitButtonLabel: "Añadir",
                    title: "Añadir Instructor",
                },
                delete: {
                    onSubmit: (id) => alert(id),
                },
                view: {
                    onSubmit: (id) => {
                        router.push(`/admin/cohorte/${id}`);
                    },
                },
            },
        }),
        [data, error, loading]
    );

    return (
        tableData && (
            <div>
                <Tabla data={tableData} />
            </div>
        )
    );
}

export default PMModal;

PMModal.renderData = {
    authRequired: true,
    currentView: "PM",
};
