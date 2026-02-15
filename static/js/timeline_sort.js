function applyTimelineGrouping() {
  const timeline = document.querySelector(".timeline");
  if (!timeline) return;

  const items = Array.from(timeline.querySelectorAll(".timeline-item"));

  const sections = {
    job: [],
    degree: [],
    professional: [],
    projects: [],
    misc: []
  };

  for (const item of items) {
    const type = item.dataset.type;

    if (type === "job") {
      sections.job.push(item);
    } else if (type === "degree") {
      sections.degree.push(item);
    } else if (["cert", "course", "online-course"].includes(type)) {
      sections.professional.push(item);
    } else if (["project"].includes(type)) {
      sections.projects.push(item);
    } else {
      sections.misc.push(item);
    }
  }

  // Sort each section by end date (Ongoing first)
  const sortByDate = (a, b) => {
    const parseDate = (value) => {
      if (!value || value === "Ongoing") return Date.now();
      return new Date(value).getTime();
    };

    return parseDate(b.dataset.end || b.dataset.start) -
           parseDate(a.dataset.end || a.dataset.start);
  };

  Object.values(sections).forEach(group => group.sort(sortByDate));

  timeline.innerHTML = "";

  const createSection = (title, items) => {
    if (!items.length) return;

    const section = document.createElement("div");
    section.className = "timeline-section";

    const header = document.createElement("h2");
    header.className = "timeline-section-title";
    header.textContent = title;

    section.appendChild(header);

    items.forEach(item => {
      item.style.width = "100%";
      item.style.marginLeft = "0";
      section.appendChild(item);
    });

    timeline.appendChild(section);
  };

  createSection("Professional Experience", sections.job);
  createSection("Education", sections.degree);
  createSection("Professional Development", sections.professional);
  createSection("Projects", sections.projects);
  createSection("Miscellaneous", sections.misc);
}

document.addEventListener("DOMContentLoaded", () => {
  applyTimelineGrouping();
});
