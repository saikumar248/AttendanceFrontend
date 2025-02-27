import React, { useState, useContext } from "react";
import { Lock, Mail, Phone, UserCircle } from "lucide-react";
import "./SignIn.css";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { UserContext } from "../../components/context/UserContext";

import { useNavigate } from "react-router-dom";
import logo from "../../assets/rs.png";

function SignIn() {
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpUser, setOtpUser] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mobile: "",
    otp: "",
    role: "Admin",
  });
  const user = {
    designation: "",
    email: "",
    fullName: "",
    id: "",
    imageName: "",
    imageType: "",
    mobile: "",
    profilePicUrl: "",
    departments: "",
  };
  const fetchImage = async (id) => {
    console.log(id);

    const response = await axios.get(
      `http://localhost:9090/api/product/${id}/image`,
      { responseType: "blob" }
    );

    user.profilePicUrl = URL.createObjectURL(response.data);
    console.log(user.profilePicUrl);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleOtpRequest = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9090/api/fetch/mobile/${formData.mobile}`
      );
      console.log("Response Data", response.data);

      setFormData((prevFormData) => ({
        ...prevFormData,
        role: response.data.designation,
      }));

      user.designation = response.data.designation;
      user.email = response.data.email;
      user.fullName = response.data.fullName;
      user.id = response.data.id;
      user.imageName = response.data.imageName;
      user.imageType = response.data.imageType;
      user.mobile = response.data.mobile;
      user.departments = response.data.departments;

      await fetchImage(user.id);

      setUser(user);
      console.log("User", user);

      sessionStorage.setItem("storedUser", JSON.stringify(user));
      const storedUser = JSON.parse(
        sessionStorage.getItem("storedUser") || "{}"
      );
      console.log("SessionStorege", storedUser);

      console.log("Role set in formData:", response.data.designation);
    } catch (error) {
      console.error("Error fetching Mobile:", error);
      setError("Mobile Not Found. Please Register.");
      return;
    }
    generateAndSendOtp();
    console.log("OTP sent");
  };

  const generateAndSendOtp = async () => {
    const phoneNumber = formData.mobile;
    const Otpxyz = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(Otpxyz);
    console.log(Otpxyz);
    console.log(otp);
    setOtpSent(true);

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

  const handleOtpVerification = () => {
    console.log("Otp", otp);
    toast.success("User LoggedIn successfully", {
      position: "top-right",
      autoClose: 2000,
    });
    if (otp === formData.otp) {
      if (formData.role == "CEO") {
        navigate("/super");
      } else if (
        formData.role == "Project Manager" ||
        formData.role == "HR" ||
        formData.role == "Team Lead"
      ) {
        navigate("/admin");
      } else {
        navigate("/intern");
      }
    } else {
      setError("Invalid OTP");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    if (formData.role == "Admin") {
      navigate("/admin");
    } else if (formData.role == "SuperAdmin") {
      navigate("/super");
    } else {
      navigate("/intern");
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <div className="header">
          <img src={logo} alt="Company Logo" className="company-logo" />
          <h2 className="title">Welcome</h2>
          <p className="subtitle">Please sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="label">Mobile Number</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="mobile"
                maxLength={10}
                minLength={10}
                value={formData.mobile}
                onChange={handleChange}
                className="input"
                placeholder="Enter your Mobile Number"
                required
              />
              {
                <button
                  type="button"
                  className="send-otp-btn"
                  onClick={() => handleOtpRequest("mobile")}
                >
                  {otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              }
            </div>
            {otpSent && (
              <div className="send-otp-section">
                <input
                  type="text"
                  className="input"
                  name="otp"
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  required
                />
                <button
                  type="button"
                  className="send-otp-btn"
                  onClick={handleOtpVerification}
                >
                  Verify OTP
                </button>
              </div>
            )}
            {error && <p className="error">{error}</p>}
          </div>
        </form>
        <div className="forgot-password">
          <span className="forgot-password" onClick={() => navigate("/signup")}>
            {"Don't"} have an account?
          </span>
        </div>
      </div>
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
    </div>
  );
}

export default SignIn;
