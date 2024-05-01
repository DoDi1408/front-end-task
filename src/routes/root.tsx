import { Outlet, Link } from "react-router-dom";

export default function Root() {
  return (
    <>
      <div id="sidebar" className="flex bg-red-400 w-full">
        NAVBAR AGREGENME LOL
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
