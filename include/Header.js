import React, { useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Ensure the path is correct based on your project structure
import '../App.css';

const Header = () => {
    const { isLoggedIn, logout, userId } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If the user ID is stored in session storage, consider the user as logged in
        const savedUserId = sessionStorage.getItem('LOGIN_USER_ID');
        if (savedUserId) {
            // Note: This assumes your login function in AuthContext 
            // also sets the userId in its state. If not, you'll need
            // to update the AuthContext accordingly.
        }
    }, []);

    const handleLogout = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/logout');
            if (response.data.success) {
                logout(); // Update authentication state using AuthContext
                navigate('/main'); // Redirect to the main page
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div id="header">
            <div className="inner">
                <h1><NavLink to='/'>따릉이</NavLink></h1>
                {isLoggedIn ? (
                    <div className="headerContainer">
                        <p>{userId}님</p> &nbsp;&nbsp;&nbsp;
                        <Link to="/myroute" className="headerLink">내 경로 보기</Link>
                        <Link to="/mypage" className="headerLink">마이페이지</Link>
                        <button onClick={handleLogout} className="headerButton">로그아웃</button>
                    </div>
                ) : (
                    <div>
                        <Link to="/login">로그인</Link> &nbsp;
                        <Link to="/register">회원가입</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
