// dom elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");

// Track attendance and prevent duplicate check-ins.
let count = 0;
const maxCount = 50;
const checkedInNames = [];

// Handle form submission.
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const normalizedName = name.toLowerCase();

  if (name === "") {
    greeting.textContent = "Please enter an attendee name.";
    greeting.className = "error-message";
    greeting.style.display = "block";
    return;
  }

  if (checkedInNames.indexOf(normalizedName) !== -1) {
    greeting.textContent = `${name} has already checked in.`;
    greeting.className = "error-message";
    greeting.style.display = "block";
    return;
  }

  if (count >= maxCount) {
    greeting.textContent = "The event has reached its attendance limit.";
    greeting.className = "error-message";
    greeting.style.display = "block";
    return;
  }

  const teamName = teamSelect.options[teamSelect.selectedIndex].text;
  count++;
  attendeeCount.textContent = count;

  const percentage = Math.round((count / maxCount) * 100);
  progressBar.style.width = `${percentage}%`;
  progressBar.setAttribute("aria-valuenow", percentage);

  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent, 10) + 1;

  checkedInNames.push(normalizedName);
  greeting.textContent = `Welcome, ${name} from ${teamName}!`;
  greeting.className = "success-message";
  greeting.style.display = "block";

  form.reset();
});
