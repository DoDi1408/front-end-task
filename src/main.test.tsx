import { mapStateTaskToColumn } from "./components/employeeKanban/kanban";
import { render, waitFor } from "@testing-library/react";
import axios from 'axios';
import EmployeeDashboard from "./routes/employeeDashboard";
import ManagerDashboard from "./routes/managerDashboard";
import { act } from "react-dom/test-utils";
jest.mock("axios"); // Mock axios for controlled testing


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



describe('Employee Dashboard', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    // Set the token in local storage
    window.localStorage.setItem("jwt", "test-token");
  });

  afterEach(() => {
    // Clean up local storage
    window.localStorage.removeItem("jwt");
  });

  test("EmployeeDashboard fetches data on mount", async () => {
    const mockData = [
      {
        id: 1,
        title: "Task 1",
        description: "This is a task description",
        stateTask: "To Do",
        dueDate: "2024-06-12",
      },
    ];
  
    const mockResponse = {
      data: mockData,
      headers: {
        "new-token": "updated_token",
      },
    };
  

    mockedAxios.get.mockResolvedValue(mockResponse)

    const {getByText} = await act( async () => {
     return render(<EmployeeDashboard axiosInstance={mockedAxios}/>)
  });
  
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("https://api.romongo.uk/employee/tasks",  {"headers": {"token": "test-token"}});

      expect(getByText("My Tasks")).toBeInTheDocument();
      expect(getByText("Task 1")).toBeInTheDocument();
    })
  });

  test("Employee Dashboard handles 0 tasks correctly", async () => {
  
    const mockResponse = {
      data: [],
      headers: {
        "new-token": "updated_token",
      },
    };
  
    mockedAxios.get.mockResolvedValue(mockResponse)

    const {getByText} = await act( async () => {
     return render(<EmployeeDashboard axiosInstance={mockedAxios}/>)
  });
  
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("https://api.romongo.uk/employee/tasks",  {"headers": {"token": "test-token"}});

      expect(getByText("No results.")).toBeInTheDocument();
    })
  });
})

describe('Manager Dashboard', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockData = [
    {
      id: 1,
      title: "Task 1",
      description: "This is a task description",
      stateTask: "To Do",
      dueDate: "2024-06-12",
      employee: {
        firstName: "Juan",
        lastName: "Perez"
      }
    },
  ];
  const mockResponse = {
    data: mockData,
    headers: {
      "new-token": "updated_token",
    },
  };

  beforeEach(() => {
    // Set the token in local storage
    window.localStorage.setItem("jwt", "test-token");
  });

  afterEach(() => {
    // Clean up local storage
    window.localStorage.removeItem("jwt");
  });

  test("Manager Dashboard fetches data on mount", async () => {
  
    mockedAxios.get.mockResolvedValue(mockResponse)

    await act( async () => {
      render(<ManagerDashboard />)
  });
  
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("https://api.romongo.uk/manager/teamTasks",  {"headers": {"token": "test-token"}});

    })
  });

  test("Verify employees names are parsed and shown correctly", async () => {
  
    mockedAxios.get.mockResolvedValue(mockResponse)

    const {getByText} = await act( async () => {
      return render(<ManagerDashboard />)
  });
  
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("https://api.romongo.uk/manager/teamTasks",  {"headers": {"token": "test-token"}});
      expect(getByText("Juan Perez")).toBeInTheDocument();
    })
  });

  test("Handle 0 team employee tasks correctly", async () => {
    
    const mockResponse2 = {
      data: [],
      headers: {
        "new-token": "updated_token",
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse2)

    const {getByText} = await act( async () => {
      return render(<ManagerDashboard />)
  });
  
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("https://api.romongo.uk/manager/teamTasks",  {"headers": {"token": "test-token"}});
      
      expect(getByText("No results.")).toBeInTheDocument();
    })
  });
})