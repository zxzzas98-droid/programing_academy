// ======================================
// Login Student
// ======================================

const loginForm = document.getElementById("loginForm");

const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", loginStudent);

async function loginStudent(e){

    e.preventDefault();

    const email = document
    .getElementById("loginEmail")
    .value
    .trim();

    loginMessage.style.color = "#2563eb";

    loginMessage.innerHTML = "جاري تسجيل الدخول...";

    const { data, error } = await supabase

    .from("students")

    .select("*")

    .eq("email", email)

    .single();

    if(error || !data){

        loginMessage.style.color = "red";

        loginMessage.innerHTML = "البريد الإلكتروني غير موجود";

        return;

    }

    if(data.status === "Pending"){

        loginMessage.style.color = "orange";

        loginMessage.innerHTML = "طلبك مازال قيد المراجعة";

        return;

    }

    if(data.status === "Rejected"){

        loginMessage.style.color = "red";

        loginMessage.innerHTML = "تم رفض طلبك من الإدارة";

        return;

    }

  if(data.status === "Approved"){

    localStorage.setItem(
        "student",
        JSON.stringify(data)
    );

    loginMessage.style.color = "green";

    loginMessage.innerHTML = "تم تسجيل الدخول";

    setTimeout(()=>{

        window.location.href = "student.html";

    },1000);

}

}