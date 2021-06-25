import React, { useState, useEffect } from "react";
import Header from "../components/header";
import { useSelector } from "react-redux";

let mounted = false;

export default function Layout({ children, currentView, headerVisibility }) {
    const [show, setShow] = useState(false);
    const user = useSelector((state) => state.auth);

    useEffect(() => {
        mounted = true;
    }, []);

    return (
        <div id="root">
            {mounted && user && user.authenticated && (
                <div id="header">
                    <Header
                        handleShowMenu={() => setShow(!show)}
                        display={headerVisibility}
                        currentView={currentView}
                    />
                </div>
            )}
            <section>{children}</section>
            <footer></footer>
        </div>
    );
}
