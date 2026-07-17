// ======================================
// Admin Login
// ======================================

const form = document.getElementById("adminLoginForm");
const message = document.getElementById("loginMessage");

form.addEventListener("submit", loginAdmin);

async function loginAdmin(e){

    e.preventDefault();

    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    message.style.color = "#2563eb";
    message.innerHTML = "جاري تسجيل الدخول...";

    const { data, error } = await window.db.auth.signInWithPassword({

        email: email,
        password: password

    });

    if(error){

        message.style.color = "red";
        message.innerHTML = "البريد الإلكتروني أو كلمة المرور غير صحيحة";

        return;

    }

    message.style.color = "green";
    message.innerHTML = "تم تسجيل الدخول";

    setTimeout(()=>{

        window.location.href = "admin.html";

    },1000);

}