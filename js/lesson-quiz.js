const params = new URLSearchParams(window.location.search);

const lessonId = Number(params.get("lesson"));

console.log("Lesson =", lessonId);

const modal = document.getElementById("questionModal");

let editingQuestion = null;

document.getElementById("addQuestion").onclick = () => {

    editingQuestion = null;

    modal.style.display = "flex";

};

async function loadQuestions() {

    const { data, error } = await db
        .from("lesson_quizzes")
        .select("*")
        .eq("lesson_id", lessonId);

    if (error) {

        console.log(error);
        return;

    }

    const table = document.getElementById("questionsTable");

    table.innerHTML = "";

    data.forEach(question => {

        table.innerHTML += `

        <tr>

            <td>${question.question}</td>

            <td>${question.correct_option}</td>

            <td>

                <button onclick="editQuestion(${question.id})">
                    تعديل
                </button>

                <button onclick="deleteQuestion(${question.id})">
                    حذف
                </button>

            </td>

        </tr>

        `;

    });

}

loadQuestions();

document.getElementById("saveQuestion").onclick = async () => {

    const question = document.getElementById("question").value;
    const option_a = document.getElementById("optionA").value;
    const option_b = document.getElementById("optionB").value;
    const option_c = document.getElementById("optionC").value;
    const option_d = document.getElementById("optionD").value;
    const correct_option = document.getElementById("correctOption").value;

    let error;

    if (editingQuestion) {

        ({ error } = await db
            .from("lesson_quizzes")
            .update({
                question,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_option
            })
            .eq("id", editingQuestion));

    } else {

        ({ error } = await db
            .from("lesson_quizzes")
            .insert([{

                lesson_id: lessonId,

                question,

                option_a,

                option_b,

                option_c,

                option_d,

                correct_option

            }]));

    }

    if (error) {

        alert(error.message);
        return;

    }

    alert("تم حفظ السؤال");

    modal.style.display = "none";

    loadQuestions();

};

async function editQuestion(id) {

    const { data, error } = await db
        .from("lesson_quizzes")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {

        alert(error.message);
        return;

    }

    editingQuestion = id;

    document.getElementById("question").value = data.question;
    document.getElementById("optionA").value = data.option_a;
    document.getElementById("optionB").value = data.option_b;
    document.getElementById("optionC").value = data.option_c;
    document.getElementById("optionD").value = data.option_d;
    document.getElementById("correctOption").value = data.correct_option;

    modal.style.display = "flex";

}

async function deleteQuestion(id) {

    if (!confirm("هل تريد حذف السؤال؟"))
        return;

    const { error } = await db
        .from("lesson_quizzes")
        .delete()
        .eq("id", id);

    if (error) {

        alert(error.message);
        return;

    }

    loadQuestions();

}

