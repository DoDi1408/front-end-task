import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import EmployeeDashboard from "./routes/employeeDashboard";
import "./index.css";
import Login from "./routes/login";
import ManagerDashboard from "./routes/managerDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "employee",
        element: <EmployeeDashboard />,
      },
      {
        path: "manager",
        element: <ManagerDashboard />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
