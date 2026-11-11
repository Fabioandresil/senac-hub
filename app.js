const projectCards = Array.from(document.querySelectorAll(".project-card"));
const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
const searchInput = document.querySelector("#project-search");
const emptyState = document.querySelector("#empty-state");
const resultsCount = document.querySelector("#results-count");
let activeFilter = "Todos";

function updateProjects() {
  const query = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const matchesCategory = activeFilter === "Todos" || card.dataset.category === activeFilter;
    const matchesSearch = card.dataset.search.toLocaleLowerCase("pt-BR").includes(query);
    const isVisible = matchesCategory && matchesSearch;

    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  emptyState.hidden = visibleCount > 0;
  resultsCount.textContent = `${visibleCount} ${visibleCount === 1 ? "projeto encontrado" : "projetos encontrados"}`;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle("selected", isSelected);
      filterButton.setAttribute("aria-pressed", String(isSelected));
    });
    updateProjects();
  });
});

searchInput.addEventListener("input", updateProjects);
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
});

updateProjects();
