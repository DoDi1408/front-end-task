import { mapStateTaskToColumn } from "./components/employeeKanban/kanban";

test("Test task state mapping for kanban view", () => {
  const stateTask1 = 0;
  const stateTask2 = 1;
  const stateTask3 = 2;

  const colTask1 = mapStateTaskToColumn(stateTask1);
  const colTask2 = mapStateTaskToColumn(stateTask2);
  const colTask3 = mapStateTaskToColumn(stateTask3);

  expect(colTask1).toMatch("todo");
  expect(colTask2).toMatch("doing");
  expect(colTask3).toMatch("done");
});
