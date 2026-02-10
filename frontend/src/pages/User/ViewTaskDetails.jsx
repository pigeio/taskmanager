import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import AvatarGroup from '../../components/layouts/AvatarGroup';
import { LuSquareArrowOutUpRight } from 'react-icons/lu';
import TaskComments from '../../components/Cards/TaskComments';

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-600 bg-cyan-100 border border-cyan-300";
      case "Completed":
        return "text-green-600 bg-green-100 border border-green-300";
      default:
        return "text-indigo-600 bg-indigo-100 border border-indigo-300";
    }
  };

  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_BY_ID(id));
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  const updateTodoChecklist = async (index) => {
    const todoChecklist = [...task?.todoChecklist];
    const taskId = id;

    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;
      try {
        const response = await axiosInstance.put(
          API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),
          { todoChecklist }
        );
        if (response.status === 200) {
          setTask(response.data?.task || task);
        }
      } catch (error) {
        todoChecklist[index].completed = !todoChecklist[index].completed;
      }
    }
  };

  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link;
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) getTaskDetailsByID();
  }, [id]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4 gap-6">
            <div className="form-card col-span-3 bg-white shadow-lg rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">{task?.title}</h2>
                <div
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusTagColor(
                    task?.status
                  )}`}
                >
                  {task?.status}
                </div>
              </div>

              <div className="mb-6">
                <InfoBox label="📝 Description" value={task?.description} />
              </div>

              <div className="grid grid-cols-12 gap-4 mb-6">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="⚡ Priority" value={task?.priority} />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="📅 Due Date"
                    value={
                      task?.dueDate
                        ? moment(task?.dueDate).format("Do MMM YYYY")
                        : "N/A"
                    }
                  />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500 mb-1 block">👥 Assigned To</label>
                  <AvatarGroup
                    avatars={
                      task?.assignedTo?.map((item) => item?.profileImageUrl) || []
                    }
                    maxVisible={5}
                  />
                </div>
              </div>

              {/* Todo Checklist */}
              {task?.todoChecklist?.length > 0 && (
                <div className="mb-6">
                  <label className="text-xs font-semibold text-slate-600 mb-2 block">✅ Todo Checklist</label>
                  <div className="bg-gray-50 rounded-md p-3">
                    {task?.todoChecklist.map((item, index) => (
                      <TodoChecklistItem
                        key={`todo_${index}`}
                        text={item.task}
                        isChecked={item.completed}
                        onChange={() => updateTodoChecklist(index)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {task?.attachments?.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-2 block">📎 Attachments</label>
                  {task.attachments.map((link, index) => (
                    <Attachment
                      key={`link_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              )}
              {/* Comments Section */}
              <div className="mt-8">
                <TaskComments taskId={id} />
              </div>

            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

const InfoBox = ({ label, value }) => (
  <div>
    <label className="text-xs font-semibold text-slate-500">{label}</label>
    <p className="text-sm font-medium text-gray-800 mt-1">{value}</p>
  </div>
);

const TodoChecklistItem = ({ text, isChecked, onChange }) => (
  <div className="flex items-center gap-3 py-2">
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-0 cursor-pointer"
    />
    <p
      className={`text-sm ${isChecked ? "line-through text-gray-400" : "text-gray-800"
        }`}
    >
      {text}
    </p>
  </div>
);

const Attachment = ({ link, index, onClick }) => (
  <div
    className="flex justify-between items-center bg-white border border-gray-200 px-4 py-3 rounded-lg mb-3 shadow-sm hover:bg-gray-50 cursor-pointer transition"
    onClick={onClick}
  >
    <div className="flex items-center gap-3 overflow-hidden">
      <span className="text-xs text-gray-400 font-semibold">
        {index < 9 ? `0${index + 1}` : index + 1}
      </span>
      <p className="text-sm text-blue-600 underline truncate">{link}</p>
    </div>
    <LuSquareArrowOutUpRight className="text-gray-400" />
  </div>
);


