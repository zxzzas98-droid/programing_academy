// ======================================
// Check Admin Login
// ======================================

checkAdmin();

async function checkAdmin() {

    const { data, error } = await window.db.auth.getSession();

    if (error || !data.session) {

        window.location.replace("admin-login.html");

        return;

    }

}

// ==========================================
// Programming Academy Admin Dashboard
// ==========================================

//===========================================
// Supabase
//===========================================

const table = document.getElementById("studentsTable");

const totalStudents = document.getElementById("totalStudents");

const pendingStudents = document.getElementById("pendingStudents");

const acceptedStudents = document.getElementById("acceptedStudents");

const rejectedStudents = document.getElementById("rejectedStudents");

const latestStudents = document.getElementById("latestStudents");

const studentsCount = document.getElementById("studentsCount");

//===========================================
// Start
//===========================================

window.addEventListener("load", () => {

    loadStudents();

});

//===========================================
// Load Students
//===========================================

async function loadStudents() {

    console.log("Start Loading...");

    const { data, error } = await window.db
        .from("students")
        .select("*")
        .order("id", { ascending: false });

    console.log("Data =", data);
    console.log("Error =", error);

    if (error) {
        alert(error.message);
        return;
    }

    createStatistics(data);
    createLatestStudents(data);
    createTable(data);

    console.log("Finished");
}

//===========================================
// Statistics
//===========================================

function createStatistics(data){

    totalStudents.innerHTML = data.length;

    const pending = data.filter(student =>

        student.status==="Pending"

    ).length;

    const accepted = data.filter(student =>

        student.status==="Approved"

    ).length;

    const rejected = data.filter(student =>

        student.status==="Rejected"

    ).length;

    animateCounter(pendingStudents,pending);

    animateCounter(acceptedStudents,accepted);

    animateCounter(rejectedStudents,rejected);

    animateCounter(totalStudents,data.length);

}

//===========================================
// Latest Students
//===========================================

function createLatestStudents(data){

    latestStudents.innerHTML="";

    data.slice(0,5).forEach(student=>{

        latestStudents.innerHTML+=`

        <li>

            <div class="latest-user">

                <img src="images/student.png">

                <div>

                    <h4>

                        ${student.name}

                    </h4>

                    <span>

                        ${student.course}

                    </span>

                </div>

            </div>

            <span class="latest-status ${student.status.toLowerCase()}">

                ${student.status}

            </span>

        </li>

        `;

    });

}

//===========================================
// Create Students Table
//===========================================

function createTable(data){
console.log("Create Table", data);
    table.innerHTML="";

    if(data.length===0){

        table.innerHTML=`

        <tr>

            <td colspan="8">

                لا يوجد طلاب

            </td>

        </tr>

        `;

        return;

    }

    data.forEach((student,index)=>{

        let badgeClass="pending";

        if(student.status==="Approved"){

            badgeClass="accepted";

        }

        if(student.status==="Rejected"){

            badgeClass="rejected";

        }

        table.innerHTML+=`

        <tr>

            <td>

                ${index+1}

            </td>

            <td>

                <div class="student-info">

                    <img src="images/student.png">

                    <div>

                        <h4>

                            ${student.name}

                        </h4>

                        <span>

                            Student

                        </span>

                    </div>

                </div>

            </td>

            <td>

                ${student.email}

            </td>

            <td>

                ${student.phone}

            </td>

            <td>

                ${student.course}

            </td>

            <td>

                <span class="badge ${badgeClass}">

                    ${student.status}

                </span>

            </td>

            <td>

                ${student.created_at ?
                new Date(student.created_at).toLocaleDateString("ar-EG")
                :
                "-"}

            </td>

            <td>

                <div class="actions">

                    <button
                    class="view"
                    onclick="viewStudent(${student.id})">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                    <button
                    class="accept"
                    onclick="approveStudent(${student.id})">

                        <i class="fa-solid fa-check"></i>

                    </button>

                    <button
                    class="reject"
                    onclick="rejectStudent(${student.id})">

                        <i class="fa-solid fa-xmark"></i>

                    </button>

                    <button
                    class="delete"
                    onclick="deleteStudent(${student.id})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>

        `;
console.log("Added:", student.name);
    });

}

//===========================================
// View Student
//===========================================

async function viewStudent(id){



    console.log("View Student:", id);
    const {data,error}=await window.db

    .from("students")

    .select("*")

    .eq("id",id)

    .single();

    if(error){

        alert(error.message);

        return;

    }

    document.getElementById("mName").innerHTML=data.name;

    document.getElementById("mEmail").innerHTML=data.email;

    document.getElementById("mPhone").innerHTML=data.phone;

    document.getElementById("mCourse").innerHTML=data.course;

    document.getElementById("mStatus").innerHTML=data.status;

    document.getElementById("mStudentStatus").innerHTML=data.status;

    document.getElementById("studentModal").style.display="flex";
console.log("Student ID:", id);
}


//===========================================
// Approve Student
//===========================================

async function approveStudent(id){

    const { error } = await window.db
        .from("students")
        .update({
            status: "Approved"
        })
        .eq("id", id);

    if(error){

        alert(error.message);

        return;

    }

    loadStudents();

}

// async function approveStudent(id){

//     // جلب بيانات الطالب

//     const { data: student, error: getError } = await window.db

//         .from("students")

//         .select("*")

//         .eq("id", id)

//         .single();

//     if(getError){

//         alert(getError.message);

//         return;

//     }

//     // تحديث الحالة

//     const { error } = await window.db

//         .from("students")

//         .update({

//             status:"Approved"

//         })

//         .eq("id",id);

//     if(error){

//         alert(error.message);

//         return;

//     }

//     // إرسال الإيميل

//     await sendStudentEmail(student,"Approved");

//     loadStudents();

// }

//===========================================
// Reject Student
//===========================================

// async function rejectStudent(id){

//     const { error } = await window.db
//         .from("students")
//         .update({
//             status: "Rejected"
//         })
//         .eq("id", id);

//     if(error){

//         alert(error.message);

//         return;

//     }

//     loadStudents();

// }


//===========================================
// Delete Student
//===========================================

//===========================================
// Reject Student
//===========================================

async function rejectStudent(id){

    const { error } = await window.db
        .from("students")
        .update({
            status: "Rejected"
        })
        .eq("id", id);

    if(error){

        alert(error.message);

        return;

    }

    loadStudents();

}


async function deleteStudent(id){

    if(!confirm("هل تريد حذف هذا الطالب؟")){

        return;

    }

    const { error } = await window.db
        .from("students")
        .delete()
        .eq("id", id);

    if(error){

        alert(error.message);

        return;

    }

    loadStudents();

}

//===========================================
// Search Students
//===========================================

// const searchInput = document.getElementById("studentSearch");

// searchInput.addEventListener("keyup", searchStudents);

// async function searchStudents(){

//     const keyword = searchInput.value.trim();

//     let query = window.db
//         .from("students")
//         .select("*")
//         .order("id",{ascending:false});

//     if(keyword !== ""){

//         query = query.or(

//             `name.ilike.%${keyword}%,
//              email.ilike.%${keyword}%`

//         );

//     }

//     const {data,error}=await query;

//     if(error){

//         console.log(error);

//         return;

//     }

//     createStatistics(data);

//     createLatestStudents(data);

//     createTable(data);

// }
//===========================================
// Search Students
//===========================================

const searchInput = document.getElementById("studentSearch");

searchInput.addEventListener("input", searchStudents);

async function searchStudents() {

    const keyword = searchInput.value.trim();

    let query = window.db
        .from("students")
        .select("*");

    if (keyword !== "") {

        query = query.or(
            `name.ilike.%${keyword}%,email.ilike.%${keyword}%`
        );

    }

    const { data, error } = await query.order("id", { ascending: false });

    if (error) {
        console.log(error);
        return;
    }

    createStatistics(data);
    createLatestStudents(data);
    createTable(data);

}
//===========================================
// Close Modal
//===========================================

const modal = document.getElementById("studentModal");

const closeModal = document.getElementById("closeModal");

closeModal.onclick = () => {

    modal.style.display = "none";

};

window.onclick = (e)=>{

    if(e.target===modal){

        modal.style.display="none";

    }

};

//===========================================
// Refresh
//===========================================

const refreshBtn=document.getElementById("refreshStudents");

if(refreshBtn){

    refreshBtn.onclick=()=>{

        loadStudents();

    };

}

//===========================================
// Counter Animation
//===========================================

function animateCounter(element,value){

    let start=0;

    const timer=setInterval(()=>{

        start++;

        element.innerHTML=start;

        if(start>=value){

            clearInterval(timer);

        }

    },15);

}

//===========================================
// Dark Mode
//===========================================

const themeBtn = document.getElementById("themeToggle");

if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add("dark");

    themeBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;

}

themeBtn.onclick = ()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;

    }else{

        localStorage.setItem("theme","light");

        themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;

    }

};

const customizer=document.getElementById("themeCustomizer");

document.getElementById("customizerBtn").onclick=()=>{

    customizer.classList.add("active");

};

document.getElementById("closeCustomizer").onclick=()=>{

    customizer.classList.remove("active");

};

document.querySelectorAll(".color").forEach(color=>{

    color.onclick=()=>{

        const value=color.dataset.color;

        document.documentElement.style.setProperty("--primary",value);

        localStorage.setItem("mainColor",value);

    };

});

const savedColor=localStorage.getItem("mainColor");

if(savedColor){

    document.documentElement.style.setProperty("--primary",savedColor);

}


// ======================================
// Logout
// ======================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.onclick = async () => {

        await window.db.auth.signOut();

        window.location.href = "admin-login.html";

    };

}


async function sendStudentEmail(student, status) {

    try {

        const response = await emailjs.send(

            "service_1a6f24j",

            "template_dtu8lg6",

            {
                name: student.name,
                email: student.email,
                status: status,
                course: student.course
            }

        );

        console.log("Email Sent", response);

    } catch (error) {

        console.error("Email Error", error);

    }

}