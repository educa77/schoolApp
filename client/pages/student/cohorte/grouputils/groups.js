import React, { useEffect, useMemo } from "react";
import { useLazyQuery } from "@apollo/client";
import { Tabla } from "../../../../components/Tabla";
import Router from "next/router";
import { USER_GROUPS } from "../../../../apollo/querys/users";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function Groups({ id }) {
  const [executeUG, { data: dataUG, refetch: fetchAll }] = useLazyQuery(USER_GROUPS);

  useEffect(() => {
    if (id) {
      executeUG({ variables: { id: parseInt(id) } });
    }
  }, [executeUG, id]);

  console.log(dataUG, "dataUG");
  console.log(id, "id");

  const preData = useMemo(() => {
    if (dataUG) {
      const preData = dataUG?.users;
      const { groups } = preData[0];
      return groups;
    }
  }, [dataUG]);

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
      data: data,
      columns: [
        { key: "name", label: "Nombre", align: "left" },
        { key: "type", label: "Tipo de grupo", align: "left" },
        { key: "qty", label: "Cant Alumnos", align: "left" },
      ],
      addButtonLabel: "Crear grupo",
    }),
    [data, id]
  );

  return (
    tableData && (
      <div style={{ height: "50vh", width: "100%" }}>
        <Tabla data={tableData} />
      </div>
    )
  );
}

export default Groups;
