import { CODE_DIRECTORY, COMPONENTS_DIRECTORY } from '../constants/url.constants.js';

export class UrlHelper {
    constructUrl(componentName) {
        const currentUrl = window.location.href;
        const baseUrlLength = currentUrl.indexOf(CODE_DIRECTORY) + CODE_DIRECTORY.length;
        const baseUrl = currentUrl.substring(0, baseUrlLength);

        return `${baseUrl}/${COMPONENTS_DIRECTORY}/${componentName}/${componentName}.component.html`;
    }
}