import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import $ from "jquery";
import "jquery-validation";

const EditPattern = () => {
  const params = useParams();
  const { id } = params;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const initialState = {
    symbol: [], // Array of selected symbol IDs
    patternType: "",
    coordinates: {}, // Object mapping symbol IDs to their coordinates
    description: "",
    minMatchesRequired: "",
  };

  const [symbols, setSymbols] = useState([]);
  const [oldData, setOldData] = useState(initialState);
  const [deselectedSymbols, setDeselectedSymbols] = useState([]); // New state to track deselected symbols
  const [patternType, setPatternType] = useState([]);

  useEffect(() => {
    fetchOldData();
    fetchSymbols();
    fetchPatternType()
  }, []);
  const fetchPatternType = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllpatterntype`);
    const response = await res.json();
    if (response.success) {
      setPatternType(response.result);
    }
  };
  const fetchSymbols = async () => {
    const res = await fetch("${process.env.REACT_APP_BACKEND_URL}/api/getAllsymbol");
    const response = await res.json();
    if (response.success) {
      setSymbols(response.result);
    }
  };

  const fetchOldData = async () => {
    const res = await fetch("${process.env.REACT_APP_BACKEND_URL}/api/getSinglepattern", {
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

  const validatePatternForm = () => {
    $("#editPatternForm").validate({
      rules: {
        "symbol[]": {
          required: true,
        },
        patternType: {
          required: true,
        },
        coordinates: {
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
      },
    });
    return $("#editPatternForm").valid();
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      if (oldData.symbol.length >= 3) {
        toast.error("You cannot select more than 3 symbols.", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      const newCoordinates = { ...oldData.coordinates };
      if (!newCoordinates[value]) {
        newCoordinates[value] = [
          [null, null],
          [null, null],
          [null, null],
        ];
      }

      setOldData((prevState) => ({
        ...prevState,
        symbol: [...prevState.symbol, value],
        coordinates: newCoordinates,
      }));

      // Remove from deselectedSymbols when re-selected
      setDeselectedSymbols((prev) => prev.filter((id) => id !== value));
    } else {
      setOldData((prevState) => ({
        ...prevState,
        symbol: prevState.symbol.filter((id) => id !== value),
      }));

      // Add to deselectedSymbols when deselected
      setDeselectedSymbols((prev) => [...prev, value]);
    }
  };

  // On form submit, remove the coordinates for symbols that were deselected
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePatternForm()) return;

    const updatedCoordinates = { ...oldData.coordinates };

    // Remove coordinates for deselected symbols
    deselectedSymbols.forEach((symbolId) => {
      delete updatedCoordinates[symbolId];
    });

    const updatedata = {
      id,
      oldData: { ...oldData, coordinates: updatedCoordinates },
    };

    try {
      const res = await fetch("${process.env.REACT_APP_BACKEND_URL}/api/updatepattern", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedata),
      });
      const response = await res.json();
      if (response.success) {
        toast.success("Pattern updated successfully!", {
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
      console.error(err);
    }
  };

  const handleCoordinatesChange = (symbolId, rowIndex, colIndex, value) => {
    const newCoordinates = { ...oldData.coordinates };
    if (!newCoordinates[symbolId]) {
      newCoordinates[symbolId] = [[], [], []]; // Initialize if undefined
    }
    newCoordinates[symbolId][rowIndex][colIndex] = value;
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
          className="bg-[#5f22d9] rounded-full hover:scale-110 transition-all duration-100 text-white text-[40px] cursor-pointer shadow-xl ml-5"
        />
        <div className="text-2xl font-bold mx-2 my-8 px-2">Edit Pattern</div>
      </div>
      <div className="flex flex-col items-center justify-center w-[70%] m-auto">
        <form id="editPatternForm" className="w-[60%]" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Symbols
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 flex justify-between items-center"
              >
                Select symbols <FaAngleDown />
              </button>
              {dropdownOpen && (
                <div className="absolute max-h-36 overflow-y-scroll top-full left-0 bg-white border border-gray-300 rounded-sm shadow-lg w-full">
                  {symbols.map((item) => (
                    <div key={item._id} className="p-2 bg-gray-200 text-sm">
                      <input
                        type="checkbox"
                        id={`symbol-${item._id}`}
                        value={item._id}
                        checked={oldData.symbol.includes(item._id)}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      <label htmlFor={`symbol-${item._id}`}>
                        {item.symbol_name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pattern Type */}
          <div className="my-4">
            <label
              htmlFor="employee_type"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
              Pattern type
            </label>
            <select
              name="patternType"
              value={oldData?.patternType}
              onChange={(e) =>
                setOldData({ ...oldData, [e.target.name]: e.target.value })
              }
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
            >
              <option value="">Select a pattern type.</option>
              {patternType.map((option) => {
                return (
                  <option
                    key={option?._id}
                    value={option?._id}
                    className=" bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  >
                    {option?.symbol_count} symbol - {option?.patternType} - {option?.combination_count} combination count
                  </option>
                );
              })}
            </select>
          </div>

          {/* Coordinates */}
          <div className="my-4">
            <label className="block mb-2 text-lg font-medium text-gray-900">
              Coordinates
            </label>
            <div className="flex flex-col">
              {oldData.symbol.map((symbolId, symbolIndex) => (
                <div key={symbolId}>
                  <label className="text-sm font-medium text-gray-700">
                    Coordinates of Symbol{" "}
                    {symbols.find((s) => s._id === symbolId)?.symbol_name}
                  </label>
                  {oldData.coordinates[symbolId]?.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                      <input
                        type="number"
                        placeholder={`Row ${rowIndex + 1}`}
                        value={row[0] || ""}
                        onChange={(e) =>
                          handleCoordinatesChange(
                            symbolId,
                            rowIndex,
                            0,
                            Number(e.target.value)
                          )
                        }
                        className="m-1 bg-gray-200 border border-gray-300 text-sm rounded-lg p-2.5 w-full"
                      />
                      <input
                        type="number"
                        placeholder={`Col ${rowIndex + 1}`}
                        value={row[1] || ""}
                        onChange={(e) =>
                          handleCoordinatesChange(
                            symbolId,
                            rowIndex,
                            1,
                            Number(e.target.value)
                          )
                        }
                        className="m-1 bg-gray-200 border border-gray-300 text-sm rounded-lg p-2.5 w-full"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Other Fields */}
          <div className="my-4">
            <label className="block mb-2 text-lg font-medium text-gray-900">
              Min Matches Required
            </label>
            <input
              type="number"
              name="minMatchesRequired"
              value={oldData.minMatchesRequired}
              onChange={(e) =>
                setOldData({ ...oldData, minMatchesRequired: e.target.value })
              }
              className="bg-gray-200 border border-gray-300 text-sm rounded-lg w-full p-2.5"
              placeholder="Enter Minimum Matches Required"
            />
          </div>

          <div className="my-4">
            <label className="block mb-2 text-lg font-medium text-gray-900">
              Description
            </label>
            <textarea
              name="description"
              value={oldData.description}
              onChange={(e) =>
                setOldData({ ...oldData, description: e.target.value })
              }
              className="bg-gray-200 border border-gray-300 text-sm rounded-lg w-full p-2.5"
              placeholder="Enter Description"
            />
          </div>

          <button
            type="submit"
            className="w-full text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
          Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPattern;
