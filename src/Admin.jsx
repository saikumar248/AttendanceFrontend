import React, { useState } from 'react';
import {  Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './components/Myspace/Dashboard';
import Calendar from './components/Myspace/Calendar';
import Overview from './components/Org/Overview';
import Interns from './components/Org/Interns';
import Departments from './components/Org/Departments';
import './Admin.css';
import { useNavigate } from 'react-router-dom';

// // Navigation component for primary navigation
// const NavBar = ({ setSpace }) => {
//   const location = useLocation();

//   return (
//     <nav className="navbar">
//       <div className="nav-section">
//         <Link
//           to="/myspace/dashboard"
//           className={location.pathname.includes('/myspace') ? 'active' : ''}
//           onClick={() => setSpace(true)}
//         >
//           Myspace
//         </Link>
//         <Link
//           to="/org/overview"
//           className={location.pathname.includes('/org') ? 'active' : ''}
//           onClick={() => setSpace(false)}
//         >
//           Org
//         </Link>
//       </div>
//     </nav>
//   );
// };

// // Sub-navigation based on the current section
// const SubNav = ({ isMyspace }) => {
//   const location = useLocation();
  
//   return (
//     <div className="sub-nav">
//       {isMyspace ? (
//         <div>
//           <Link 
//             to="/myspace/dashboard" 
//             className={location.pathname === '/myspace/dashboard' ? 'active' : ''}
//           >
//             Dashboard
//           </Link>
//           <Link 
//             to="/myspace/calendar" 
//             className={location.pathname === '/myspace/calendar' ? 'active' : ''}
//           >
//             Calendar
//           </Link>
//         </div>
//       ) : (
//         <div>
//           <Link 
//             to="/org/overview" 
//             className={location.pathname === '/org/overview' ? 'active' : ''}
//           >
//             Overview
//           </Link>
//           <Link 
//             to="/org/interns" 
//             className={location.pathname === '/org/interns' ? 'active' : ''}
//           >
//             Interns
//           </Link>
//           <Link 
//             to="/org/departments" 
//             className={location.pathname === '/org/departments' ? 'active' : ''}
//           >
//             Departments
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };


// Update the NavBar component to use correct paths
const NavBar = ({ setSpace }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleSignout = () =>{
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="nav-section">
        <Link
          to="/admin/myspace/dashboard"
          className={location.pathname.includes('/myspace') ? 'active' : ''}
          onClick={() => setSpace(true)}
        >
          Myspace
        </Link>
        <Link
          to="/admin/org/overview"
          className={location.pathname.includes('/org') ? 'active' : ''}
          onClick={() => setSpace(false)}
        >
          Org
        </Link>
       
      </div>
      <button onClick={handleSignout}>Logout</button>
    </nav>
  );
};

// Update the SubNav component to use correct paths
const SubNav = ({ isMyspace }) => {
  const location = useLocation();
  
  return (
    <div className="sub-nav">
      {isMyspace ? (
        <div>
          <Link 
            to="/admin/myspace/dashboard" 
            className={location.pathname === '/admin/myspace/dashboard' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/myspace/calendar" 
            className={location.pathname === '/admin/myspace/calendar' ? 'active' : ''}
          >
            Calendar
          </Link>
        </div>
      ) : (
        <div>
          <Link 
            to="/admin/org/overview" 
            className={location.pathname === '/admin/org/overview' ? 'active' : ''}
          >
            Overview
          </Link>
          <Link 
            to="/admin/org/interns" 
            className={location.pathname === '/admin/org/interns' ? 'active' : ''}
          >
            Interns
          </Link>
          <Link 
            to="/admin/org/departments" 
            className={location.pathname === '/admin/org/departments' ? 'active' : ''}
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
          <Route path="/" element={<Navigate to="/admin/myspace/dashboard" />} />
        </Routes>
      </main>
    </div>

  );
}

export default Admin;