import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";

const Login = () => {
    const validateLoginForm = () => {
      
        $("#loginform").validate({
          rules: {
            email: {
              required: true,
              email: true,
            },
            password: {
              required: true,
            },
          },
          messages: {
          
            email: {
              required: "Please enter email",
              email: "Please enter a valid email address",
            },
            password: {
              required: "Please enter password",
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
        return $("#loginform").valid();
      };

    const handleSubmit = async(e)=>{
        e.preventDefault();
        if (!validateLoginForm()) {
          //setError("Please fill in all required fields.");
          return;
        }
    }
  return (
    <div>
      <div class="flex w-full flex-wrap">
        <div class="flex w-full flex-col md:w-1/2 lg:w-1/3">
          <div class="my-auto flex flex-col justify-center px-6 pt-8 sm:px-24 md:justify-start md:px-8 md:pt-0 lg:px-12">
            <p class="text-center text-3xl font-bold">Welcome</p>
            <p class="mt-2 text-center">Login to access your account.</p>
            <form class="flex flex-col pt-3 md:pt-8" id="loginform">
              <div class="flex flex-col pt-4">
                <div class="relative flex items-center overflow-hidden rounded-lg border focus-within:border-transparent focus-within:ring-2 transition focus-within:ring-blue-600">
                  <span class="inline-flex items-center border-r border-gray-300 bg-white px-3 text-sm text-gray-500 shadow-sm">
                    <svg
                      width="15"
                      height="15"
                      fill="currentColor"
                      viewBox="0 0 1792 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z"></path>
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    id="login-email"
                    class="w-full flex-1 appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400  focus:outline-none"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div class="mb-12 flex flex-col pt-4">
                <div class="relative flex items-center overflow-hidden rounded-lg border focus-within:border-transparent focus-within:ring-2 transition focus-within:ring-blue-600">
                  <span class="inline-flex items-center border-r border-gray-300 bg-white px-3 text-sm text-gray-500 shadow-sm">
                    <svg
                      width="15"
                      height="15"
                      fill="currentColor"
                      viewBox="0 0 1792 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z"></path>
                    </svg>
                  </span>
                  <input
                    type="password"
                    name="password"
                    id="login-password"
                    class="w-full flex-1 appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400  focus:outline-none"
                    placeholder="Password"
                  />
                </div>
              </div>
              <button
                onClick={handleSubmit}
                type="submit"
                class="w-full rounded-lg bg-blue-700 px-4 py-2 text-center text-base font-semibold text-white shadow-md transition ease-in hover:bg-blue-600 focus:outline-none focus:ring-2"
              >
                <span class="w-full">Login</span>
              </button>
            </form>
          </div>
        </div>
        <div class="pointer-events-none hidden select-none bg-black shadow-2xl md:block md:w-1/2 lg:w-2/3">
          <img
            class="h-screen w-full object-cover opacity-90"
            src="/loginimage.jpeg"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
