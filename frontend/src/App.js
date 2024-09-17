import "./App.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Users from "./components/employees/Users";
import ShowUsers from "./components/employees/ShowUsers";
import EditUser from "./components/employees/EditUser";
import AddUser from "./components/employees/AddUser";
import Home from  "./components/Home";
import Luckyslot from "./components/Luckyslot";
import Login from "./components/Login";
function App() {
  const [sideBar, setSideBar] = useState(true);
  const toggleSideBar = () => {
    setSideBar(!sideBar);
  };
  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <div>
            <Login/>
        </div>
      ),
    },
    {
      path: "/",
      element: (
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <Home/>
          </div>
        </div>
      ),
    },
    {
      path: "/users",
      element: (
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <Users/>
          </div>
        </div>
      ),
    },
    {
      path: "/users/showuser/:id",
      element: (
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <ShowUsers/>
          </div>
        </div>
      ),
    },
    {
      path: "/users/adduser",
      element: (
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <AddUser/>
          </div>
        </div>
      ),
    },
    {
      path: "/users/edituser/:id",
      element: (
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <EditUser/>
          </div>
        </div>
      ),
    },
    {
      path: "/luckyslot",
      element: (
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <Luckyslot/>
          </div>
        </div>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
