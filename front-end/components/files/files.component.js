import { RequestService } from "../../services/request.service.js";
import { VALID_FILE_EXTENSIONS } from '../../constants/file.constants.js';
import { StatusIds } from '../../constants/status-ids.constants.js';
import { NotificationService } from "../../services/notification.service.js";
import { UserSessionService } from "../../services/user-session.service.js";

window.bodyLoaded = bodyLoaded;
window.chooseFilesButtonClicked = chooseFilesButtonClicked;
window.selectedFileChanged = selectedFileChanged;
window.uploadFile = uploadFile;

const requestService = new RequestService();
const notificationService = new NotificationService();
const userSessionService = new UserSessionService();

async function bodyLoaded() {
    await updateFilesTable();
}

function chooseFilesButtonClicked() {
    const fileInput = document.getElementById('file-input');
    fileInput.click();
}

function selectedFileChanged() {
    const fileName = getSelectedFile().name;

    const fileNameElement = document.getElementById('file-name');
    fileNameElement.innerHTML = fileName;

    const uploadFileButtonElement = document.getElementById('upload-file-button');
    uploadFileButtonElement.classList.remove('hidden');
}

async function uploadFile() {
    const file = getSelectedFile();

    const fileExtension = file.name.split('.').pop();
    if (!VALID_FILE_EXTENSIONS.includes(fileExtension)) {
        notificationService.error('Unsupported file type');
        return;
    }

    let data = new FormData();
    data.append("file", file);
    data.append("fileName", file.name);
    data.append("userId", userSessionService.getCurrentUserId());
    data.append("statusId", StatusIds.Uploaded);

    await requestService.post('../../../back-end/uploadFile.php', data)
        .then(response => {
            if (response === '1') {
                notificationService.success('File uploaded');
                updateFilesTable();
                return;
            }

            notificationService.error('File upload failed');
        })
        .catch(_ => notificationService.error('File upoad failed'));
}

async function updateFilesTable() {
    let data = new URLSearchParams({
        userId: userSessionService.getCurrentUserId()
    });

    await requestService.get('../../../back-end/getFiles.php', data)
        .then(response => {
            const files = JSON.parse(response);

            const table = document.getElementById('files-table');
            for (let i = 0; i < files.length; i++) {
                let row = table.insertRow(-1);
                row.insertCell(-1).innerHTML = files[i]['id'];
                row.insertCell(-1).innerHTML = files[i]['name'];
                row.insertCell(-1).innerHTML = files[i]['status'];
            }
        })
        .catch(_ => notificationService.error('Error getting files'));
}

function getSelectedFile() {
    return document.getElementById("file-input").files[0];;
}