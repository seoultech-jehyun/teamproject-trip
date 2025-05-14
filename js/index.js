// 모든 섹션과 인디케이터 dot 요소를 선택
const sections = document.querySelectorAll("section");
const dots = document.querySelectorAll(".dot");
// 현재 보여지고 있는 섹션의 인덱스와 스크롤 중 여부를 저장할 변수
let currentIndex = 0;
let isScrolling = false;

// 지정한 인덱스의 섹션으로 스크롤 이동
function scrollToSection(index) {
    // 범위를 벗어난 인덱스는 무시
    if (index < 0 || index >= sections.length) return;
    // 스크롤 중 상태로 설정하여 중복 스크롤 방지
    isScrolling = true;
    // 해당 섹션으로 부드럽게 스크롤
    sections[index].scrollIntoView({ behavior: "smooth" });
    // 현재 인덱스 업데이트 및 UI 갱신
    currentIndex = index;
    updateDots();         // 인디케이터 dot 활성화 상태 업데이트
    updateHeaderColor();  // 헤더 글자 색상 변경
    // 1초 후 스크롤 중 상태 해제
    setTimeout(() => isScrolling = false, 1000);
}

// 현재 섹션에 맞는 인디케이터 dot에 active 클래스 적용
function updateDots() {
    dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentIndex);
    });
}

// 현재 섹션 위치에 따라 헤더 텍스트 색상을 흰색 또는 검정으로 변경
function updateHeaderColor() {
    const headerText = document.querySelector("header h1");
    const navLinks = document.querySelectorAll("header nav a");

    if (currentIndex === 0) {
        // 첫 번째 섹션에서는 흰색 텍스트
        headerText.style.color = "white";
        navLinks.forEach(link => link.style.color = "white");
    } else {
        // 그 외 섹션에서는 검정색 텍스트
        headerText.style.color = "black";
        navLinks.forEach(link => link.style.color = "black");
    }
}

// 마우스 휠 이벤트에 따라 위/아래 섹션으로 이동
window.addEventListener("wheel", (e) => {
    if (isScrolling) return;
    if (e.deltaY > 0) {
        // 아래로 스크롤
        scrollToSection(currentIndex + 1);
    } else {
        // 위로 스크롤
        scrollToSection(currentIndex - 1);
    }
});

// 키보드 방향키(위/아래)로 섹션 이동
window.addEventListener("keydown", (e) => {
    if (isScrolling) return;
    if (e.key === "ArrowDown") scrollToSection(currentIndex + 1);
    if (e.key === "ArrowUp") scrollToSection(currentIndex - 1);
});

// 인디케이터 dot 클릭 시 해당 섹션으로 이동
dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => scrollToSection(idx));
});

// 페이지 로딩 시 헤더 색상 초기화
updateHeaderColor();