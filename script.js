document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const searchBtn = document.getElementById("searchBtn");
  const addBtn = document.getElementById("addBtn");
  const tableBody = document.getElementById("tableBody");

  let devices = JSON.parse(localStorage.getItem("devices")) || [];

  function save() {
    localStorage.setItem("devices", JSON.stringify(devices));
  }

  function render(search = "") {
    tableBody.innerHTML = "";
    const term = String(search).trim().toLowerCase();
    devices
      .filter((d) => d.name.toLowerCase().includes(term))
      .forEach((d) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${d.id}</td><td>${d.name}</td>`;
        tableBody.appendChild(tr);
      });
  }

  addBtn &&
    addBtn.addEventListener("click", () => {
      const name = nameInput.value.trim();
      if (!name) return;
      devices.push({ id: devices.length + 1, name });
      save();
      nameInput.value = "";
      render();
    });

  searchBtn &&
    searchBtn.addEventListener("click", () => render(nameInput.value));

  render();
});
