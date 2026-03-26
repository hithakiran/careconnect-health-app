const form = document.getElementById("supportForm");
const tableBody = document.getElementById("tableBody");

let data = JSON.parse(localStorage.getItem("patients")) || [];

updateTable();

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const problem = document.getElementById("problem").value;

  const result = analyzeProblem(problem);

  document.getElementById("responseBox").innerHTML =
    `Severity: ${result.severity} <br> Advice: ${result.advice}`;

  const entry = {
    name,
    problem,
    severity: result.severity
  };

  data.push(entry);

  // SAVE TO LOCAL STORAGE
  localStorage.setItem("patients", JSON.stringify(data));

  updateTable();
});

function analyzeProblem(problem) {
  problem = problem.toLowerCase();

  // HIGH SEVERITY
  if (
    problem.includes("chest pain") ||
    problem.includes("heart attack") ||
    problem.includes("breathing difficulty") ||
    problem.includes("unconscious") ||
    problem.includes("severe bleeding")
  ) {
    return {
      severity: "High",
      advice: "Seek emergency medical attention immediately."
    };
  }

  // MEDIUM SEVERITY
  else if (
    problem.includes("fever") ||
    problem.includes("vomiting") ||
    problem.includes("infection") ||
    problem.includes("stomach pain") ||
    problem.includes("body pain") ||
    problem.includes("headache") ||
    problem.includes("cough")
  ) {
    return {
      severity: "Medium",
      advice: "Monitor symptoms and consult a doctor if they persist."
    };
  }

  // LOW SEVERITY
  else if (
    problem.includes("cold") ||
    problem.includes("tired") ||
    problem.includes("weakness") ||
    problem.includes("mild pain") ||
    problem.includes("allergy")
  ) {
    return {
      severity: "Low",
      advice: "Take rest, stay hydrated, and monitor your condition."
    };
  }

  // DEFAULT (unknown case)
  else {
    return {
      severity: "Low",
      advice: "Unable to determine severity. Please consult a healthcare professional."
    };
  }
}

function updateTable() {
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center; color:gray;">
          No patient data yet
        </td>
      </tr>`;
    return;
  }

  data.forEach(entry => {
    const row = `<tr>
      <td>${entry.name}</td>
      <td>${entry.problem}</td>
      <td class="${entry.severity.toLowerCase()}">${entry.severity}</td>
    </tr>`;
    tableBody.innerHTML += row;
  });
}
function toggleChat() {
  const chatBody = document.getElementById("chatBody");
  chatBody.style.display =
    chatBody.style.display === "flex" ? "none" : "flex";
}

function sendMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.toLowerCase();
  const messages = document.getElementById("messages");

  if (message.trim() === "") return;

  // Show user message
  messages.innerHTML += `<div class="user-msg">${message}</div>`;

  // Bot response
  let response = getBotResponse(message);

  setTimeout(() => {
    messages.innerHTML += `<div class="bot-msg">${response}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }, 500);

  input.value = "";
}

function getBotResponse(msg) {

  // greetings
  if (msg.includes("hello") || msg.includes("hi")) {
    return "Hello! Tell me your symptoms and I’ll try to help.";
  }

  // use SAME AI logic
  const result = analyzeProblem(msg);

  return `
  <strong>Severity:</strong> ${result.severity} <br>
  <strong>Advice:</strong> ${result.advice}
`;
  
}