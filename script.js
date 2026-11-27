$(function () {
  const $ = window.jQuery;
  $("#year").text(new Date().getFullYear());
  function updateTime() {
    $("#datetime").text(new Date().toLocaleString());
  }
  updateTime();
  setInterval(updateTime, 1000);
  const announcements = [
    "Welcome to the MCA Department Portal",
    "Add verified examination and timetable updates here",
    "Explore student projects, academic programmes and department activities",
  ];
  let tickerIndex = 0;
  function updateTicker() {
    $("#tickerText").fadeOut(180, function () {
      $(this).text(announcements[tickerIndex]).fadeIn(180);
    });
    tickerIndex = (tickerIndex + 1) % announcements.length;
  }
  setInterval(updateTicker, 3500);
  const loggedIn = localStorage.getItem("mcaLoggedIn") === "true";
  if (loggedIn) {
    $("#accountLinks").addClass("d-none");
    $("#logoutBtn").removeClass("d-none");
  }
  $("#logoutBtn").on("click", function () {
    localStorage.removeItem("mcaLoggedIn");
    location.href = "login.html";
  });
  $.getJSON("data/department-data.json")
    .done(function (data) {
      renderCards(
        "#courseList",
        data.courses,
        (c) =>
          `<div class="col-md-6 col-lg-3"><article class="course-card h-100"><div class="course-icon"><i class="bi ${safe(c.icon)}"></i></div>
            <h3>${safe(c.name)}</h3><p>${safe(c.description)}</p></article></div>`,
      );
      renderCards(
        "#facultyList",
        data.faculty,
        (p) =>
          `<div class="col-sm-6 col-lg-4"><article class="faculty-card h-100"><div class="faculty-avatar"><i class="bi bi-person"></i></div><h3>${safe(p.name)}</h3><p class="fw-semibold">${safe(p.role)}</p><p class="small">${safe(p.specialisation)}</p></article></div>`,
      );
      renderCards(
        "#projectList",
        data.projects,
        (p) =>
          `<div class="col-md-6 col-lg-3"><article class="course-card h-100"><div class="course-icon"><i class="bi bi-code-square"></i></div><h3>${safe(p.name)}</h3><p>${safe(p.tech)}</p></article></div>`,
      );
      renderCards(
        "#placementList",
        data.placements,
        (p) =>
          `<div class="col-6 col-lg-3"><article class="stat-card"><i class="bi bi-building"></i><h3>${safe(p.company)}</h3><strong>${safe(p.count)}</strong><p>Sample selections</p></article></div>`,
      );
      renderCards(
        "#achievementList",
        data.achievements,
        (a) =>
          `<div class="col-md-6 col-lg-3"><article class="achievement-card"><i class="bi bi-trophy"></i><p>${safe(a)}</p></article></div>`,
      );
      $("#noticeList").html(
        data.notices
          .map(
            (n) =>
              `<article class="notice-item"><div class="notice-date">${safe(n.date)}</div><div><h3>${safe(n.title)}</h3><p>${safe(n.description)}</p></div></article>`,
          )
          .join(""),
      );
      animateCounter("#studentsCount", 250, "");
      animateCounter("#facultyCount", 15, "");
      animateCounter("#placementCount", 95, "%");
      animateCounter("#projectsCount", 120, "");
    })
    .fail(function () {
      $(".section-heading").after(
        '<div class="container"><div class="alert alert-warning">Could not load department data. Run the project using VS Code Live Server.</div></div>',
      );
    });
  function renderCards(selector, items, template) {
    $(selector).html(items.map(template).join(""));
  }
  function safe(value) {
    return String(value).replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        })[ch],
    );
  }
  function animateCounter(selector, end, suffix) {
    let n = 0;
    const step = Math.max(1, Math.ceil(end / 50));
    const timer = setInterval(() => {
      n = Math.min(end, n + step);
      $(selector).text(n + suffix);
      if (n >= end) clearInterval(timer);
    }, 25);
  }
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();
    const form = this;
    if (!form.checkValidity()) {
      $(form).addClass("was-validated");
      $("#formFeedback").html(
        '<div class="alert alert-danger">Please correct the highlighted fields.</div>',
      );
      return;
    }
    const record = {
      name: $("#name").val().trim(),
      email: $("#email").val().trim(),
      subject: $("#subject").val().trim(),
      message: $("#message").val().trim(),
      date: new Date().toISOString(),
    };
    const messages = JSON.parse(localStorage.getItem("mcaMessages") || "[]");
    messages.push(record);
    localStorage.setItem("mcaMessages", JSON.stringify(messages));
    $("#formFeedback").html(
      '<div class="alert alert-success">Your demo message has been saved in this browser.</div>',
    );
    form.reset();
    $(form).removeClass("was-validated");
  });
  $('a.nav-link, .navbar-brand, a[href^="#"]').on("click", function (e) {
    const href = $(this).attr("href");
    if (href && href.length > 1 && $(href).length) {
      e.preventDefault();
      $("html,body").animate({ scrollTop: $(href).offset().top - 68 }, 400);
      $(".navbar-collapse").collapse("hide");
      $(".nav-link").removeClass("active");
      $(`.nav-link[href="${href}"]`).addClass("active");
    }
  });
});
