// ✅ Zane AI - Human Life Manager

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new window.SpeechRecognition();
recognition.lang = 'en-US';
recognition.continuous = true;
recognition.interimResults = false;

function speak(message) {
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'en-US';
  utterance.rate = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function addTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateTaskList();
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
}

function updateTaskList() {
  const taskList = document.getElementById("tasks");
  taskList.innerHTML = "";
  getTasks().forEach((task, index) => {
    const li = document.createElement("li");
    li.innerText = `${index + 1}. ${task}`;
    taskList.appendChild(li);
  });
}

function processCommand(command) {
  command = command.toLowerCase();
  console.log("Heard:", command);

  if (command.includes("add task")) {
    const task = command.replace("add task", "").trim();
    if (task) {
      addTask(task);
      speak(`Task added: ${task}`);
    } else {
      speak("Please tell me the task.");
    }

  } else if (command.includes("show tasks")) {
    const tasks = getTasks();
    if (tasks.length === 0) speak("You have no tasks right now.");
    else {
      speak(`You have ${tasks.length} tasks.`);
      updateTaskList();
    }

  } else if (command.includes("delete all tasks")) {
    localStorage.removeItem("tasks");
    updateTaskList();
    speak("All tasks cleared.");

  } else if (command.startsWith("open")) {
    const name = command.replace("open", "").trim();
    const websites = {
      "youtube": "https://youtube.com",
      "instagram": "https://instagram.com",
      "facebook": "https://facebook.com",
      "google": "https://google.com",
      "canva": "https://canva.com",
      "notion": "https://notion.so",
      "gmail": "https://mail.google.com",
      "spotify": "https://open.spotify.com",
      "chatgpt": "https://chat.openai.com"
    };
    let found = false;
    for (const key in websites) {
      if (name.includes(key)) {
        speak(`Opening ${key}`);
        window.open(websites[key], "_blank");
        found = true;
        break;
      }
    }
    if (!found) speak(`I couldn't find any application or site named ${name}`);

  } else if (command.includes("search for")) {
    const query = command.replace("search for", "").trim();
    if (query.length > 0) {
      speak(`Searching for ${query}`);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    } else {
      speak("Please say what to search.");
    }

  } else if (command.includes("what time")) {
    const time = new Date().toLocaleTimeString();
    speak(`It's ${time}`);

  } else if (command.includes("what day") || command.includes("today")) {
    const date = new Date().toDateString();
    speak(`Today is ${date}`);

  } else if (command.includes("good night") || command.includes("shutdown")) {
    speak("Good night sir, shutting down.");
    setTimeout(() => window.close(), 2000);

  } else if (command.includes("who are you")) {
    speak("I am your personal human life manager, Zane AI.");

  } else if (command.includes("how are you")) {
    speak("I'm doing great, sir. Always ready for you.");

  } else {
    speak("Sorry, I didn't understand that command.");
  }
}

recognition.onresult = function (event) {
  const transcript = event.results[event.results.length - 1][0].transcript.trim();
  processCommand(transcript);
};

recognition.onend = function () {
  setTimeout(() => recognition.start(), 1000); // restart listening
};

recognition.onerror = function () {
  recognition.stop();
  setTimeout(() => recognition.start(), 1000);
};

recognition.start();
speak("Welcome back sir. I'm online and listening.");
