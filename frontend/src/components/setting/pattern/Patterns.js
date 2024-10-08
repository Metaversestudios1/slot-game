import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Patterns = () => {
  const [patterns, setPatterns] = useState([]);
  const [noData, setNoData] = useState(false);
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchPatterns();
  }, [page]);
  const fetchPatternType = async (id) => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getSinglepatterntype`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const response = await res.json();
    if (response.success) {
      const type = `${response?.result?.symbol_count} symbol - ${response?.result?.patternType} - ${response?.result?.combination_count} combination count`;
      return type;
    }
  };
  const fetchSymbolName = async (id) => {
    try {
      const symbolRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getSinglesymbol`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      const symbolData = await symbolRes.json();
      return symbolData.success ? symbolData.result.symbol_name : "Unknown";
    } catch (error) {
      console.error("Error fetching symbol name:", error);
      return "Unknown";
    }
  };
  const fetchPatterns = async () => {
    setLoader(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/getAllpattern?page=${page}&limit=${pageSize}`
      );
      const response = await res.json();

      if (response.success) {
        if (response.result.length === 0) {
          setNoData(true);
        }

        // Map each pattern, resolving all symbol names and pattern type for each pattern
        const updatedPatterns = await Promise.all(
          response.result.map(async (pattern) => {
            // Fetch and map symbol names
            const symbolsWithNames = await Promise.all(
              pattern.symbol.map(async (symbolId) => {
                const symbolName = await fetchSymbolName(symbolId);
                return symbolName;
              })
            );

            // Fetch the pattern type string using the patterntype_id of each pattern
            const patternTypeString = await fetchPatternType(
              pattern.patternType
            );

            // Return the updated pattern with symbol names and pattern type string
            return {
              ...pattern,
              symbol: symbolsWithNames, // Updated with symbol names
              patternType: patternTypeString, // Updated with pattern type string
            };
          })
        );
        setPatterns(updatedPatterns);
        setCount(response.count);
      } else {
        setNoData(true);
      }
    } catch (error) {
      console.error("Error fetching patterns:", error);
    } finally {
      setLoader(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    const permissionOfDelete = window.confirm(
      "Are you sure, you want to delete the pattern"
    );
    if (permissionOfDelete) {
      let patternOne = patterns.length === 1;
      if (count === 1) {
        patternOne = false;
      }
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/deletepattern`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const response = await res.json();
      if (response.success) {
        toast.success("Pattern is deleted Successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (patternOne) {
          setPage(page - 1);
        } else {
          fetchPatterns();
        }
      }
    }
  };

  const startIndex = (page - 1) * pageSize;

  return (
    <div className="relative">
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
        <div className="text-2xl font-bold mx-2 my-8 px-4">Patterns List</div>
      </div>
      <div className="flex justify-between">
        <NavLink to="/patterns/addpattern">
          <button className="bg-[#5f22d9] text-white p-3 m-5 text-sm rounded-lg">
            Add New
          </button>
        </NavLink>
      </div>

      {loader && (
        <div className="absolute h-full w-full top-64  flex justify-center items-center">
          <div
            className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}
      <div className="relative overflow-x-auto m-5 mb-0">
        {patterns.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right border-2 border-gray-300">
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Sr no.
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Symbol
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Pattern type
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  min Matches Required
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  win amount
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  description
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {patterns.map((item, index) => (
                <tr key={item?._id} className="bg-white">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                  >
                    {startIndex + index + 1}
                  </th>

                  <td className="px-6 py-4 border-2 border-gray-300 relative">
                    {(item?.symbol).join(", ")}
                  </td>

                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900  border-2 border-gray-300"
                  >
                    {item?.patternType}
                  </th>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.minMatchesRequired || "-"}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.win_amount}
                  </td>
                  <td className="px-6 py-4 border-2 border-gray-300">
                    {item?.description || "-"}
                  </td>
                  <td className=" py-5 pl-5 gap-1 border-2  border-gray-300">
                    <div className="flex items-center">
                      <NavLink to={`/patterns/editpattern/${item?._id}`}>
                        <CiEdit className="text-2xl cursor-pointer text-green-900" />
                      </NavLink>
                      <MdDelete
                        onClick={(e) => handleDelete(e, item?._id)}
                        className="text-2xl cursor-pointer text-red-900"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {noData && (
        <div className="text-center text-xl">
          Currently! There are no patterns in the storage.
        </div>
      )}

      {patterns.length > 0 && (
        <div className="flex flex-col items-center my-10">
          <span className="text-sm text-black">
            Showing{" "}
            <span className="font-semibold text-black">{startIndex + 1}</span>{" "}
            to{" "}
            <span className="font-semibold text-black">
              {Math.min(startIndex + pageSize, count)}
            </span>{" "}
            of <span className="font-semibold text-black">{count}</span> Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={
                patterns.length < pageSize || startIndex + pageSize >= count
              }
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patterns;
