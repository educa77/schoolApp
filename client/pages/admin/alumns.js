import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Tabla } from "../../components/Tabla";
import { getUserRol } from "../../apollo/querys/users";
import { INVITE_USER } from "../../apollo/Mutations/users";
import { Button, ButtonGroup, Snackbar } from "@material-ui/core";
import { FileCopyRounded, MailOutlineRounded } from "@material-ui/icons";
import { useCopyToClipboard } from "react-use";
import { Alert } from "@material-ui/lab";
import { useRouter } from "next/router";

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function Alumns() {
    const router = useRouter();

    const { loading, error, data, refetch } = useQuery(getUserRol, {
        variables: { role: "student" },
    });

    const [inviteMutation, resultInvite] = useMutation(INVITE_USER);

    useEffect(() => {
        if (!resultInvite.loading && resultInvite.called) {
            refetch();
        }
    }, [resultInvite, refetch]);

    const [{ value: copyValue }, copyToClipboard] = useCopyToClipboard();

    const [showSnackbar, setShowSnackbar] = useState(false);

    useEffect(() => {
        if (copyValue) {
            setShowSnackbar(true);
        }
    }, [copyValue]);

    const tableData = useMemo(
        () => ({
            loading,
            error,
            data:
                data && data.getUserRol
                    ? data.getUserRol.map((user) => {
                          return {
                              __typename: user.__typename,
                              email: user.email,
                              familyName: user.familyName && capitalizeFirstLetter(user.familyName),
                              givenName: user.givenName && capitalizeFirstLetter(user.givenName),
                              id: user.id,
                              roles: user.roles,
                          };
                      })
                    : undefined,
            columns: [
                { key: "givenName", label: "Nombre", align: "left" },
                { key: "familyName", label: "Apellido", align: "left" },
                {
                    key: "email",
                    label: "Email",
                    align: "left",
                    component: (el) => (
                        <ButtonGroup>
                            <Button startIcon={<MailOutlineRounded />} href={`mailto: ${el.email}`}>
                                Enviar
                            </Button>
                            <Button onClick={() => copyToClipboard(el.email)}>
                                <FileCopyRounded />
                            </Button>
                        </ButtonGroup>
                    ),
                },
            ],
            addButtonLabel: "Invitar estudiante",
            actions: {
                create: {
                    initialValues: {
                        email: undefined,
                    },
                    inputs: [{ key: "email", label: "Email" }],
                    onSubmit: async (values) => {
                        const data = {
                            variables: {
                                ...values,
                                role: "student",
                            },
                        };
                        await inviteMutation(data);
                    },
                    submitButtonLabel: "Invitar",
                    title: "Invitar estudiante",
                },
                view: {
                    onSubmit: (id) => router.push(`/profile/${id}`),
                },
            },
        }),
        [data, error, loading, inviteMutation, copyToClipboard]
    );

    return (
        <div>
            <Tabla loading={loading} data={tableData} />
            <Snackbar
                open={showSnackbar}
                autoHideDuration={3000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Alert severity="info">Email copiado al potapapeles</Alert>
            </Snackbar>
        </div>
    );
}

export default Alumns;

Alumns.renderData = {
    authRequired: true,
    currentView: "Alumnos",
};
