// dom elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");

let count = 0;
const maxGoal = 50;

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamLabel = teamSelect.options[teamSelect.selectedIndex].text;
  const teamCounter = document.getElementById(team + "Count");

  count = count + 1;

  const percentage = Math.round((count / maxGoal) * 100);

  attendeeCount.textContent = count;
  progressBar.style.width = `${percentage}%`;
  teamCounter.textContent = Number(teamCounter.textContent) + 1;
  greeting.textContent = `Welcome, ${name} from ${teamLabel}!`;

  form.reset();
});
