// Demo authentication using browser localStorage. Not suitable for real passwords or production websites.
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const user = document.getElementById("newUser").value.trim();
    const pass = document.getElementById("newPass").value;
    if (user.length < 3 || pass.length < 4) {
      document.getElementById("feedback").innerHTML =
        '<div class="alert alert-danger">Use at least 3 characters for username and 4 for password.</div>';
      return;
    }

    localStorage.setItem("mcaDemoUser", user);
    localStorage.setItem("mcaDemoPass", pass);
    document.getElementById("feedback").innerHTML =
      '<div class="alert alert-success">Registration successful. You can now log in.</div>';
    setTimeout(() => (location.href = "login.html"), 900);
  });
}
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;
    if (
      user === localStorage.getItem("mcaDemoUser") &&
      pass === localStorage.getItem("mcaDemoPass")
    ) {
      localStorage.setItem("mcaLoggedIn", "true");
      location.href = "index.html";
    } else {
      document.getElementById("feedback").innerHTML =
        '<div class="alert alert-danger">Invalid username or password.</div>';
    }
  });
}
