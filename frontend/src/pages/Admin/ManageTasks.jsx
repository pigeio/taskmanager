import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/layouts/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All"); // New state

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
          priority: filterPriority === "All" ? "" : filterPriority, // Send priority
        },
      });

      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      const statusSummary = response.data?.statusSummary || {};
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pending || 0 },
        { label: "In Progress", count: statusSummary.inProgress || 0 },
        { label: "Completed", count: statusSummary.completed || 0 }
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };

  const handleDownloadReport = async () => {
    // add later
  };

  useEffect(() => {
    getAllTasks();
  }, [filterStatus]);

  return (
    <DashboardLayout>
      <div className='my-5'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between'>
          <div className='flex items-center justify-between gap-3'>
            <h2 className='text-xl md:text-xl font-medium'>My Tasks</h2>
            <button
              className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primaryDark rounded-md shadow'
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className='text-lg' />
              Download Report
            </button>

            {/* Priority Filter */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-md text-sm outline-none"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {tabs?.[0]?.count > 0 && (
            <div className='flex items-center gap-3'>
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActivetab={setFilterStatus}
              />

              <button className='hidden lg:flex download-btn' onClick={handleDownloadReport}>
                <LuFileSpreadsheet className='text-lg' />
              </button>
            </div>
          )}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          {allTasks?.map((item, index) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate}
              assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
              attachmentCount={item.attachment?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoChecklist={item.todoChecklist || []}
              onClick={() => {
                handleClick(item);
              }}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;

