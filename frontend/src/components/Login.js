
import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { notify } from '../utils';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault(); 
        setError(''); 

       
        const correctEmail = 'admin@gmail.com';
        const correctPassword = 'password';
        

        if (email === correctEmail && password === correctPassword) {
            notify('Login Successful!', 'success');
            onLoginSuccess(); 
        } else {
            const errorMessage = 'Invalid email or password.';
            setError(errorMessage);
            notify(errorMessage, 'error');
            setPassword(''); 
        }
    };

    return (
        <div className="card border-0 shadow-lg"
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '15px',
                maxWidth: '450px', 
                width: '100%'
            }}>
            <div className="card-body p-4 p-md-5">
                <h1 className="text-center mb-4 fw-bold"
                    style={{
                        color: '#4b6cb7',
                        fontSize: '2rem'
                    }}>
                    Task Manager Login
                </h1>
                <form onSubmit={handleLogin}>
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="floatingInput"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingInput">
                            <FaUser className='me-2' /> Email address
                        </label>
                    </div>
                    <div className="form-floating mb-4">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingPassword">
                            <FaLock className='me-2' /> Password
                        </label>
                    </div>

                    <div className="d-grid">
                        <button
                            className="btn btn-primary btn-lg fw-bold"
                            type="submit"
                            style={{ background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)', border: 'none' }}
                        >
                            Login
                        </button>
                    </div>
                </form>
                 <div className="text-center mt-3 text-muted ">
                    <small>Use admin@gmail.com / password</small>
                 </div>
            </div>
        </div>
    );
}

export default Login;