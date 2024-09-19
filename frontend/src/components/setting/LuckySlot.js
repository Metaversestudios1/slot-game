import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";

const LuckySlot = () => {
  const [error, setError] = useState("");
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
  //   $("#settingform").validate({
  //     rules: {
  //       oldPassword: {
  //         required: true,
  //       },
  //       newPassword: {
  //         required: true,
  //       },
  //       confirmPassword: {
  //         required: true,
  //         equalTo: "#newPassword", // Ensures confirmPassword matches newPassword
  //       },
  //     },
  //     messages: {
  //       oldPassword: {
  //         required: "Please enter old Password",
  //       },
  //       newPassword: {
  //         required: "Please enter new Password",
  //       },
  //       confirmPassword: {
  //         required: "Please confirm your Password",
  //         equalTo: "Passwords do not match",
  //       },
  //     },
  //     errorElement: "div",
  //     errorPlacement: function (error, element) {
  //       error.addClass("invalid-feedback");
  //       error.insertAfter(element);
  //     },
  //     highlight: function (element) {
  //       $(element).addClass("is-invalid").removeClass("is-valid");
  //     },
  //     unhighlight: function (element) {
  //       $(element).removeClass("is-invalid").addClass("is-valid");
  //     },
  //   });

  //   // Return validation status
  //   return $("#settingform").valid();
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/changePassword`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        const response = await res.json();
        if (response.success) {
          setError("");
          toast.success("Setting changed Successfully!", {
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
            navigate(0);
          }, 1500);
        } else {
          setError(response.message);
        }
      } catch (err) {
        console.err(err);
      }
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
        <div className="text-2xl font-bold mx-2 my-8 px-4">Lucky Slot</div>
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
              placeholder="New Password"
              required
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
              type="password"
              name="win_amount"
              id="win_amount"
              value={data.win_amount}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Confirm Password"
              required
            />
          </div>
          {error && <p className="text-red-900  text-[17px] mb-5">{error}</p>}

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

export default LuckySlot;
