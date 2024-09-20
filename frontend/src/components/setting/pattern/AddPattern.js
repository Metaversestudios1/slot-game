import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import $ from "jquery";
import "jquery-validation";
const AddPattern = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [symbols, setSymbols] = useState([]);
  const initialState = {
    symbol: [],
    patternType: "",
    coordinates: [[], [], []],
    win_amount: "",
    description: "",
    minMatchesRequired: "",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const [data, setData] = useState(initialState);
  useEffect(() => {
    fetchSymbols();
  },[]);
  const fetchSymbols = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllsymbol`);
    const response = await res.json();
    if (response.success) {
      setSymbols(response.result);
    }
  };
  const validatePatternForm = () => {
    $("#patternform").validate({
      rules: {
        "symbol[]": {
          required: true
        },
        patternType: {
          required: true,
        },
        coordinates: {
          required: true,
        },
        win_amount: {
          required: true,
        },
      },
      messages: {
        "symbol[]": {
          required: "Please select at least one symbol",
        },
        patternType: {
          required: "Please enter pattern type",
        },
        coordinates: {
          required: "Please enter coordinates",
        },
        win_amount: {
          required: "Please enter win amout",
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
    return $("#patternform").valid();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validatePatternForm()){
      return
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/insertpattern`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.success) {
        toast.success("Pattern added Successfully!", {
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
          navigate("/patterns");
        }, 1500);
      }
    } catch (err) {
      console.err(err);
    }
  };
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setData((prevState) => ({
      ...prevState,
      symbol: checked
        ? [...prevState.symbol, value]
        : prevState.symbol.filter((id) => id !== value),
    }));
  };
  const handleCoordinatesChange = (index, coordIndex, value) => {
    const newCoordinates = [...data.coordinates];
    newCoordinates[index][coordIndex] = value;
    setData({ ...data, coordinates: newCoordinates });
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
        <div className="text-2xl font-bold mx-2 my-8 px-2">Add pattern</div>
      </div>
      <div className="flex flex-col items-center justify-center w-[70%] m-auto">
        <form id="patternform" className="w-[60%]">
          <div>
            <label
              htmlFor="symbol"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Symbols
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                }}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black w-full p-2.5 flex justify-between items-center"
              >
                Select symbols
                <FaAngleDown className="text-end" />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 bg-white border border-gray-300 rounded-sm shadow-lg w-full" style={{ zIndex: 10 }}>
                  {symbols.map((item) => (
                    <div
                      key={item._id}
                      className="p-2 bg-gray-200 text-gray-900 text-sm  focus:ring-blue-500 focus:border-black block w-full"
                    >
                      <input
                        type="checkbox"
                        id={`symbol-${item._id}`}
                        value={item._id}
                        checked={data.symbol.includes(item._id)}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`symbol-${item._id}`}
                        className="text-gray-900 text-sm"
                      >
                        {item.symbol_name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              <input
              type="hidden"
              name="symbol[]"
              value={data.symbol.length ? "valid" : ""}
            />
            </div>
          </div>
          <div className="my-4 relative ">
            <label
              htmlFor="patternType"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
              Pattern Type
            </label>
            <input
              type="text"
              name="patternType"
              id="patternType"
              value={data.patternType}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter Pattern type"
            />
          </div>
          <div className="my-4 relative">
            <label
              htmlFor="coordinates"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
              Coordinates
            </label>
            <div className="flex flex-col" >
            {data.coordinates.map((coord, index) => (
              <div key={index} className="flex flex-row">
                <input
                  type="number"
                  placeholder={`Row ${index + 1}`}
                  value={coord[0]}
                  onChange={(e) =>
                    handleCoordinatesChange(index, 0, Number(e.target.value))
                  }
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 m-1"
                />
                <input
                  type="number"
                  placeholder={`Col ${index + 1}`}
                  value={coord[1]}
                  onChange={(e) =>
                    handleCoordinatesChange(index, 1, Number(e.target.value))
                  }
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 m-1"
                />
              </div>
            ))}
            </div>
          </div>
          <div className="my-4 relative">
            <label
              htmlFor="minMatchesRequired"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
            Min matches required
            </label>
            <input
              type="text"
              name="minMatchesRequired"
              id="minMatchesRequired"
              value={data.minMatchesRequired}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter Minimum matches required"
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
          <div className="my-4 relative">
            <label
              htmlFor="description"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
            Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              value={data.description}
              onChange={handleChange}
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter description"
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

export default AddPattern;
