import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoMdDownload } from "react-icons/io";

const ShowUsers = () => {
  const initialState = {
    name: "",
    personal_email: "",
    company_email: "",
    contact_number: "",
    role: "",
    photo: null,
    document: null,
    department: "",
    designation: "",
    employee_type: "",
    shift_timing: "",
    permanent_address: "",
    current_address: "",
    work_location: "",
    joining_date: "",
    team_lead: "",
    projects_assigned: [],
    date_of_birth: "",
    marriage_anniversary: "",
    nationality: "",
    gender: "",
    experience: "",
    hobbies: "",
    education: "",
    skills: [],
    bank_details: {
      acc_no: "",
      ifsc_code: "",
      acc_holder_name: "",
      bank_name: "",
      branch: "",
    },
    relative_name: "",
    relative_contact: "",
    relative_relation: "",
  };
  const [loader, setLoader] = useState(true);
  const [employeeDetail, setEmployeeDetail] = useState(initialState);

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/getesingleemployee`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      const result = await response.json();

      if (result.success && result.data[0]) {
        setEmployeeDetail(formatEmployeeData(result.data[0]));

        // Fetch related details
        const { role, department, team_lead, projects_assigned } =
          result.data[0];
        await fetchRelatedDetails(
          role,
          department,
          team_lead,
          projects_assigned
        );
      } else {
        console.error("No data found for the given parameter.");
      }
    } catch (error) {
      console.error("Failed to fetch old data:", error);
    } 
  };

  const formatEmployeeData = (data) => ({
    name: data?.name || "",
    personal_email: data?.personal_email || "",
    company_email: data?.company_email || "",
    contact_number: data?.contact_number || "",
    role: data?.role || "",
    photo: data?.photo?.url || "",
    document: data?.document?.url || "",
    department: data?.department || "",
    designation: data?.designation || "",
    employee_type: data?.employee_type || "",
    shift_timing: data?.shift_timing || "",
    permanent_address: data?.permanent_address || "",
    current_address: data?.current_address || "",
    work_location: data?.work_location || "",
    joining_date: formatDate(data?.joining_date),
    team_lead: data?.team_lead || "",
    projects_assigned: data?.projects_assigned || [],
    date_of_birth: formatDate(data?.date_of_birth),
    marriage_anniversary: formatDate(data?.marriage_anniversary),
    nationality: data?.nationality || "",
    gender: data?.gender || "",
    experience: data?.experience || "",
    hobbies: data?.hobbies || "",
    education: data?.education || "",
    skills: data?.skills ? data?.skills.split(", ") : [],
    bank_details: data?.bank_details || {},
    relative_name: data?.relative_name || "",
    relative_contact: data?.relative_contact || "",
    relative_relation: data?.relative_relation || "",
  });

  const fetchRelatedDetails = async (role, department, teamLead, projects) => {
    try {
      if (role)
        fetchDataAndUpdateState(
          role,
          "role",
          `http://localhost:8000/api/getSingleRole `,
          "role"
        );
      if (department)
        fetchDataAndUpdateState(
          department,
          "department",
          `http://localhost:8000/api/getSingleDepartment`,
          "department_name"
        );
      if (teamLead)
        fetchDataAndUpdateState(
          teamLead,
          "team_lead",
          `http://localhost:8000/api/getesingleemployee`,
          "name"
        );

      // Fetch project names in parallel
      if (projects.length > 0) {
        const projectNames = await Promise.all(
          projects.map((id) =>
            fetchDataAndGetValue(
              id,
              `http://localhost:8000/api/getSingleproject`,
              "name"
            )
          )
        );
        setEmployeeDetail((prevState) => ({
          ...prevState,
          projects_assigned: projectNames.filter((name) => name),
        }));
      }
    } catch (err) {
      console.error("Error fetching related details:", err);
    }finally {
      setLoader(false);
    }
  };

  const fetchDataAndUpdateState = async (id, key, url, dataKey) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const response = await res.json();
      if (response.success) {
        setEmployeeDetail((prevState) => ({
          ...prevState,
          [key]: response.data[0][dataKey] || "NA",
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDataAndGetValue = async (id, url, dataKey) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const response = await res.json();
      if (response.success) {
        return response.result[0][dataKey];
      }
    } catch (err) {
      console.log(err);
    }
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Convert to yyyy-mm-dd format
  };

  const handleDocumentView = () => {
    if (!employeeDetail.document) {
      alert("There is no document attached to the profile!");
    } else {
      window.open(employeeDetail.document, "_blank");
    }
  };
  return (
    <div className="relative bg-gray-100">
      {loader ? (
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
      ) : (
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4 h-screen">
            <div className=" col-span-4 sm:col-span-3">
              <div className="bg-white shadow rounded-lg p-6 sticky top-5 ">
                <div className="flex flex-col items-center">
                  <img
                    src={employeeDetail?.photo}
                    className="w-32 h-32  bg-gray-300 rounded-full mb-4 shrink-0"
                  ></img>
                  <h1 className="text-xl font-bold">
                    {employeeDetail?.name || "NA"}
                  </h1>
                  <p className="text-gray-700">
                    {employeeDetail?.designation || "NA"}
                  </p>
                  <IoMdDownload
                    className="mt-4 text-2xl cursor-pointer"
                    onClick={handleDocumentView}
                  />
                </div>
                <hr className="my-6 border-t border-gray-300" />
                <div className="flex flex-col">
                  <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">
                    Projects assigned
                  </span>
                  <ul>
                    {employeeDetail?.projects_assigned.map((item, index) => {
                      return (
                        <li key={index} className="mb-2">
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">
                    Skills
                  </span>
                  <ul>
                    {employeeDetail?.skills.map((item) => {
                      return (
                        <li key={item} className="mb-2">
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-span-4 sm:col-span-9">
              <div className="bg-white shadow rounded-lg p-6">
                <div>
                  <h3 className="font-semibold text-center mt-3 text-xl">
                    Personal Information:
                  </h3>
                  <div className="flex justify-between mx-10 flex-wrap">
                    <div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Employee Name: </div>
                        <div>{employeeDetail?.name || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Personal Email: </div>
                        <div>{employeeDetail?.personal_email || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Company Email: </div>
                        <div>{employeeDetail?.company_email || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Contact number: </div>
                        <div>{employeeDetail?.contact_number || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Role: </div>
                        <div>{employeeDetail?.role || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Education: </div>
                        <div>{employeeDetail?.education || "NA"}</div>
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Date of birth: </div>
                        <div>{employeeDetail?.date_of_birth || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Marriage anniversary: </div>
                        <div>
                          {employeeDetail?.marriage_anniversary || "NA"}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Nationality: </div>
                        <div>{employeeDetail?.nationality || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Gender: </div>
                        <div>{employeeDetail?.gender || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Experience: </div>
                        <div>{employeeDetail?.experience || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Hobbies: </div>
                        <div>{employeeDetail?.hobbies || "NA"}</div>
                      </div>
                    </div>
                  </div>
                  <div className=" mx-10 ">
                    <div className=" text-lg flex flex-wrap">
                      <div className="font-bold">Current Address: </div>{" "}
                      {employeeDetail?.current_address || "NA"}
                    </div>
                  </div>
                  <div className=" mx-10 my-2">
                    <div className=" text-lg flex flex-wrap">
                      <div className="font-bold">Permanent Address: </div>{" "}
                      {employeeDetail?.permanent_address || "NA"}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-center mt-3 text-xl">
                    Relative/Spouse Information:
                  </h3>
                  <div className="flex mx-10 flex-wrap">
                    <div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Relative Name: </div>
                        <div>{employeeDetail?.relative_name || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Relative Contact: </div>
                        <div>{employeeDetail?.relative_contact || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Relative Relation: </div>
                        <div>{employeeDetail?.relative_relation || "NA "}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-center mt-3 text-xl">
                    Employment Details:
                  </h3>
                  <div className="flex justify-between mx-10 flex-wrap">
                    <div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Department: </div>
                        <div>{employeeDetail?.department || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Designation: </div>
                        <div>{employeeDetail?.designation || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Joining date: </div>
                        <div>{employeeDetail?.joining_date || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Employee Type: </div>
                        <div>{employeeDetail?.employee_type || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Shift timing: </div>
                        <div>{employeeDetail?.shift_timing || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Work Location: </div>
                        <div>{employeeDetail?.work_location || "NA"}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Team Lead: </div>
                        <div>{employeeDetail?.team_lead || "NA"}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-center mt-3 text-xl">
                    Bank Details:
                  </h3>
                  <div className="flex mx-10 flex-wrap">
                    <div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Account holder Name: </div>
                        <div>
                          {employeeDetail?.bank_details?.acc_holder_name ||
                            "NA"}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Account Number: </div>
                        <div>
                          {employeeDetail?.bank_details?.acc_no || "NA"}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">IFSC code: </div>
                        <div>
                          {employeeDetail?.bank_details?.ifsc_code || "NA"}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Bank name: </div>
                        <div>
                          {employeeDetail?.bank_details?.bank_name || "NA "}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-wrap my-3 text-lg">
                        <div className="font-bold">Bank Branch: </div>
                        <div>
                          {employeeDetail?.bank_details?.branch || "NA "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowUsers;
