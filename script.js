document.addEventListener('DOMContentLoaded', () => {
    const currentNameElement = document.querySelector('.current-name');
    const detailLinkElement = document.querySelector('.detail-link'); // Select the new link element
    const contentDiv = document.querySelector('.content');

    const scrollContainer = document.createElement('div');
    scrollContainer.classList.add('horizontal-scroll-grid-container');
    scrollContainer.style.display = 'flex';
    scrollContainer.style.overflowX = 'auto';
    scrollContainer.style.scrollSnapType = 'x mandatory';
    scrollContainer.style.gap = '50px';
    scrollContainer.style.scrollBehavior = 'smooth';
    contentDiv.appendChild(scrollContainer);

    let allItemsData = [];
    let gridItems = [];
    let currentIndex = 0; // Keep track of the current item's index for auto-slide

    // Function to update the h2 and the detail link
    function updateCurrentDisplay(itemData) {
        currentNameElement.textContent = itemData.nick;
        // --- Modify the detail link's href to include data ---
        // Pass the item ID as a URL parameter
        detailLinkElement.href = `detail/detail.html?id=${itemData.id}`;
        // Optionally, you could pass other specific data if needed, e.g.,
        // detailLinkElement.href = `detail.html?id=${itemData.id}&name=${encodeURIComponent(itemData.nick)}`;
        // For more complex data, passing just the ID is usually better, and detail.html fetches details.
    }

    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            allItemsData = data;

            // Initialize with the first item's data
            if (data.length > 0) {
                updateCurrentDisplay(data[0]);
                currentIndex = 0; // Ensure currentIndex is set to the first item
            }

            data.forEach(item => {
                const gridItem = document.createElement('div');
                gridItem.classList.add('grid-item');
                gridItem.dataset.id = item.id;
                gridItem.dataset.nick = item.nick; // Keeping these for potential direct use or observer
                gridItem.dataset.imageUrl = item.image_url;
                gridItem.style.minWidth = '750px';
                gridItem.style.borderRadius = '5px';
                gridItem.style.boxShadow = '0 0 50px rgba(0, 0, 0, 0.3)';
                gridItem.style.scrollSnapAlign = 'start'; // Ensure items snap

                const itemImg = document.createElement('img');
                itemImg.src = item.image_url;
                itemImg.alt = item.name;
                itemImg.style.width = '100%';
                itemImg.style.height = '550px';
                itemImg.style.objectFit = 'cover';

                gridItem.appendChild(itemImg);
                scrollContainer.appendChild(gridItem);
                gridItems.push(gridItem);
            });

            // IntersectionObserver 설정
            const observer = new IntersectionObserver((entries) => {
                let visibleEntries = entries.filter(entry => entry.isIntersecting);
                if (visibleEntries.length > 0) {
                    visibleEntries.sort((a, b) => {
                        const aCenter = a.boundingClientRect.left + a.boundingClientRect.width / 2;
                        const bCenter = b.boundingClientRect.left + b.boundingClientRect.width / 2;
                        const containerCenter = scrollContainer.getBoundingClientRect().left + scrollContainer.clientWidth / 2;
                        return Math.abs(aCenter - containerCenter) - Math.abs(bCenter - containerCenter);
                    });

                    const target = visibleEntries[0].target;
                    const itemId = parseInt(target.dataset.id);
                    const activeItem = allItemsData.find(item => item.id === itemId);
                    if (activeItem) {
                        updateCurrentDisplay(activeItem);
                        currentIndex = gridItems.indexOf(target); // Sync current index with observer
                    }
                }
            }, {
                root: scrollContainer,
                threshold: 0.5 // Adjust threshold for when an item is considered "active"
            });

            gridItems.forEach(item => observer.observe(item));

            // 자동 슬라이드
            setInterval(() => {
                if (gridItems.length === 0) return;
                currentIndex = (currentIndex + 1) % gridItems.length;
                gridItems[currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'start' });
            }, 5000);
        })
        .catch(error => console.error('Error fetching data:', error));

    // --- Drag Scroll Functionality (from previous responses, unchanged) ---
    let isDown = false;
    let startX;
    let scrollLeft;

    scrollContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollContainer.classList.add('active-drag');
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
        e.preventDefault();
    });

    scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        scrollContainer.classList.remove('active-drag');
    });

    scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        scrollContainer.classList.remove('active-drag');
    });

    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollContainer.scrollLeft = scrollLeft - walk;
    });
    // --- End Drag Scroll Functionality ---
});