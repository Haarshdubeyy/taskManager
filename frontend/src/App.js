
import React, { useState } from 'react';
import './App.css';
import TaskManager from './components/TaskManager';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

function App() {
 
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  
  const handleLogout = () => {
    setIsLoggedIn(false);
    
  };

  return (
   
    <div className="App min-vh-100 d-flex align-items-center justify-content-center"
         style={{
           background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
           padding: '20px'
         }}>

   
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
         
        <TaskManager onLogout={handleLogout} />
      )}

      
       <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" 
        />
    </div>
  );
}

export default App;