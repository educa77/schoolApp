import styled from "styled-components";
import Preloader from "../Preloader";
import { AnimatePresence, motion } from "framer-motion";
import { colors, device } from "../../styles/Theme";

export const PagePreloader = ({ visible, animateEnter }) => {
  return (
    <AnimatePresence>
      {visible && (
        <Container
          initial={animateEnter ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Preloader maxWidth="400" />
        </Container>
      )}
    </AnimatePresence>
  );
};

const Container = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: ${colors.white};

  @media (max-width: ${device.sm}) {
    padding: 50px;
  }
`;
