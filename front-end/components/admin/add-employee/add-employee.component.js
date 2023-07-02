import { HashHelper } from '../../../helpers/hash.helper.js';
import { DataValidationHelper} from '../../../helpers/data-validation.helper.js'
import { FormHelper} from '../../../helpers/form.helper.js'
import { NotificationService } from "../../../services/notification.service.js";
import { EmployeeService } from '../../../services/employee.service.js';
import { DepartmentService } from '../../../services/department.service.js';

window.bodyLoaded = bodyLoaded;
window.validateEmail = validateEmail;
window.validateName = validateName;
window.validateFamilyName = validateFamilyName;
window.validatePassword = validatePassword;
window.validateDepartment = validateDepartment;
window.addEmployee = addEmployee;

const employeeService = new EmployeeService();
const hashHelper = new HashHelper();
const dataValidationHelper = new DataValidationHelper();
const formHelper = new FormHelper();
const notificationService = new NotificationService();
const departmentService = new DepartmentService();

function bodyLoaded() {
    // we don't await these async functions so they can be executed parallelly
    setDepartments();
}

async function setDepartments() {
    await departmentService.getDepartments()
        .then(departments => {
            const departmentsDropdownElement = document.getElementById('department');
            departments.forEach(department => {
                const optionHtml = `<option value='${department.id}'>${department.name}</option>`;
                departmentsDropdownElement.insertAdjacentHTML('beforeEnd', optionHtml);
            });
        });
}

async function addEmployee() {
    formHelper.clearFormErrors();
    
    const isFormValid = await validateForm();
    if (!isFormValid) {
        return;
    }
    
    const employeeData = await getEmployeeData();
    employeeService.addEmployee(employeeData)
        .then(isAdded => {
            isAdded ? 
                notificationService.success('Employee was added') :
                notificationService.error('Error adding employee');
        });
};

async function getEmployeeData() {
    return {
        email: document.getElementById('email').value,
        name: document.getElementById('name').value,
        familyName: document.getElementById('family-name').value,
        passwordHash: await hashHelper.getSHA256Hash(document.getElementById('password').value),
        departmentId: document.getElementById('department').value,
        isAdmin: document.getElementById('is-admin').checked
    };
}

async function validateForm() {
    const isEmailValid = await validateEmail();
    const isNameValid = validateName();
    const isFamilyNameValid = validateFamilyName();
    const isPasswordValid = validatePassword();
    const isDepartmentValid = validateDepartment();

    return isEmailValid && isNameValid && isFamilyNameValid && isPasswordValid && isDepartmentValid;
}

async function validateEmail() {
    const emailInput = document.getElementById('email');

    return formHelper.isInputValueValid(
        emailInput, 
        dataValidationHelper.notNullOrEmpty, 
        'Email is required'
    )
    &&
    formHelper.isInputValueValid(
        emailInput, 
        dataValidationHelper.isEmailValid, 
        'Invalid email'
    )
    &&
    (await formHelper.isInputValueValidAsync(
        emailInput, 
        isEmailNotUsed, 
        'User with this email already exists'
    ));
}

function validateName() {
    const nameInput = document.getElementById('name');

    return formHelper.isInputValueValid(
        nameInput, 
        dataValidationHelper.notNullOrEmpty, 
        'Name is required'
    )
    &&
    formHelper.isInputValueValid(
        nameInput, 
        dataValidationHelper.isNameValid, 
        'Name must be maximum 50 characters'
    );
}

function validateFamilyName() {
    const familyNameInput = document.getElementById('family-name');

    return formHelper.isInputValueValid(
        familyNameInput, 
        dataValidationHelper.notNullOrEmpty, 
        'Family name is required'
    )
    &&
    formHelper.isInputValueValid(
        familyNameInput, 
        dataValidationHelper.isNameValid, 
        'Family name must be maximum 50 characters'
    );
}

function validatePassword() {
    const passwordInput = document.getElementById('password');

    return formHelper.isInputValueValid(
        passwordInput, 
        dataValidationHelper.notNullOrEmpty, 
        'Password is required'
    )
    &&
    formHelper.isInputValueValid(
        passwordInput, 
        dataValidationHelper.isPasswordValid, 
        'Password must be between 5 and 50 characters, and can contain uppercase letters, lowercase letters, and numbers'
    );
}

function validateDepartment() {
    const departmentInput = document.getElementById('department');

    return formHelper.isInputValueValid(
        departmentInput, 
        dataValidationHelper.notNullOrEmpty, 
        'Department is required'
    );
}

async function isEmailNotUsed(email) {
    return !(await employeeService.emailExists(email));
}