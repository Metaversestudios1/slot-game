import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";

const EditPattern = () => {
  const params = useParams();
  const { id } = params;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const initialState = {
    symbol: "",
    patternType: "",
    coordinates: [[], [], []],
    win_amount: "",
    description: "",
    minMatchesRequired: "",
  };
  const [symbols, setSymbols] = useState([]);

  const [oldData, setOldData] = useState(initialState);
  useEffect(() => {
    fetchOldData();
    fetchSymbols();
  }, []);
  const fetchSymbols = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllsymbol`);
    const response = await res.json();
    if (response.success) {
      setSymbols(response.result);
    }
  };
  const fetchOldData = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getSinglepattern`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const response = await res.json();
    if (response.success) {
      setOldData({
        ...oldData,
        symbol: response?.result?.symbol,
        patternType: response?.result?.patternType,
        coordinates: response?.result?.coordinates,
        win_amount: response?.result?.win_amount,
        description: response?.result?.description,
        minMatchesRequired: response?.result?.minMatchesRequired,
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
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updatepattern`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedata),
      });
      const response = await res.json();
      if (response.success) {
        toast.success("Pattern updated Successfully!", {
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

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setOldData((prevState) => ({
      ...prevState,
      symbol: checked
        ? [...prevState.symbol, value]
        : prevState.symbol.filter((id) => id !== value),
    }));
  };
  const handleCoordinatesChange = (index, coordIndex, value) => {
    const newCoordinates = [...oldData.coordinates];
    newCoordinates[index][coordIndex] = value;
    setOldData({ ...oldData, coordinates: newCoordinates });
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
        <div className="text-2xl font-bold mx-2 my-8 px-2">Edit pattern</div>
      </div>
      <div className="flex flex-col items-center justify-center w-[70%] m-auto">
        <form id="settingform" className="w-[60%]">
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
                <div
                  className="absolute max-h-36 overflow-y-scroll top-full left-0 bg-white border border-gray-300 rounded-sm shadow-lg w-full"
                  style={{ zIndex: 10 }}
                >
                  {symbols.map((item) => (
                    <div
                      key={item._id}
                      className="p-2 bg-gray-200 text-gray-900 text-sm  focus:ring-blue-500 focus:border-black block w-full"
                    >
                      <input
                        type="checkbox"
                        id={`symbol-${item._id}`}
                        value={item._id}
                        checked={oldData?.symbol.includes(item._id)}
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
              value={oldData?.patternType}
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
            <div className="flex flex-col">
              {oldData?.coordinates.map((coord, index) => (
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
              value={oldData?.minMatchesRequired}
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
              value={oldData?.win_amount}
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
              value={oldData?.description}
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
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPattern;
