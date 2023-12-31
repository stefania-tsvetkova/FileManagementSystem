import { RequestService } from '../../../services/request.service.js';
import { NotificationService } from '../../../services/notification.service.js';
import { UserSessionService } from '../../../services/user-session.service.js';
import { StatusIds } from '../../../constants/status-ids.constants.js';
import { SERVER_CODE_DIRECTORY } from '../../../constants/url.constants.js';
import { DateTimeHelper } from '../../../helpers/date-time.helper.js';
import { FileService } from '../../../services/file.service.js';

window.bodyLoaded = bodyLoaded;
window.setFileStatus = setFileStatus;
window.download = download;

const requestService = new RequestService();
const notificationService = new NotificationService();
const userSessionService = new UserSessionService();
const dateTimeHelper = new DateTimeHelper();
const fileService = new FileService();

function bodyLoaded() {
    // we don't await these async functions so they can be executed parallelly
    updateFilesTable();
}

async function setFileStatus(fileId, statusId) {
    let data = new URLSearchParams({
        fileId: fileId,
        statusId: statusId
    });
    
    await requestService.put(`../../../../${SERVER_CODE_DIRECTORY}/employee/updateFileStatus.php`, data)
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

function download(fileId, fileName) {
    fileService.download(fileId, fileName);
}

async function updateFilesTable() {
    let data = new URLSearchParams({
        employeeId: userSessionService.getCurrentUserId()
    });
    
    await requestService.get(`../../../../${SERVER_CODE_DIRECTORY}/employee/getFiles.php`, data)
        .then(response => {
            const files = JSON.parse(response)
                .sort((a, b) => -1 * dateTimeHelper.compareDateTimeStrings(a.statusDate, b.statusDate));

            const table = document.getElementById('files-table');
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }

            for (let i = 0; i < files.length; i++) {
                let row = table.insertRow(-1);
                row.insertCell(-1).innerHTML = files[i].id;
                row.insertCell(-1).innerHTML = files[i].name;
                row.insertCell(-1).innerHTML = files[i].department;
                row.insertCell(-1).innerHTML = files[i].userEmail;
                row.insertCell(-1).innerHTML = files[i].status;
                row.insertCell(-1).innerHTML = dateTimeHelper.formatDateTimeString(files[i].uploadDate);
                row.insertCell(-1).innerHTML = dateTimeHelper.formatDateTimeString(files[i].statusDate);
                row.insertCell(-1).innerHTML = getActionsHtml(files[i].id, files[i].name, files[i].statusId);
            }
        })
        .catch(_ => notificationService.error('Error getting files'));
}

function getActionsHtml(fileId, fileName, statusId) {
    const reviewButtonHtml = `
        <button
            class="icon-button"
            ${statusId == StatusIds.Uploaded ? '' : 'disabled'}
            title="Review"
            onclick="setFileStatus(${fileId}, ${StatusIds.Reviewing})">
            <i class="fa fa-pen-to-square"></i>
        </button>`;

    const approveButtonHtml = `
        <button 
            class="icon-button approve-button"
            ${statusId == StatusIds.Reviewing ? '' : 'disabled'}
            title="Approve"
            onclick="setFileStatus(${fileId}, ${StatusIds.Approved})">
            <i class="fa fa-square-check"></i>
        </button>`;

    const rejectButtonHtml = `
        <button 
            class="icon-button reject-button"
            ${statusId == StatusIds.Reviewing ? '' : 'disabled'}
            title="Reject"
            onclick="setFileStatus(${fileId}, ${StatusIds.Rejected})">
            <i class="fa fa-square-xmark"></i>
        </button>`;

        const downloadButtonHtml = `
            <button
                class="icon-button"
                title="Download"
                onclick="download(${fileId}, '${fileName}')">
                <i class="fa fa-download"></i>
            </button>`;

    return `${reviewButtonHtml}${approveButtonHtml}${rejectButtonHtml}${downloadButtonHtml}`;
}