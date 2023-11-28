import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Ensure this path is correct
import axios from 'axios';
import './Style.css';
import user from './img/user.png';

function MyPage() {
    const { isLoggedIn, logout, userId } = useAuth(); // Use userId from AuthContext
    const [userInfo, setUserInfo] = useState({
        userid: '', // 아이디
        userpw: '', // 비밀번호
        name: '', // 이름
        gender: '', // 성별
        address: '', // 주소
        phone_number: '' // 전화번호
    });
    const navigate = useNavigate();

    useEffect(() => {
        const userId = sessionStorage.getItem('LOGIN_USER_ID');
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/user/details/${userId}`);
                setUserInfo(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, []);

    const handleDelete = async () => {
        if (window.confirm("회원탈퇴 하시겠습니까?")) {
            try {
                const response = await axios.delete(`http://localhost:8080/api/user/delete/${userId}`);
                alert(response.data.message);
                logout(); // Logout using AuthContext
                navigate('/main'); // Redirect to main page
            } catch (error) {
                console.error("Error deleting user data:", error);
                alert("Failed to delete user.");
            }
        }
    };

    return (
        <div className="mypage-container">
            <div className="mypage-sidebar">
                <div className="sidebar-item">마이페이지</div>
            </div>
            <div className="mypage-content">
                <div className="user-info">
                    <div className="user-image"><img src={user} alt="" className="user-image" /></div>
                    <div className="user-greeting">{userInfo.userid} 님 안녕하세요</div>
                </div>
                <div className="user-details">
                    <div className="details-item">아이디: {userInfo.userid}</div>
                    <div className="details-item">비밀번호: {userInfo.userpw}</div>
                    <div className="details-item">이름: {userInfo.name}</div>
                    <div className="details-item">성별: {userInfo.gender}</div>
                    <div className="details-item">주소: {userInfo.address}</div>
                    <div className="details-item">전화번호: {userInfo.phone_number}</div>
                    <div className="user-update-link-container">
                        <Link to="/userupdate" className="user-action-button">회원정보수정</Link>
                    </div>
                </div>
                <div className="user-action-container">
                    {isLoggedIn && (
                        <button onClick={handleDelete} className="user-delete-button">회원탈퇴</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyPage;
