import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { MODULES } from "../../../apollo/querys/modules";
import { Tabla } from "../../../components/Tabla";

const ModuleStudent = () => {
  const router = useRouter();

  const { loading, error, data: preData } = useQuery(MODULES);

  const data = useMemo(() => {
    if (Array.isArray(preData?.modules)) {
      return preData.modules.map((module) => {
        return {
          ...module,
        };
      });
    } else return preData;
  }, [preData]);

  const tableData = useMemo(
    () => ({
      loading,
      error,
      data,
      columns: [{ key: "name", label: "Modulo", align: "left" }],
      actions: {
        view: {
          onSubmit: (id) => {
            router.push(`/student/modules/${id}`);
          },
        },
      },
    }),
    [data, error, loading, router]
  );

  return tableData && <Tabla data={tableData} />;
};

export default ModuleStudent;

ModuleStudent.renderData = {
  authRequired: true,
  currentView: "Modulos",
};
