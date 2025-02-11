// import React, { useState, useEffect,useContext } from 'react';
// import { Clock, Users, Calendar, CheckCircle } from 'lucide-react';
// import { UserContext } from "../context/UserContext";

// function Dashboard() {
//   const [time, setTime] = useState(new Date());
//   const [isCheckedIn, setIsCheckedIn] = useState(false);
//   const [timer, setTimer] = useState(0);
//   const [timerInterval, setTimerInterval] = useState(null);
//   const { signedInUser } = useContext(UserContext);

//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [user, setUser] = useState({ ...signedInUser });
//   const [editedUser, setEditedUser] = useState({ ...signedInUser });

//   // Current time update effect
//   useEffect(() => {
//     const clockTimer = setInterval(() => {
//       setTime(new Date());
//     }, 1000);
//     return () => clearInterval(clockTimer);
//   }, []);


//   // Check-in timer effect
//   useEffect(() => {
//     if (isCheckedIn) {
//       const interval = setInterval(() => {
//         setTimer(prev => prev + 1);
//       }, 1000);
//       setTimerInterval(interval);
//     } else {
//       if (timerInterval) {
//         clearInterval(timerInterval);
//         setTimerInterval(null);
//       }
//       setTimer(0);
//     }
//     return () => {
//       if (timerInterval) {
//         clearInterval(timerInterval);
//       }
//     };
//   }, [isCheckedIn]);

//   // Format timer to HH:MM:SS
//   const formatTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleCheckInOut = () => {
//     setIsCheckedIn(!isCheckedIn);
//   };

//   const handleEditProfile = () => {
//     setIsEditOpen(true);
//   };

//   const handleChange = (e) => {
//     setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
//   };


//   const handleSave = async () => {
//     try {
//       const response = await fetch('/api/updateProfile', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(editedUser),
//       });

//       if (response.ok) {
//         setUser(editedUser);
//         setIsEditOpen(false);
//       } else {
//         console.error("Failed to update profile");
//       }
//     } catch (error) {
//       console.error("Error updating profile", error);
//     }
//   };


//   return (
//     <div className="dashboard">
//       <div className="profile-section">
//         <img
//         onClick={handleEditProfile}
//           src = {signedInUser.profilePicUrl}
//           alt="Profile"
//           className="profile-pic w-24 h-24 rounded-full mb-4"
//         />
//         <h2 className="text-xl font-bold mb-2">{signedInUser.fullName}</h2>
//         <p className="text-gray-600 mb-4">{signedInUser.designation}</p>
//         <br></br>
        
//         <div className="flex flex-col items-center gap-4">
//           <button
//             onClick={handleCheckInOut}
//             className={`px-6 py-2 rounded-lg font-medium transition-colors ${
//               isCheckedIn
//                 ? 'bg-green-500 text-white'
//                 : 'bg-red-500 text-white'
//             }`}
//           >
//             {isCheckedIn ? 'Check Out' : 'Check In'}
//           </button>
//           <br></br>
//           {isCheckedIn && (
//             <div className="text-lg font-medium">
//               <br></br>Time Elapsed: 
//               <h1>{formatTime(timer)}</h1>
//             </div>
//           )}
//         </div>
        
//         <div className="timer mt-6">
//           <Clock className="w-6 h-6 mx-auto mb-2" />
//           <h3 className="font-medium mb-2">Current Time</h3>
//           <p className="text-lg">{time.toLocaleTimeString()}</p>
//         </div>
//       </div>

//       <div className="other-sections grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
//   <section className="section-card bg-gray-100 p-6 rounded-lg shadow">
//     <Users className="w-6 h-6 mb-4" />
//     <h3 className="text-lg font-medium mb-3">Groups</h3>
//     <p className="text-gray-600">Active Projects: 5</p>
//     <p className="text-gray-600">Team Members: 12</p>
//   </section>

//   <section className="section-card bg-gray-100 p-6 rounded-lg shadow">
//     <Calendar className="w-6 h-6 mb-4" />
//     <h3 className="text-lg font-medium mb-3">Leave Approvals</h3>
//     <p className="text-gray-600">Pending Requests: 3</p>
//     <p className="text-gray-600">Approved This Month: 8</p>
//   </section>

//   <section className="section-card bg-gray-100 p-6 rounded-lg shadow">
//     <CheckCircle className="w-6 h-6 mb-4" />
//     <h3 className="text-lg font-medium mb-3">Attendance</h3>
//     <p className="text-gray-600">Present Today: 45</p>
//     <p className="text-gray-600">On Leave: 5</p>
//   </section>
// </div>

//     </div>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect, useContext } from 'react';
import { Clock, Users, Calendar, CheckCircle, X } from 'lucide-react';
import { UserContext } from "../context/UserContext";

function Dashboard() {
  const [time, setTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const { signedInUser } = useContext(UserContext);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [user, setUser] = useState({ ...signedInUser });
  const [editedUser, setEditedUser] = useState({ ...signedInUser });

  // console.log(editedUser);

  // Current time update effect
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Check-in timer effect
  useEffect(() => {
    if (isCheckedIn) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      setTimer(0);
    }
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isCheckedIn]);

  // Format timer to HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCheckInOut = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  const handleEditProfile = () => {
    setIsEditOpen(true);
  };

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setIsEditOpen(false);
    setEditedUser({ ...user }); // Reset form
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/updateProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        setUser(editedUser);
        setIsEditOpen(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="profile-section">
        <img
          onClick={handleEditProfile}
          src={signedInUser.profilePicUrl}
          alt="Profile"
          className="profile-pic w-24 h-24 rounded-full mb-4 cursor-pointer"
        />
        <h2 className="text-xl font-bold mb-2">{signedInUser.fullName}</h2>
        <p className="text-gray-600 mb-4">{signedInUser.designation}</p>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleCheckInOut}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isCheckedIn ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {isCheckedIn ? 'Check Out' : 'Check In'}
          </button>
          {isCheckedIn && (
            <div className="text-lg font-medium">
              Time Elapsed: {formatTime(timer)}
            </div>
          )}
        </div>
        
        <div className="timer mt-6">
          <Clock className="w-6 h-6 mx-auto mb-2" />
          <h3 className="font-medium mb-2">Current Time</h3>
          <p className="text-lg">{time.toLocaleTimeString()}</p>
        </div>
      </div>

      <div className="other-sections grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <section className="section-card bg-gray-100 p-6 rounded-lg shadow">
          <Users className="w-6 h-6 mb-4" />
          <h3 className="text-lg font-medium mb-3">Groups</h3>
          <p className="text-gray-600">Active Projects: 5</p>
          <p className="text-gray-600">Team Members: 12</p>
        </section>

        <section className="section-card bg-gray-100 p-6 rounded-lg shadow">
          <Calendar className="w-6 h-6 mb-4" />
          <h3 className="text-lg font-medium mb-3">Leave Approvals</h3>
          <p className="text-gray-600">Pending Requests: 3</p>
          <p className="text-gray-600">Approved This Month: 8</p>
        </section>

        <section className="section-card bg-gray-100 p-6 rounded-lg shadow">
          <CheckCircle className="w-6 h-6 mb-4" />
          <h3 className="text-lg font-medium mb-3">Attendance</h3>
          <p className="text-gray-600">Present Today: 45</p>
          <p className="text-gray-600">On Leave: 5</p>
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
    </div>
  );
}

export default Dashboard;