let jobsData = [];
let selectedTags = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("../data.json")
    .then((response) => response.json())
    .then((data) => {
      jobsData = data;
      loadTagsFromLocalStorage();
      renderJobs(jobsData);
      updateFiltersUI();
    })
    .catch((err) => console.log(err));

  // clear button
  document.getElementById("clearFilters").addEventListener("click", () => {
    selectedTags = [];
    saveTagsToLocalStorage();
    updateFiltersUI();
    renderJobs(jobsData);
  });
});

// Render all job card to DOM
function renderJobs(jobs) {
  const jobWrapper = document.querySelector(".job-wrapper");
  jobWrapper.innerHTML = "";

  const filtered = selectedTags.length ? filteredJobsByTags(jobs) : jobs;

  filtered.forEach((job) => {
    const jobCard = createJobCard(job);
    jobWrapper.appendChild(jobCard);
  });
}

// create a single job card element
function createJobCard(job) {
  const jobCard = document.createElement("div");
  jobCard.className = `job-card ${job.featured ? 'featured-card' : ""}`;

  let jobTags = [...job.languages, ...job.tools, job.level];

  // left side
  const cardLeft = document.createElement("div");
  cardLeft.className = "job-left";
  cardLeft.innerHTML = `
        <div class="job-left">
        <div class="company-logo">
            <img src="${job.logo}" alt="${job.company}">
        </div>
        <div class="company-info">
            <div class="company-header">
                <p class="company-name">${job.company}</p>
                <div class="new-tag tag ${job.new === true && "active"}">${
    job.new === true ? "NEW!" : ""
  }</div>
                <div class="feature-tag tag ${
                  job.featured === true && "active"
                }">${job.featured === true ? "FEATURE!" : ""}</div>
            </div>
            <h5 class="job-title">${job.position}</h5>
            <div class="company-footer">
                <p class="job-details">${
                  job.postedAt
                } <span class="dot"></span> ${
    job.contract
  } <span class="dot"></span> ${job.location}</p>
            </div>
        </div>
    </div>
    `;

  // middle (separator)
  const separator = document.createElement("span");
  separator.className = "line";

  // right side
  const cardRight = document.createElement("div");
  cardRight.className = "job-right";

  jobTags.forEach((tag) => {
    const tagP = document.createElement("p");
    tagP.className = "cat-tag";
    tagP.innerHTML = tag;
    tagP.addEventListener("click", () => addTagFilter(tag));
    cardRight.appendChild(tagP);
  });

  jobCard.appendChild(cardLeft);
  jobCard.appendChild(separator);
  jobCard.appendChild(cardRight);

  return jobCard;
}

// add selected tag to filter
function addTagFilter(tag) {
  if (!selectedTags.includes(tag)) {
    selectedTags.push(tag);
    saveTagsToLocalStorage();
    updateFiltersUI();
    renderJobs(jobsData);
  }
}

// remove tag from filter
function removeTag(tag) {
  selectedTags = selectedTags.filter((t) => t !== tag);
  saveTagsToLocalStorage();
  updateFiltersUI();
  renderJobs(jobsData);
}

// Filter jobs by selected tags (AND logic)
function filteredJobsByTags(jobs) {
  return jobs.filter((job) => {
    const jobTags = [
      job.role,
      job.level,
      ...(job.languages || []),
      ...(job.tools || []),
    ];
    return selectedTags.every((tag) => jobTags.includes(tag));
  });
}

// Update filter tag UI pills
function updateFiltersUI() {
  const filterTagsEl = document.getElementById("filterTags");
  filterTagsEl.innerHTML = "";

  selectedTags.forEach((tag) => {
    const tagDiv = document.createElement("div");
    tagDiv.classList = "tag-pill";
    tagDiv.innerHTML = `
      <span>${tag}</span>
      <span class="remove-tag">&times;</span>
    `;

    tagDiv.querySelector(".remove-tag").addEventListener('click', () => removeTag(tag));
    filterTagsEl.appendChild(tagDiv);
  });

  console.log(selectedTags)
  document.querySelector(".search-bar").style.display = selectedTags.length ? 'flex' : "none";
}


// save tags to local storage
function saveTagsToLocalStorage() {
    localStorage.setItem("selectedTags", JSON.stringify(selectedTags));
}

function loadTagsFromLocalStorage() {
    const stored = localStorage.getItem('selectedTags');
    if (stored) {
        selectedTags = JSON.parse(stored);
    }
}