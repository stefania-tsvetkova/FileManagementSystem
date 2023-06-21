import { RequestService } from "../../services/request.service.js";
import { NotificationService } from "../../services/notification.service.js";
import { UserSessionService } from "../../services/user-session.service.js";

window.bodyLoaded = bodyLoaded;

const requestService = new RequestService();
const notificationService = new NotificationService();
const userSessionService = new UserSessionService();

async function bodyLoaded() {
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
            }
        })
        .catch(_ => notificationService.error('Error getting files'));
}