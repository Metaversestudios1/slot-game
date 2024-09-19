import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";
import { FaAngleDown } from "react-icons/fa6";

const AddUser = () => {
  const [loader, setLoader] = useState(false);
  const [mobileValid, setMobileValid] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const initialState = {
    name: "",
    email: "",
    password: "",
    contact: "",
  };
  const [data, setData] = useState(initialState);

  const validateUserForm = () => {
    // Add custom validation method for phone number
    $.validator.addMethod(
      "validPhone",
      function (value, element) {
        return this.optional(element) || /^\d{10}$/.test(value);
      },
      "Please enter a valid 10-digit phone number."
    );

    // Add custom validation method for experience

    // Initialize jQuery validation
    $("#userform").validate({
      rules: {
        username: {
          required: true,
        },
        email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
        },
        contact: {
          required: true,
          validPhone: true, // Apply custom phone number validation
        },
      },
      messages: {
        username: {
          required: "Please enter name",
        },
        email: {
          required: "Please enter email",
          email: "Please enter a valid email address",
        },
        password: {
          required: "Please enter password",
        },
        contact: {
          required: "Please enter contact details",
          validPhone: "Phone number must be exactly 10 digits", // Custom error message
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
    return $("#userform").valid();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateUserForm()) {
      //setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoader(true);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/insertuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      console.log(response)
      if (response.success) {
        setMobileValid("");
        toast.success("New user is added Successfully!", {
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
          navigate("/users");
        }, 1500);
      } else {
        setLoader(false);
        setError(response.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="flex items-center ">
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
        </div>
        <div className="flex items-center">
          <div className="text-2xl font-bold mx-2 my-8 px-2">Add Employee</div>
        </div>
      </div>
      {loader ? (
        <div className="absolute w-[80%] h-[40%] flex justify-center items-center">
          <div
            className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <div className="w-[70%] m-auto my-10">
          <form id="userform">
            <div className="grid gap-6 mb-6 md:grid-cols-2 ">
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  User name<span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="username"
                  value={data.username}
                  onChange={handleChange}
                  type="text"
                  id="username"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="John"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="contact"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Phone number
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="contact"
                  value={data.contact}
                  onChange={handleChange}
                  type="text"
                  id="contact"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="123-45-678"
                  required
                />
                {mobileValid && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {mobileValid}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 ">
              <div className="">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Email address
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  type="email"
                  id="email"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="john.doe@company.com"
                  required
                />
              </div>
              <div className="">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Password<span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  type="password"
                  id="password"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="•••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-900  text-[17px] mb-5">{error}</p>}
            <button
              type="submit"
              onClick={handleSubmit}
              className="text-white hover:scale-110 transition-all duration-200 bg-[#5f22d9] hover:bg-[#6131ff] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
            >
              ADD
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddUser;
