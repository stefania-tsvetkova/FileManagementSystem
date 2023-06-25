import { CODE_DIRECTORY, UserTypeComponentDirectories } from '../constants/url.constants.js';
import { UserTypes } from '../constants/user-types.constants.js';

export class UrlHelper {
    constructUrl(componentName, userType) {
        const currentUrl = window.location.href;
        const baseUrlLength = currentUrl.indexOf(CODE_DIRECTORY) + CODE_DIRECTORY.length;
        const baseUrl = currentUrl.substring(0, baseUrlLength);

        const componentDirectory = UserTypeComponentDirectories[userType];

        return `${baseUrl}/${componentDirectory}/${componentName}/${componentName}.component.html`;
    }
}