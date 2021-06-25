import React, { useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Avatar, Container, Grid, makeStyles } from "@material-ui/core";
import { UPDATE_USER } from "../../apollo/Mutations/users";
import { USER_BY_ID } from "../../apollo/querys/users";
import { useRouter } from "next/router";
import BasicInfo from "../../profileUtils/profilebasicinfo";
import Contact from "../../profileUtils/profilecontact";

const useStyles = makeStyles((theme) => ({
    avatar: {
        width: theme.spacing(14),
        height: theme.spacing(14),
    },
}));

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function Profile() {
    const classes = useStyles();
    const router = useRouter();
    const { id } = router.query;

    const variables = { id: parseInt(id) };

    const { loading, data: preData, refetch } = useQuery(USER_BY_ID, { variables });
    const [update] = useMutation(UPDATE_USER);

    const data = useMemo(() => {
        if (!loading && preData) {
            let user = preData.users.map((e) => {
                return {
                    email: e.email,
                    familyName: capitalizeFirstLetter(e.familyName),
                    givenName: capitalizeFirstLetter(e.givenName),
                    id: e.id,
                    nickName: capitalizeFirstLetter(e.nickName),
                    photoUrl: e.photoUrl,
                };
            });
            return user;
        }
    }, [preData, id]);

    async function handleUpdate(values) {
        await update({ variables: { id: uid, user: { ...values } } });
        refetch();
    }

    return (
        <div style={{ height: "calc(100vh - 65px)" }}>
            {data && (
                <Container maxWidth="sm" style={{ padding: "1rem" }}>
                    <Grid container>
                        <Grid container item xs={12} spacing={2}>
                            <Grid item container xs={12} justify="center">
                                {data && <Avatar className={classes.avatar} src={data.photoUrl} />}
                            </Grid>
                            <Grid item xs={12}>
                                {data && (
                                    <BasicInfo
                                        onSubmit={handleUpdate}
                                        data={data}
                                        onlyView={data.id ? true : false}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                {data && (
                                    <Contact
                                        onSubmit={handleUpdate}
                                        data={data}
                                        onlyView={data.id ? true : false}
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            )}
        </div>
    );
}

export default Profile;

Profile.renderData = {
    authRequired: true,
    currentView: "Alumnos",
};
