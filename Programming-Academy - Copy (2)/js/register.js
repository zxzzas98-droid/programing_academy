// ======================================
// Register Student
// ======================================

const form = document.getElementById("registerForm");
const message = document.getElementById("registerMessage");

form.addEventListener("submit", registerStudent);

async function registerStudent(e){

    e.preventDefault();

    const student={

        name:document.getElementById("name").value,

        email:document.getElementById("email").value,

        phone:document.getElementById("phone").value,

        course:document.getElementById("course").value,

        status:"Pending"

    };

    message.innerHTML="جاري إنشاء الحساب...";

const { data, error } = await window.db
    .from("students")
    .insert([student])
    .select()
    .single();

if (error) {

    message.style.color = "red";
    message.innerHTML = error.message;
    return;

}

// حفظ بيانات الطالب
localStorage.setItem(
    "student",
    JSON.stringify(data)
);

message.style.color = "green";
message.innerHTML = "تم إرسال طلبك، انتظر موافقة الإدارة...";

setTimeout(() => {

    window.location.href = "pending.html";

}, 1000);

    if(error){

        message.style.color="red";
        message.innerHTML=error.message;
        return;

    }

    // نحفظ بيانات الطالب مؤقتاً
    localStorage.setItem(
        "student",
        JSON.stringify(student)
    );

    message.style.color="green";

    message.innerHTML="تم إرسال طلبك، انتظر موافقة الإدارة...";

    setTimeout(()=>{

        window.location.href="pending.html";

    },1000);

}