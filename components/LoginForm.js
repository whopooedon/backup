import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Ensure the path is correct based on your project structure
import './Style.css';

function LoginForm() {
    const [credentials, setCredentials] = useState({
        userid: '',
        userpw: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Use the login function from AuthContext

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            const response = await axios.post('http://localhost:8080/api/loginAction', credentials, { withCredentials: true });
            if (response.data.success) {
                login(credentials.userid); // Update login state using AuthContext
                
                // Redirect to main page upon successful login
                navigate('/main');
            } else {
                // Handle login failure response from server
                setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.');
            }
        } catch (err) {
            // Handle errors during the login request
            setError('로그인 중 문제가 발생했습니다. 나중에 다시 시도해 주세요.');
        }
    };

    return (
        <div className="loginFormContainer">
            <h3>로그인</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>아이디:</label>
                    <input
                        type="text"
                        name="userid"
                        value={credentials.userid}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>비밀번호:</label>
                    <input
                        type="password"
                        name="userpw"
                        value={credentials.userpw}
                        onChange={handleChange}
                    />
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit">로그인</button>
            </form>
        </div>
    );
}

export default LoginForm;
