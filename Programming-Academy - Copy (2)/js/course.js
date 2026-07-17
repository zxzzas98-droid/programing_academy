const params = new URLSearchParams(window.location.search);

const courseId = Number(params.get("id"));

const student = JSON.parse(localStorage.getItem("student"));



let completedLessons = [];

if (!student) {

    alert("يجب إنشاء حساب أولاً");

    window.location.href = "register.html";

}

let lessons = [];
let progress = [];
let currentLesson = 0;

async function loadPage() {

    // بيانات الكورس
    const { data: course, error: courseError } = await db
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

    if (courseError) {

        console.log(courseError);

        return;

    }

    document.getElementById("courseTitle").textContent = course.title;

    document.getElementById("courseDescription").textContent = course.description;

    // الدروس
    const { data: lessonsData, error: lessonsError } = await db

        .from("lessons")

        .select("*")

        .eq("course_id", courseId)

        .order("lesson_order");

    if (lessonsError) {

        console.log(lessonsError);

        return;

    }

    lessons = lessonsData;

    // التقدم
    const { data: progressData } = await db

        .from("student_progress")

        .select("*")

        .eq("student_name", student.email)

        .eq("course_id", courseId);

    progress = progressData || [];

    renderLessons();

    if (lessons.length > 0) {

        playLesson(0);

    }

}

function lessonCompleted(id) {

    return progress.some(p => p.lesson_id === id);

}

function lessonUnlocked(index) {

    if (index === 0) return true;

    return lessonCompleted(lessons[index - 1].id);

}

function renderLessons() {

    const list = document.getElementById("lessonsList");

    list.innerHTML = "";

    lessons.forEach((lesson, index) => {

        const button = document.createElement("button");

        if (lessonCompleted(lesson.id)) {

            button.innerHTML = `✅ ${lesson.lesson_order} - ${lesson.title}`;

            button.className = "lessonDone";

        }

        else if (lessonUnlocked(index)) {

            button.innerHTML = `📘 ${lesson.lesson_order} - ${lesson.title}`;

            button.className = "lessonOpen";

        }

        else {

            button.innerHTML = `🔒 ${lesson.lesson_order} - ${lesson.title}`;

            button.className = "lessonLocked";

        }

        button.onclick = () => {

            if (!lessonUnlocked(index)) {

                alert("يجب النجاح في اختبار الدرس السابق أولاً");

                return;

            }

            playLesson(index);

        };

        list.appendChild(button);

    });

}

function playLesson(index) {

    currentLesson = index;

    const lesson = lessons[index];

    document.getElementById("videoPlayer").src =
        convertToEmbed(lesson.video_url);

    updateActiveLesson();

    updateProgress();

}

function convertToEmbed(url) {

    if (url.includes("watch?v=")) {

        const id = new URL(url).searchParams.get("v");

        return `https://www.youtube.com/embed/${id}`;

    }

    if (url.includes("youtu.be/")) {

        const id = url.split("youtu.be/")[1];

        return `https://www.youtube.com/embed/${id}`;

    }

    return url;

}

function updateActiveLesson() {

    const buttons = document.querySelectorAll("#lessonsList button");

    buttons.forEach(btn => btn.classList.remove("activeLesson"));

    if (buttons[currentLesson]) {

        buttons[currentLesson].classList.add("activeLesson");

    }

}

function updateProgress() {

    const done = progress.length;

    const total = lessons.length;

    const percent = Math.round((done / total) * 100);

    const progressText = document.getElementById("progressText");

    const progressBar = document.getElementById("progressBar");

    if (progressText) {

        progressText.textContent =
            `أكملت ${done} من ${total} (${percent}%)`;

    }

    if (progressBar) {

        progressBar.style.width = percent + "%";

    }

}

document.getElementById("nextLesson").onclick = () => {

    if (currentLesson >= lessons.length - 1) {

        alert("هذا آخر درس");

        return;

    }

    if (!lessonUnlocked(currentLesson + 1)) {

        alert("اجتز اختبار الدرس الحالي أولاً");

        return;

    }

    playLesson(currentLesson + 1);

};

document.getElementById("prevLesson").onclick = () => {

    if (currentLesson > 0) {

        playLesson(currentLesson - 1);

    }

};

document.getElementById("quizBtn").onclick = () => {

    const lesson = lessons[currentLesson];

    window.location.href =
        `quiz.html?lesson=${lesson.id}&course=${courseId}`;

};

loadPage();

