import { useState, useEffect } from "react";
import { getTasks, updateTask, deleteTask } from "../Context/api";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import "../Styles/TaksAreaStyles.css";
import { useAuth } from "../Context/AuthContext";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const TaskContentArea: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const { user } = useAuth();
  const currentUserId = user?.userID;

  const fetchTasks = async () => {
    try {
      const data = await getTasks(currentUserId ?? "");
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    socket.on("taskCreated", (task: any) => {
      setTasks((prev) => [task, ...prev]);
    });
    socket.on("taskUpdated", (updatedTask: { id: any; }) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    });
    socket.on("taskDeleted", ({ id }: { id: string }) => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    });
    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  // When a task is opened, set status to in_progress if needed
  const handleOpenTask = async (task: any) => {
    if (
      task.status === "todo" &&
      (task.assignedTo?.includes(currentUserId) || task.assignedTo === currentUserId)
    ) {
      await handleTaskStatusChange(task.id, "in_progress");
    }
    // Open your task detail modal or page here
    // e.g., setSelectedTask(task);
  };

  const handleTaskStatusChange = async (taskId: string, status: string) => {
    try {
      await updateTask(taskId, { status });
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, status } : task))
      );
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "All") return true;
    return task.status === filterStatus;
  });

  // Helper to determine if current user is assigner
  const isAssigner = (task: any) => task.createdBy === currentUserId;
  // Helper to determine if current user is assignee
  const isAssignee = (task: any) =>
    (Array.isArray(task.assignedTo) && task.assignedTo.includes(currentUserId)) ||
    task.assignedTo === currentUserId;

  return (
    <div className="task-content-area">
      <div className="task-header">
        <h3>Task Manager</h3>
        <div className="task-filter">
          <label>Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="task-table-container">
        <table className="task-table">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="task-row">
                <td
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => handleOpenTask(task)}
                  title="Open Task"
                >
                  {task.title}
                </td>
                <td>{task.description}</td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ""}</td>
                <td>
                  <span className={`task-status ${task.status.toLowerCase()}`}>
                    {task.status}
                  </span>
                </td>
                <td className="task-actions">
                  <FaEdit
                    className="task-action-icon"
                    onClick={() => console.log("Edit task", task.id)}
                  />
                  <FaTrash
                    className="task-action-icon"
                    onClick={() => handleDeleteTask(task.id)}
                  />
                  {/* Status change controls */}
                  {isAssignee(task) && task.status === "in_progress" && (
                    <button
                      className="task-action-btn"
                      onClick={() => handleTaskStatusChange(task.id, "review")}
                    >
                      Request Review
                    </button>
                  )}
                  {isAssigner(task) && task.status === "review" && (
                    <>
                      <button
                        className="task-action-btn"
                        onClick={() => handleTaskStatusChange(task.id, "done")}
                      >
                        Pass
                      </button>
                      <button
                        className="task-action-btn"
                        onClick={() => handleTaskStatusChange(task.id, "in_progress")}
                      >
                        Fail
                      </button>
                    </>
                  )}
                  {/* Generic status dropdown for admin/assigner */}
                  <select
                    value={task.status}
                    onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Completed</option>
                    <option value="blocked">Blocked</option>
                  </select>
                  <FaCheck
                    className="task-action-icon"
                    onClick={() =>
                      task.status !== "done" &&
                      handleTaskStatusChange(task.id, "done")
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskContentArea;
