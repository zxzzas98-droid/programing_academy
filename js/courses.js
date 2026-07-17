const supabaseUrl = "https://tqyigopjqqsghdpvtjvn.supabase.co";
alert("أنا الملف الجديد");
const supabaseKey = "sb_publishable_vwhUFY1WSTxbA-IocuRVrA_fQgpS1eU";

const db = supabase.createClient(supabaseUrl, supabaseKey);

const modal = document.getElementById("courseModal");

const addBtn = document.getElementById("addBtn");

const closeBtn = document.getElementById("closeModal");

let editingCourseId = null;
let currentImage = "";

addBtn.onclick = () => {

    modal.style.display = "flex";

};

closeBtn.onclick = () => {

    modal.style.display = "none";

};

window.onclick = (e)=>{

    if(e.target==modal){

        modal.style.display="none";

    }

};

// async function uploadImage(file){

//     const fileName = Date.now() + "-" + file.name;

//     const { error } = await db.storage
//         .from("courses")
//         .upload(fileName, file);

//     if(error){

//         alert(error.message);

//         return null;

//     }

//     const { data } = db.storage
//         .from("courses")
//         .getPublicUrl(fileName);

//     return data.publicUrl;

// }

async function uploadImage(file){

    const fileName = Date.now() + "-" + file.name;

    const { data, error } = await db.storage
        .from("courses")
        .upload(fileName, file);

    console.log("Upload Data:", data);
    console.log("Upload Error:", error);

    if(error){
        alert(error.message);
        return null;
    }

    const { data: publicData } = db.storage
        .from("courses")
        .getPublicUrl(fileName);

    console.log("Public URL:", publicData.publicUrl);

    return publicData.publicUrl;
}

// document.getElementById("saveCourse").onclick = async ()=>{

//     const imageFile =
//     document.getElementById("courseImage").files[0];

//     let imageUrl="";

//     if(imageFile){

//         imageUrl=await uploadImage(imageFile);

//     }

//     const { error } = await db

//     .from("courses")

//     .insert([{

//         title:document.getElementById("courseTitle").value,

//         description:document.getElementById("courseDescription").value,

//         category:document.getElementById("courseCategory").value,

//         level:document.getElementById("courseLevel").value,

//         lessons:Number(document.getElementById("courseLessons").value)||0,

//         duration:document.getElementById("courseDuration").value,

//         price:Number(document.getElementById("coursePrice").value)||0,

//         image:imageUrl

//     }]);

//     if(error){

//         console.log(error);

//         alert(error.message);

//         return;

//     }

//     alert("تم إضافة الكورس");

//     modal.style.display="none";

//     loadCourses();

// };

document.getElementById("saveCourse").onclick = async ()=>{

    const title = document.getElementById("courseTitle").value;
    const description = document.getElementById("courseDescription").value;
    const category = document.getElementById("courseCategory").value;
    const level = document.getElementById("courseLevel").value;
    const lessons = Number(document.getElementById("courseLessons").value)||0;
    const duration = document.getElementById("courseDuration").value;
    const price = Number(document.getElementById("coursePrice").value)||0;

    const imageFile = document.getElementById("courseImage").files[0];

    let imageUrl = currentImage;

    if(imageFile){
        imageUrl = await uploadImage(imageFile);
    }

    let error;

    if(editingCourseId){

        ({ error } = await db
            .from("courses")
            .update({
                title,
                description,
                category,
                level,
                lessons,
                duration,
                price,
                image:imageUrl
            })
            .eq("id", editingCourseId));

    }else{

        ({ error } = await db
            .from("courses")
            .insert([{
                title,
                description,
                category,
                level,
                lessons,
                duration,
                price,
                image:imageUrl
            }]));

    }

    if(error){
        alert(error.message);
        return;
    }

    alert(editingCourseId ? "تم تعديل الكورس" : "تم إضافة الكورس");

    editingCourseId = null;
    currentImage = "";

    modal.style.display = "none";

    loadCourses();
};

async function loadCourses(){

    const { data,error } = await db

    .from("courses")

    .select("*")

    .order("id",{ascending:false});
console.log(data);
    if(error){

        console.log(error);

        return;

    }

    const table=document.getElementById("coursesTable");

    table.innerHTML="";

    data.forEach(course=>{
   console.log("ID =", course.id, "Title =", course.title);
        table.innerHTML+=`

<tr>

<td>${course.id}</td>

<td>

<img src="${course.image}" width="80">

</td>

<td>${course.title}</td>

<td>${course.category}</td>

<td>${course.level}</td>

<td>${course.lessons}</td>

<td>${course.price} جنيه</td>

<td>

<button class="edit"
onclick="editCourse(${course.id})">
تعديل
</button>

<button class="delete"
onclick="deleteCourse(${course.id})">
حذف
</button>

<button class="lessons"
onclick="openLessons(${course.id})">
إدارة الدروس
</button>

</td>

</tr>

`;

    });

}

loadCourses();


async function deleteCourse(id) {

    const ok = confirm("هل تريد حذف الكورس؟");

    if (!ok) return;

    const { error } = await db
        .from("courses")
        .delete()
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    alert("تم حذف الكورس");

    loadCourses();

}

async function deleteCourse(id) {

    const ok = confirm("هل تريد حذف الكورس؟");

    if (!ok) return;

    const { error } = await db
        .from("courses")
        .delete()
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    alert("تم حذف الكورس");

    loadCourses();
}

async function editCourse(id){

    const { data, error } = await db
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

    if(error){
        alert(error.message);
        return;
    }

    editingCourseId = id;
    currentImage = data.image;

    document.getElementById("courseTitle").value = data.title;
    document.getElementById("courseDescription").value = data.description;
    document.getElementById("courseCategory").value = data.category;
    document.getElementById("courseLevel").value = data.level;
    document.getElementById("courseLessons").value = data.lessons;
    document.getElementById("courseDuration").value = data.duration;
    document.getElementById("coursePrice").value = data.price;

    modal.style.display = "flex";
}

function openLessons(courseId) {

    window.location.href = `lessons.html?course=${courseId}`;

}

