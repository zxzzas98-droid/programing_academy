/*=========================================
 Programming Academy
 profile.js
=========================================*/

//==================================
// CURRENT USER
//==================================

const currentUser = JSON.parse(

localStorage.getItem("currentUser")

);

if(!currentUser){

window.location.href="login.html";

}

//==================================
// ELEMENTS
//==================================

const fullName=document.getElementById("fullName");

const email=document.getElementById("email");

const phone=document.getElementById("phone");

const course=document.getElementById("course");

const profileName=document.getElementById("profileName");

const profileImage=document.getElementById("profileImage");

const profileForm=document.getElementById("profileForm");

//==================================
// LOAD DATA
//==================================

function loadProfile(){

fullName.value=currentUser.name||"";

email.value=currentUser.email||"";

phone.value=currentUser.phone||"";

course.value=currentUser.course||"HTML & CSS";

profileName.textContent=currentUser.name||"Student";

if(currentUser.image){

profileImage.src=currentUser.image;

}

}

loadProfile();

//==================================
// SAVE PROFILE
//==================================

profileForm.addEventListener("submit",(e)=>{

e.preventDefault();

currentUser.name=fullName.value;

currentUser.email=email.value;

currentUser.phone=phone.value;

currentUser.course=course.value;

localStorage.setItem(

"currentUser",

JSON.stringify(currentUser)

);

let students=JSON.parse(

localStorage.getItem("students")

)||[];

const index=students.findIndex(

student=>student.id===currentUser.id

);

if(index!==-1){

students[index]=currentUser;

localStorage.setItem(

"students",

JSON.stringify(students)

);

}

profileName.textContent=currentUser.name;

showToast("Profile Updated Successfully");

});

/*==================================
 PROFILE IMAGE
==================================*/

const imageInput=document.getElementById("imageInput");

const changeImage=document.getElementById("changeImage");

changeImage.onclick=()=>{

imageInput.click();

};

imageInput.onchange=()=>{

const file=imageInput.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=(e)=>{

profileImage.src=e.target.result;

currentUser.image=e.target.result;

localStorage.setItem(

"currentUser",

JSON.stringify(currentUser)

);

let students=JSON.parse(

localStorage.getItem("students")

)||[];

const index=students.findIndex(

student=>student.id===currentUser.id

);

if(index!=-1){

students[index].image=e.target.result;

localStorage.setItem(

"students",

JSON.stringify(students)

);

}

showToast("Profile Image Updated");

};

reader.readAsDataURL(file);

};

/*==================================
 CHANGE PASSWORD
==================================*/

const passwordForm=document.getElementById("passwordForm");

passwordForm.addEventListener("submit",(e)=>{

e.preventDefault();

const oldPassword=document.getElementById("oldPassword").value;

const newPassword=document.getElementById("newPassword").value;

const confirmPassword=document.getElementById("confirmPassword").value;

if(oldPassword!==currentUser.password){

showToast("Current Password Incorrect");

return;

}

if(newPassword!==confirmPassword){

showToast("Passwords Do Not Match");

return;

}

currentUser.password=newPassword;

localStorage.setItem(

"currentUser",

JSON.stringify(currentUser)

);

let students=JSON.parse(

localStorage.getItem("students")

)||[];

const index=students.findIndex(

student=>student.id===currentUser.id

);

if(index!=-1){

students[index].password=newPassword;

localStorage.setItem(

"students",

JSON.stringify(students)

);

}

passwordForm.reset();

showToast("Password Changed Successfully");

});

/*==================================
 STATISTICS
==================================*/

document.getElementById("completedCourses").textContent=

localStorage.getItem("completedCourses")||0;

document.getElementById("studyingCourses").textContent=

localStorage.getItem("studyingCourses")||0;

document.getElementById("certificateCount").textContent=

localStorage.getItem("completedCourses")||0;

let progress=0;

const completed=Number(

localStorage.getItem("completedCourses")

)||0;

progress=Math.min(completed*10,100);

document.getElementById("overallProgress").textContent=

progress+"%";

/*==================================
 LAST LOGIN
==================================*/

document.getElementById("lastLogin").textContent=

localStorage.getItem(

"lastLogin_"+currentUser.id

)||"Unknown";


/*==================================
 FAVORITE COURSES
==================================*/

const favoriteList=document.getElementById("favoriteCourses");

const favorites=JSON.parse(

localStorage.getItem("favorites")

)||[];

favoriteList.innerHTML="";

if(favorites.length===0){

favoriteList.innerHTML="<li>No Favorite Courses</li>";

}else{

favorites.forEach(course=>{

const li=document.createElement("li");

li.innerHTML="❤️ Course #"+(course+1);

favoriteList.appendChild(li);

});

}

/*==================================
 DARK / LIGHT MODE
==================================*/

const themeBtn=document.getElementById("themeBtn");

const savedTheme=localStorage.getItem("profileTheme");

if(savedTheme==="light"){

document.body.classList.add("light");

themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

}

themeBtn.onclick=()=>{

document.body.classList.toggle("light");

if(document.body.classList.contains("light")){

localStorage.setItem("profileTheme","light");

themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

showToast("Light Mode Enabled");

}else{

localStorage.setItem("profileTheme","dark");

themeBtn.innerHTML='<i class="fa-solid fa-moon"></i>';

showToast("Dark Mode Enabled");

}

};

/*==================================
 LOGOUT
==================================*/

function logout(){

localStorage.removeItem("currentUser");

window.location.href="login.html";

}

/*==================================
 TOAST
==================================*/

function showToast(message){

const toast=document.createElement("div");

toast.className="toast";

toast.textContent=message;

document.body.appendChild(toast);

setTimeout(()=>{

toast.classList.add("show");

},100);

setTimeout(()=>{

toast.classList.remove("show");

setTimeout(()=>{

toast.remove();

},300);

},2500);

}

/*==================================
 SHORTCUTS
==================================*/

document.addEventListener("keydown",(e)=>{

if(e.ctrlKey&&e.key==="d"){

themeBtn.click();

}

if(e.ctrlKey&&e.key==="l"){

logout();

}

});

/*==================================
 AUTO SAVE
==================================*/

window.addEventListener("beforeunload",()=>{

localStorage.setItem(

"currentUser",

JSON.stringify(currentUser)

);

});

/*==================================
 PAGE READY
==================================*/

window.addEventListener("load",()=>{

showToast(

"Welcome Back, "+currentUser.name

);

});

/*==================================
 END
==================================*/