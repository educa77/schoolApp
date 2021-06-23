import React, { useState } from "react";
import Dashboard from "../pages/dashboard";
import styled from "styled-components";

export default function Home() {
    return (
        <>
            <Dashboard />
        </>
    );
}

Home.renderData = {
    authRequired: true,
    currentView: "Dashboard",
};
