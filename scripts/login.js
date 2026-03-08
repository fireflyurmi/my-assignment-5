document.getElementById("login-btn").addEventListener("click", function() {
    // get the values
    const loginUserName = document.getElementById("login-user-name").value;
    const loginPassword = document.getElementById("login-password").value;

    // match the username & password
    if (loginUserName === "admin" && loginPassword === "admin123") {
    Swal.fire({
        title: "Success!",
        text: "Successfully Logged In",
        icon: "success",
        confirmButtonText: "Let's Go!"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.assign('./home.html');
        }
    });
}else {
        Swal.fire({
            title: "Error!",
            text: "Login Failed!",
            icon: "error"
        });
    }
});
