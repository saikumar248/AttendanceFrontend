import React, { useState } from "react";
import axios from "axios";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Dashboard from "../../components/Myspace/Dashboard";
import Calendar from "../../components/Myspace/Calendar";
import Overview from "../../components/Org/Overview";
import Interns from "../../components/Org/Interns";
import Departments from "../../components/Org/Departments";
import "./Admin.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { Plus, LogOut, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/rslogo.png";
import defaultProfilePic from "../../assets/default.png";



const NavBar = ({ setSpace }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const handlePlus = () => {
    setShowPopup(!showPopup);
  };
  const handleSignout = () => {
    sessionStorage.removeItem("signedInUser ");
    sessionStorage.clear();
    localStorage.setItem("timer", 0);
    localStorage.setItem("isCheckedIn", false);
    navigate("/");
  };

  const handleClose = () => {
    setShowPopup(false);
  };
  const [isEmployeePopupOpen, setIsEmployeePopupOpen] = useState(false);
  const [isInternPopupOpen, setIsInternPopupOpen] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    batchNo: "",
    email: "",
    designation: "",
    department: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  

  const handleEmployeeClick = () => {
    handleClose();
    setUserData((prev) => ({ ...prev, designation: "Employee" }));
    setIsEmployeePopupOpen(true);
  };

  const handleInternClick = () => {
    handleClose();
    setUserData((prev) => ({ ...prev, designation: "Intern" }));
    setIsInternPopupOpen(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    validateField(name, value);
  };
  const handleAddClose = () => {
    setIsInternPopupOpen(false);
    setIsEmployeePopupOpen(false);
  };

  const [image, setImage] = useState(null);
  const handleSaveIntern = async () => {
    const formData = new FormData();
    formData.append(
      "imageFile",
      image || new File([defaultProfilePic], "default.png", { type: "image/png" })
    );
    formData.append(
      "intern",
      new Blob([JSON.stringify(userData)], { type: "application/json" })
    );
    console.log("FromDtaaa", formData);
    axios
    .post(`http://localhost:9090/api/addIntern`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      setError("");
         toast.success("Intern Added successfully", {
            position: "top-right",
            autoClose: 2000,
          });
      handleAddClose();
      setUserData({});
    })
    .catch((error) => {
      console.log(error);
      setError(
        `Error ${error.response.status}: ${
          error.response.data.message ||
          "Sign-up failed. The user may already exist. Please try again."
        }`
      );
    });
  };

  const handleSaveEmployee = async () => {
    const { batchNo, ...updatedUserData } = userData; 
    setUserData(updatedUserData); 
    console.log(userData);
    const formData = new FormData();
    formData.append(
      "imageFile",
      image || new File([defaultProfilePic], "default.png", { type: "image/png" })
    );
    formData.append(
      "intern",
      new Blob([JSON.stringify(userData)], { type: "application/json" })
    );
    console.log("FromDtaaa", formData);
    axios
    .post(`http://localhost:9090/api/addEmployee`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      setError("");
         toast.success("Employee Added successfully", {
            position: "top-right",
            autoClose: 2000,
          });
      handleAddClose();
      setUserData({});
    })
    .catch((error) => {
      console.log(error);
      setError(
        `Error ${error.response.status}: ${
          error.response.data.message ||
          "Sign-up failed. The user may already exist. Please try again."
        }`
      );
    });
  };


  const storedUser = JSON.parse(sessionStorage.getItem("storedUser") || "{}");
  const departmentOptions = storedUser.departments.split(",");

  // const departmentOptions = [
  //   "Java",
  //   "MERN",
  //   "DataScience",
  //   "Python",
  //   "Testing",
  //   "BA",
  //   "SM",
  //   "DotNet",
  //   "HR",
  // ];

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (!/^[a-zA-Z]+$/.test(value)) {
          error = "Only alphabets are allowed";
        }
        break;

      case "email":
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
          error = "Invalid Email";
        }
        break;

      case "mobile":
        if (!/^[6-9][0-9]{9}$/.test(value)) {
          error = "Invalid Mobile Number";
        }
        break;

      case "batchNo":
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
          error = "Only alphanumeric values are allowed";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  return (
    <>
      <nav className="navbar-main">
        <div className="navbar-container">
          <div className="titlee">
            <img src={logo} alt="logo" />
            <h1 className="nav-section-main">RamanaSoft Attendance</h1>
          </div>
          <div className="nav-buttons">
            <button className="logout-btn" onClick={handleSignout}>
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </nav>
      <nav className="navbar">
        <div className="nav-section">
          <Link
            to="/admin/myspace/dashboard"
            className={location.pathname.includes("/myspace") ? "active" : ""}
            onClick={() => setSpace(true)}
          >
            Myspace
          </Link>
          <Link
            to="/admin/teams"
            className={location.pathname.includes("/teams") ? "active" : ""}
            onClick={() => setSpace(false)}
          >
            Teams
          </Link>
          <Link
            to="/admin/org/overview"
            className={location.pathname.includes("/org") ? "active" : ""}
            onClick={() => setSpace(false)}
          >
            Org
          </Link>
        </div>
        <button className="add-btn" onClick={handlePlus}>
          <Plus size={20} />
        </button>
      </nav>
      {showPopup && (
        <>
          <div className="plus-popup-overlay" onClick={handleClose}></div>
          <div className="plus-popup">
            <div className="plus-popup-header">
              <h2>Add</h2>
              <button className="plus-popup-close" onClick={handleClose}>
                <X size={20} />
              </button>
            </div>

            <div className="plus-popup-content">
              <div className="form-group">
                <button onClick={handleEmployeeClick}>Employee</button>
                <button onClick={handleInternClick}>Intern</button>
              </div>
            </div>
          </div>
        </>
      )}

      {isEmployeePopupOpen && (
        <>
          <div className="common-popup-overlay" onClick={handleAddClose}></div>
          <div className="common-popup">
            <div className="common-popup-header">
              <h2>Adding Employee</h2>
              <button className="common-popup-close" onClick={handleAddClose}>
                <X size={20} />
              </button>
            </div>

            <div className="common-popup-content">
              <div className="common-form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  required
                />
                {errors.firstName && (
                  <span className="error">{errors.firstName}</span>
                )}
              </div>
              

              <div className="common-form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  required
                />
                {errors.lastName && (
                  <span className="error">{errors.lastName}</span>
                )}
              </div>

              <div className="common-form-group">
                <label>Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={userData.designation}
                  readOnly
                />
              </div>

              <div className="common-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="common-form-group">
                <label>Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={userData.mobile}
                  onChange={handleChange}
                  required
                />
                {errors.mobile && (
                  <span className="error">{errors.mobile}</span>
                )}
              </div>
{/* 
              <div className="common-form-group">
                <label>BatchNo</label>
                <input
                  type="text"
                  name="batchNo"
                  value={userData.batchNo}
                  onChange={handleChange}
                  required
                />
                {errors.batchNo && (
                  <span className="error">{errors.batchNo}</span>
                )}
              </div> */}

              <div className="common-form-group">
                <label>Department</label>
                <select
                  name="department"
                  value={userData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map((department, index) => (
                    <option key={index} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {error && <p className="error">{error}</p>}

            <div className="common-popup-footer">
              <button className="btn btn-secondary" onClick={handleAddClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveEmployee}>
                Register
              </button>
            </div>
          </div>
        </>
      )}

      {isInternPopupOpen && (
        <>
          <div className="common-popup-overlay" onClick={handleAddClose}></div>
          <div className="common-popup">

              <div className="common-popup-header">
                <h2>Adding Intern</h2>
                <button className="common-popup-close" onClick={handleAddClose}>
                  <X size={20} />
                </button>
              </div>

              <div className="common-popup-content">
                <div className="common-form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleChange}
                    required
                  />
                  {errors.firstName && (
                    <span className="error">{errors.firstName}</span>
                  )}
                </div>

                <div className="common-form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleChange}
                    required
                  />
                  {errors.lastName && (
                    <span className="error">{errors.lastName}</span>
                  )}
                </div>

                <div className="common-form-group">
                  <label>Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={userData.designation}
                    readOnly
                  />
                </div>

                <div className="common-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <span className="error">{errors.email}</span>
                  )}
                </div>

                <div className="common-form-group">
                  <label>Mobile</label>
                  <input
                    type="text"
                    name="mobile"
                    value={userData.mobile}
                    onChange={handleChange}
                    required
                  />
                  {errors.mobile && (
                    <span className="error">{errors.mobile}</span>
                  )}
                </div>

                <div className="common-form-group">
                  <label>BatchNo</label>
                  <input
                    type="text"
                    name="batchNo"
                    value={userData.batchNo}
                    onChange={handleChange}
                    required
                  />
                  {errors.batchNo && (
                    <span className="error">{errors.batchNo}</span>
                  )}
                </div>

                <div className="common-form-group">
                  <label>Department</label>
                  <select
                    name="department"
                    value={userData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departmentOptions.map((department, index) => (
                      <option key={index} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {error && <p className="error">{error}</p>}

              <div className="common-popup-footer">
                <button className="btn btn-secondary" onClick={handleAddClose}>
                  Cancel
                </button>
                <button  className="btn btn-primary" onClick={handleSaveIntern}>
                  Register
                </button>
              </div>

          </div>
        </>
      )}
    </>
  );
};

const SubNav = ({ isMyspace }) => {
  const location = useLocation();

  return (
    <div className="sub-nav">
      {isMyspace ? (
        <div>
          <Link
            to="/admin/myspace/dashboard"
            className={
              location.pathname === "/admin/myspace/dashboard" ? "active" : ""
            }
          >
            Overview
          </Link>
          {/* <Link 
            to="/admin/myspace/calendar" 
            className={location.pathname === '/admin/myspace/calendar' ? 'active' : ''}
          >
            Calendar
          </Link> */}
        </div>
      ) : (
        <div>
          <Link
            to="/admin/org/overview"
            className={
              location.pathname === "/admin/org/overview" ? "active" : ""
            }
          >
            Overview
          </Link>
          <Link
            to="/admin/org/interns"
            className={
              location.pathname === "/admin/org/interns" ? "active" : ""
            }
          >
            Interns
          </Link>
          <Link
            to="/admin/org/departments"
            className={
              location.pathname === "/admin/org/departments" ? "active" : ""
            }
          >
            Departments
          </Link>
        </div>
      )}
    </div>
  );
};

function Admin() {
  const [isMyspace, setSpace] = useState(true);

  return (
    <div className="admin-panel">
      <NavBar setSpace={setSpace} />
      <SubNav isMyspace={isMyspace} />
      <main className="main-content">
        <Routes>
          <Route path="/myspace/dashboard" element={<Dashboard />} />
          <Route path="/myspace/calendar" element={<Calendar />} />
          <Route path="/org/overview" element={<Overview />} />
          <Route path="/org/interns" element={<Interns />} />
          <Route path="/org/departments" element={<Departments />} />
          <Route
            path="/"
            element={<Navigate to="/admin/myspace/dashboard" />}
          />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Admin;
