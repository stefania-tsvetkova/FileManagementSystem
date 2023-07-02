import { UserService } from '../../services/user.service.js';
import { EmployeeService } from '../../services/employee.service.js';
import { HashHelper } from '../../helpers/hash.helper.js';
import { UrlHelper} from '../../helpers/url.helper.js'
import { DataValidationHelper} from '../../helpers/data-validation.helper.js'
import { FormHelper} from '../../helpers/form.helper.js'
import { COMPONENTS_DIRECTORY } from '../../constants/url.constants.js';
import { UserTypes } from '../../constants/user-types.constants.js';

window.bodyLoaded = bodyLoaded;
window.validateEmail = validateEmail;
window.validatePassword = validatePassword;
window.login = login;

const userService = new UserService();
const employeeService = new EmployeeService();
const hashHelper = new HashHelper();
const urlHelper = new UrlHelper();
const dataValidationHelper = new DataValidationHelper();
const formHelper = new FormHelper();

let userType;

async function bodyLoaded() {
    await fetch('../../../common/login-page/login-page.html')
        .then(response => response.text())
        .then(pageHtml => document.body.insertAdjacentHTML('afterbegin', pageHtml));

    getUserType();
    if (userType == UserTypes.Employee.toLowerCase()) {
        const loginButton = document.getElementById('login-button');
        loginButton.innerHTML = 'Login as employee';
        
        const userLoginElement = document.getElementById('user-login');
        userLoginElement.classList.remove('hidden');

        const userLoginButtonElement = document.getElementById('user-login-button');
        const userLoginUrl = urlHelper.constructUrl('login', UserTypes.User);
        userLoginButtonElement.setAttribute('href', userLoginUrl);
    }
    else {
        const registerElement = document.getElementById('register');
        registerElement.classList.remove('hidden');

        const registerButtonElement = document.getElementById('register-button');
        const registerUrl = urlHelper.constructUrl('register', UserTypes.User);
        registerButtonElement.setAttribute('href', registerUrl);
        
        const employeeLoginElement = document.getElementById('employee-login');
        employeeLoginElement.classList.remove('hidden');
        
        const employeeLoginButtonElement = document.getElementById('employee-login-button');
        const employeeLoginUrl = urlHelper.constructUrl('login', UserTypes.Employee);
        employeeLoginButtonElement.setAttribute('href', employeeLoginUrl);
    }
}

async function login() {
    formHelper.clearFormErrors();
    
    const isFormValid = await validateForm();
    if (!isFormValid) {
        return;
    }
    
    const userData = await getUserData();

    const service = userType == UserTypes.User.toLowerCase() ? userService : employeeService;
    let isLoggedIn = await service.login(userData);
    
    if (!isLoggedIn) {
        formHelper.displayError('login-button', 'Email or password is incorrect');
    }
};

async function getUserData() {
    return {
        email: document.getElementById('email').value,
        passwordHash: await hashHelper.getSHA256Hash(document.getElementById('password').value)
    };
}

function getUserType() {
    const urlParts = document.URL.split('/');
    const userTypeIndex = urlParts.findIndex(el => el === COMPONENTS_DIRECTORY) + 1;

    userType = urlParts[userTypeIndex];
}

async function validateForm() {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    return isEmailValid && isPasswordValid;
}

function validateEmail() {
    const emailInput = document.getElementById('email');

    return formHelper.isInputValueValid(
        emailInput, 
        dataValidationHelper.notNullOrEmpty, 
        'Email is required'
    );
}

function validatePassword() {
    const passwordInput = document.getElementById('password');

    return formHelper.isInputValueValid(
        passwordInput, 
        dataValidationHelper.notNullOrEmpty, 
        'Password is required'
    );
}