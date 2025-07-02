export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  
  AUTH: {
    REGISTER: "/api/auth/register",          // Register new user (admin / member)
    LOGIN: "/api/auth/login",                // Login – returns JWT
    GET_PROFILE: "/api/auth/profile",        // Logged-in user details
    VERIFY_EMAIL: "/api/auth/verify-email",  // Email verification
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    LOGOUT: "/api/auth/logout"
  },

  USERS: {
    GET_ALL: "/api/users",                         // GET  → all users
    CREATE: "/api/users",                          // POST → create user
    UPDATE: (id) => `/api/users/${id}`,            // PUT  → update user by id
    DELETE: (id) => `/api/users/${id}`             // DELETE → delete user by id
  },

  
  TASKS: {
    // Dashboard
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",       // Admin dashboard
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // User dashboard

    // Task CRUD
    GET_ALL: "/api/tasks",                           // GET  → all tasks
    GET_BY_ID: (id) => `/api/tasks/${id}`,           // GET  → task details
    CREATE: "/api/tasks",                            // POST → new task
    UPDATE: (id) => `/api/tasks/${id}`,              // PUT  → update task body
    UPDATE_STATUS: (id) => `/api/tasks/${id}/status`,// PUT  → update status only
    UPDATE_TODO: (id) => `/api/tasks/${id}/todo`     // PUT  → update checklist
  },

  
  REPORTS: {
    EXPORT_TASKS: "/api/reports/export-tasks",       // Export tasks CSV / Excel
    EXPORT_USERS: "/api/reports/export-users"        // Export users CSV / Excel
  }
};
