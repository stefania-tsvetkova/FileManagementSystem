import { RequestService } from "../../../services/request.service.js";
import { NotificationService } from "../../../services/notification.service.js";
import { UserSessionService } from "../../../services/user-session.service.js";

window.bodyLoaded = bodyLoaded;

const requestService = new RequestService();
const notificationService = new NotificationService();
const userSessionService = new UserSessionService();

function bodyLoaded() {
    // we don't await these async function so they can be executed parallelly
    updateFilesTable();
}

async function updateFilesTable() {
    let data = new URLSearchParams({
        employeeId: userSessionService.getCurrentUserId()
    });

    const getFilesScript = userSessionService.isCurrentUserAdmin() ? 
        'getAdminFiles.php' : 
        'getEmployeeFiles.php';
    const getFilesUrl = `../../../../back-end/${getFilesScript}`;

    await requestService.get(getFilesUrl, data)
        .then(response => {
            const files = JSON.parse(response);

            const table = document.getElementById('files-table');
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }

            for (let i = 0; i < files.length; i++) {
                let row = table.insertRow(-1);
                row.insertCell(-1).innerHTML = files[i]['id'];
                row.insertCell(-1).innerHTML = files[i]['name'];
                row.insertCell(-1).innerHTML = files[i]['department'];
                row.insertCell(-1).innerHTML = files[i]['userEmail'];
                row.insertCell(-1).innerHTML = files[i]['status'];
                row.insertCell(-1).innerHTML = '';
            }
        })
        .catch(_ => notificationService.error('Error getting files'));
}