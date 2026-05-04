/* ======================================================
   1. Theme System (Light / Dark Mode)
   ====================================================== */
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeStylesheet = document.getElementById('themeStylesheet');

if (localStorage.getItem('theme') === 'dark') {
    if (themeStylesheet) themeStylesheet.setAttribute('href', 'dark.css');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun">';
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const isLight = themeStylesheet.getAttribute('href') === 'light.css';
        themeStylesheet.setAttribute('href', isLight ? 'dark.css' : 'light.css');
        themeToggleBtn.innerHTML = isLight ? '<i class="fa-solid fa-sun">' : '<i class="fa-solid fa-moon">';
        localStorage.setItem('theme', isLight ? 'dark' : 'light');
    });
}

/* ======================================================
   2. Navbar Login State
   ====================================================== */
function updateNavbar() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');
    const loginLink = document.querySelector('a[href="sign.html"]');

    if (isLoggedIn === 'true' && loginLink) {
        loginLink.parentElement.innerHTML = `
            <div class="user-box">
                <span class="user-name">Hi, ${userName}</span>
                <button onclick="logout()" class="logout-btn">Logout</button>
            </div>`;
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('currentPassenger');
    window.location.href = "sign.html";
}

/* ======================================================
   3. Switch Login / Signup Forms
   ====================================================== */
function switchForm(type) {
    const loginF = document.getElementById('loginForm');
    const signupF = document.getElementById('signupForm');
    const loginTab = document.getElementById('loginTabBtn');
    const signupTab = document.getElementById('signupTabBtn');

    if (type === 'login') {
        loginF?.classList.add('active');
        signupF?.classList.remove('active');
        loginTab?.classList.add('active');
        signupTab?.classList.remove('active');
    } else {
        signupF?.classList.add('active');
        loginF?.classList.remove('active');
        signupTab?.classList.add('active');
        loginTab?.classList.remove('active');
    }
}

/* ======================================================
   4. Search Flights
   ====================================================== */
function searchFlights() {
    let input = document.getElementById('search-input')?.value.toLowerCase();
    let cards = document.getElementsByClassName('flight-card');

    for (let i = 0; i < cards.length; i++) {
        let title = cards[i].getElementsByTagName('h3')[0].innerText.toLowerCase();
        cards[i].style.display = title.includes(input) ? "" : "none";
    }
}

/* ======================================================
   5. Passenger Protection
   ====================================================== */
function checkPassengerBeforeAction() {
    const passenger = localStorage.getItem('currentPassenger');
    if (!passenger) {
        alert("Please fill Passenger Details first!");
        window.location.href = "passenger.html";
        return false;
    }
    return true;
}

/* ======================================================
   6. Booking System
   ====================================================== */
function openPayment(destination, price, method = 'visa') {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        alert("Please login first!");
        window.location.href = "sign.html";
        return;
    }

    localStorage.setItem('tempDest', destination);
    localStorage.setItem('tempPrice', Number(price));
    localStorage.setItem('paymentMethod', method);

    const paymentArea = document.getElementById('paymentArea');

    if (paymentArea) {
        if (!checkPassengerBeforeAction()) return;

        paymentArea.classList.add('active');
        document.getElementById('destTitle').innerText = "Booking to " + destination;
        document.getElementById('priceTitle').innerText = "Total Price: " + Number(price).toLocaleString() + " EGP";

        if (method === 'cash') {
            document.getElementById('cashFields').style.display = 'block';
            document.getElementById('visaFields').style.display = 'none';
        } else {
            document.getElementById('visaFields').style.display = 'block';
            document.getElementById('cashFields').style.display = 'none';
        }
        paymentArea.scrollIntoView({ behavior: 'smooth' });
    } else {
        if (!checkPassengerBeforeAction()) return;
        window.location.href = "payment.html";
    }
}

/* ======================================================
   7. Validate & Confirm Payment (تم التعديل ليعمل مع الجدول)
   ====================================================== */
function validatePayment() {
    const method = localStorage.getItem('paymentMethod');
    const otp = document.getElementById('otp').value;

    if (method === 'cash') {
        const phone = document.getElementById('cashPhone').value;
        if (phone.length < 11 || !otp) {
            alert("Please enter a valid Phone number and OTP!");
            return;
        }
        confirmBooking('Cash / Wallet');
    } else {
        const card = document.getElementById('cardNumber').value;
        if (card.length < 12 || !otp) {
            alert("Please enter valid Card details and OTP!");
            return;
        }
        confirmBooking('Visa / Master Card');
    }
}

function confirmBooking(methodName) {
    if (!checkPassengerBeforeAction()) return;

    const dest = localStorage.getItem('tempDest');
    const price = Number(localStorage.getItem('tempPrice'));

    if (!dest) {
        alert("No flight selected!");
        window.location.href = "flights.html";
        return;
    }

    const d = new Date();
    d.setDate(d.getDate() + 7);
    const dateStr = d.toLocaleDateString('en-GB');

    const newFlight = {
        from: "Cairo",
        to: dest,
        price: price.toLocaleString() + " EGP",
        method: methodName,
        class: "Economy",
        date: dateStr
    };

    let list = JSON.parse(localStorage.getItem('myBookings')) || [];
    list.push(newFlight);
    localStorage.setItem('myBookings', JSON.stringify(list));

    alert("Booking Successful! Redirecting to your trips...");
    window.location.href = "my-bookings.html";
}

/* ======================================================
   8. Bookings Table
   ====================================================== */
let fixedFlights = [
    { from: "Cairo", to: "London", class: "Business", price: "48,500 EGP", method: "Visa", date: "15/05/2026" },
    { from: "Cairo", to: "Dubai", class: "Economy", price: "14,200 EGP", method: "Wallet", date: "22/06/2026" }
];

function renderTable() {
    const body = document.getElementById('bookingsBody');
    if (!body) return;

    let userBookings = JSON.parse(localStorage.getItem('myBookings')) || [];
    let allData = [...fixedFlights, ...userBookings];

    body.innerHTML = "";
    if (allData.length === 0) {
        body.innerHTML = "<tr><td colspan='7' style='text-align:center;'>No bookings found.</td></tr>";
        return;
    }

    allData.forEach((item, index) => {
        const isFixed = index < fixedFlights.length;
        body.innerHTML += `
            <tr>
                <td>${item.from}</td>
                <td>${item.to}</td>
                <td>${item.class}</td>
                <td><b>${item.price}</b></td>
                <td>${item.method}</td>
                <td>${item.date}</td>
                <td>
                    <button onclick="handleDelete(${index}, ${isFixed})"
                        class="delete-btn" style="background:red; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">
                        Delete
                    </button>
                </td>
            </tr>`;
    });
}

function handleDelete(index, isFixed) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    if (!isFixed) {
        let userBookings = JSON.parse(localStorage.getItem('myBookings')) || [];
        userBookings.splice(index - fixedFlights.length, 1);
        localStorage.setItem('myBookings', JSON.stringify(userBookings));
    } else {
        fixedFlights.splice(index, 1);
    }
    renderTable();
}

/* ======================================================
   9. Auth Validation
   ====================================================== */
function validateSignup() {
    const name = document.getElementById('newName').value.trim();
    const email = document.getElementById('newEmail').value.trim();
    const pass = document.getElementById('newPass').value.trim();

    if (!name || !email || !pass) { alert("Please fill all fields"); return; }
    if (!email.includes("@")) { alert("Please enter a valid email"); return; }
    if (pass.length < 6) { alert("Password must be at least 6 characters"); return; }

    localStorage.setItem('registeredUser', JSON.stringify({ name, email, pass }));
    alert("Signup successful! Please login.");
    switchForm('login');
}

function validateLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    const saved = JSON.parse(localStorage.getItem('registeredUser'));

    if (saved && email === saved.email && pass === saved.pass) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', saved.name);
        window.location.href = "home.html";
    } else {
        alert("Invalid email or password");
    }
}

/* ======================================================
   10. Passenger Details Save
   ====================================================== */
function savePassengerData() {
    const fname = document.getElementById('fname')?.value;
    const lname = document.getElementById('lname')?.value;
    const passport = document.getElementById('passport')?.value;

    if (!fname || !lname || !passport) {
        alert("Please fill in the essential passenger details!");
        return;
    }

    const passengerInfo = { name: fname + " " + lname, passport: passport };
    localStorage.setItem('currentPassenger', JSON.stringify(passengerInfo));

    alert("Details saved! Proceeding to payment...");
    window.location.href = "payment.html";
}

/* ======================================================
   11. Page Initialization
   ====================================================== */
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();

    if (document.getElementById('bookingsBody')) {
        renderTable();
    }

    if (window.location.pathname.includes('payment.html')) {
        const dest = localStorage.getItem('tempDest');
        const price = localStorage.getItem('tempPrice');
        const method = localStorage.getItem('paymentMethod') || 'visa';

        if (dest && price && localStorage.getItem('currentPassenger')) {
            const paymentArea = document.getElementById('paymentArea');
            if (paymentArea) {
                paymentArea.classList.add('active');
                document.getElementById('destTitle').innerText = "Booking to " + dest;
                document.getElementById('priceTitle').innerText = "Total Price: " + Number(price).toLocaleString() + " EGP";

                if (method === 'cash') {
                    document.getElementById('cashFields').style.display = 'block';
                    document.getElementById('visaFields').style.display = 'none';
                } else {
                    document.getElementById('visaFields').style.display = 'block';
                    document.getElementById('cashFields').style.display = 'none';
                }
            }
        }
    }
});
function searchFlights() {
    // نجيب القيمة اللي المستخدم كتبها
    let input = document.getElementById("search-input").value.toLowerCase();

    // نجيب كل الكروت
    let cards = document.querySelectorAll(".card");

    // نلف على كل كارت
    cards.forEach(card => {

        // نجيب النص اللي جوه الكارت
        let text = card.innerText.toLowerCase();

        // لو الكلمة موجودة
        if (text.includes(input)) {
            card.parentElement.style.display = ""; // يظهر
        } else {
            card.parentElement.style.display = "none"; // يختفي
        }

    });
}