import React, { useState } from "react";
import styled, { css } from "styled-components";
import { colors } from "../styles/Theme";
import Header from "../components/header";
import NavBar from "../components/NavBar/NavBar";
import { useSelector } from "react-redux";

export default function Layout({ children, currentView }) {
  const [show, setShow] = useState(false);
  const user = useSelector((state) => state.auth);

  return (
    <div>
      {user && user.authenticated && (
        <section>
          <Header handleShowMenu={() => setShow(!show)} />
          <NavBar show={show} />
        </section>
      )}
      {children}
      <footer></footer>
    </div>
  );
}
