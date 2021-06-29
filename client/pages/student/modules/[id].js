import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useLazyQuery } from "@apollo/client";
import { MODULES_BY_ID } from "../../../apollo/querys/modules";
import { Tabla } from "../../../components/Tabla";

const ContentsModule = () => {
  const router = useRouter();
  const { id } = router.query;

  const [execute, { data: preData }] = useLazyQuery(MODULES_BY_ID);

  useEffect(() => {
    if (id) {
      execute({ variables: { id: parseInt(id) } });
    }
  }, [execute, id]);

  const data = useMemo(() => {
    if (preData) {
      return preData.modules[0]?.contents;
    }
  }, [preData]);

  const tableData = useMemo(
    () => ({
      data,
      columns: [{ key: "topicName", label: "Nombre del contenido", align: "left" }],
      actions: {
        view: {
          onSubmit: (id) => {
            router.push(`/student/modules/content/${id}`);
          },
        },
      },
    }),
    [data, router]
  );

  return tableData && <Tabla data={tableData} />;
};

export default ContentsModule;

ContentsModule.renderData = {
  authRequired: true,
  currentView: "Modulos",
};
