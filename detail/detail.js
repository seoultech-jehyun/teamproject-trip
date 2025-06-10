document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('id'); // Get the ID from the URL

    if (itemId) {
        fetch('../data.json') // Fetch the same data.json
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const item = data.find(d => d.id == itemId); // Find the item by ID

                if (item) {
                    document.getElementById('detail-image').style.backgroundImage = `url('${item.image_url}')`;
                    document.getElementById('detail-name').textContent = item.name;
                    document.getElementById('detail-region').textContent = item.region;
                    document.getElementById('detail-description').textContent = item.description;

                    const attractionsDiv = document.getElementById('detail-main-attractions');
                    attractionsDiv.innerHTML = '<h3>주요 명소</h3><ul>' +
                        item.main_attractions.map(attr => `<li><strong>${attr.name}:</strong> ${attr.description}</li>`).join('') +
                        '</ul>';

                    // --- Kakao Map Integration ---
                    // Check if latitude and longitude exist in the item data
                    if (item.lat && item.lng) {
                        var mapContainer = document.getElementById('map'), // 지도를 표시할 div
                            mapOption = {
                                center: new kakao.maps.LatLng(item.lat, item.lng), // Set map center to item's coordinates
                                level: 3 // 지도의 확대 레벨
                            };

                        var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

                        // 마커가 표시될 위치입니다
                        var markerPosition = new kakao.maps.LatLng(item.lat, item.lng);

                        // 마커를 생성합니다
                        var marker = new kakao.maps.Marker({
                            position: markerPosition
                        });

                        // 마커가 지도 위에 표시되도록 설정합니다
                        marker.setMap(map);
                    } else {
                        document.getElementById('map').innerHTML = '<p>Map coordinates not available for this item.</p>';
                    }
                    // --- End Kakao Map Integration ---

                } else {
                    document.querySelector('.detail-container').innerHTML = '<p>Item not found.</p><a href="index.html">Go back</a>';
                }
            })
            .catch(error => console.error('Error fetching detail data:', error));
    } else {
        document.querySelector('.detail-container').innerHTML = '<p>No item ID provided.</p><a href="index.html">Go back</a>';
    }
});