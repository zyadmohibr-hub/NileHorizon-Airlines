/* Theme System (Light / Dark Mode) */
// نظام تغيير الثيم بين الفاتح والداكن

const themeToggleBtn = document.getElementById('themeToggleBtn');
// زرار تغيير الثيم

const themeStylesheet = document.getElementById('themeStylesheet');
// ملف الـ CSS المسؤول عن الشكل

if (localStorage.getItem('theme') === 'dark') {
// لو المستخدم مختار dark قبل كده

    if (themeStylesheet)
        themeStylesheet.setAttribute('href', 'dark.css');
// تحميل ملف الدارك

    if (themeToggleBtn)
        themeToggleBtn.innerHTML = '&#9728;';
// تغيير شكل الزر (شمس)
}

if (themeToggleBtn) {
// لو الزرار موجود

    themeToggleBtn.addEventListener('click', () => {
// عند الضغط على الزر

        const isLight = themeStylesheet.getAttribute('href') === 'light.css';
// هل الوضع الحالي لايت؟

        themeStylesheet.setAttribute('href', isLight ? 'dark.css' : 'light.css');
// تبديل بين لايت ودارك

        themeToggleBtn.innerHTML = isLight ? '&#9728;' : '&#127769;';
// تغيير الأيقونة (شمس / قمر)

        localStorage.setItem('theme', isLight ? 'dark' : 'light');
// حفظ الاختيار في المتصفح
    });
}
/* Navbar Login State */
// التحكم في حالة تسجيل الدخول في الناف بار

function updateNavbar() {

    const isLoggedIn = localStorage.getItem('isLoggedIn');
// هل المستخدم عامل تسجيل دخول؟

    const userName = localStorage.getItem('userName');
// اسم المستخدم

    const loginLink = document.querySelector('a[href="sign.html"]');
// رابط تسجيل الدخول

    if (isLoggedIn === 'true' && loginLink) {
// لو المستخدم مسجل دخول

        loginLink.parentElement.innerHTML = `
            <div class="user-box">
                <span class="user-name">Hi, ${userName}</span>
                <button onclick="logout()" class="logout-btn">Logout</button>
            </div>`;
// استبدال زرار login بعناصر المستخدم
    }
}

function logout() {
// تسجيل خروج المستخدم

    localStorage.removeItem('isLoggedIn');
// حذف حالة الدخول

    localStorage.removeItem('userName');
// حذف الاسم

    localStorage.removeItem('currentPassenger');
// حذف بيانات الراكب

    window.location.href = "sign.html";
// تحويل لصفحة تسجيل الدخول
}
/* Switch Login / Signup */
// التبديل بين فورم التسجيل والدخول

function switchForm(type) {

    const loginF = document.getElementById('loginForm');
// فورم اللوجين

    const signupF = document.getElementById('signupForm');
// فورم التسجيل

    const loginTab = document.getElementById('loginTabBtn');
// زرار اللوجين

    const signupTab = document.getElementById('signupTabBtn');
// زرار التسجيل

    if (type === 'login') {
// لو المستخدم اختار login

        loginF?.classList.add('active');
// إظهار اللوجين

        signupF?.classList.remove('active');
// إخفاء التسجيل

        loginTab?.classList.add('active');
// تفعيل زر اللوجين

        signupTab?.classList.remove('active');
// إلغاء تفعيل التسجيل

    } else {
// العكس

        signupF?.classList.add('active');
        loginF?.classList.remove('active');
        signupTab?.classList.add('active');
        loginTab?.classList.remove('active');
    }
}

/* Search Flights */
// البحث عن الرحلات

function searchFlights() {

    let input = document.getElementById('search-input')?.value.toLowerCase();
// النص المكتوب في البحث

    let cards = document.getElementsByClassName('flight-card');
// كل كروت الرحلات

    for (let i = 0; i < cards.length; i++) {

        let title = cards[i].getElementsByTagName('h3')[0].innerText.toLowerCase();
// اسم الرحلة

        cards[i].style.display =
            title.includes(input) ? "" : "none";
// إظهار أو إخفاء الكارت حسب البحث
    }
}

/* Passenger Protection */
// التأكد من بيانات الراكب

function checkPassengerBeforeAction() {

    const passenger = localStorage.getItem('currentPassenger');
// بيانات الراكب

    if (!passenger) {

        alert("Please fill Passenger Details first!");
// تنبيه

        window.location.href = "passenger.html";
// تحويل

        return false;
    }

    return true;
}
/* Booking System */
// فتح صفحة الدفع

function openPayment(destination, price, method = 'visa') {

    if (localStorage.getItem('isLoggedIn') !== 'true') {
// لازم يكون مسجل دخول

        alert("Please login first!");
        window.location.href = "sign.html";
        return;
    }

    localStorage.setItem('tempDest', destination);
// تخزين الوجهة

    localStorage.setItem('tempPrice', Number(price));
// تخزين السعر

    localStorage.setItem('paymentMethod', method);
// طريقة الدفع

    const paymentArea = document.getElementById('paymentArea');
// قسم الدفع

    if (paymentArea) {

        if (!checkPassengerBeforeAction()) return;
// تأكد من الراكب

        paymentArea.classList.add('active');
// إظهار الدفع

        document.getElementById('destTitle').innerText =
            "Booking to " + destination;
// الوجهة

        document.getElementById('priceTitle').innerText =
            "Total Price: " + Number(price).toLocaleString() + " EGP";
// السعر

        if (method === 'cash') {
// كاش

            document.getElementById('cashFields').style.display = 'block';
            document.getElementById('visaFields').style.display = 'none';

        } else {
// فيزا

            document.getElementById('visaFields').style.display = 'block';
            document.getElementById('cashFields').style.display = 'none';
        }

        paymentArea.scrollIntoView({ behavior: 'smooth' });
// النزول للقسم
    }
}

/* Validate & Confirm Payment */
// التحقق من بيانات الدفع ثم تأكيد الحجز

function validatePayment() {

    const method = localStorage.getItem('paymentMethod');
// طريقة الدفع المختارة

    const otp = document.getElementById('otp').value;
// كود OTP المدخل من المستخدم

    if (method === 'cash') {
// لو الدفع كاش

        const phone = document.getElementById('cashPhone').value;
// رقم الهاتف للكاش

        if (phone.length < 11 || !otp) {
// التحقق من صحة البيانات

            alert("Please enter a valid Phone number and OTP!");
// تنبيه خطأ

            return;
// إيقاف العملية
        }

        confirmBooking('Cash / Wallet');
// تأكيد الحجز كاش

    } else {
// لو الدفع فيزا

        const card = document.getElementById('cardNumber').value;
// رقم البطاقة

        if (card.length < 12 || !otp) {
// تحقق من البطاقة و OTP

            alert("Please enter valid Card details and OTP!");
// تنبيه خطأ

            return;
// إيقاف
        }

        confirmBooking('Visa / Master Card');
// تأكيد الحجز فيزا
    }
}

/* Confirm Booking */
// حفظ الحجز داخل النظام

function confirmBooking(methodName) {

    if (!checkPassengerBeforeAction()) return;
// التأكد من بيانات الراكب

    const dest = localStorage.getItem('tempDest');
// الوجهة

    const price = Number(localStorage.getItem('tempPrice'));
// السعر

    if (!dest) {
// لو مفيش وجهة

        alert("No flight selected!");
        window.location.href = "flights.html";
        return;
    }

    const d = new Date();
// تاريخ الحجز

    d.setDate(d.getDate() + 7);
// إضافة 7 أيام

    const dateStr = d.toLocaleDateString('en-GB');
// تحويل التاريخ لصيغة مناسبة

    const newFlight = {
// إنشاء بيانات الحجز الجديد

        from: "Cairo",
        to: dest,
        price: price.toLocaleString() + " EGP",
        method: methodName,
        class: "Economy",
        date: dateStr
    };

    let list = JSON.parse(localStorage.getItem('myBookings')) || [];
// جلب كل الحجوزات السابقة

    list.push(newFlight);
// إضافة الحجز الجديد

    localStorage.setItem('myBookings', JSON.stringify(list));
// حفظ البيانات

    alert("Booking Successful! Redirecting to your trips...");
// رسالة نجاح

    window.location.href = "my-bookings.html";
// تحويل لصفحة الحجوزات
}

/* Fixed Flights */
// رحلات ثابتة موجودة في النظام

let fixedFlights = [
    { from: "Cairo", to: "London", class: "Business", price: "48,500 EGP", method: "Visa", date: "15/05/2026" },
    { from: "Cairo", to: "Dubai", class: "Economy", price: "14,200 EGP", method: "Wallet", date: "22/06/2026" }
];

/* Render Bookings Table */
// عرض كل الحجوزات في الجدول

function renderTable() {

    const body = document.getElementById('bookingsBody');
// جسم الجدول

    if (!body) return;
// لو مفيش جدول اخرج

    let userBookings = JSON.parse(localStorage.getItem('myBookings')) || [];
// حجوزات المستخدم

    let allData = [...fixedFlights, ...userBookings];
// دمج الحجوزات الثابتة مع الجديدة

    body.innerHTML = "";
// تفريغ الجدول

    if (allData.length === 0) {
// لو مفيش بيانات

        body.innerHTML = "<tr><td colspan='7' style='text-align:center;'>No bookings found.</td></tr>";
        return;
    }

    allData.forEach((item, index) => {
// عرض كل حجز

        const isFixed = index < fixedFlights.length;
// هل هو ثابت ولا لا

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
                        class="delete-btn">
                        Delete
                    </button>
                </td>
            </tr>`;
    });
}

/* Delete Booking */
// حذف حجز

function handleDelete(index, isFixed) {

    if (!confirm("Are you sure you want to cancel this booking?")) return;
// تأكيد الحذف

    if (!isFixed) {
// لو حجز مستخدم

        let userBookings = JSON.parse(localStorage.getItem('myBookings')) || [];
// جلب الحجوزات

        userBookings.splice(index - fixedFlights.length, 1);
// حذف عنصر

        localStorage.setItem('myBookings', JSON.stringify(userBookings));
// حفظ

    } else {
// لو حجز ثابت

        fixedFlights.splice(index, 1);
// حذف من المصفوفة
    }

    renderTable();
// إعادة رسم الجدول
}

/* Signup Validation */
// التحقق من بيانات التسجيل

function validateSignup() {

    const name = document.getElementById('newName').value.trim();
// الاسم

    const email = document.getElementById('newEmail').value.trim();
// الإيميل

    const pass = document.getElementById('newPass').value.trim();
// الباسورد

    if (!name || !email || !pass) {
// لو في بيانات ناقصة

        alert("Please fill all fields");
        return;
    }

    if (!email.includes("@")) {
// تحقق من الإيميل

        alert("Please enter a valid email");
        return;
    }

    if (pass.length < 6) {
// طول الباسورد

        alert("Password must be at least 6 characters");
        return;
    }

    localStorage.setItem('registeredUser', JSON.stringify({ name, email, pass }));
// حفظ المستخدم

    alert("Signup successful! Please login.");
    switchForm('login');
// تحويل لصفحة اللوجين
}

/* Login Validation */
// تسجيل الدخول

function validateLogin() {

    const email = document.getElementById('loginEmail').value.trim();
// الإيميل

    const pass = document.getElementById('loginPass').value.trim();
// الباسورد

    const saved = JSON.parse(localStorage.getItem('registeredUser'));
// البيانات المحفوظة

    if (saved && email === saved.email && pass === saved.pass) {
// لو البيانات صحيحة

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', saved.name);
// تسجيل دخول

        window.location.href = "home.html";
// تحويل

    } else {
// لو خطأ

        alert("Invalid email or password");
    }
}

/* Passenger Save */
// حفظ بيانات الراكب

function savePassengerData() {

    const fname = document.getElementById('fname')?.value;
// الاسم الأول

    const lname = document.getElementById('lname')?.value;
// الاسم الأخير

    const passport = document.getElementById('passport')?.value;
// رقم الباسبور

    if (!fname || !lname || !passport) {
// تحقق من البيانات

        alert("Please fill in the essential passenger details!");
        return;
    }

    const passengerInfo = {
        name: fname + " " + lname,
        passport: passport
    };
// تكوين بيانات الراكب

    localStorage.setItem('currentPassenger', JSON.stringify(passengerInfo));
// حفظ

    alert("Details saved! Proceeding to payment...");
    window.location.href = "payment.html";
// تحويل
}

/* Page Init */
// تشغيل عند فتح الصفحة

document.addEventListener('DOMContentLoaded', () => {

    updateNavbar();
// تحديث الناف بار

    if (document.getElementById('bookingsBody')) {
        renderTable();
// عرض الجدول لو موجود
    }

    if (window.location.pathname.includes('payment.html')) {
// لو في صفحة الدفع

        const dest = localStorage.getItem('tempDest');
        const price = localStorage.getItem('tempPrice');
        const method = localStorage.getItem('paymentMethod') || 'visa';

        if (dest && price && localStorage.getItem('currentPassenger')) {
// لو البيانات كاملة

            const paymentArea = document.getElementById('paymentArea');

            if (paymentArea) {

                paymentArea.classList.add('active');
// تفعيل الدفع

                document.getElementById('destTitle').innerText =
                    "Booking to " + dest;

                document.getElementById('priceTitle').innerText =
                    "Total Price: " + Number(price).toLocaleString() + " EGP";

                if (method === 'cash') {
// كاش

                    document.getElementById('cashFields').style.display = 'block';
                    document.getElementById('visaFields').style.display = 'none';

                } else {
// فيزا

                    document.getElementById('visaFields').style.display = 'block';
                    document.getElementById('cashFields').style.display = 'none';
                }
            }
        }
    }
});