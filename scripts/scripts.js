class TodoItem {
    constructor(id, text, completed, timestamp) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        this.timestamp = timestamp;
    }
}

class TodoItemPremium extends TodoItem {
    constructor(id, text, completed, timestamp, image) {
        super(id, text, completed, timestamp);
        this.image = image;
    }
}

const todoList = document.getElementById("todo-list");
const newTaskInput = document.getElementById("new-task");
let tasks = [];

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function updateList() {
    todoList.innerHTML = "";

   

    for (const task of tasks) {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = task.id;
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTaskStatus(task.id));
        const label = document.createElement("label");
        label.textContent = task.text + " (" + formatDate(task.timestamp) + ")";
        if (task.completed) {
            label.style.textDecoration = "line-through";
            label.style.color = "blue";
        }
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove task";
        removeButton.addEventListener("click", () => removeTask(task.id));
        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(removeButton);


        todoList.appendChild(li);
    }
}

function addTask() {
    const text = newTaskInput.value.trim();
    if (text === "") return;
    const timestamp = new Date().getTime();
    const task = new TodoItem(timestamp, text, false, timestamp); 
    tasks.push(task);
    newTaskInput.value = "";
    updateList();
    saveStorage();
}

function removeTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    updateList();
    saveStorage();
}

function toggleTaskStatus(id) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
        task.completed = !task.completed;
        updateList();
        saveStorage();
    }
}

function removeCompletedTasks() {
    tasks = tasks.filter((task) => !task.completed);
    updateList();
    saveStorage();
}

function removeUncompletedTasks() {
    tasks = tasks.filter((task) => task.completed);
    updateList();
    saveStorage();
}

function sortAscending() {
    tasks.sort((a, b) => a.timestamp - b.timestamp);
    updateList();
    saveStorage();
}

function sortDescending() {
    tasks.sort((a, b) => b.timestamp - a.timestamp);
    updateList();
    saveStorage();
}

let pickedTask = null;
function pickRandom() {
    if(pickedTask){
        pickedTask.style.color = "black"
    }
    const Index = Math.floor(Math.random() * tasks.length);
    const randomTask = tasks[Index];
    if (randomTask) {
        
        const item = document.querySelector(`[id="${randomTask.id}"]`).closest("li");
        if (item) {
            item.style.color = "red"; 
            pickedTask = item;
        }
    }
}

function saveStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadStorage() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = storedTasks.map((task) => {
     
        return new TodoItem(task.id, task.text, task.completed, task.timestamp);
        
    });
    
    updateList();
}

function clearStorage() {
    localStorage.removeItem("tasks");
    tasks = [];
    updateList();
}


loadStorage();

newTaskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

todoList.addEventListener("dblclick", (event) => {
    const listItem = event.target.closest("li");
    if (!listItem) return;

    const label = listItem.querySelector("label");
    const text = prompt("Edit the task:", label.textContent);

    if (text !== null) {
        const id = parseInt(listItem.querySelector("input[type=checkbox]").id);
        const task = tasks.find((t) => t.id === id);
        if (task) {
            task.text = text;
            task.timestamp = new Date().getTime();
            updateList();
            saveStorage();
        }
    }
});