import LogIn from "../views/login";

export default function ingresar() {
  return (
    <>
      <LogIn />
    </>
  );
}

ingresar.renderData = {
  authRequired: false,
  header: "false",
  pageTitle: `Ingresá a School App`,
};
