import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { Tabla } from "../../../components/Tabla";
import { COUNT_USERS } from "../../../apollo/querys/users";
import { COHORTE_BY_ID } from "../../../apollo/querys/cohortes";
import {
  ADD_USER_TO_COHORTE,
  DELETE_USER_TO_COHORTE,
} from "../../../apollo/Mutations/cohortes";
import { Button, ButtonGroup, Snackbar } from "@material-ui/core";
import { MailOutlineRounded, FileCopyRounded } from "@material-ui/icons";
import { useCopyToClipboard } from "react-use";
import { Alert } from "@material-ui/lab";
import { useRouter } from "next/router";

function Alumns({ className, data: componentData, ide }) {
  const router = useRouter();

  const [inviteMutation, { loading: addLoading }] =
    useMutation(ADD_USER_TO_COHORTE);

  const [deleteMutation, { loading: deleteLoading }] = useMutation(
    DELETE_USER_TO_COHORTE
  );

  const [executeCount, { loading: queryLoading, error, data: count }] =
    useLazyQuery(COUNT_USERS);

  const [{ value: copyValue }, copyToClipboard] = useCopyToClipboard();

  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (copyValue) {
      setShowSnackbar(true);
    }
  }, [copyValue]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const onChangePage = (_, page) => {
    setPage(page);
  };
  const onChangeRowsPerPage = (e) => {
    setRowsPerPage(e.target.value);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (componentData) {
    const variables = {
      id: parseInt(componentData[0]?.id),
    };
    var { data: preData, refetch } = useQuery(COHORTE_BY_ID, {
      variables,
    });
    preData = preData?.cohortes?.filter(
      (ele) => ele.id === parseInt(componentData[0]?.id)
    );
  }
  if (ide) {
    const variablesId = {
      id: parseInt(ide),
    };
    var { data: preData, refetch } = useQuery(COHORTE_BY_ID, {
      variablesId,
    });
  }

  var cohorteMemo = useMemo(() => {
    if (ide) {
      preData = preData?.cohortes?.filter((ele) => ele.id === parseInt(ide));
    }

    if (Array.isArray(preData?.cohortes)) {
      return preData.cohortes.map((item) => {
        return {
          ...item,
          name: item.name.toUpperCase(),
          instructorDisplay: `${
            capitalizeFirstLetter(item.instructor.givenName) || ""
          } ${capitalizeFirstLetter(item.instructor.familyName) || ""}`,
          instructor: item.instructor.id,
          groups: Array.isArray(item.groups) ? item.groups.length : 0,
          alumns: Array.isArray(item.users) ? item.users.length : 0,
          users: item.users,
        };
      });
    } else return preData;
  }, [preData]);

  var cohorte = useMemo(() => {
    if (cohorteMemo) return cohorteMemo.pop();
  }, [cohorteMemo]);

  const variables = useMemo(
    () => ({
      where: cohorte ? { Cohorte: { id: cohorte?.id } } : undefined,
      limit: rowsPerPage,
      offset: rowsPerPage * page,
    }),
    [rowsPerPage, page, cohorte]
  );

  const loading = useMemo(
    () => addLoading || queryLoading || deleteLoading,
    [addLoading, queryLoading, deleteLoading]
  );

  useEffect(() => {
    if (cohorte) {
      executeCount({ variables });
    }
  }, [cohorte, executeCount, variables]);

  const data = useMemo(
    () =>
      (cohorte &&
        cohorte?.users?.map((user) => {
          var usuario = {
            __typename: user.__typename,
            givenName: user.givenName && capitalizeFirstLetter(user.givenName),
            familyName:
              user.familyName && capitalizeFirstLetter(user.familyName),
            email: user.email,
            id: user.id,
            nickName: user.nickName,
            photoUrl: user.photoUrl,
            roles: user.roles,
            cohortes: user.cohortes,
          };
          return usuario;
        })) ||
      "",
    [cohorte]
  );

  const tableData = useMemo(
    () => ({
      loading,
      error,
      data: data && data,
      columns: [
        { key: "givenName", label: "Nombre", align: "left" },
        { key: "familyName", label: "Apellido", align: "left" },
        {
          key: "email",
          label: "Email",
          align: "left",
          component: (el) => (
            <ButtonGroup>
              <Button
                startIcon={<MailOutlineRounded />}
                href={`mailto: ${el.email}`}
              >
                Enviar
              </Button>
              <Button onClick={() => copyToClipboard(el.email)}>
                <FileCopyRounded />
              </Button>
            </ButtonGroup>
          ),
        },
      ],
      addButtonLabel: "Agregar estudiante",
      actions: {
        view: {
          onSubmit: (id) => router.push(`/profile/${id}`),
        },
        delete: {
          initialValues: {
            userId: "",
          },
          onSubmit: async (values) => {
            const datos = {
              variables: {
                cohorteId: cohorte.id,
                userId: values,
              },
            };
            await deleteMutation({
              variables: {
                cohorteId: datos.variables.cohorteId,
                userId: datos.variables.userId,
              },
            });
            refetch();
          },
        },
        create: {
          initialValues: {
            userId: 0,
          },
          inputs: [{ key: "userId", label: "Id" }],
          onSubmit: async (values) => {
            const data = {
              variables: {
                ...values,
                userId: [parseInt(values.userId)],
                cohorteId: parseInt(cohorte.id),
              },
            };
            await inviteMutation(data);
            refetch();
          },
          submitButtonLabel: "Agregar",
          title: "Agregar estudiante",
        },
      },
    }),
    [
      loading,
      error,
      data,
      copyToClipboard,
      cohorte?.id,
      deleteMutation,
      refetch,
      inviteMutation,
    ]
  );

  return (
    <div className={className} style={{ height: "50vh", width: "100%" }}>
      <Tabla
        loading={loading}
        data={tableData}
        count={Math.ceil(count?.countUsers / 5) || undefined}
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />{" "}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="info">Email copiado al potapapeles</Alert>
      </Snackbar>
    </div>
  );
}

export default Alumns;
