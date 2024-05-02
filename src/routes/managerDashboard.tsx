import { DataTable } from "../components/managerTable/data-table";
import { Payment, columns } from "../components/managerTable/columns";

const data: Payment[] = [
  {
    id: "728ed5s2f",
    date: "2 de Julio",
    name: "Raul Alejandro",
    taskName: "Unit Tests",
    status: "pending",
  },
  {
    id: "728e3d5s2f",
    date: "5 de Julio",
    name: "Rodrigo Chavez",
    taskName: "Crear Pipeline",
    status: "completed",
  },
  {
    id: "728ed5s2f",
    date: "2 de Julio",
    name: "Raul Alejandro",
    taskName: "Unit Tests",
    status: "pending",
  },
  {
    id: "728e3d5s2f",
    date: "5 de Julio",
    name: "Rodrigo Chavez",
    taskName: "Crear Pipeline",
    status: "completed",
  },
];

const ManagerDashboard = () => {
  return (
    <>
      <h1 className="font-bold text-3xl py-5 text-center">
        Tareas Equipo: Devops
      </h1>
      <div className="container mx-auto py-5">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

export default ManagerDashboard;
