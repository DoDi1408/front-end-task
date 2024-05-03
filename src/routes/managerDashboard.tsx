import { DataTable } from "../components/managerTable/data-table";
import { columns } from "../components/managerTable/columns";
import { TasksManager } from "@/lib/types";
import { useState, useEffect } from "react";
import axios from "axios";

/* const data: TasksManager[] = [
  {
    id: 1212,
    dueDate: "2 de Julio",
    employeeName: "Raul Alejandro",
    title: "Unit Tests",
    description: "Lorem Ipsum Lorem Ipsum Lorem Ipsum",
    stateTask: 1,
  },
  {
    id: 212,
    dueDate: "5 de Julio",
    employeeName: "Rodrigo Chavez",
    title: "Create Pipeline",
    description: "Lorem Ipsum Lorem Ipsum Lorem Ipsum",
    stateTask: 2,
  },
  {
    id: 3232,
    dueDate: "2 de Julio",
    employeeName: "Raul Alejandro",
    title: "Develop unit tests for compiler",
    description: "Lorem Ipsum Lorem Ipsum Lorem Ipsum",
    stateTask: 2,
  },
  {
    id: 3232,
    dueDate: "5 de Julio",
    employeeName: "Rodrigo Chavez",
    title: "Create Pipeline",
    description: "Lorem Ipsum Lorem Ipsum Lorem Ipsums",
    stateTask: 1,
  },
  {
    id: 32332,
    dueDate: "6 de Julio",
    employeeName: "Erick luna",
    title: "Develop Unit Tests",
    description: "Lorem Ipsum Lorem Ipsum Lorem Ipsums",
    stateTask: 0,
  },
]; */

const ManagerDashboard = () => {
  const [data, setData] = useState<TasksManager[]>();
  const [employees, setEmployees] =
    useState<{ value: string; label: string }[]>();

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "https://api.romongo.uk/manager/7/teamTasks"
      );

      console.log(response);
      const seenEmployees = new Set();
      const newEmployeeList: { value: string; label: string }[] = [];
      response.data.forEach(
        (
          task: TasksManager & {
            employee: { firstName: string; lastname: string };
          }
        ) => {
          const employeeName = `${task?.employee?.firstName} ${task?.employee?.lastname}`;
          if (!seenEmployees.has(employeeName)) {
            seenEmployees.add(employeeName);
            newEmployeeList.push({
              value: employeeName,
              label: employeeName,
            });
          }
        }
      );
      setEmployees(newEmployeeList);
      setData(
        response.data.map(
          (
            task: TasksManager & {
              employee: { firstName: string; lastname: string };
            }
          ) => ({
            id: task?.id,
            description: task?.description,
            stateTask: task?.stateTask,
            dueDate: task?.dueDate,
            employeeName: `${task?.employee?.firstName} ${task?.employee?.lastname}`,
          })
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <h1 className="font-bold text-3xl py-5 text-center">
        Team Tasks: SQL Infrastructure
      </h1>
      <div className="container mx-auto py-5">
        <DataTable
          columns={columns}
          data={data ?? []}
          employees={employees ?? []}
        />
      </div>
    </>
  );
};

export default ManagerDashboard;
