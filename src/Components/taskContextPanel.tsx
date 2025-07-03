import { useState, useEffect } from "react";
import { getTasks, deleteTask, createTask, updateTask } from "../Context/api"; // Adjust imports for task API
import { FaHistory, FaEdit, FaTrash } from "react-icons/fa";
import "../Styles/contextStyles.css";
import { DynamicFormModal } from "./FormModal"; // Reuse form modal for tasks
import io from "socket.io-client";
import { useAuth } from "../Context/AuthContext";
import { data } from "react-router-dom";

const filterOptions = ["Today", "Tomorrow", "Week", "Month"];
const socket = io("http://localhost:3000", {
  path: "/socket.io",
  transports: ["websocket"],
});

const TaskContextPanel: React.FC = () => {
  const { user } = useAuth();
  const currentUserId = user?.userID;

  const [showTaskFormModal, setShowTaskFormModal] = useState<false | "create" | { type: "edit"; data: any }>(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [filters, setFilters] = useState("Today");
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchTasks = async () => {
    try {
      if (currentUserId) {
        const data = await getTasks(currentUserId);
        setTasks(Array.isArray(data) ? data : []);
      }
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();

    if (currentUserId) {
      socket.emit("join", currentUserId);
    }

    // Real-time listeners
    socket.on("new_task", (newTask: any) => {
      setTasks((prev) => {
        // Prevent duplicate tasks
        if (prev.some(t => t.taskId === newTask.taskId)) return prev;
        return [...prev, newTask];
      });
    });

    socket.on("task_updated", (updatedTask: any) => {
      setTasks((prev) =>
        prev.map((task) => (task.taskId === updatedTask.taskId ? updatedTask : task))
      );
    });

    socket.on("task_deleted", (deletedTaskId: any) => {
      setTasks((prev) => prev.filter((task) => task.taskId !== deletedTaskId));
    });

    return () => {
      socket.off("new_task");
      socket.off("task_updated");
      socket.off("task_deleted");
    };
  }, [currentUserId]);

  const handleTaskSubmit = async (taskData: any) => {
    try {
      if (showTaskFormModal === "create") {
        await createTask({ ...taskData, userId: currentUserId });
      } else if (showTaskFormModal && showTaskFormModal.type === "edit") {
        await updateTask(taskData.taskId, taskData);
      }
    } catch (err) {
      console.error("Task submission failed:", err);
    } finally {
      setShowTaskFormModal(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      // socket will remove the task from UI
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const renderTasks = (category: string) =>
    tasks
      .filter((t) => {
        if (category === "upcoming") {
          const taskDate = new Date(t.dueDate);
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const diffInMs = taskDate.getTime() - today.getTime();
          const oneDay = 24 * 60 * 60 * 1000;
  
          switch (filters) {
            case "Today":
              return taskDate.toDateString() === today.toDateString();
            case "Tomorrow":
              return taskDate.toDateString() === new Date(today.getTime() + oneDay).toDateString();
            case "Week":
              return diffInMs >= 0 && diffInMs < oneDay * 7;
            case "Month":
              return taskDate.getMonth() === now.getMonth();
            default:
              return true;
          }
        }
        return t.category === category;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) // <-- Sort by dueDate ascending
      .map((task) => (
        <div key={task.taskId} className="tasklist-item">
          <div className="tasklist-info">
            <strong>{task.title}</strong>
            <span>{new Date(task.dueDate).toLocaleString()}</span>
          </div>
          <div className="tasklist-actions">
            <FaEdit className="task-icon" onClick={() => setShowTaskFormModal({ type: "edit", data: task })} />
            <FaTrash className="task-icon" onClick={() => handleDelete(task.taskId)} />
          </div>
        </div>
      ));

  return (
    <>
      <div className="chatlist-header">
        <span>Tasks</span>
        <div className="chatlist-right-btns">
          <button className="eventlist-history-btn" title="View History">
            <FaHistory />
          </button>
          <div className="chatlist-new-btn" onClick={() => setShowTaskFormModal("create")}>
            ＋ New Task
          </div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="chatlist-section chatlist-scrollable">
        <div className="tasklist-section-header">
          <h4 className="chatlist-title">
            Upcoming (
            <span
              className="filter-dropdown-trigger"
              onClick={() => setShowDropdown((prev) => !prev)}
              style={{ cursor: "pointer", marginLeft: "4px" }}
            >
              {filters}
            </span>
            )
          </h4>
          {showDropdown && (
            <div className="tasklist-dropdown">
              {filterOptions.map((option) => (
                <div
                  key={option}
                  className={`tasklist-dropdown-item ${filters === option ? "selected" : ""}`}
                  onClick={() => {
                    setFilters(option);
                    setShowDropdown(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        {renderTasks("upcoming")}
      </div>

      {/* Work Tasks */}
      <div className="chatlist-section chatlist-scrollable">
        <div className="tasklist-section-header">
          <h4 className="chatlist-title">Work</h4>
        </div>
        {renderTasks("work")}
      </div>

      {/* Personal Tasks */}
      <div className="chatlist-section chatlist-scrollable">
        <div className="tasklist-section-header">
          <h4 className="chatlist-title">Personal</h4>
        </div>
        {renderTasks("personal")}
      </div>

      {showTaskFormModal && (
        <DynamicFormModal
          isOpen={!!showTaskFormModal}
          type="task"
          onClose={() => setShowTaskFormModal(false)}
          onSubmit={handleTaskSubmit}
        />
      )}
    </>
  );
};

export default TaskContextPanel;
