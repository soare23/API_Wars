let tableData = document.querySelector('table-data');
let nextBtn = document.getElementById('next');
let previousBtn = document.getElementById('previous');
let table = document.getElementById('table-content');
let modalTable = document.getElementById('modal-table-content');
let modalBg = document.querySelector('.modal-bg');
let closeModalBtn = document.querySelector('#modal-inactive-button');
let closeModalTrigger = document.querySelector('#modal-inactive-trigger');
let residentPlanetName = document.getElementById('resident-planet');
let nextData = '';
let previousData = '';

// Get initial planet data from API

async function getInitialData() {
  const res = await fetch('https://swapi.dev/api/planets/');
  const data = await res.json();
  let initialData = data.results;
  nextData = data.next.replace('http', 'https');
  if (data.previous) {
    previousData = data.previous.replace('http', 'https');
  }

  generateTableData(initialData);
}

getInitialData();

// Get initial residents data from API

async function getResidentsData() {}

// Populate initial table with API initial value & residents data

function generateTableData(data) {
  data.forEach((element, index) => {
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `<td>${element.name}</td>
        <td>${element.diameter} km</td>
        <td>${element.climate}</td>
        <td>${element.terrain}</td>
        <td>${element.surface_water} %</td>
        <td>${element.population} people</td>
        <td><button class="residents" id=${index}>
        ${
          element.residents.length > 0
            ? element.residents.length + ' resident(s)'
            : 'No known residents'
        }
        </button></td`;
    table.appendChild(tableRow);
  });
  residentsBtn = document.querySelectorAll('.residents');
  residentsBtn.forEach((item) => {
    item.addEventListener('click', (e) => {
      let residentsList = data[e.target.id].residents;
      let residentPlanet = data[e.target.id].name;
      residentPlanetName.innerHTML = `<h3> Residents of ${residentPlanet} </h3>`;
      residentsList.forEach((resident) => {
        let residents = resident.replace('http', 'https');
        fetch(residents)
          .then((response) => response.json())
          .then((residentData) => {
            modalBg.classList.add('modal-active');
            const residentModalRow = document.createElement('tr');
            residentModalRow.innerHTML = `
            <td>${residentData.name}</td>
            <td>${residentData.height} cm</td>
            <td>${residentData.mass} kg</td>
            <td>${residentData.skin_color}</td>
            <td>${residentData.hair_color}</td>
            <td>${residentData.eye_color}</td>
            <td>${residentData.birth_year}</td>
            <td>${residentData.gender}</td>`;
            modalTable.appendChild(residentModalRow);
          });
      });
    });
  });
}

// Get next 10 planets from API

async function getNextData() {
  const res = await fetch(nextData);
  const data = await res.json();
  let newData = data.results;
  if (data.next) {
    nextData = data.next.replace('http', 'https');
  }
  if (data.previous) {
    previousData = data.previous.replace('http', 'https');
  }
  clearTable();
  generateTableData(newData);
}

// Get previous 10 planets from API

async function getPreviousData() {
  const res = await fetch(previousData);
  const data = await res.json();
  let newData = data.results;
  if (data.next) {
    nextData = data.next.replace('http', 'https');
  }
  if (data.previous) {
    previousData = data.previous.replace('http', 'https');
  }
  clearTable();
  generateTableData(newData);
}

// Clear initial table

function clearTable() {
  table.innerHTML = '';
}

// Clear residents table

function clearResidentsTable() {
  modalTable.innerHTML = '';
}
// Event listeners

nextBtn.addEventListener('click', getNextData);
previousBtn.addEventListener('click', getPreviousData);
closeModalBtn.addEventListener('click', function () {
  clearResidentsTable();
  modalBg.classList.remove('modal-active');
});
closeModalTrigger.addEventListener('click', function () {
  clearResidentsTable();
  modalBg.classList.remove('modal-active');
});
