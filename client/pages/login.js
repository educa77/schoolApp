import LogIn from "../views/login";
import { AnimatePresence } from "framer-motion";

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
