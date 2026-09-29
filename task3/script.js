const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const alertBox = document.getElementById("alert");
const counter = document.getElementById("counter");
const list = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filters__btn");

let todos = [];
let nextId = 1;
let currentFilter = "all";

function addTodo(text) {
  todos.push({
    id: nextId++,
    text: text,
    completed: false
  });
}

function removeTodo(id) {
  todos = todos.filter(function (todo) {
    return todo.id !== id;
  });
}

function toggleTodo(id) {
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      todos[i].completed = !todos[i].completed;
      return;
    }
  }
}

function getVisibleTodos() {
  if (currentFilter === "active") {
    return todos.filter(function (todo) {
      return !todo.completed;
    });
  }
  if (currentFilter === "completed") {
    return todos.filter(function (todo) {
      return todo.completed;
    });
  }
  return todos;
}

function updateCounter() {
  const completed = todos.filter(function (todo) {
    return todo.completed;
  }).length;
  const active = todos.length - completed;
  counter.textContent = "Осталось: " + active + ", Выполнено: " + completed;
}

function createItem(todo) {
  const li = document.createElement("li");
  li.className = "item";
  li.dataset.id = todo.id;

  if (todo.completed) {
    li.classList.add("completed");
  }

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "item__checkbox";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", function () {
    toggleTodo(todo.id);
    render();
  });

  const span = document.createElement("span");
  span.className = "item__text";
  span.textContent = todo.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "item__delete";
  deleteBtn.textContent = "Удалить";
  deleteBtn.addEventListener("click", function () {
    removeTodo(todo.id);
    render();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

function render() {
  list.innerHTML = "";

  const visible = getVisibleTodos();

  visible.forEach(function (todo) {
    list.appendChild(createItem(todo));
  });

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Задач пока нет";
    list.appendChild(empty);
  }

  updateCounter();
}

function showAlert(message) {
  alertBox.textContent = message;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = input.value.trim();

  if (text === "") {
    showAlert("Введите текст задачи");
    return;
  }

  showAlert("");
  addTodo(text);
  input.value = "";
  input.focus();
  render();
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (btn) {
      btn.classList.remove("filters__btn--active");
    });
    button.classList.add("filters__btn--active");
    currentFilter = button.dataset.filter;
    render();
  });
});

render();