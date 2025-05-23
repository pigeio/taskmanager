import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Auth/Login"
import SignUp from './pages/Auth/SignUp';

//Admin pages
import Dashboard from './pages/Admin/Dashboard';
import ManageTasks from './pages/Admin/ManageTasks';
import CreateTask from './pages/Admin/CreateTask';
import ManageUsers from './pages/Admin/ManageUsers';

//user pages
import UserDashboard from './pages/User/UserDashboard';
import MyTasks from './pages/User/MyTasks';
import ViewTaskDetails from './pages/User/ViewTaskDetails';

import PrivateRoute from './routes/PrivateRoute';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path= "/login" element={<Login/>} />
          <Route path="/signUp" element={<SignUp/>} />

          {/*Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element ={<Dashboard />} />
          <Route path="/admin/tasks" element ={<ManageTasks />} />
          <Route path="/admin/create-task" element ={<CreateTask />} />
          <Route path="/admin/users" element ={<ManageUsers />} />
          </Route>

          {/*User Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/user/dashboard" element ={<UserDashboard />} />
          <Route path="/user/tasks" element={<MyTasks />} />
          <Route path="/user/tasks-details/:id" element={<ViewTaskDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
