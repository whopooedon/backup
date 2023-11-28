import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useSearchParams } from 'react-router-dom';

const MyRouteView = () => {
    const [searchParams] = useSearchParams();
    const latitude = parseFloat(searchParams.get('lat1'));
    const longitude = parseFloat(searchParams.get('lng1'));
    const c_latitude = parseFloat(searchParams.get('lat2'));
    const c_longitude = parseFloat(searchParams.get('lng2'));
    const mapContainer = useRef(null);
    const [routeInfo, setRouteInfo] = useState({ distance: null, duration: null });

    // Mapbox 토큰 설정
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FwdGFpbjIwMDQ1IiwiYSI6ImNsb3BiajJ0dDA1MHMybnA2aml5ZXZrb3IifQ.YwY7ZH5DmThQJ1XJo7SudQ';

    // 맵 초기화 및 마커 추가
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: 12
        });

        // 시작 및 종료 위치에 마커 추가
        new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
        new mapboxgl.Marker().setLngLat([c_longitude, c_latitude]).addTo(map);

        // 경로 가져오기 및 추가
        getRoute([longitude, latitude], [c_longitude, c_latitude]).then(route => {
            setRouteInfo({ distance: route.distance, duration: route.duration });

            // 경로 레이어 추가
            map.on('load', () => {
                if (map.getSource('route')) {
                    map.removeSource('route');
                }

                map.addSource('route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: route.geometry
                    }
                });

                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#FF0000',
                        'line-width': 6
                    }
                });
            });
        });
    }, [latitude, longitude, c_latitude, c_longitude]);

    // Mapbox Directions API를 사용하여 경로 정보 가져오기
    const getRoute = async (start, end) => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.join(',')};${end.join(',')}`;
        const response = await fetch(`${url}?geometries=geojson&access_token=${mapboxgl.accessToken}`);
        const data = await response.json();
        return data.routes[0];
    };

    

    return (
        <div>
            <div ref={mapContainer} style={{ 
            width: 'calc(100% - 100px)', // 전체 너비에서 좌우 여백(총 100px)을 뺀 너비
            height: '800px', // 높이 설정
            margin: '0 50px', // 상하 여백은 0, 좌우 여백은 각각 50px
            position: 'relative',
            borderRadius: '25px' // `Mapbox.js`에 적용된 테두리 반경 스타일도 적용하세요(선택 사항)
        }} />
            <div className="routeInfo">
                {routeInfo.distance && <div>거리: {(routeInfo.distance / 1000).toFixed(2)} km</div>}
                {routeInfo.duration && <div>예상 시간: {(routeInfo.duration / 60).toFixed(2)} 분</div>}
            </div>
        </div>
    );
};

export default MyRouteView;