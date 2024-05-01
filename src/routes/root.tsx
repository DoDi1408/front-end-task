import { Outlet } from "react-router-dom";
import { NavBar } from "../components/navBar";

export default function Root() {
  return (
    <>
      <NavBar />
      <div id="detail" className="bg-[#F4F3F2] w-full h-screen">
        <Outlet />
      </div>
    </>
  );
}
