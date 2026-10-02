// dom elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const attendeeList = document.getElementById("attendeeList");
const celebrationMessage = document.getElementById("celebrationMessage");

let count = 0;
const maxGoal = 50;
const teamOrder = ["water", "zero", "power"];
const teamLabels = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};
const storageKey = "intel-summit-checkin-data";
const teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};
const attendees = [];

function getSavedData() {
  if (typeof localStorage === "undefined") {
    return null;
  }

  const savedData = localStorage.getItem(storageKey);

  if (!savedData) {
    return null;
  }

  try {
    return JSON.parse(savedData);
  } catch (error) {
    return null;
  }
}

function saveProgress() {
  if (typeof localStorage === "undefined") {
    return;
  }

  const savedData = {
    count: count,
    teamCounts: teamCounts,
    attendees: attendees,
  };

  localStorage.setItem(storageKey, JSON.stringify(savedData));
}

function renderAttendeeList() {
  if (!attendeeList) {
    return;
  }

  attendeeList.innerHTML = "";

  if (attendees.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "attendee-item";
    emptyItem.textContent = "No attendees checked in yet.";
    attendeeList.appendChild(emptyItem);
    return;
  }

  for (let i = 0; i < attendees.length; i++) {
    const attendee = attendees[i];
    const item = document.createElement("li");
    const nameElement = document.createElement("span");
    const teamElement = document.createElement("span");

    nameElement.className = "attendee-name";
    teamElement.className = "attendee-team";
    nameElement.textContent = attendee.name;
    teamElement.textContent = attendee.team;

    item.className = "attendee-item";
    item.appendChild(nameElement);
    item.appendChild(teamElement);
    attendeeList.appendChild(item);
  }
}

function updateCelebration() {
  if (!celebrationMessage) {
    return;
  }

  if (count >= maxGoal) {
    let winningTeam = "water";
    let highestCount = teamCounts.water;

    for (let i = 1; i < teamOrder.length; i++) {
      const team = teamOrder[i];

      if (teamCounts[team] > highestCount) {
        highestCount = teamCounts[team];
        winningTeam = team;
      }
    }

    celebrationMessage.textContent = `🎉 Goal reached! ${teamLabels[winningTeam]} wins the celebration!`;
    celebrationMessage.style.display = "block";
    return;
  }

  celebrationMessage.textContent = "";
  celebrationMessage.style.display = "none";
}

function loadProgress() {
  const savedData = getSavedData();

  if (savedData) {
    count = Number(savedData.count) || 0;

    for (let i = 0; i < teamOrder.length; i++) {
      const team = teamOrder[i];
      teamCounts[team] =
        Number(savedData.teamCounts && savedData.teamCounts[team]) || 0;
    }

    if (savedData.attendees && savedData.attendees.length > 0) {
      attendees.length = 0;

      for (let i = 0; i < savedData.attendees.length; i++) {
        attendees.push(savedData.attendees[i]);
      }
    }
  }

  attendeeCount.textContent = count;

  for (let i = 0; i < teamOrder.length; i++) {
    const team = teamOrder[i];
    const teamCounter = document.getElementById(team + "Count");

    if (teamCounter) {
      teamCounter.textContent = teamCounts[team];
    }
  }

  const percentage = Math.round((count / maxGoal) * 100);
  progressBar.style.width = `${percentage}%`;
  progressBar.setAttribute("aria-valuenow", percentage);

  renderAttendeeList();
  updateCelebration();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !team) {
    return;
  }

  const teamLabel = teamSelect.options[teamSelect.selectedIndex].text;

  count = count + 1;
  teamCounts[team] = Number(teamCounts[team]) + 1;
  attendees.push({
    name: name,
    team: teamLabel,
  });

  const percentage = Math.round((count / maxGoal) * 100);

  attendeeCount.textContent = count;
  progressBar.style.width = `${percentage}%`;
  progressBar.setAttribute("aria-valuenow", percentage);

  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = teamCounts[team];
  greeting.textContent = `Welcome, ${name} from ${teamLabel}!`;

  renderAttendeeList();
  updateCelebration();
  saveProgress();
  form.reset();
});

loadProgress();
