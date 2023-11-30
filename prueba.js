// Función para hacer una solicitud a la API y devolver una promesa
function apiInteraction(HTTPMethod, url, data = null) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open(HTTPMethod, url);
    request.responseType = 'json';

    if (["POST", "PUT", "PATCH", "DELETE"].includes(HTTPMethod)) {
      request.setRequestHeader('Content-Type', 'application/json');
    }

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve(request.response);
      } else {
        reject(request.response);
      }
    };

    request.onerror = () => {
      reject(request.statusText);
    };

    // Enviar datos si están presentes
    if (data !== null) {
      request.send(JSON.stringify(data));
    } else {
      request.send();
    }
  });
}

// Función para agregar empleados a la tabla
async function addEmployeesToTable() {
  try {
    const employees = await apiInteraction("GET", "https://utn-lubnan-api-2.herokuapp.com/api/Employee");
    const companies = await apiInteraction("GET", "https://utn-lubnan-api-2.herokuapp.com/api/Company");
    const employeeDataWithCompany = mapEmployeesWithCompany(employees, companies);
    fillTable(employeeDataWithCompany);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Función para mapear empleados con la información de la compañía
function mapEmployeesWithCompany(employees, companies) {
  return employees.map((employee) => {
    const company = companies.find((c) => c.companyId === employee.companyId);
    return {
      ...employee,
      company: company ? company : null,
    };
  });
}

// Función para llenar la tabla con los datos de los empleados
function fillTable(employeeDataWithCompany) {
  let table = document.getElementById('tableBody');
  let content = ``;
  employeeDataWithCompany.forEach((employee) => {
    content += `
      <tr id='${employee.employeeId}'>
          <td>${employee.employeeId}</td>
          <td>${employee.companyId}</td>
          <td>${employee.company.name}</td>
          <td>${employee.firstName}</td>
          <td>${employee.lastName}</td>
          <td>${employee.email}</td>
          <td><i class="fa-solid fa-check" style="color: green;"></i></td>
          <td>
              <button class="btn btn-sm btn-danger" onclick="deleteOneEmployee(${employee.employeeId})"><i class="fa-solid fa-trash-can"></i>Borrar</button>
          </td>
      </tr>`;
  });
  table.innerHTML = content;
}

let testingPost = {
  "employeeId": 1001,
  "companyId": 10,
  "firstName": "Agustin",
  "lastName": "Carnessali",
  "email": "agustin.com"
};

async function addOneEmployee(employee) {
  await apiInteraction('POST', "https://utn-lubnan-api-2.herokuapp.com/api/Employee", employee);
}

async function deleteOneEmployee(id) {
  await apiInteraction('DELETE', `https://utn-lubnan-api-2.herokuapp.com/api/Employee/${id}`)
    .then((response) => {
      deleteFromTable(id);
    });
}

function deleteFromTable(id) {
  const row = document.getElementById(id);

  if (row) {
    row.remove();
    console.log(`Fila con ID ${id} eliminada correctamente.`);
  } else {
    console.error(`No se encontró la fila con ID ${id}.`);
  }
}

async function addAndWaitToCreateTable() {
  await addEmployeesToTable();
}

async function deleteOneEmployeeAndWait(id) {
  await addAndWaitToCreateTable();
  await deleteOneEmployee(id);
}

// Llamada a la función que agrega empleados y espera a que la tabla se actualice
addAndWaitToCreateTable()