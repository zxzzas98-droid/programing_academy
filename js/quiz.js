const params = new URLSearchParams(window.location.search);

const lessonId = Number(params.get("lesson"));
const courseId = Number(params.get("course"));

const student = JSON.parse(localStorage.getItem("student"));

if (!student) {

    alert("يجب تسجيل الدخول أولاً");

    window.location.href = "login.html";

}

let questions = [];
let currentQuestion = 0;
let score = 0;

async function loadQuiz() {

    const { data, error } = await db
        .from("lesson_quizzes")
        .select("*")
        .eq("lesson_id", lessonId);

    if (error) {
        console.log(error);
        return;
    }

    questions = data;

    if (questions.length === 0) {

        document.body.innerHTML = `
            <h2 style="text-align:center;margin-top:50px;">
                لا يوجد اختبار لهذا الدرس
            </h2>
        `;

        return;

    }

    showQuestion();

}

loadQuiz();

function showQuestion() {

    const q = questions[currentQuestion];

    document.getElementById("question").textContent = q.question;

    const answers = document.getElementById("answers");

    answers.innerHTML = "";

    ["A", "B", "C", "D"].forEach(letter => {

        const option = q["option_" + letter.toLowerCase()];

        answers.innerHTML += `

        <label>

            <input
                type="radio"
                name="answer"
                value="${letter}">

            ${option}

        </label>

        <br><br>

        `;

    });

}

document.getElementById("nextBtn").onclick = () => {

    const answer = document.querySelector(
        'input[name="answer"]:checked'
    );

    if (!answer) {

        alert("اختر إجابة");

        return;

    }

    if (answer.value === questions[currentQuestion].correct_option) {

        score++;

    }

    currentQuestion++;

    if (currentQuestion < questions.length) {

        showQuestion();

    } else {

        finishQuiz();

    }

};

async function finishQuiz() {

    const percent = Math.round((score / questions.length) * 100);

    const passed = percent >= 70;

    // حفظ نتيجة الاختبار
    const { error } = await db
        .from("quiz_results")
        .insert([{

            lesson_id: lessonId,

            course_id: courseId,

            student_name: student.email,

            score: score,

            total_questions: questions.length,

            percentage: percent,

            passed: passed

        }]);

    if (error) {

        alert(error.message);

        return;

    }

    // حفظ التقدم عند النجاح
    if (passed) {

        const { error: progressError } = await db

            .from("student_progress")

            .upsert([{

                student_name: student.email,

                course_id: courseId,

                lesson_id: lessonId,

                completed: true

            }]);

        if (progressError) {

            console.log(progressError);

        }

    }

    // عرض النتيجة
    document.body.innerHTML = `

    <div class="quiz-result">

        <h1>${passed ? "🎉 مبروك لقد نجحت" : "❌ للأسف لم تنجح"}</h1>

        <h2>درجتك</h2>

        <h1>${score} / ${questions.length}</h1>

        <h2>${percent}%</h2>

        <button id="backCourse">

            العودة إلى الكورس

        </button>

    </div>

    `;

    document.getElementById("backCourse").onclick = () => {

        window.location.href = `course.html?id=${courseId}`;

    };
await checkCourseCompletion();

if (passed) {

    const { error: progressError } = await db

        .from("student_progress")

        .upsert([{

            student_name: student.email,

            course_id: courseId,

            lesson_id: lessonId,

            completed: true

        }]);

    if (progressError) {

        console.log(progressError);

    }

    await checkCourseCompletion();

}
}

async function checkCourseCompletion(){

    // عدد دروس الكورس

    const { data: lessons } = await db

        .from("lessons")

        .select("id")

        .eq("course_id", courseId);

    // الدروس التي أكملها الطالب

    const { data: progress } = await db

        .from("student_progress")

        .select("lesson_id")

        .eq("student_name", student.email)

        .eq("course_id", courseId);

    if(!lessons || !progress){

        return;

    }

    {

        await createCertificate();

    }

}

async function createCertificate(){

    // هل الشهادة موجودة بالفعل؟

    const { data: oldCertificate } = await db

        .from("certificates")

        .select("*")

        .eq("student_name", student.email)

        .eq("course_id", courseId);

    if(oldCertificate.length>0){

        return;

    }

    const certificateNumber =
        "PA-" + Date.now();

    await db

        .from("certificates")

        .insert([{

            student_name: student.email,

            course_id: courseId,

            certificate_number: certificateNumber

        }]);

    alert("🎉 مبروك\nتم إصدار شهادتك بنجاح");

}

