import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Style.css';


function UserUpdatePage({ userId }) {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        userid: '',
        userpw: '',
        name: '',
        gender: '',
        address: '',
        phone_number: ''
    });

    useEffect(() => {
        const userId = sessionStorage.getItem('LOGIN_USER_ID');
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/user/details/${userId}`);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:8080/api/user/update', user);
            if (response.data.message) {
                alert(response.data.message);
            }
            navigate('/main');
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    };

    return (
        <div className="userUpdateFormContainer">
            <h2>회원 정보 수정</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>아이디:</label>
                    <input
                        type="text"
                        name="userid"
                        value={user.userid}
                        onChange={handleChange}
                        readOnly
                    />
                </div>
                <div>
                    <label>비밀번호:</label>
                    <input
                        type="text"
                        name="userpw"
                        value={user.userpw}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>이름:</label>
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>성별:</label>
                    <input
                        type="text"
                        name="gender"
                        value={user.gender}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>주소:</label>
                    <input
                        type="text"
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>전화번호:</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={user.phone_number}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">수정하기</button>
                
            </form>
        </div>
    );
}

export default UserUpdatePage;
