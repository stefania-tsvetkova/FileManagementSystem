import { RequestService } from './request.service.js';
import { NotificationService } from './notification.service.js';
import { SERVER_CODE_DIRECTORY } from '../constants/url.constants.js';

const requestService = new RequestService();
const notificationService = new NotificationService();

export class FileService {
    download(fileId, fileName) {
        let data = new URLSearchParams({
            fileId: fileId,
            fileName: fileName
        });
        
        requestService.get(`../../../../${SERVER_CODE_DIRECTORY}/common/downloadFile.php`, data)
            .then(response => {
                if (response === '') {
                    notificationService.error('File download failed');
                    return;
                }
    
                var url = window.URL.createObjectURL(new Blob([response]));
    
                var link = document.createElement('a');
                link.href = url;
                link.download = fileName;
    
                document.body.appendChild(link);
                link.click();
    
                window.URL.revokeObjectURL(url);
    
                notificationService.success('File downloading');
                
            })
            .catch(_ => notificationService.error('File download failed'));
    }
}