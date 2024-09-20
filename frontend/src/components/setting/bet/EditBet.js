import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowRoundBack } from "react-icons/io";

const EditBet = () => {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const initialState = {
    bet_size: "",
    bet_line: "",
    bet_amount: "",
    bet_level: "",
  };

  const [oldData, setOldData] = useState(initialState);
  useEffect(() => {
    fetchOldData();
  }, []);

  const fetchOldData = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getSinglebet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const response = await res.json();
    if (response.success) {
      setOldData({
        ...oldData,
        bet_size: response?.result?.bet_size,
        bet_line: response?.result?.bet_line,
        bet_amount: response?.result?.bet_amount,
        bet_level: response?.result?.bet_level,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOldData({ ...oldData, [name]: value });
  };

  const handleSubmit = async (e) => {
    const updatedata = { id, oldData };
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updatebet`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedata),
      });
      const response = await res.json();
      if (response.success) {
        toast.success("Bet updated Successfully!", {
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
          navigate("/bets");
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
        <div className="text-2xl font-bold mx-2 my-8 px-2">Edit Bet</div>
      </div>
      <div className="flex flex-col items-center justify-center w-[70%] m-auto">
        <form id="settingform" className="w-[60%]">
          <div className="my-4">
            <label
              htmlFor="bet_size"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
              Bet size
            </label>
            <input
              type="text"
              name="bet_size"
              id="bet_size"
              value={oldData?.bet_size}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter Bet size"
            />
          </div>
          <div className="my-4 relative">
            <label
              htmlFor="bet_line"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
            Bet Line
            </label>
            <input
              type="text"
              name="bet_line"
              id="bet_line"
              value={oldData?.bet_line}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter bet line"
            />
          </div>
          <div className="my-4 relative">
            <label
              htmlFor="bet_amount"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
            Bet amount
            </label>
            <input
              type="text"
              name="bet_amount"
              id="bet_amount"
              value={oldData?.bet_amount}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter bet amount"
            />
          </div>
          <div className="my-4 relative">
            <label
              htmlFor="bet_level"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
            Bet_level
            </label>
            <input
              type="text"
              name="bet_level"
              id="bet_level"
              value={oldData?.bet_level}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter bet level"
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="my-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
          Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBet;
