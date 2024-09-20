import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import $ from "jquery";
import "jquery-validation";
const AddBet = () => {
  const navigate = useNavigate();
  const initialState = {
    bet_size: "",
    bet_line: "",
    bet_level: "",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const [data, setData] = useState(initialState);
  const validateBetForm = () => {
 
 $("#betform").validate({
   rules: {
     bet_size: {
       required: true,
     },
     bet_line: {
       required: true,
     },
     bet_level: {
       required: true,
     },
   },
   messages: {
     bet_size: {
       required: "Please enter bet size",
     },
     bet_line: {
       required: "Please enter bet line",
     },
     bet_level: {
       required: "Please enter bet level",
     },
   },
   errorElement: "div",
   errorPlacement: function (error, element) {
     error.addClass("invalid-feedback");
     error.insertAfter(element);
   },
   highlight: function (element, errorClass, validClass) {
     $(element).addClass("is-invalid").removeClass("is-valid");
   },
   unhighlight: function (element, errorClass, validClass) {
     $(element).removeClass("is-invalid").addClass("is-valid");
   },
 });

 // Return validation status
 return $("#betform").valid();
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateBetForm()) {
      return
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/insertbet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.success) {
        toast.success("Bet added Successfully!", {
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
        <div className="text-2xl font-bold mx-2 my-8 px-2">Add Bet</div>
      </div>
      <div className="flex flex-col items-center justify-center w-[70%] m-auto">
        <form id="betform" className="w-[60%]">
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
              value={data.bet_size}
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
              value={data.bet_line}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter bet line"
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
              value={data.bet_level}
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
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBet;
