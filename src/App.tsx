import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import NewTask from "./components/NewTask";
import NewUser from "./components/NewUser";
import Task from "./components/Task";
import RequireAuth from "./components/auth/RequireAuth";
import Welcome from "./components/auth/Welcome";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";

export default function App() {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<Home />} />
          <Route path="inventory" element={<Detections />} />
          <Route path="upload" element={<Upload />} /> */}
          <Route index element={<Users />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/users/new" element={<NewUser />} />
          <Route path="/tasks/new" element={<Task />} />
          <Route path="/tasks/:id/edit" element={<Task />} />
          <Route path="/*" element={<Tasks />} />
        </Route>
      </Route>
      {/* Public routes */}

      <Route path="/welcome" element={<Welcome />} />
      {/* <Route path="/admin" element={<Admin />} /> */}
    </Routes>
  );
}
