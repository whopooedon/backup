import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Style.css';

import bike1 from './img/bike1.jpg';


// AttractionCard 컴포넌트
const AttractionCard = ({ imageUrl, title}) => {
    return (
      <div className="attraction-card">
        <img src={imageUrl} alt={title} className="attraction-image" />
        <h3>{title}</h3>
      </div>
    );
  };
  
  // CulturePage 컴포넌트
const CulturePage = () => {
    const { bike_addr1 } = useParams();
    const { latitude } = useParams();
    const { longitude } = useParams();
    const [cultureData, setCultureData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    let address = bike_addr1;
    let parts = address.split(" ");
    let district = parts.length >= 2 ? parts[1] : address;

    useEffect(() => {
        const fetchCultureData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/culture-locations?district=${district}`);
                console.log(response.data);
                setCultureData(response.data);
                setIsLoading(false);
            } catch (error) {
                setError(error);
                setIsLoading(false);
            }
        };

        fetchCultureData();
    }, [district]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className='culture-header'>
        <h2>{district} 문화 정보</h2>
        <div className="attraction-list">
            {cultureData.map((item, index) => (
                <Link to={`/path?lat1=${latitude}&lng1=${longitude}&lat2=${item.c_latitude}&lng2=${item.c_longitude}&b_mark=${bike_addr1}&c_mark=${item.culture_name}`} key={index}>
                    <AttractionCard
                        imageUrl={item.culture_image} // 이 부분을 item에 맞는 이미지 URL로 변경해야 함
                        title={item.culture_name}
                    />
                </Link>
            ))}
        </div>
    </div>
    );
};

export default CulturePage;