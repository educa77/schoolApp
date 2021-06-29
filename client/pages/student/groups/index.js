import React, { useEffect, useMemo } from "react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { Tabla } from "../../../components/Tabla";
import { CREATE_GROUP, DELETE_GROUP } from "../../../apollo/Mutations/groups";
import { ADD_GROUP_TO_COHORTE } from "../../../apollo/Mutations/cohortes";
import { USER_FULL } from "../../../apollo/querys/users";

function GroupStudent(className) {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const [execute, { loading: queryLoading, error, data, refetch }] = useLazyQuery(USER_FULL);

  useEffect(() => {
    if (user) {
      execute({ variables: { id: user.id } });
    }
  }, [execute, user]);

  const [createGroup, resultCreate] = useMutation(CREATE_GROUP);
  const [removeGroup, resultDelete] = useMutation(DELETE_GROUP);
  const [addGroupToCohorte, { loading: addLoading }] = useMutation(ADD_GROUP_TO_COHORTE);

  const loading = useMemo(() => queryLoading || addLoading, [queryLoading, addLoading]);

  const tableData = useMemo(
    () => ({
      data:
        data &&
        data.users[0].groups.map((group) => {
          return {
            ...group,
            qty: group.students.length,
          };
        }),
      columns: [
        { key: "name", label: "Nombre", align: "left" },
        { key: "type", label: "Tipo de grupo", align: "left" },
        { key: "qty", label: "Cantidad de alumnos", align: "left" },
      ],
      addButtonLabel: "Crear grupo",
      actions: {
        create: {
          initialValues: {
            name: "",
            type: "pp",
          },
          inputs: [{ key: "name", label: "Nombre" }],

          onSubmit: async (values) => {
            const datos = {
              variables: {
                ...values,
                name: values.name,
                studentId: data && data.users[0].id,
              },
            };
            await createGroup({
              variables: {
                name: datos.variables.name,
                type: datos.variables.type,
                studentId: [parseInt(datos.variables.studentId)],
              },
            });
          },
        },
        delete: {
          onSubmit: async (values) => {
            const datos = {
              variables: {
                id: values,
              },
            };
            await removeGroup({
              variables: {
                id: parseInt(datos.variables.id),
              },
            });
          },
        },

        view: {
          onSubmit: (id) => router.push(`/student/groups/${id}`),
        },
      },
    }),
    [data, createGroup, router, removeGroup]
  );

  useEffect(() => {
    if (!resultCreate.loading && resultCreate.called) {
      refetch();
    }
  }, [resultCreate, refetch]);

  useEffect(() => {
    if (!resultDelete.loading && resultDelete.called) {
      refetch();
    }
  }, [resultDelete, refetch]);

  return (
    tableData && (
      <div className={className} style={{ height: "100%", width: "100%" }}>
        <Tabla loading={loading} data={tableData} />
      </div>
    )
  );
}

export default GroupStudent;

GroupStudent.renderData = {
  authRequired: true,
  currentView: "Grupos",
};
