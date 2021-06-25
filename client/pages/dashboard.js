import React from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

function Dashboard() {
    return (
        <AnimatePresence>
            <ContainerBox
                exit={{ opacity: 0 }}
                animate={{
                    scale: [1, 2, 2, 1, 1],
                    rotate: [0, 0, 270, 270, 0],
                    borderRadius: ["20%", "20%", "50%", "50%", "20%"],
                }}>
                <Draw src="assets/hello.svg" alt="hello" />
            </ContainerBox>
        </AnimatePresence>
    );
}

export default Dashboard;

const ContainerBox = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 4rem - 1px);
    height: 100%;
`;

const Draw = styled.img`
    width: 100%;
    max-width: calc(100vw - 10rem);
    max-height: 50vh;
`;

Dashboard.renderData = {
    authRequired: true,
    currentView: "Dashboard",
};
