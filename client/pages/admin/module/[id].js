import React, { useMemo, useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { MODULES_BY_ID } from "../../../apollo/querys/modules";
import { Tabla } from "../../../components/Tabla";
import { useRouter } from "next/router";

const ContentsScreen = () => {
    const router = useRouter();
    const { id } = router.query;
    const variables = { id: parseInt(id) };

    const [execute, { loading, error, data: preData }] = useLazyQuery(MODULES_BY_ID);

    useEffect(() => {
        if (id) {
            execute({ variables });
        }
    }, []);

    console.log(preData, "preData");

    const data = useMemo(() => {
        if (preData) {
            return preData.modules.map((e) => {
                return e.contents;
            });
        }
    }, [preData]);

    const dato = useMemo(() => {
        if (data) {
            const arr = data.pop();
            return arr;
        }
    }, [data]);

    const tableData = useMemo(
        () => ({
            loading,
            error,
            data: dato,
            columns: [{ key: "topicName", label: "Nombre del contenido", align: "left" }],
            addButtonLabel: "Agregar contenido",
            actions: {
                create: {
                    onClick: (props) => {
                        const idUrl = props?.view?.history?.state?.as;
                        const id = idUrl.split("/").pop();
                        router.push(`/admin/module/create/${id}`);
                    },

                    submitButtonLabel: "Crear",
                    title: "Crear contenido",
                },

                view: {
                    onSubmit: (id) => {
                        router.push(`/admin/module/content/${id}`);
                    },
                },
            },
        }),
        [data, error, loading]
    );

    return (
        <Tabla
            loading={loading}
            data={tableData}
            count={undefined}
            page={1}
            rowsPerPage={4}
            onChangePage={2}
            onChangeRowsPerPage={2}
        />
    );
};

export default ContentsScreen;

ContentsScreen.renderData = {
    authRequired: true,
    currentView: "Modulos",
};
