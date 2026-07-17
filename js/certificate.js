const student = JSON.parse(localStorage.getItem("student"));

const courseId = Number(
    new URLSearchParams(window.location.search).get("course")
);

loadCertificate();

async function loadCertificate() {

    const { data: certificate } = await db

        .from("certificates")

        .select("*")

        .eq("student_name", student.email)

        .eq("course_id", courseId)

        .single();

    const { data: course } = await db

        .from("courses")

        .select("*")

        .eq("id", courseId)

        .single();

    document.getElementById("studentName").innerHTML =
        student.name;

    document.getElementById("courseName").innerHTML =
        course.title;

    document.getElementById("certificateNumber").innerHTML =
        certificate.certificate_number;

    document.getElementById("issueDate").innerHTML =
        new Date(certificate.issue_date)
        .toLocaleDateString();

}

document.getElementById("printBtn").onclick = () => {

    window.print();

};

document.getElementById("downloadBtn").onclick = async ()=>{

    const element=document.getElementById("certificate");

    const canvas=await html2canvas(element);

    const img=canvas.toDataURL("image/png");

    const pdf=new jspdf.jsPDF("landscape");

    pdf.addImage(img,"PNG",10,10,277,190);

    pdf.save("Certificate.pdf");

};