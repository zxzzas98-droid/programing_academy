const student = JSON.parse(localStorage.getItem("student"));

if (!student) {

    window.location.href = "register.html";

}

async function checkStatus() {

    const { data, error } = await db
        .from("students")
        .select("*")
        .eq("email", student.email)
        .single();

    console.log(data);

    if (error) {

        console.log(error);

        return;

    }

    if (data.status === "Approved") {

        localStorage.setItem(
            "student",
            JSON.stringify(data)
        );

        window.location.href = "student.html";
        // أو courses.html حسب الصفحة التي تريدها

    }

}

setInterval(checkStatus, 5000);

checkStatus();