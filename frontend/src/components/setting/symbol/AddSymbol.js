import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowRoundBack } from "react-icons/io";

const AddSymbol = () => { 
  const navigate = useNavigate();
  const initialState = {
    symbol_name: "",
    win_amount: "",
    win_percentage: "",
  };

  const handleChange = (e)=>{
    const {name, value} = e.target
    setData({...data, [name]:value})
  }

const [data, setData] = useState(initialState)

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/insertsymbol`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        const response = await res.json();
        if (response.success) {
          toast.success("Symbol added Successfully!", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setTimeout(() => {
            navigate("/symbols");
          }, 1500);
        } 
      } catch (err) {
        console.err(err);
      }
  };
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="flex items-center">
      <IoIosArrowRoundBack
      onClick={handleGoBack}
      className="bg-[#5f22d9] rounded-full hover:scale-110 transition-all duration-100 text-white  text-[40px] cursor-pointer shadow-xl ml-5"
    />
        <div className="text-2xl font-bold mx-2 my-8 px-2">Add symbol</div>
      </div>
      <div className="flex flex-col items-center justify-center w-[70%] m-auto">
        <form id="settingform" className="w-[60%]">
          <div className="my-4">
            <label
              htmlFor="symbol_name"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
              Symbol
            </label>
            <input
              type="text"
              name="symbol_name"
              id="symbol_name"
              value={data.symbol_name}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter Symbol"
              required
            />
          </div>
          <div className="my-4 relative">
            <label
              htmlFor="win_percentage"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
            Win percentage
            </label>
            <input
              type="text"
              name="win_percentage"
              id="win_percentage"
              value={data.win_percentage}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter win percentage"
            />
          </div>
          <div className="my-4 relative">
            <label
              htmlFor="win_amount"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
            Win amount
            </label>
            <input
              type="text"
              name="win_amount"
              id="win_amount"
              value={data.win_amount}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter win amount"
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="my-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSymbol;