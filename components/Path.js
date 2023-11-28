import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Style.css'; 


const Path = () => {
    const [searchParams] = useSearchParams();
    const b_mark = (searchParams.get('b_mark'));
    const c_mark = (searchParams.get('c_mark'));
    const latitude = parseFloat(searchParams.get('lat1'));
    const longitude = parseFloat(searchParams.get('lng1'));
    const c_latitude = parseFloat(searchParams.get('lat2'));
    const c_longitude = parseFloat(searchParams.get('lng2'));
    const mapContainer = useRef(null);
    const [routeInfo, setRouteInfo] = useState({ distance: null, duration: null });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUserId = sessionStorage.getItem('LOGIN_USER_ID');
        setIsLoggedIn(savedUserId != null);
    }, []);

    const handleSaveRoute = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/user-save', {
                b_mark: b_mark,
                c_mark: c_mark,
                b_latitude: latitude,
                b_longitude: longitude,
                c_latitude: c_latitude,
                c_longitude: c_longitude,
                userid: sessionStorage.getItem('LOGIN_USER_ID')
            });

            if (response.data.success) {
                alert('경로가 저장되었습니다.');
                navigate('/main');
            } else {
                alert('경로 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('경로 저장 중 에러가 발생했습니다:', error);
            alert('경로 저장 중 문제가 발생했습니다.');
        }
    };

    // Mapbox Directions API를 호출하여 경로 데이터를 가져오는 함수
    const getRoute = async (start, end) => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.join(',')};${end.join(',')}?geometries=geojson&access_token=pk.eyJ1IjoiY2FwdGFpbjIwMDQ1IiwiYSI6ImNsb3BiajJ0dDA1MHMybnA2aml5ZXZrb3IifQ.YwY7ZH5DmThQJ1XJo7SudQ`;
        const response = await fetch(url);
        const data = await response.json();
        return data.routes[0];
    };

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiY2FwdGFpbjIwMDQ1IiwiYSI6ImNsb3BiajJ0dDA1MHMybnA2aml5ZXZrb3IifQ.YwY7ZH5DmThQJ1XJo7SudQ';

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: 12
        });

        // 마커 추가
        new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
        new mapboxgl.Marker().setLngLat([c_longitude, c_latitude]).addTo(map);

        const addRouteLayer = (routeGeometry) => {
            if (map.getLayer('route')) {
                map.removeLayer('route');
                map.removeSource('route');
            }

            map.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: routeGeometry
                    }
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#FF0000',
                    'line-width': 8
                }
            });
        };

        // 경로 가져오기 및 소요 시간, 거리 계산
        getRoute([longitude, latitude], [c_longitude, c_latitude]).then(route => {
            setRouteInfo({ distance: route.distance, duration: route.duration });
            map.on('load', () => addRouteLayer(route.geometry));
        });
    }, [latitude, longitude, c_latitude, c_longitude]);

    return (
        <div>
            <div ref={mapContainer} style={{ 
            width: 'calc(100% - 100px)', // 전체 너비에서 좌우 여백(총 100px)을 뺀 너비
            height: '800px', 
            margin: '0 50px', 
            position: 'relative',
            borderRadius: '25px' 
        }} />
            <div className="routeInfo">
                {routeInfo.distance && <div>거리: {(routeInfo.distance / 1000).toFixed(2)} km</div>}
                {routeInfo.duration && <div>예상 시간: {(routeInfo.duration / 60).toFixed(2)} 분</div>}
            </div>

            {isLoggedIn && (
                <button className="save-route-button"
                style={{ 
                    position: 'absolute', 
                    top: '210px', 
                    left: '61.5px',
                    transform: 'translateY(-50%)'
                }}
                 
                 onClick={handleSaveRoute}>
                    경로 저장
                </button>
            )}
        </div>
    );
};

export default Path;