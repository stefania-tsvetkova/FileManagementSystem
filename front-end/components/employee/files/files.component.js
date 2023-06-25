import { RequestService } from "../../../services/request.service.js";
import { NotificationService } from "../../../services/notification.service.js";
import { UserSessionService } from "../../../services/user-session.service.js";
import { StatusIds } from "../../../constants/status-ids.constants.js";

window.bodyLoaded = bodyLoaded;
window.setFileStatus = setFileStatus;

const requestService = new RequestService();
const notificationService = new NotificationService();
const userSessionService = new UserSessionService();

function bodyLoaded() {
    // we don't await these async function so they can be executed parallelly
    updateFilesTable();
}

async function setFileStatus(fileId, statusId) {
    let data = new URLSearchParams({
        fileId: fileId,
        statusId: statusId
    });
    
    await requestService.put('../../../../back-end/updateFileStatus.php', data)
        .then(isSuccessful => {
            if (!isSuccessful) {
                notificationService.error('Error updating file status');
                return;
            }

            notificationService.success('File status updated');
            updateFilesTable();
        })
        .catch(_ => notificationService.error('Error getting files'));
}

async function updateFilesTable() {
    let data = new URLSearchParams({
        employeeId: userSessionService.getCurrentUserId()
    });
    
    await requestService.get('../../../../back-end/getEmployeeFiles.php', data)
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
                row.insertCell(-1).innerHTML = getActionsHtml(files[i]['id']);
            }
        })
        .catch(_ => notificationService.error('Error getting files'));
}

function getActionsHtml(fileId) {
    const approveButtonHtml = `
        <button 
            class="approve-button"
            onclick="setFileStatus(${fileId}, ${StatusIds.Approved})">
            Approve
        </button>`;

    const rejectButtonHtml = `
        <button 
            class="reject-button"
            onclick="setFileStatus(${fileId}, ${StatusIds.Rejected})">
            Reject
        </button>`;

    return `${approveButtonHtml}${rejectButtonHtml}`;
}