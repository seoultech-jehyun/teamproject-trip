const headerText = document.querySelector("header h1");
const navLinks = document.querySelectorAll("header nav a");

headerText.style.color = "black";
navLinks.forEach(link => link.style.color = "black");

document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const checkin = this.checkin.value;
  const checkout = this.checkout.value;
  const guests = this.guests.value;

  alert(`Reservation Confirmed!\nCheck-In: ${checkin}\nCheck-Out: ${checkout}\nGuests: ${guests}`);
});
