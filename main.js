function api(method, url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = "json";
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(xhr.status);
      }
    };
    xhr.onerror = function () {
      console.log(Error(xhr.status));
    };
    xhr.send();
  });
}

const employeeURL = "http://localhost:3000/employees";
const companyURL = "http://localhost:3000/companies";

async function getEmployees() {
  try {
    const data = await api("GET", employeeURL);
    return data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
}

async function getCompanies() {
  try {
    const data = await api("GET", companyURL);
    return data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
}

function unificarDatos(employees, companies) {
  return employees
    .map((employee) => {
      let company = companies.find((c) => c.companyId === employee.companyId);

      // Verificar si la compañía existe y está activa
      if (company && company.active) {
        return {
          ...employee,
          ...company,
        };
      }

      return null;
    })
    .filter((employee) => employee !== null); // Eliminar empleados que no tienen compañía o cuya compañía está desactivada
}


async function fetchData() {
  try {
    const employees = await getEmployees();
    const companies = await getCompanies();
console.log(unificarDatos(employees, companies)); 
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();
