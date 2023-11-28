import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './Style.css';

function RegistrationForm() {
    const navigate = useNavigate();
    // 폼 필드 상태를 관리하는 state 훅
    const [formData, setFormData] = useState({
        userid: '',
        userpw: '',
        name: '',
        gender: '',
        address: '',
        phone_number: '' // phone_number로 변경
    });

    // 에러 및 성공 메시지 상태를 관리하는 state 훅
    const [message, setMessage] = useState({ error: '', success: '' });

    // 입력 필드가 변경될 때마다 formData 상태를 업데이트하는 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 폼 제출 처리 함수
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/registerAction', formData);
            if (response.data.success) {
                setMessage({ success: '회원 가입이 완료되었습니다.', error: '' });
                // 폼을 초기화하거나 다른 페이지로 리다이렉트 할 수 있습니다.
                setFormData({
                    userid: '',
                    userpw: '',
                    name: '',
                    gender: '',
                    address: '',
                    phone_number: ''
                });
                alert("회원가입 완료")
                navigate('/main');
            } else {
                setMessage({ error: '회원 가입에 실패했습니다. 다시 시도해 주세요.', success: '' });
            }
        } catch (err) {
            setMessage({ error: '회원 가입에 실패했습니다. 다시 시도해 주세요.', success: '' });
        }
    };

    return (
        <div className="registrationFormContainer">
            <h3>회원가입</h3>
            {message.error && <div className="alert alert-danger">{message.error}</div>}
            {message.success && <div className="alert alert-success">{message.success}</div>}
            <form onSubmit={handleSubmit}>
                {/* 각 입력 필드에 handleChange 함수를 연결합니다. */}
                <div>
                    <label>아이디:</label>
                    <input
                        type="text"
                        name="userid"
                        value={formData.userid}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>비밀번호:</label>
                    <input
                        type="password"
                        name="userpw"
                        value={formData.userpw}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>이름:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>성별:</label>
                    <input
                        type="text"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>주소:</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>전화번호:</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}

export default RegistrationForm;
