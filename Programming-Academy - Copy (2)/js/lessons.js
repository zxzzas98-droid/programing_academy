


const params = new URLSearchParams(window.location.search);
const courseId = Number(params.get("course"));
console.log("Course ID From URL =", courseId);
const modal = document.getElementById("lessonModal");

let editingLessonId = null;

document.getElementById("addLesson").onclick = () => {

    editingLessonId = null;

    document.getElementById("lessonTitle").value = "";
    document.getElementById("lessonVideo").value = "";
    document.getElementById("lessonDuration").value = "";
    document.getElementById("lessonOrder").value = "";

    modal.style.display = "block";

};

async function loadLessons() {

    const { data, error } = await db
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("lesson_order", { ascending: true });

    if (error) {
        console.log(error);
        return;
    }

    const table = document.getElementById("lessonsTable");

    table.innerHTML = "";

    data.forEach(lesson => {

        table.innerHTML += `
        <tr>

            <td>${lesson.lesson_order}</td>

            <td>${lesson.title}</td>

            <td>${lesson.duration}</td>

<td>

<button onclick="editLesson(${lesson.id})">
تعديل
</button>

<button onclick="deleteLesson(${lesson.id})">
حذف
</button>

<button onclick="openQuiz(${lesson.id})">
اختبار
</button>

</td>

        </tr>
        `;

    });

}

document.getElementById("saveLesson").onclick = async () => {

    const title = document.getElementById("lessonTitle").value;
    const video_url = document.getElementById("lessonVideo").value;
    const duration = document.getElementById("lessonDuration").value;
    const lesson_order = Number(document.getElementById("lessonOrder").value);

    let error;

    if (editingLessonId) {

        ({ error } = await db
            .from("lessons")
            .update({
                title,
                video_url,
                duration,
                lesson_order
            })
            .eq("id", editingLessonId));

    } else {

        ({ error } = await db
            .from("lessons")
            .insert([{
                course_id: courseId,
                title,
                video_url,
                duration,
                lesson_order
            }]));

    }

    if (error) {
        console.log(error);
        alert(error.message);
        return;
    }

    alert(editingLessonId ? "تم تعديل الدرس" : "تم إضافة الدرس");

    modal.style.display = "none";

    editingLessonId = null;

    loadLessons();

};

async function editLesson(id) {

    const { data, error } = await db
        .from("lessons")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        alert(error.message);
        return;
    }

    editingLessonId = id;

    document.getElementById("lessonTitle").value = data.title;
    document.getElementById("lessonVideo").value = data.video_url;
    document.getElementById("lessonDuration").value = data.duration;
    document.getElementById("lessonOrder").value = data.lesson_order;

    modal.style.display = "block";

}

async function deleteLesson(id) {

    const ok = confirm("هل تريد حذف الدرس؟");

    if (!ok) return;

    const { error } = await db
        .from("lessons")
        .delete()
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    alert("تم حذف الدرس");

    loadLessons();

}

loadLessons();

function openQuiz(lessonId) {

    window.location.href =
    `lesson-quiz.html?lesson=${lessonId}`;

}