async function loadCourses() {

    const { data, error } = await db
        .from("courses")
        .select("*")
        .order("id", { ascending: false });

    if (error) {

        console.log(error);

        return;

    }

    const container =
    document.getElementById("coursesContainer");

    container.innerHTML = "";

    data.forEach(course => {

        container.innerHTML += `

        <div class="course-card">

            <img src="${course.image}">

            <div class="course-info">

                <h3>${course.title}</h3>

                <p>${course.description}</p>

                <span>${course.price} جنيه</span>

                <a href="course.html?id=${course.id}" class="btn">

                    ابدأ التعلم

                </a>

            </div>

        </div>

        `;

    });

}

loadCourses();