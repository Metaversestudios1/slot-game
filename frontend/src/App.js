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
import Error from "./components/Error";
import Symbols from "./components/setting/symbol/Symbols";
import EditSymbol from "./components/setting/symbol/EditSymbol";
import AddSymbol from "./components/setting/symbol/AddSymbol";
import Bets from "./components/setting/bet/Bets";
import AddBet from "./components/setting/bet/AddBet";
import EditBet from "./components/setting/bet/EditBet";
import Patterns from "./components/setting/pattern/Patterns";
import AddPattern from "./components/setting/pattern/AddPattern";
import EditPattern from "./components/setting/pattern/EditPattern";
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
    
    {
      path: "/symbols",
      element: (
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <Symbols/>
          </div>
        </div>
      ),
    },
    {
      path: "/symbols/addsymbol",
      element: (
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <AddSymbol/>
          </div>
        </div>
      ),
    },
    {
      path: "/symbols/editsymbol/:id",
      element: (
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <EditSymbol/>
          </div>
        </div>
      ),
    },
    {
      path: "/bets",
      element: (
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <Bets/>
          </div>
        </div>
      ),
    },
    {
      path: "/bets/addbet",
      element: (
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <AddBet/>
          </div>
        </div>
      ),
    },
    {
      path: "/bets/editbet/:id",
      element: (
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <EditBet/>
          </div>
        </div>
      ),
    },
    {
      path: "/patterns",
      element: (
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <Patterns/>
          </div>
        </div>
      ),
    },
    {
      path: "/patterns/addpattern",
      element: (
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <AddPattern/>
          </div>
        </div>
      ),
    },
    {
      path: "/patterns/editpattern/:id",
      element: (
        <div className="flex h-screen">
          <Sidebar sidebar={sideBar} className="flex-1" />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <EditPattern/>
          </div>
        </div>
      ),
    },
    {
      path: "*",
      element: (
        <Error/>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
