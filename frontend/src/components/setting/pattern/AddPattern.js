import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
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
    coordinates: {}, // Initialize as an empty object, we'll add symbols dynamically
    description: "",
    minMatchesRequired: "",
  };

  const [data, setData] = useState(initialState);
  const [patternType, setPatternType] = useState([]);

  useEffect(() => {
    fetchSymbols();
    fetchPatternType();
  }, []);

  const fetchPatternType = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getAllpatterntype`);
    const response = await res.json();
    if (response.success) {
      setPatternType(response.result);
    }
  };
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
    return $("#patternform").valid();
  };

  // const findDuplicateCoordinates = () => {
  //   const coordMap = {};
  //   const { coordinates, symbol } = data;

  //   // Traverse through each selected symbol's coordinates
  //   for (const symbolId in coordinates) {
  //     const symbolCoords = coordinates[symbolId];

  //     if (!symbolCoords) continue; // Skip if coordinates for this symbol are undefined

  //     symbolCoords.forEach((row, rowIndex) => {
  //       row.forEach((col, colIndex) => {
  //         // Ensure we're only considering defined values (actual coordinates)
  //         if (col !== undefined && col !== null && col !== "") {
  //           const coordKey = `${rowIndex}-${colIndex}`;
  //           coordMap[coordKey] = (coordMap[coordKey] || 0) + 1;
  //         }
  //       });
  //     });
  //   }

  //   const totalSelectedSymbols = symbol.length;
  //   let overlappingCoords = 0;

  //   // Count overlapping coordinates (coordinates used by more than one symbol)
  //   for (const key in coordMap) {
  //     if (coordMap[key] > 1) {
  //       overlappingCoords++;
  //     }
  //   }

  //   // If two symbols are selected, allow only one overlap
  //   if (totalSelectedSymbols === 2 && overlappingCoords > 1) {
  //     return true; // More than 1 overlapping coordinate for 2 symbols
  //   }

  //   // If three symbols are selected, allow up to two overlaps
  //   if (totalSelectedSymbols === 3 && overlappingCoords > 2) {
  //     return true; // More than 2 overlapping coordinates for 3 symbols
  //   }

  //   return false; // Valid pattern, no conflicts
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePatternForm()) {
      return;
    }
    // if (findDuplicateCoordinates()) {
    //   toast.error(
    //     "The coordinates are conflicting, Please make sure you choose right pattern!",
    //     {
    //       position: "top-right",
    //       autoClose: 1000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     }
    //   );
    //   return;
    // }

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
      console.error(err);
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    setData((prevState) => {
      // Check if maximum 3 symbols are already selected
      if (checked && prevState.symbol.length >= 3) {
        toast.error("You can select a maximum of 3 symbols!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return prevState; // Prevent adding more than 3 symbols
      }

      return {
        ...prevState,
        symbol: checked
          ? [...prevState.symbol, value]
          : prevState.symbol.filter((id) => id !== value),
      };
    });
  };

  // Adjust coordinate input fields based on the number of selected symbols, using symbol ID as key
  const handleCoordinatesChange = (symbolId, rowIndex, colIndex, value) => {
    setData((prevState) => {
      const updatedCoordinates = { ...prevState.coordinates };

      // Initialize coordinates for this symbol if it doesn't already exist
      if (!updatedCoordinates[symbolId]) {
        updatedCoordinates[symbolId] = [[], [], []]; // Initialize with empty 3x2 array
      }

      // Update the specific coordinate for the symbol's pattern
      updatedCoordinates[symbolId][rowIndex][colIndex] = value;

      return { ...prevState, coordinates: updatedCoordinates };
    });
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
          onClick={() => navigate(-1)}
          className="bg-[#5f22d9] rounded-full hover:scale-110 transition-all text-white text-[40px] cursor-pointer ml-5"
        />
        <div className="text-2xl font-bold mx-2 my-8 px-2">Add Pattern</div>
      </div>
      <div className="flex flex-col items-center w-[70%] m-auto">
        <form id="patternform" className="w-[60%]">
          <div>
            <label
              htmlFor="symbol"
              className="block mb-2 text-lg font-medium text-gray-900"
            >
              Symbols
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-gray-200 border border-gray-300 text-sm rounded-lg w-full p-2.5 flex justify-between items-center"
              >
                Select symbols <FaAngleDown />
              </button>
              {dropdownOpen && (
                <div
                  className="absolute max-h-36 overflow-y-scroll top-full left-0 bg-white border rounded-sm w-full"
                  style={{ zIndex: 10 }}
                >
                  {symbols.map((item) => (
                    <div key={item._id} className="p-2 bg-gray-200">
                      <input
                        type="checkbox"
                        id={`symbol-${item._id}`}
                        value={item._id}
                        checked={data.symbol.includes(item._id)}
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
          <div className="my-4">
            <label
              htmlFor="employee_type"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
            >
              Pattern type
            </label>
            <select
              name="patternType"
              value={data?.patternType}
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
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
          {data.symbol.map((symbolId, index) => (
            <div key={symbolId} className="my-4">
              <h4 className="block mb-2 text-lg font-medium text-gray-900">
                Coordinates for Symbol{" "}
                {symbols.map((item) => {
                  return item._id === symbolId ? item.symbol_name : "";
                })}
              </h4>
              {Array.from({ length: 3 }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {Array.from({ length: 2 }).map((_, colIndex) => (
                    <input
                      key={colIndex}
                      type="number"
                      placeholder={`Row ${rowIndex + 1} Col ${colIndex + 1}`}
                      value={
                        data.coordinates[symbolId]?.[rowIndex]?.[colIndex] || ""
                      }
                      onChange={(e) =>
                        handleCoordinatesChange(
                          symbolId,
                          rowIndex,
                          colIndex,
                          Number(e.target.value)
                        )
                      }
                      className="m-1 bg-gray-200 border border-gray-300 text-sm rounded-lg p-2.5 w-full"
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}

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
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter Minimum matches required"
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
              onChange={(e) =>
                setData({ ...data, [e.target.name]: e.target.value })
              }
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
              placeholder="Enter description"
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg px-5 py-2.5"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPattern;
