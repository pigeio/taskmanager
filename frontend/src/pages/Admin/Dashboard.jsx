import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { addThousandsSeperator } from "../../utils/helper";

import InfoCard from "../../components/Cards/InfoCards";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/layouts/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";


const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const Dashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const prepareChartData = (charts) => {
    const taskDistribution = charts?.taskDistribution || {};
    const taskPriorityLevels = charts?.taskPriorityLevels || {};

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    const hasPieData = taskDistributionData.some(item => item.count > 0);
    const fallbackPie = [
      { status: "Pending", count: 1 },
      { status: "In progress", count: 1 },
      { status: "Completed", count: 1 },
    ];
    setPieChartData(hasPieData ? taskDistributionData : fallbackPie);

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];

    const hasBarData = priorityLevelData.some(item => item.count > 0);
    const fallbackBar = [
      { priority: "Low", count: 1 },
      { priority: "Medium", count: 1 },
      { priority: "High", count: 1 },
    ];
    setBarChartData(hasBarData ? priorityLevelData : fallbackBar);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      if (response && response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || {});
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const onSeeMore = () => navigate("/admin/tasks");

  const getGreeting = () => {
    const hour = moment().hour();
    return hour < 12 ? "Good Morning!" : hour < 18 ? "Good Afternoon!" : "Good Evening!";
  };

  useEffect(() => { getDashboardData(); }, []);

  if (!user || loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="p-4 text-center">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="card my-5">
        <div className="col-span-3">
          <h2 className="text-xl md:text-2xl">{getGreeting()} {user?.name}</h2>
          <p className="text-xs md:text-sm text-gray-400 mt-1.5">{moment().format("dddd Do MMM YYYY")}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 md:gap-6 mt-5">
          <InfoCard label="Total Tasks" value={addThousandsSeperator(dashboardData?.charts?.taskDistribution?.All || 0)} color="bg-primary" />
          <InfoCard label="Pending Tasks" value={addThousandsSeperator(dashboardData?.charts?.taskDistribution?.Pending || 0)} color="bg-violet-500" />
          <InfoCard label="In Progress Tasks" value={addThousandsSeperator(dashboardData?.charts?.taskDistribution?.InProgress || 0)} color="bg-cyan-500" />
          <InfoCard label="Completed Tasks" value={addThousandsSeperator(dashboardData?.charts?.taskDistribution?.Completed || 0)} color="bg-lime-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="min-w-[300px] w-full">
          <div className="card">
            <h5 className="font-medium">Task Distribution</h5>
            <div className="h-[300px] w-full">
              <CustomPieChart data={pieChartData} colors={COLORS} />
            </div>
          </div>
        </div>

        <div className="min-w-[300px] w-full">
          <div className="card">
            <h5 className="font-medium">Task Priority Levels</h5>
            <div className="h-[300px] w-full">
              <CustomBarChart data={barChartData} />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>
              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>
            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;




