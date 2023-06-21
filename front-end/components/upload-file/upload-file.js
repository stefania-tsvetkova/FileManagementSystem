import { RequestService } from "../../services/request.service.js";
import { VALID_FILE_EXTENSIONS } from '../../constants/file.constants.js';
import { NotificationService } from "../../services/notification.service.js";
import { UserSessionService } from "../../services/user-session.service.js";

window.uploadFile = uploadFile;

const requestService = new RequestService();
const notificationService = new NotificationService();
const userSessionService = new UserSessionService();

async function uploadFile() {
    const file = document.getElementById("file").files[0];

    const fileExtension = file.name.split('.').pop();
    if (!VALID_FILE_EXTENSIONS.includes(fileExtension)) {
        notificationService.error('Unsupported file type');
        return;
    }

    let data = new FormData();
    data.append("file", file);
    data.append("fileName", file.name);
    data.append("userId", userSessionService.getCurrentUserId());

    await requestService.post('../../../back-end/uploadFile.php', data)
        .then(response => 
            response === '1' ?
            notificationService.success('File uploaded') :
            notificationService.error('File upload failed'))
        .catch(_ => notificationService.error('File upoad failed'));
}