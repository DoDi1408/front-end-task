import { useState, useEffect } from "react";
import { DataTable } from "../components/managerTable/data-table";
import { columns } from "../components/managerTable/columns";
import { TasksManager } from "@/lib/types";
import axios from "axios";

const ManagerDashboard = () => {
  const [data, setData] = useState<TasksManager[]>([]);
  const [employees, setEmployees] = useState<
    { value: string; label: string }[]
  >([]);

  const fetchTasks = async () => {
    const token = localStorage.getItem("jwt");
    if (token) {
      const config = {
        headers: { token: token },
      };
      try {
        const response = await axios.get(
          "https://api.romongo.uk/manager/teamTasks",
          config
        );

        console.log(response);
        const seenEmployees = new Set();
        const newEmployeeList: { value: string; label: string }[] = [];
        response.data.forEach(
          (
            task: TasksManager & {
              employee: { firstName: string; lastName: string };
            }
          ) => {
            const employeeName = `${task?.employee?.firstName} ${task?.employee?.lastName}`;
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
                employee: { firstName: string; lastName: string };
              }
            ) => ({
              id: task?.id,
              description: task?.description,
              stateTask: task?.stateTask,
              dueDate: task?.dueDate.substring(0, 10),
              employeeName: `${task?.employee?.firstName} ${task?.employee?.lastName}`,
            })
          )
        );
      } catch (error) {
        console.error(error);
      }
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
        <DataTable columns={columns} data={data} employees={employees} />
      </div>
    </>
  );
};

export default ManagerDashboard;
