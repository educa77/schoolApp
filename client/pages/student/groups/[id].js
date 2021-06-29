import React, { useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";

import { Tabla } from "../../../components/Tabla";
import { ADD_USER_TO_GROUP, REMOVE_USER_OF_GROUP } from "../../../apollo/Mutations/users";
import { GROUPS } from "../../../apollo/querys/groups";

function GroupStudentPP() {
  const router = useRouter();
  const { id } = router.query;

  const [execute, { loading: queryLoading, error, data }] = useLazyQuery(GROUPS);

  useEffect(() => {
    if (id) {
      execute({ variables: { id: parseInt(id) } });
    }
  }, [execute, id]);

  const [addUsersToGroups, { loading: addLoading }] = useMutation(ADD_USER_TO_GROUP);
  const [removeUserOfGroup, { loading: removeLoading }] = useMutation(REMOVE_USER_OF_GROUP);

  const loading = useMemo(
    () => queryLoading || addLoading || removeLoading,
    [queryLoading, addLoading, removeLoading]
  );

  const tableData = useMemo(
    () => ({
      data: data && data.groups[0].students,
      columns: [
        { key: "givenName", label: "Nombre", align: "left" },
        { key: "familyName", label: "Apellido", align: "left" },
        { key: "email", label: "Mail", align: "left" },
      ],
      addButtonLabel: "Invitar",
      actions: {
        view: {
          onSubmit: (id) => router.push(`/profile/${id}`),
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
    [data, id, router, removeUserOfGroup, addUsersToGroups]
  );

  return (
    tableData && (
      <div style={{ height: "100vh", width: "100%" }}>
        <Tabla data={tableData} />
      </div>
    )
  );
}

export default GroupStudentPP;

GroupStudentPP.renderData = {
  authRequired: true,
  currentView: "Grupos",
};
