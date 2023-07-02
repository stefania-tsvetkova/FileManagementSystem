import { CLIENT_CODE_DIRECTORY, UserTypeComponentDirectories } from '../constants/url.constants.js';

export class UrlHelper {
    constructUrl(componentName, userType) {
        const currentUrl = window.location.href;
        const baseUrlLength = currentUrl.indexOf(CLIENT_CODE_DIRECTORY) + CLIENT_CODE_DIRECTORY.length;
        const baseUrl = currentUrl.substring(0, baseUrlLength);

        const componentDirectory = UserTypeComponentDirectories[userType];

        return `${baseUrl}/${componentDirectory}/${componentName}/${componentName}.component.html`;
    }
}