const student = JSON.parse(localStorage.getItem("student"));

if (!student) {

    window.location.href = "login.html";

}

document.getElementById("studentName").innerHTML =
`أهلاً ${student.name}`;

async function loadDashboard(){

    const { count:courses } = await db
    .from("courses")
    .select("*",{count:"exact",head:true});

    document.getElementById("coursesCount").innerHTML=courses;

    const { data:progress } = await db
    .from("student_progress")
    .select("*")
    .eq("student_name",student.email);

    const completed=progress.length;

    const percent=courses==0?0:
    Math.round((completed/courses)*100);

    document.getElementById("progressPercent").innerHTML=
    percent+"%";

    const { data:certificates } = await db
    .from("certificates")
    .select("*")
    .eq("student_name",student.email);

    document.getElementById("certificatesCount").innerHTML=
    certificates.length;

}

loadDashboard();
loadCertificates();
document.getElementById("coursesBtn").onclick = async () => {

    const { data, error } = await db
        .from("courses")
        .select("id")
        .eq("title", student.course)
        .single();

    if (error) {

        alert("الكورس غير موجود");

        console.log(error);

        return;

    }

    window.location.href = `course.html?id=${data.id}`;

}; 

document.getElementById("logoutBtn").onclick=()=>{

    localStorage.removeItem("student");

    window.location.href="login.html";

}

async function loadCertificates() {

    const { data, error } = await db
        .from("certificates")
        .select(`
            *,
            courses(title)
        `)
        .eq("student_name", student.email)
        .order("issue_date", { ascending: false });

    if (error) {
        console.log(error);
        return;
    }

    const list = document.getElementById("certificatesList");

    list.innerHTML = "";

    if (data.length === 0) {

        list.innerHTML = "<p>لا توجد شهادات حتى الآن.</p>";

        return;

    }

    data.forEach(certificate => {

        list.innerHTML += `

        <div class="certificate-card">

            <h3>${certificate.courses.title}</h3>

            <p>

                رقم الشهادة:

                ${certificate.certificate_number}

            </p>

            <button onclick="openCertificate(${certificate.course_id})">

                عرض الشهادة

            </button>

        </div>

        `;

    });

}

function openCertificate(courseId){

    window.location.href =
    `certificate.html?course=${courseId}`;

}

