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

  const teamCounts = {};

  for (let i = 0; i < teamOrder.length; i++) {
    const team = teamOrder[i];
    const teamCounter = document.getElementById(team + "Count");
    teamCounts[team] = Number(teamCounter.textContent);
  }

  const allAttendees = [];

  if (attendeeList) {
    const attendeeItems = attendeeList.querySelectorAll(".attendee-item");

    for (let i = 0; i < attendeeItems.length; i++) {
      const item = attendeeItems[i];
      const attendeeName = item.querySelector(".attendee-name").textContent;
      const attendeeTeam = item.querySelector(".attendee-team").textContent;

      allAttendees.push({
        name: attendeeName,
        team: attendeeTeam,
      });
    }
  }

  const savedData = {
    count: count,
    teamCounts: teamCounts,
    attendees: allAttendees,
  };

  localStorage.setItem(storageKey, JSON.stringify(savedData));
}

function getWinningTeam() {
  let leader = teamOrder[0];
  let topCount = Number(
    document.getElementById(teamOrder[0] + "Count").textContent,
  );

  for (let i = 1; i < teamOrder.length; i++) {
    const team = teamOrder[i];
    const teamTotal = Number(
      document.getElementById(team + "Count").textContent,
    );

    if (teamTotal > topCount) {
      topCount = teamTotal;
      leader = team;
    }
  }

  return leader;
}

function updateCelebration() {
  if (!celebrationMessage) {
    return;
  }

  if (count >= maxGoal) {
    const winner = getWinningTeam();
    celebrationMessage.textContent = `🎉 Goal reached! ${teamLabels[winner]} wins the celebration!`;
    celebrationMessage.style.display = "block";
    return;
  }

  celebrationMessage.textContent = "";
  celebrationMessage.style.display = "none";
}

function renderAttendeeList() {
  if (!attendeeList) {
    return;
  }

  const savedData = getSavedData();
  const attendees = savedData && savedData.attendees ? savedData.attendees : [];
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

function loadProgress() {
  const savedData = getSavedData();

  if (!savedData) {
    return;
  }

  count = Number(savedData.count) || 0;

  for (let i = 0; i < teamOrder.length; i++) {
    const team = teamOrder[i];
    const teamCounter = document.getElementById(team + "Count");

    if (!teamCounter) {
      continue;
    }

    teamCounter.textContent =
      savedData.teamCounts && savedData.teamCounts[team]
        ? savedData.teamCounts[team]
        : 0;
  }

  attendeeCount.textContent = count;

  const percentage = Math.round((count / maxGoal) * 100);
  progressBar.style.width = `${percentage}%`;
  progressBar.setAttribute("aria-valuenow", percentage);

  if (savedData.attendees && savedData.attendees.length > 0) {
    attendeeList.innerHTML = "";

    for (let i = 0; i < savedData.attendees.length; i++) {
      const attendee = savedData.attendees[i];
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

  updateCelebration();
}

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
  progressBar.setAttribute("aria-valuenow", percentage);
  teamCounter.textContent = Number(teamCounter.textContent) + 1;
  greeting.textContent = `Welcome, ${name} from ${teamLabel}!`;

  const attendeeItem = document.createElement("li");
  const attendeeName = document.createElement("span");
  const attendeeTeam = document.createElement("span");

  attendeeName.className = "attendee-name";
  attendeeTeam.className = "attendee-team";
  attendeeName.textContent = name;
  attendeeTeam.textContent = teamLabel;

  attendeeItem.className = "attendee-item";
  attendeeItem.appendChild(attendeeName);
  attendeeItem.appendChild(attendeeTeam);

  if (
    attendeeList &&
    attendeeList.querySelector(".attendee-item") &&
    attendeeList.querySelector(".attendee-item").textContent ===
      "No attendees checked in yet."
  ) {
    attendeeList.innerHTML = "";
  }

  attendeeList.appendChild(attendeeItem);
  updateCelebration();
  saveProgress();
  form.reset();
});

loadProgress();
