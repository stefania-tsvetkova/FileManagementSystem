export class FormHelper {
    clearFormErrors() {
        let errors = document.querySelectorAll('[id*="-error"]');
        errors.forEach(error => {
            error.textContent = '';
        });
    }
    
    isInputValueValid(input, isValidFunction, errorMessage) {
        if (!isValidFunction(input.value)) {
            this.displayError(input.id, errorMessage);
            return false;
        }
    
        this.removeError(input.id);
        return true;
    }
    
    async isInputValueValidAsync(input, isValidFunction, errorMessage) {
        if (!(await isValidFunction(input.value))) {
            this.displayError(input.id, errorMessage);
            return false;
        }
    
        this.removeError(input.id);
        return true;
    }

    displayError(inputId, errorMessage) {
        const errorElement = document.getElementById(`${inputId}-error`);
        errorElement.textContent = errorMessage;
    }

    removeError(inputId) {
        const errorElement = document.getElementById(`${inputId}-error`);
        errorElement.textContent = '';
    }
}