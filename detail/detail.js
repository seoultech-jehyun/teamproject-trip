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

                    } else {
                        document.querySelector('.detail-container').innerHTML = '<p>Item not found.</p><a href="index.html">Go back</a>';
                    }
                })
                .catch(error => console.error('Error fetching detail data:', error));
        } else {
            document.querySelector('.detail-container').innerHTML = '<p>No item ID provided.</p><a href="index.html">Go back</a>';
        }
    });