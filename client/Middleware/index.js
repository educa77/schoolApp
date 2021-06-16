import Router from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Middleware({ authRequired }) {
  const user = useSelector((state) => state.auth);

  useEffect(() => {
    if (authRequired && (!user || !user?.token)) Router.push("/ingresar");
  }, [user, authRequired]);

  return null;
}
