import { HashHelper } from '../../../helpers/hash.helper.js';
import { DataValidationHelper} from '../../../helpers/data-validation.helper.js'
import { FormHelper} from '../../../helpers/form.helper.js'
import { NotificationService } from "../../../services/notification.service.js";
import { EmployeeService } from '../../../services/employee.service.js';
import { DepartmentService } from '../../../services/department.service.js';

window.addEmployee = addEmployee;
window.bodyLoaded = bodyLoaded;

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
    
    const data = getFormData();

    const isFormValid = await validateForm(data);
    if (!isFormValid) {
        return;
    }
    
    const employeeData = await getEmployeeData(data);
    employeeService.addEmployee(employeeData)
        .then(isAdded => {
            isAdded ? 
                notificationService.success('Employee was added') :
                notificationService.error('Error adding employee');
        });
};

async function getEmployeeData(data) {
    return {
        email: data.email.value,
        name: data.name.value,
        familyName: data.familyName.value,
        passwordHash: await hashHelper.getSHA256Hash(data.password.value),
        departmentId: data.department.value,
        isAdmin: data.isAdmin.checked
    };
}

function getFormData() {
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('name');
    const familyNameInput = document.getElementById('family-name');
    const passwordInput = document.getElementById('password');
    const departmentInput = document.getElementById('department');
    const isAdminInput = document.getElementById('is-admin');

    return {
        email: emailInput,
        name: nameInput,
        familyName: familyNameInput,
        password: passwordInput,
        department: departmentInput,
        isAdmin: isAdminInput
    };
}

async function validateForm(data) {
    let isFormValid = true;

    isFormValid &= 
        formHelper.isInputValueValid(
            data.email, 
            dataValidationHelper.notNullOrEmpty, 
            'Email is required'
        )
        &&
        formHelper.isInputValueValid(
            data.email, 
            dataValidationHelper.isEmailValid, 
            'Invalid email'
        )
        &&
        (await formHelper.isInputValueValidAsync(
            data.email, 
            isEmailNotUsed, 
            'Employee with this email already exists'
        ));

    isFormValid &= 
        formHelper.isInputValueValid(
            data.name, 
            dataValidationHelper.notNullOrEmpty, 
            'Name is required'
        )
        &&
        formHelper.isInputValueValid(
            data.name, 
            dataValidationHelper.isNameValid, 
            'Name must be maximum 50 characters'
        );

    isFormValid &= 
        formHelper.isInputValueValid(
            data.familyName, 
            dataValidationHelper.notNullOrEmpty, 
            'Family name is required'
        )
        &&
        formHelper.isInputValueValid(
            data.familyName, 
            dataValidationHelper.isNameValid, 
            'Family name must be maximum 50 characters'
        );

    isFormValid &= 
        formHelper.isInputValueValid(
            data.password, 
            dataValidationHelper.notNullOrEmpty, 
            'Password is required'
        )
        &&
        formHelper.isInputValueValid(
            data.password, 
            dataValidationHelper.isPasswordValid, 
            'Password must be between 5 and 50 characters, and can contain uppercase letters, lowercase letters, and numbers'
        );

    

    isFormValid &= 
        formHelper.isInputValueValid(
            data.department, 
            dataValidationHelper.notNullOrEmpty, 
            'Department is required'
        );

    return isFormValid;
}

async function isEmailNotUsed(email) {
    return !(await employeeService.emailExists(email));
}