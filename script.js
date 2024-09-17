let peopleData = [];
let currentId = 1;
let editId = null;

// Referencias al DOM
const personForm = document.getElementById('person-form');
const personTableBody = document.getElementById('person-table');
const exportBtn = document.getElementById('export-btn');
const addBtn = document.getElementById('add-btn');
const updateBtn = document.getElementById('update-btn');

// Agregar persona
personForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const zona = document.getElementById('zona').value;
    const fullname = document.getElementById('fullname').value;
    const direccion = document.getElementById('direccion').value;
    const dni = document.getElementById('dni').value;
    const phone = document.getElementById('phone').value;
    const edad = document.getElementById('edad').value;

    if (editId) {
        // Actualizar persona existente
        const personIndex = peopleData.findIndex(person => person.id === editId);
        peopleData[personIndex] = { id: editId, zona, fullname, direccion, dni, phone, edad };
        editId = null;
        toggleButtons();
    } else {
        // Agregar nueva persona
        const person = {
            id: currentId++,
            zona,
            fullname,
            direccion,
            dni,
            phone,
            edad
        };
        peopleData.push(person);
    }

    renderTable();
    personForm.reset();
});

// Editar persona
function editPerson(id) {
    const person = peopleData.find(person => person.id === id);
    document.getElementById('zona').value = person.zona;
    document.getElementById('fullname').value = person.fullname;
    document.getElementById('direccion').value = person.direccion;
    document.getElementById('dni').value = person.dni;
    document.getElementById('phone').value = person.phone;
    document.getElementById('edad').value = person.edad;
    editId = id;
    toggleButtons();
}

// Cambiar entre botones de agregar y actualizar
function toggleButtons() {
    if (editId) {
        addBtn.classList.add('d-none');
        updateBtn.classList.remove('d-none');
    } else {
        addBtn.classList.remove('d-none');
        updateBtn.classList.add('d-none');
    }
}

// Manejar clic en el botón de actualizar
updateBtn.addEventListener('click', () => {
    personForm.dispatchEvent(new Event('submit'));
});

// Eliminar persona
function deletePerson(id) {
    peopleData = peopleData.filter(person => person.id !== id);
    renderTable();
}

// Renderizar tabla
function renderTable() {
    personTableBody.innerHTML = '';

    peopleData.forEach((person) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${person.zona}</td>
            <td>${person.fullname}</td>
            <td>${person.direccion}</td>
            <td>${person.dni}</td>
            <td>${person.phone}</td>
            <td>${person.edad}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editPerson(${person.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deletePerson(${person.id})">Eliminar</button>
            </td>
        `;
        personTableBody.appendChild(row);
    });
}

// Exportar a Excel
exportBtn.addEventListener('click', () => {
    const worksheetData = [['PROGRAMA PENSION 65'], ['Ítem', 'Zona', 'Apellidos y Nombres', 'Dirección', 'DNI', 'Teléfono', 'Edad']]; // Título y cabeceras

    // Agregar los datos
    peopleData.forEach((person) => {
        worksheetData.push([person.id, person.zona, person.fullname, person.direccion, person.dni, person.phone, person.edad]);
    });

    // Crear el archivo Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Personas');

    // Descargar archivo
    XLSX.writeFile(workbook, 'PROGRAMA_PENSION_65.xlsx');
});

// Renderizar tabla inicial
renderTable();
