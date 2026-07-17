// const supabaseUrl = "https://tqyigopjqqsghdpvtjvn.supabase.co";
// const supabaseKey = "ضع الـ Publishable Key هنا";

// const db = supabase.createClient(supabaseUrl, supabaseKey);

// async function loadCourses() {

//     const { data, error } = await db
//         .from("courses")
//         .select("*")
//         .order("id", { ascending: false });

//     if (error) {
//         console.log(error);
//         return;
//     }

//     const container = document.getElementById("coursesContainer");

//     container.innerHTML = "";

//     data.forEach(course => {

//         container.innerHTML += `
//             <div class="course-card">

//                 <img src="${course.image}" alt="${course.title}">

//                 <h3>${course.title}</h3>

//                 <p>${course.description}</p>

//                 <span>${course.price} جنيه</span>

//             </div>
//         `;

//     });

// }

// loadCourses();



async function loadLatestCourses() {

    const { data, error } = await db
        .from("courses")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const container = document.getElementById("latestCourses");

    container.innerHTML = "";

    data.forEach(course => {

        container.innerHTML += `
            <div class="course-card">

                <img src="${course.image}" alt="${course.title}">

                <div class="course-info">

                    <h3>${course.title}</h3>

                    <p>${course.description}</p>

                    <span>${course.price} جنيه</span>

                    <button onclick="window.location.href='course.html?id=${course.id}'">
                        ابدأ التعلم
                    </button>

                </div>

            </div>
        `;

    });

}

loadLatestCourses();




const themeBtn = document.getElementById("themeToggle");

// تحميل الوضع المحفوظ
if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add("dark");

    themeBtn.innerHTML="☀";

}else{

    themeBtn.innerHTML="🌙";

}

// تغيير الوضع

themeBtn.onclick = ()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML="☀";

    }else{

        localStorage.setItem("theme","light");

        themeBtn.innerHTML="🌙";

    }

};