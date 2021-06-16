import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector((state) => state.auth);
  return <></>;
}

Home.renderData = {
  authRequired: true,
  currentView: "Home",
};
