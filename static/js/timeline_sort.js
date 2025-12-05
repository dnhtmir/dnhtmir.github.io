function applyTimelineSort() {
  const timeline = document.querySelector(".timeline");
  if (!timeline) return;

  const items = Array.from(timeline.querySelectorAll(".timeline-item"));

  items.sort(
    (a, b) =>
      new Date(b.dataset.end === "Today" ? Date.now() : (b.dataset.end || b.dataset.start)) -
      new Date(a.dataset.end === "Today" ? Date.now() : (a.dataset.end || a.dataset.start))
  );

  const groupsByYear = new Map();
  for (const item of items) {
    const end = item.dataset.end || item.dataset.start;
    const year =
      end === "Today"
        ? "Today"
        : new Date(end).getFullYear();
    if (!groupsByYear.has(year)) groupsByYear.set(year, []);
    groupsByYear.get(year).push(item);
  }

  const sortedYears = Array.from(groupsByYear.keys()).sort((a, b) => {
    if (a === "Today") return -1;
    if (b === "Today") return 1;
    return b - a;
  });

  timeline.innerHTML = "";

  for (const year of sortedYears) {
    const group = document.createElement("div");
    group.className = "timeline-year-group";

    const marker = document.createElement("div");
    marker.className = "timeline-year";
    marker.textContent = year;
    group.appendChild(marker);

    for (const item of groupsByYear.get(year)) {
      group.appendChild(item);
      item.style.width = "100%";
      item.style.marginLeft = "0";
    }

    timeline.appendChild(group);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyTimelineSort();
});
