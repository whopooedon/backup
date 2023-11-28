import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Style.css';

import m_blue from './img/marker-blue.png';
import m_red from './img/marker-red.png';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FwdGFpbjIwMDQ1IiwiYSI6ImNsb3BiajJ0dDA1MHMybnA2aml5ZXZrb3IifQ.YwY7ZH5DmThQJ1XJo7SudQ';

const MapWithMarkers = () => {
    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);
    const [currentMarkers, setCurrentMarkers] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
    const [message, setMessage] = useState('');
    

    useEffect(() => {
        axios.get('http://localhost:8080/api/districts').then(response => {
            setDistricts(response.data);
        });
    }, []);

    useEffect(() => {
        if (selectedDistrict) {
            axios.get(`http://localhost:8080/api/districts/${selectedDistrict}/neighborhoods`).then(response => {
                setNeighborhoods(response.data);
            });
        }
    }, [selectedDistrict]);

    useEffect(() => {
        if (mapContainer.current && !map) {
            const newMap = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [126.9780, 37.5665],
                zoom: 10
            });

            newMap.on('load', () => {
                setMap(newMap);
            });
        }
    }, [map]);

    const handleFind = () => {
        if (selectedDistrict && selectedNeighborhood) {
            setMessage('');
            axios.get(`http://localhost:8080/api/bike-locations?district=${selectedDistrict}&neighborhood=${selectedNeighborhood}`)
                .then(response => {
                    const locations = response.data;
                    if (locations.length === 0) {
                        alert('대여소가 없습니다.');
                    } else {
                        // 기존 마커 제거
                        currentMarkers.forEach(marker => marker.remove())
                    

                        // 새로운 마커 추가
                        const newMarkers = locations.map(location => {
                            
                            let clicked = false;
                            const el = document.createElement('div');
                            el.className = 'marker';

                            el.style.backgroundImage = `url(${m_blue})`;
                            el.style.backgroundSize = 'contain';
                            el.style.width = '35px'; // Set the size of the icon
                            el.style.height = '35px';
                            el.style.backgroundRepeat = 'no-repeat';
                            el.style.backgroundPosition = 'center';

                            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                                `${location.bikeAddr1}</br>
                                <a href="/culture/${location.bikeAddr1}/${location.longitude}/${location.latitude}">문화정보 찾으러가기</a>`
                            );

                            const marker = new mapboxgl.Marker(el)
                                .setLngLat([location.longitude, location.latitude])
                                .setPopup(popup) // sets a popup on this marker
                                .addTo(map);


                            marker.getElement().addEventListener('mouseenter', () => {
                                popup.addTo(map);
                            });

                            // 마우스를 떼었을 때 클릭되지 않았다면 팝업 제거
                            marker.getElement().addEventListener('mouseleave', () => {
                                if (!clicked) {
                                    popup.remove();
                                }
                            });
                            

                            el.addEventListener('click', () => {
                                clicked = !clicked;
                            
                                // 팝업 상태 토글
                                if (clicked) {
                                    popup.addTo(map);
                                    el.style.backgroundImage = `url(${m_red})`; // 클릭 해제 시 원래 이미지로 복원
                                    
                                } else {
                                    popup.remove();
                                    el.style.backgroundImage = `url(${m_blue})`; // 클릭 해제 시 원래 이미지로 복
                                }
                            });
                        
                            return marker;
                        });

                        setCurrentMarkers(newMarkers); // 마커 배열 업데이트
                    }
                })
                .catch(error => {
                    console.error('Error fetching locations:', error);
                    setMessage('위치를 불러오는 데 실패했습니다.');
                });
        } else {
            setMessage('구와 동을 모두 선택해주세요.');
        }
    };

    const selectStyle = {
        padding: '10px',
        margin: '5px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        fontSize: '16px',
        outline: 'none',
        cursor: 'pointer',
        backgroundColor: 'white'
    };

    const buttonStyle = {
        padding: '10px 20px',
        margin: '5px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: 'rgb(112, 114, 127)',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        outline: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
    };

    return (
        <div>
        <div ref={mapContainer} style={{ width: 'calc(100% - 100px)', // 전체 너비에서 좌우 여백(총 100px)을 뺀 너비
            height: '800px', 
            margin: '0 50px', // 상하 여백은 0, 좌우 여백은 각각 50px
            position: 'relative',
            borderRadius : '25px'  }}>
            <div style={{
                position: 'absolute',
                left: '10px',
                top: '10px',
                background: 'white',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                zIndex: 1 // z-index를 설정하여 지도 위에 요소들이 표시되도록 함
            }}>
                <select onChange={e => setSelectedDistrict(e.target.value)} value={selectedDistrict} style={selectStyle}>
                    <option value="">구 선택하시오</option>
                    {districts.map(district => (
                        <option key={district} value={district}>{district}</option>
                    ))}
                </select>

                <select onChange={e => setSelectedNeighborhood(e.target.value)} value={selectedNeighborhood} style={selectStyle}>
                    <option value="">동 선택하시오</option>
                    {neighborhoods.map(neighborhood => (
                        <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                    ))}
                </select>

                <button onClick={handleFind} style={buttonStyle}>찾기</button>
            </div>
        </div>

        {message && <div>{message}</div>}
    </div>
    );
};

export default MapWithMarkers;