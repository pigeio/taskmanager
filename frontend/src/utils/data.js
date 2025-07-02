import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: 1,
    title: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: 2,
    title: "Manage tasks", 
    icon: LuClipboardCheck,          
    path: "/admin/create-task", 
  },
  {
    id: 3,
    title: "Team Members",
    icon: LuUsers,          //LuUsers
    path: "/admin/users",   ///admin/users
  },
  {
    id: 4,
    title: "Create Tasks",  //Team Members
    icon: LuSquarePlus,    //LuSquarePlus
    path: "/tasks/new",    ///tasks/new
  },
  {
    id: 5,
    title: "Logout",
    icon: LuLogOut,
    path: "/logout",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id: 1,
    title: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/user/dashboard",
  },
  {
    id: 2,
    title: "Manage Tasks",
    icon: LuUsers,
    path: "/user/tasks",
  },
  {
    id: 3,
    title: "Team Members",
    icon: LuClipboardCheck,
    path: "/user/tasks",
  },
  {
    id: 4,
    title: "Create Tasks",
    icon: LuSquarePlus,
    path: "/admin/create-task",
  },
  {
    id: 5,
    title: "Logout",
    icon: LuLogOut,
    path: "/logout",
  },
];

export const PRIORITY_DATA = [
    {label: "Low" , value: "Low"},
    {label: "Medium" , value: "Medium"},
    {label: "High" , value: "High"},
];


export const STATUS_DATA = [
    {label: "Pending" , value: "Pending"},
    {label: "In progress" , value: "In Progress"},
    {label: "Completed" , value: "Completed"},
];