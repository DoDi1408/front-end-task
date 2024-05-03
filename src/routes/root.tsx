import { Outlet } from "react-router-dom";
import { NavBar } from "../components/navBar";

export default function Root() {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div id="detail" className="bg-[#F4F3F2] flex-1">
        <Outlet />
      </div>
    </div>
  );
}
