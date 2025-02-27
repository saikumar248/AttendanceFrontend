import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { UserContext } from "../context/UserContext";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const { signedInUser } = useContext(UserContext);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTechPopupOpen, setIsTechPopupOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [user, setUser] = useState({ ...signedInUser });
  const [editedUser, setEditedUser] = useState({ ...signedInUser });

  const storedUser = JSON.parse(sessionStorage.getItem("storedUser") || "{}");
  const tech = storedUser.departments.split(",");
  const projects = ["Attendnce", "ChatApp"];
  const [employees, setEmployees] = useState([]); // State to store filtered employee list

  const technologies = tech.reduce((acc, technology, index) => {
    acc[technology] = employees;
    return acc;
  }, {});

  const [isCheckedIn, setIsCheckedIn] = useState(() => {
    return JSON.parse(localStorage.getItem("isCheckedIn")) || false;
  });
  const [timer, setTimer] = useState(() => {
    return parseInt(localStorage.getItem("timer")) || 0;
  });
  const [error, setError] = useState("");

  const [checkInStatus, setCheckInStatus] = useState("Yet to check in");
  const [timerInterval, setTimerInterval] = useState(null);
  const [productiveTime, setProductiveTime] = useState("0hr 0min 0sec");

  useEffect(() => {
    if (isCheckedIn) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          const updatedTimer = prev + 1;
          localStorage.setItem("timer", updatedTimer);
          return updatedTimer;
        });
      }, 1000);
      setTimerInterval(interval);
      setCheckInStatus("Checked in");
      localStorage.setItem("isCheckedIn", true);
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
        const totalSeconds = timer + convertTimeStringToSeconds(productiveTime);
        const newProductiveTime = convertSecondsToTimeString(totalSeconds);
        setProductiveTime(newProductiveTime);
      }
      if (timer > 0) {
        saveAttendance();
      }
      setTimer(0);
      localStorage.setItem("timer", 0);
      setCheckInStatus(timer > 0 ? "Checked out" : "Yet to check in");
      localStorage.setItem("isCheckedIn", false);
    }
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isCheckedIn]);

  console.log("Productive Time", productiveTime);

  const saveAttendance = async () => {
    try {
      const userId = storedUser.id;
      const todayDate = new Date().toISOString();
      const attendanceData = {
        userId,
        date: todayDate,
        productiveTime,
      };

      const response = await axios.post(
        "http://localhost:9090/api/saveAttendance",
        attendanceData
      );

      console.log("Attendance Saved Successfully:", response.data);
      // alert("Attendance saved successfully!");
      toast.success("Attendance Saved Successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error saving attendance:", error);
    }
  };

  // Helper function to convert seconds to "1hr 20min 30sec" format
  const convertSecondsToTimeString = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}hr ${mins}min ${secs}sec`;
  };

  // Helper function to convert "1hr 20min 30sec" back to seconds
  const convertTimeStringToSeconds = (timeString) => {
    const [hrs, mins, secs] = timeString
      .split(/hr|min|sec/)
      .map((val) => parseInt(val) || 0);
    return hrs * 3600 + mins * 60 + secs;
  };

  useEffect(() => {
    axios
      .put(`http://localhost:9090/api/updateStatus/${storedUser.id}`, null, {
        params: { status: checkInStatus },
      })
      .catch((error) => {
        console.log(error);
      });
  }, [checkInStatus]);

  if (!isCheckedIn) {
    const hours = Math.floor(timer / 3600);
    const minutes = Math.floor((timer % 3600) / 60);
    const secs = timer % 60;
    console.log(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    );
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCheckInOut = () => {
    setIsCheckedIn(!isCheckedIn);
  };
  const handlefetchTech = async (tech) => {
    try {
      console.log("TEch", tech);

      const response = await axios.get(
        `http://localhost:9090/api/getInterns/${tech}`
      );
      // console.log(response.data)
      const filteredEmployees = response.data.map((emp) => ({
        name: `${emp.firstName} ${emp.lastName}`,
        batchNumber: emp.batchNo,
        status: emp.checkInStatus,
      }));

      setEmployees(filteredEmployees); // Store the filtered employee list

      console.log(employees);
    } catch (error) {
      console.error("Failed to fetch technologies:", error);
    }
  };

  const handleTechClick = (tech) => {
    handlefetchTech(tech);
    setSelectedTech(tech);
    setIsTechPopupOpen(true);
  };

  const handleEditProfile = () => {
    setIsEditOpen(true);
  };

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setIsFormVisible(!isFormVisible);
    setIsEditOpen(false);
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        setUser(editedUser);
        setIsEditOpen(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      setError("Duplicate Dates");
      console.error("Error updating profile", error);
    }
  };

  console.log(storedUser.profilePicUrl);
  const [isLeaveFormOpen, setIsOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const [leave, setLeave] = useState({
    startDate: today,
    endDate: today,
    reason: "",
    userId: storedUser.id,
    department: "Java",
    leaveStatus: "Approved",
    fullName : "SaiKumar Madderla",
    batchNo : "Java 40"
  });

  const [errors, setErrors] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleLeaveChange = (e) => {
    const { name, value } = e.target;
    setLeave((prevLeave) => ({
      ...prevLeave,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let newErrors = { startDate: "", endDate: "", reason: "" };
    let isValid = true;

    if (leave.startDate < today) {
      newErrors.startDate = "Start date cannot be before today.";
      isValid = false;
    }

    if (leave.endDate < leave.startDate) {
      newErrors.endDate = "End date cannot be before the start date.";
      isValid = false;
    }

    if (!leave.reason.trim()) {
      newErrors.reason = "Reason is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLeaveSave = async (leaveData) => {
    try {
      const response = await axios.post(
        "http://localhost:9090/api/saveLeave",
        leaveData
      );
      console.log("Leave saved successfully:", response.data);
      toast.success("Leave Applied successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      handleClose();
    } catch (error) {
      console.error("Error saving leave:", error);
    }
  };

  const handleLeaveSubmit = () => {
    if (validateForm()) {
      console.log(leave);
      handleLeaveSave(leave);
    }
  };

  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9090/api/fetchLeaves")
      .then((response) => response.json())
      .then((data) => {setLeaveRequests(data); console.log(data)})
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  console.log("Leaves",leaveRequests);

  const [statuses, setStatuses] = useState({});

  const approveLeave = (id) => {
    // handleApprove(id);
    setStatuses((prev) => ({ ...prev, [id]: "Approved" }));
  };

  const rejectLeave = (id) => {
    // handleReject(id);
    setStatuses((prev) => ({ ...prev, [id]: "Rejected" }));
  };

  return (
    <div className="dashboard">
      <div className="profile-section">
        <img
          onClick={handleEditProfile}
          src={storedUser.profilePicUrl}
          alt="Profile"
          className="profile-pic"
        />
        <h2>{storedUser.fullName}</h2>
        <p>{storedUser.designation}</p>
        <div>
          {isCheckedIn && (
            <div className="timer">Time Elapsed: {formatTime(timer)}</div>
          )}
          <div className="status-message">{checkInStatus}</div>
          <button
            onClick={handleCheckInOut}
            className={`check-button ${isCheckedIn ? "check-in" : "check-out"}`}
          >
            {isCheckedIn ? "Check Out" : "Check In"}
          </button>
        </div>
        <div className="reportees-section">
          <section className="section-card">
            <h3 className="section-title">Reportees</h3>
            {Object.keys(technologies).map((tech) => (
              <p
                key={tech}
                className="reportee-item"
                onClick={() => handleTechClick(tech)}
              >
                {tech}
              </p>
            ))}
          </section>
        </div>
      </div>

      <div className="other-sections grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <section className="section-card bg-gray-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Activities</h3>
          {projects.map((proj, index) => (
            <p key={index} className="text-gray-600 ">
              {proj}
            </p>
          ))}
        </section>
      </div>

      {/* <div className="leave-container">
      <section className="leave-card">
        <div className="leave-header">
          <h3 className="leave-title">Leave Request</h3>
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="toggle-button"
          >
            <ChevronDown size={20} />
          </button>
        </div>
        {isFormVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="leave-form-container"
          >
            <h4 className="form-title">Leave Request Form</h4>
            <form className="leave-form">
              <label className="form-label">
                <span>Start Date</span>
                <input type="date" className="form-input" />
              </label>
              <label className="form-label">
                <span>End Date</span>
                <input type="date" className="form-input" />
              </label>
              <label className="form-label">
                <span>Reason</span>
                <textarea className="form-textarea" rows="3"></textarea>
              </label>
              <button type="submit" className="submit-button">Submit</button>
            </form>
          </motion.div>
        )}
      </section>
    </div> */}

      <div className="leave-container">
        <section className="leave-card">
          <div className="leave-header">
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="leave-button"
            >
              Apply Leave
            </button>
          </div>
          {isFormVisible && (
            <>
              <div className="popup-overlay" onClick={handleClose}></div>
              <div className="popup">
                <div className="popup-header">
                  <h2>Leave Request</h2>
                  <button className="popup-close" onClick={handleClose}>
                    <X size={20} />
                  </button>
                </div>

                <div className="popup-content">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={leave.startDate}
                      onChange={handleLeaveChange}
                      min={today} // Restrict to today or future dates
                    />
                    {errors.startDate && (
                      <span className="error">{errors.startDate}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={leave.endDate}
                      onChange={handleLeaveChange}
                      min={leave.startDate} // Restrict to start date or future dates
                    />
                    {errors.endDate && (
                      <span className="error">{errors.endDate}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Reason</label>
                    <textarea
                      name="reason"
                      value={leave.reason}
                      onChange={handleLeaveChange}
                      rows="4"
                    ></textarea>
                    {errors.reason && (
                      <span className="error">{errors.reason}</span>
                    )}
                  </div>
                </div>
                {error && <p className="error">{error}</p>}

                <div className="popup-footer">
                  <button className="btn btn-secondary" onClick={handleClose}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleLeaveSubmit}
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
      <div className="leave-section">
      <section className="leave-section-card">
        <h3 className="leave-section-title">Leave Approvals</h3>
        {leaveRequests.length > 0 ? (
          <ul>
            {leaveRequests.map((leave, index) => (
              <li key={index} className="leave-item">
                <span>
                  {leave.fullName} {leave.batchNo} 
                </span>
                <div>
                  {statuses[leave.id] ? (
                    <span className={`status ${statuses[leave.id].toLowerCase()}`}>{statuses[leave.id]}</span>
                  ) : (
                    <>
                      <button className="approve-btn" onClick={() => approveLeave(leave.id)}>
                        Approve
                      </button>
                      <button className="reject-btn" onClick={() => rejectLeave(leave.id)}>
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No leave approvals available.</p>
        )}
      </section>
    </div>
      {isEditOpen && (
        <>
          <div className="popup-overlay" onClick={handleClose}></div>
          <div className="popup">
            <div className="popup-header">
              <h2>Edit Profile</h2>
              <button className="popup-close" onClick={handleClose}>
                <X size={20} />
              </button>
            </div>

            <div className="popup-content">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={editedUser.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={editedUser.designation}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={editedUser.mobile}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="popup-footer">
              <button className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </>
      )}

      {isTechPopupOpen && selectedTech && (
        <>
          <div
            className="popup-overlay"
            onClick={() => setIsTechPopupOpen(false)}
          ></div>
          <div className="popup tech-popup">
            <div className="popup-header">
              <h2>{selectedTech}</h2>
              <button
                className="popup-close"
                onClick={() => setIsTechPopupOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="popup-content">
              <table className="tech-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Batch Number</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((person, index) => (
                    <tr key={index}>
                      <td>{person.name}</td>
                      <td>{person.batchNumber}</td>
                      <td>
                        <span
                          className={`status-badge ${person.status
                            .trim()
                            .toLowerCase()
                            .replace(/\s+/g, "")}`}
                        >
                          {person.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Dashboard;
