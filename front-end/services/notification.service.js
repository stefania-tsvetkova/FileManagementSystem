export class NotificationService {
    async error(message) {
        const notificationElement = await addNotification(message);
        notificationElement.classList.add('error');
    }

    async success(message) {
        const notificationElement = await addNotification(message);
        notificationElement.classList.add('success');
    }
}

async function addNotification(message) {
    document.getElementById('notification')?.remove();

    await fetch('../../../common/notification/notification.html')
        .then(response => response.text())
        .then(notificationHtml => document.body.insertAdjacentHTML('afterbegin', notificationHtml));

    const notificationElement = document.getElementById('notification');
    notificationElement.innerHTML = message;

    setTimeout(
        _ => {
            const notificationElement = document.getElementById('notification');
            if (notificationElement.innerHTML === message) {
                notificationElement.remove();
            }
        }, 
        1500);

    return notificationElement;
}