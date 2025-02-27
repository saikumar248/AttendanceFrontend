import axios from "axios";
import React, { useState } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import { ToastContainer, toast } from 'react-toastify';

const SignUp = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    mobile: "",
    mobileOtp: "",
    email: "",
    emailOtp: "",
    designation: "",
    profilePic: null,
    departments:"",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [otpSentMobile, setOtpSentMobile] = useState(false);
  const [otpSentEmail, setOtpSentEmail] = useState(false);
  const [otpVerified, setOtpVerified] = useState({
    mobile: false,
    email: false,
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile" && (!/^\d*$/.test(value) || value.length > 10))
      return;

    // Email Validation (Basic Format Check)
    if (name === "email") {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(value) && value !== "") {
        setError("Invalid email format");
      } else {
        setError("");
      }
    }
    setUserData({ ...userData, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setUserData(prevState => {
        const currentDepts = prevState.departments ? prevState.departments.split(',') : [];
        let newDepts;
        if (checked) {
            newDepts = [...currentDepts, value];
        } else {
            newDepts = currentDepts.filter(dept => dept !== value);
        }
        return {
            ...prevState,
            departments: newDepts.join(',')
        };
    });
};

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setUserData({ ...userData, profilePic: e.target.files[0] });
  };

  const generateAndSendMobileOtp = async () => {
    const phoneNumber = userData.mobile;
    console.log("Function Triggered");
    const Otpxyz = Math.floor(100000 + Math.random() * 900000).toString();
    setUserData({ ...userData, mobileOtp: Otpxyz });
    const message = `Dear customer, use this OTP ${Otpxyz} to signup into your Quality Thought Next account. This OTP will be valid for the next 15 mins.`;
    const encodedMessage = encodeURIComponent(message);
    const apiUrl = `https://login4.spearuc.com/MOBILE_APPS_API/sms_api.php?type=smsquicksend&user=qtnextotp&pass=987654&sender=QTTINF&t_id=1707170494921610008&to_mobileno=${phoneNumber}&sms_text=${encodedMessage}`;
    try {
      const response = await axios.get(apiUrl);
      console.log("API Response:", Otpxyz);
    } catch (error) {
      setError(Otpxyz);
    }
  };
  const generateAndSendEmailOtp = async () => {
    if (!userData.email) {
      setError("Email is required");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:9090/sendEmailOTPforSignup/${userData.email}`
      );
      console.log(response);
      setUserData({ ...userData, emailOtp: response.data });
      alert(`OTP sent to ${userData.email}`);
      setError(response.data);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpRequest = (type) => {
    if (type === "mobile" && userData.mobile.length !== 10) {
      setError("Mobile number must be 10 digits");
      return;
    }
    if (
      type === "email" &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userData.email)
    ) {
      setError("Enter a valid email");
      return;
    }
    if (type === "mobile") {
      generateAndSendMobileOtp();
      setOtpSentMobile(true);
    }
    if (type === "email") {
      generateAndSendEmailOtp();
      setOtpSentEmail(true);
    }
  };

  const handleOtpVerification = (type) => {
    if (userData[`${type}Otp`] == userData[`${type}OtpInput`]) {
      setOtpVerified({ ...otpVerified, [type]: true });
      setError("");
    } else {
      setError("Invalid OTP");
    }
  };
  const user = {
    fullName: userData.fullName,
    mobile: userData.mobile,
    email: userData.email,
    designation: userData.designation,
    profilePic: null,
    departments:userData.departments,
  };

  const formData = new FormData();
  formData.append("imageFile", image);
  formData.append(
    "user",
    new Blob([JSON.stringify(user)], { type: "application/json" })
  );
  console.log("FromDtaaa", formData);

  // const [imageUrl, setImageUrl] = useState("");

  const handlePostUser = () => {
    axios
      .post(`http://localhost:9090/api/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // alert("User registered successfully!");
        navigate("/");
        console.log("hi")
        toast.success("User registered successfully", {
          position: "top-right",
          autoClose: 2000,
        });
      

        
      })
      .catch((error) => {
        console.log(error);
        setError(
          `Error ${error.response.status}: ${
            error.response.data.message ||
            "Sign-up failed. The user may already exist. Please try again."
          }`

        );
        toast.error("The user may already exist", {
          position: "top-right",
          autoClose: 2000,
        });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("userData",userData);
    if (userData.mobile.length !== 10) {
      setError("Mobile number must be 10 digits");
      return;
    }
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userData.email)
    ) {
      setError("Enter a valid email");
      return;
    }
    // if (!otpVerified.mobile || !otpVerified.email) {
    //   setError("Please verify both Mobile and Email OTPs");
    //   return;
    // }
    console.log(user);
    handlePostUser();
    // alert("Registration Successful!");


    // navigate("/")
  };

  return (
    <div className="container">
      <div className="signup-form-card">
        <h2 className="header-title">Register</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="signup-form-group">
            <label className="label">Full Name</label>
            <input
              type="text"
              className="input"
              name="fullName"
              value={userData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="signup-form-group">
            <label className="label">Mobile</label>

            <div className="input-wrapper">
              <input
                type="number"
                className="input"
                name="mobile"
                value={userData.mobile}
                onChange={handleChange}
                disabled={otpVerified.mobile}
                required
              />
              {!otpVerified.mobile && (
                <button
                  type="button"
                  className="otp-btn"
                  onClick={() => handleOtpRequest("mobile")}
                >
                  {otpSentMobile ? "Resend OTP" : "Send OTP"}
                </button>
              )}
              {otpVerified.mobile && <Check className="icon" />}
            </div>
            {otpSentMobile && !otpVerified.mobile && (
              <div className="otp-section">
                <input
                  type="number"
                  className="input"
                  name="mobileOtpInput"
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  required
                />
                <button
                  type="button"
                  className="otp-btn"
                  onClick={() => handleOtpVerification("mobile")}
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>

          <div className="signup-form-group">
            <label className="label">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                className="input"
                name="email"
                value={userData.email}
                onChange={handleChange}
                disabled={otpVerified.email}
                required
              />
              {!otpVerified.email && (
                <button
                  type="button"
                  className="otp-btn"
                  onClick={() => handleOtpRequest("email")}
                >
                  {otpSentEmail ? "Resend OTP" : "Send OTP"}
                </button>
              )}
              {otpVerified.email && <Check className="icon" />}
            </div>
            {otpSentEmail && !otpVerified.email && (
              <div className="otp-section">
                <input
                  type="number"
                  className="input"
                  name="emailOtpInput"
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  required
                />
                <button
                  type="button"
                  className="otp-btn"
                  onClick={() => handleOtpVerification("email")}
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>

          <div className="signup-form-group">
            <label className="label">Designation</label>
            <select
              className="select"
              name="designation"
              value={userData.designation}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="CEO">CEO</option>
              <option value="Project Manager">Project Manager</option>
              <option value="HR">HR</option>
            </select>
          </div>

          <div className="signup-form-group">
            <label className="label">Departments</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="Departments"
                  value="Java"
                  checked={userData.departments.split(",").includes("Java")}
                  onChange={handleCheckboxChange}
                />
                Java
              </label>
              <label>
                <input
                  type="checkbox"
                  name="Departments"
                  value="MERN"
                  checked={userData.departments.split(",").includes("MERN")}
                  onChange={handleCheckboxChange}
                />
                MERN
              </label>
              <label>
                <input
                  type="checkbox"
                  name="Departments"
                  value="Python"
                  checked={userData.departments.split(",").includes("Python")}
                  onChange={handleCheckboxChange}
                />
                Python
              </label>
              <label>
                <input
                  type="checkbox"
                  name="Departments"
                  value="DotNet"
                  checked={userData.departments.split(",").includes("DotNet")}
                  onChange={handleCheckboxChange}
                />
                DotNet
              </label>
              <label>
                <input
                  type="checkbox"
                  name="Departments"
                  value="DataScience"
                  checked={userData.departments.split(",").includes("DataScience")}
                  onChange={handleCheckboxChange}
                />
                Data Science
              </label>
              <label>
                <input
                  type="checkbox"
                  name="Departments"
                  value="Scrum"
                  checked={userData.departments.split(",").includes("Scrum")}
                  onChange={handleCheckboxChange}
                />
                Scrum
              </label>
              <label>
                <input
                  type="checkbox"
                  name="Departments"
                  value="BA"
                  checked={userData.departments.split(",").includes("BA")}
                  onChange={handleCheckboxChange}
                />
                Business Analyst 
                              </label>
            </div>
          </div>

          <div className="signup-form-group">
            <label className="label">Profile Picture</label>
            <input
              type="file"
              className="input"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="submit-btn">
            Sign Up
          </button>
          <ToastContainer />

          <p className="signin-link">
            <Link to="/">Already have an account?</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
