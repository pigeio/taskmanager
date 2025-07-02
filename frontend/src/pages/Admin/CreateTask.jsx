import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import DeleteAlert from "../../components/layouts/DeleteAlert";

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedUsers: [],
    todo: [],
  });

  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) =>
    setTaskData((prev) => ({ ...prev, [key]: value }));

  const clearData = () =>
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedUsers: [],
    });

  // CRUD operations

  const getTaskDetailsByID = async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        API_PATHS.TASKS.GET_BY_ID(taskId)
      );
      setTaskData(res.data);
    } catch (err) {
      toast.error(err.message || "Error fetching task");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    try {
      setLoading(true);
      const payload = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: new Date(taskData.dueDate).toISOString(),
        assignedTo: taskData.assignedUsers,
        todoChecklist: taskData.todo.map((item) => ({
          task: item,
          completed: false,
        })),
        attachements: [],
      };
      const res = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, payload);
      toast.success("Task created!");
      navigate("/admin/tasks");
    } catch (err) {
      toast.error(err.message || "Error creating task");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    try {
      setLoading(true);
      await axiosInstance.put(
        API_PATHS.TASKS.UPDATE(taskId),
        taskData
      );
      toast.success("Task updated!");
      navigate("/admin/tasks");
    } catch (err) {
      toast.error(err.message || "Error updating task");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(API_PATHS.TASKS.DELETE(taskId));
      toast.success("Task deleted!");
      navigate("/admin/tasks");
    } catch (err) {
      toast.error(err.message || "Error deleting task");
    } finally {
      setLoading(false);
      setOpenDeleteAlert(false);
    }
  };

  const handleSubmit = async () => {
    if (!taskData.title || !taskData.description || !taskData.dueDate) {
      toast.error("Please fill all required fields");
      return;
    }
    taskId ? await updateTask() : await createTask();
  };

  useEffect(() => {
    getTaskDetailsByID();
  }, [taskId]);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto mt-8 px-6 py-8 bg-gradient-to-br from-indigo-50 via-white to-pink-50 shadow-2xl rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-indigo-700">
            {taskId ? "Update Task" : "Create Task"}
          </h2>

          {taskId && (
            <button
              onClick={() => setOpenDeleteAlert(true)}
              className="text-red-600 hover:text-red-800 flex items-center gap-2"
            >
              <LuTrash2 size={18} />
              Delete
            </button>
          )}
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              placeholder="e.g. Build Landing Page"
              value={taskData.title}
              onChange={(e) => handleValueChange("title", e.target.value)}
              className="w-full rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe the task..."
              value={taskData.description}
              onChange={(e) =>
                handleValueChange("description", e.target.value)
              }
              className="w-full rounded-xl border border-indigo-300 bg-pink-50 px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>

          {/* Assignees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignees
            </label>
            <SelectUsers
              selectedUsers={taskData.assignedUsers}
              setSelectedUsers={(ids) =>
                handleValueChange("assignedUsers", ids)
              }
            />
          </div>

          {/* Todo Checklist */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Checklist / To-do Items
            </label>
            <TodoListInput
              todoList={taskData.todo}
              setTodoList={(list) => handleValueChange("todo", list)}
            />
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <SelectDropdown
                value={taskData.priority}
                onChange={(val) => handleValueChange("priority", val)}
                options={PRIORITY_DATA}
                placeholder="Select priority"
                className="w-full rounded-xl border border-pink-300 bg-pink-50 px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={taskData.dueDate}
                onChange={(e) =>
                  handleValueChange("dueDate", e.target.value)
                }
                className="w-full rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachments
              </label>
              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-60"
            >
              {taskId ? "Update Task" : "Create Task"}
            </button>

            <button
              type="button"
              onClick={clearData}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-xl font-semibold transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/*  Delete confirmation */}
        {openDeleteAlert && (
          <DeleteAlert
            content="Are you sure you want to delete this task?"
            onDelete={deleteTask}
            onCancel={() => setOpenDeleteAlert(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;





