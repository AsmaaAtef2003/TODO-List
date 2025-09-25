// ================= TRANSLATIONS =================
const translations = {
  en: {
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    firstName: "First Name",
    lastName: "Last Name",
    logout: "Logout",
    todoPlaceholder: "Enter a new task",
    addTask: "Add Task",
    noAccount: "Don't have an account?",
    registerLink: "Register",
  },
  ar: {
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    logout: "تسجيل الخروج",
    todoPlaceholder: "أدخل مهمة جديدة",
    addTask: "إضافة مهمة",
    noAccount: "ليس لديك حساب؟",
    registerLink: "سجل الآن",
  },
};

function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  applyLanguage();
}

function applyLanguage() {
  const lang = localStorage.getItem("lang") || "en";
  const dict = translations[lang];
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  if (document.querySelector("#loginTitle"))
    document.querySelector("#loginTitle").textContent = dict.login;
  if (document.querySelector("#registerTitle"))
    document.querySelector("#registerTitle").textContent = dict.register;
  if (document.querySelector("#emailLabel"))
    document.querySelector("#emailLabel").textContent = dict.email;
  if (document.querySelector("#passwordLabel"))
    document.querySelector("#passwordLabel").textContent = dict.password;
  if (document.querySelector("#firstNameLabel"))
    document.querySelector("#firstNameLabel").textContent = dict.firstName;
  if (document.querySelector("#lastNameLabel"))
    document.querySelector("#lastNameLabel").textContent = dict.lastName;
  if (document.querySelector("#logoutBtn"))
    document.querySelector("#logoutBtn").textContent = dict.logout;
  if (document.querySelector("#taskInput"))
    document.querySelector("#taskInput").placeholder = dict.todoPlaceholder;
  if (document.querySelector("#addTaskBtn"))
    document.querySelector("#addTaskBtn").textContent = dict.addTask;
  if (document.querySelector("#registerLink"))
    document.querySelector("#registerLink").textContent = dict.registerLink;
}
document.addEventListener("DOMContentLoaded", applyLanguage);

// ================= AUTH =================
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const addTaskBtn = document.getElementById("addTaskBtn");

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      if (!email || !password) {
        document.getElementById("loginMessage").textContent =
          "Please fill all fields.";
        return;
      }
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) {
        document.getElementById("loginMessage").textContent =
          "User not found. Please register first.";
      } else {
        localStorage.setItem("currentUser", email);
        window.location.href = "home.html";
      }
    });
  }

  // REGISTER
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;

      if (!firstName || !lastName || !email || !password) {
        document.getElementById("registerMessage").textContent =
          "Please fill all fields.";
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.some((u) => u.email === email)) {
        document.getElementById("registerMessage").textContent =
          "Email already exists.";
        return;
      }

      users.push({ firstName, lastName, email, password, todos: [] });
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", email);
      window.location.href = "home.html";
    });
  }

  // LOGOUT
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
    });
  }

  // TODO LIST
  if (addTaskBtn) {
    class Todo {
      constructor(task) {
        this.task = task;
        this.completed = false;
      }
    }

    const taskList = document.getElementById("taskList");
    const taskInput = document.getElementById("taskInput");

    const currentUserEmail = localStorage.getItem("currentUser");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = users.find((u) => u.email === currentUserEmail);

    function renderTodos() {
      taskList.innerHTML = "";
      currentUser.todos.forEach((todo, index) => {
        const li = document.createElement("li");
        li.textContent = todo.task;
        if (todo.completed) li.style.textDecoration = "line-through";

        const actions = document.createElement("div");

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "✔";
        completeBtn.onclick = () => {
          todo.completed = !todo.completed;
          saveTodos();
        };

        const editBtn = document.createElement("button");
        editBtn.textContent = "✎";
        editBtn.onclick = () => {
          const newTask = prompt("Edit task:", todo.task);
          if (newTask) {
            todo.task = newTask;
            saveTodos();
          }
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑";
        deleteBtn.onclick = () => {
          currentUser.todos.splice(index, 1);
          saveTodos();
        };

        actions.append(completeBtn, editBtn, deleteBtn);
        li.appendChild(actions);
        taskList.appendChild(li);
      });
    }

    function saveTodos() {
      users = users.map((u) =>
        u.email === currentUserEmail ? currentUser : u
      );
      localStorage.setItem("users", JSON.stringify(users));
      renderTodos();
    }

    addTaskBtn.addEventListener("click", () => {
      if (taskInput.value.trim() === "") return;
      currentUser.todos.push(new Todo(taskInput.value.trim()));
      taskInput.value = "";
      saveTodos();
    });

    renderTodos();
  }
});
