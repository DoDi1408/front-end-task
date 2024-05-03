export type Tasks = {
  id: number;
  title: string;
  description: string;
  stateTask: number;
  dueDate: string;
}[];

export type TasksManager = {
  id: number;
  title: string;
  description: string;
  stateTask: number;
  dueDate: string;
  employeeName: string;
};
