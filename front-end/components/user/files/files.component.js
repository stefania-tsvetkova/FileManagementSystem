import { RequestService } from '../../../services/request.service.js';
import { VALID_FILE_EXTENSIONS } from '../../../constants/file.constants.js';
import { StatusIds } from '../../../constants/status-ids.constants.js';
import { NotificationService } from '../../../services/notification.service.js';
import { UserSessionService } from '../../../services/user-session.service.js';
import { SERVER_CODE_DIRECTORY } from '../../../constants/url.constants.js';

window.bodyLoaded = bodyLoaded;
window.selectedDepartmentChanged = selectedDepartmentChanged;
window.chooseFilesButtonClicked = chooseFilesButtonClicked;
window.selectedFileChanged = selectedFileChanged;
window.uploadFile = uploadFile;

const requestService = new RequestService();
const notificationService = new NotificationService();
const userSessionService = new UserSessionService();

function bodyLoaded() {
    // we don't await these async function so they can be executed parallelly
    setDepartments();
    updateFilesTable();
}

function chooseFilesButtonClicked() {
    const fileInput = document.getElementById('file-input');
    fileInput.click();
}

function selectedFileChanged() {
    const fileName = getSelectedFile().name;

    const fileNameElement = document.getElementById('file-name');
    fileNameElement.innerHTML = fileName;

    const departmentsDropdownElement = document.getElementById('departments-dropdown');
    departmentsDropdownElement.classList.remove('hidden');

    const uploadFileButtonElement = document.getElementById('upload-file-button');
    uploadFileButtonElement.classList.remove('hidden');
}

async function uploadFile() {
    const departmentId = getSelectedDepartmentId();
    if (departmentId === '') {
        const uploadErrorElement = document.getElementById(`upload-error`);
        uploadErrorElement.textContent = 'Department is requered';
        return;
    }

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
    data.append("departmentId", departmentId);
    data.append("statusId", StatusIds.Uploaded);

    await requestService.post(`../../../../${SERVER_CODE_DIRECTORY}/uploadFile.php`, data)
        .then(response => {
            if (response !== '') {
                notificationService.success(`File uploaded - the No. Ref. is ${response}`);
                updateFilesTable();
                return;
            }

            notificationService.error('File upload failed');
        })
        .catch(_ => notificationService.error('File upoad failed'));
}

function selectedDepartmentChanged() {
    const uploadErrorElement = document.getElementById(`upload-error`);
    uploadErrorElement.textContent = '';
}

async function setDepartments() {
    await requestService.get(`../../../../${SERVER_CODE_DIRECTORY}/getDepartments.php`)
        .then(response => {
            const departments = JSON.parse(response)
                .sort((a, b) => a.name.localeCompare(b.name));

            const departmentsDropdownElement = document.getElementById('departments-dropdown');
            departments.forEach(department => {
                const optionHtml = `<option value='${department.id}'>${department.name}</option>`;
                departmentsDropdownElement.insertAdjacentHTML('beforeEnd', optionHtml);
            });
        })
        .catch(_ => notificationService.error('Error getting departments'));
}

async function updateFilesTable() {
    let data = new URLSearchParams({
        userId: userSessionService.getCurrentUserId()
    });

    await requestService.get(`../../../../${SERVER_CODE_DIRECTORY}/getUserFiles.php`, data)
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
                row.insertCell(-1).innerHTML = files[i]['status'];
            }
        })
        .catch(_ => notificationService.error('Error getting files'));
}

function getSelectedFile() {
    return document.getElementById('file-input').files[0];
}

function getSelectedDepartmentId() {
    return document.getElementById('departments-dropdown').value;
}