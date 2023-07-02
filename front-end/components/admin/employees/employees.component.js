import { RequestService } from '../../../services/request.service.js';
import { NotificationService } from '../../../services/notification.service.js';
import { SERVER_CODE_DIRECTORY } from '../../../constants/url.constants.js';
import { UserTypes } from '../../../constants/user-types.constants.js';
import { UrlHelper} from '../../../helpers/url.helper.js'

window.bodyLoaded = bodyLoaded;
window.addEmployee = addEmployee;

const requestService = new RequestService();
const notificationService = new NotificationService();
const urlHelper = new UrlHelper();

function bodyLoaded() {
    // we don't await these async functions so they can be executed parallelly
    updateEmployeesTable();
}

async function updateEmployeesTable() {
    await requestService.get(`../../../../${SERVER_CODE_DIRECTORY}/admin/getEmployees.php`)
        .then(response => {
            const employees = JSON.parse(response);

            const table = document.getElementById('employees-table');
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }

            for (let i = 0; i < employees.length; i++) {
                let row = table.insertRow(-1);
                row.insertCell(-1).innerHTML = employees[i].email;
                row.insertCell(-1).innerHTML = employees[i].name;
                row.insertCell(-1).innerHTML = employees[i].familyName;
                row.insertCell(-1).innerHTML = employees[i].department;
                row.insertCell(-1).innerHTML = employees[i].isAdmin ? UserTypes.Admin : UserTypes.Employee;
            }
        })
        .catch(_ => notificationService.error('Error getting employees'));
}

function addEmployee() {
    const addEmployeeUrl = urlHelper.constructUrl('add-employee', UserTypes.Admin);
    window.location.replace(addEmployeeUrl);
}