import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import $ from "jquery";
import "jquery-validation";
const AddPatternType = () => {
  const navigate = useNavigate();
  const initialState = {
    symbol_count: "",
    patternType: "",
    combination_count: "",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const [data, setData] = useState(initialState);
  const validatePatternTypeForm = () => {
 
 $("#patterntypeform").validate({
   rules: {
    symbol_count: {
        required: true,
        digits: true, // Add this to ensure only numbers are allowed
      },
     patternType: {
       required: true,
     },
     combination_count: {
       required: true,
     },
   },
   messages: {
     symbol_count: {
      required: "Please enter symbol count",
      digits: "Symbol count must be a number",// Add this to ensure only numbers are allowed
      },
     patternType: {
       required: "Please enter pattern type",
     },
     combination_count: {
       required: "Please enter combination count",
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
 return $("#patterntypeform").valid();
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validatePatternTypeForm()) {
      return
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/insertpatterntype`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.success) {
        toast.success("Pattern type added Successfully!", {
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
          navigate("/patternstype");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
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
        <div className="text-2xl font-bold mx-2 my-8 px-2">Add Pattern Type</div>
      </div>
      <div className="flex flex-col items-center justify-center w-[70%] m-auto">
        <form id="patterntypeform" className="w-[60%]">
          <div className="my-4">
            <label
              htmlFor="symbol_count"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
              Symbol count
            </label>
            <input
              type="text"
              name="symbol_count"
              id="symbol_count"
              value={data.symbol_count}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter symbol count"
            />
          </div>
          <div className="my-4 relative">
            <label
              htmlFor="patternType"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
            Pattern type
            </label>
            <input
              type="text"
              name="patternType"
              id="patternType"
              value={data.patternType}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter the pattern type"
            />
          </div>
          <div className="my-4 relative">
            <label
              htmlFor="combination_count"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
            Combination count
            </label>
            <input
              type="text"
              name="combination_count"
              id="combination_count"
              value={data.combination_count}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter combination count"
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

export default AddPatternType;
