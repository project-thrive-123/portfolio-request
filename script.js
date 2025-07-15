document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('portfolioForm');
    const submitBtn = document.getElementById('submitBtn');

    // Form fields
    const fullName = document.getElementById('fullName');
    const phoneNumber = document.getElementById('phoneNumber');
    const email = document.getElementById('email');
    const orderId = document.getElementById('orderId');
    const transactionId = document.getElementById('transactionId');

    // Error elements
    const fullNameError = document.getElementById('fullNameError');
    const phoneNumberError = document.getElementById('phoneNumberError');
    const emailError = document.getElementById('emailError');
    const orderIdError = document.getElementById('orderIdError');
    const transactionIdError = document.getElementById('transactionIdError');

    // Track if form has been submitted
    let formSubmitted = false;

    // Focus the first field on page load
    setTimeout(() => {
        fullName.focus();
    }, 500);

    // Full name formatting - only allow letters and spaces
    fullName.addEventListener('input', function (e) {
        // Replace any non-letter and non-space characters
        this.value = this.value.replace(/[^a-zA-Z\s]/g, '');

        // Only validate after first submission attempt
        if (formSubmitted) {
            validateFullName();
        }
    });

    // Phone number formatting
    phoneNumber.addEventListener('input', function (e) {
        // Remove any non-digit characters
        this.value = this.value.replace(/\D/g, '');

        // Limit to 11 digits
        if (this.value.length > 11) {
            this.value = this.value.slice(0, 11);
        }

        // Only validate after first submission attempt
        if (formSubmitted) {
            validatePhoneNumber();
        }
    });

    // Add event listeners for real-time validation AFTER first submission
    email.addEventListener('input', function () {
        if (formSubmitted) {
            validateEmail();
        }
    });

    orderId.addEventListener('input', function () {
        if (formSubmitted) {
            validateOrderId();
        }
    });

    // Add keypress event to submit form on Enter key
    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && document.activeElement.tagName !== 'TEXTAREA') {
            const focusedElement = document.activeElement;
            const formElements = Array.from(form.elements);
            const currentIndex = formElements.indexOf(focusedElement);

            if (currentIndex !== -1 && currentIndex < formElements.length - 1) {
                e.preventDefault();
                formElements[currentIndex + 1].focus();
            } else if (currentIndex === formElements.length - 1) {
                e.preventDefault();
                submitBtn.click();
            }
        }
    });

    // Form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Set form as submitted to enable real-time validation going forward
        formSubmitted = true;

        // Validate all fields before submission
        const isFullNameValid = validateFullName();
        const isPhoneNumberValid = validatePhoneNumber();
        const isEmailValid = validateEmail();
        const isOrderIdValid = validateOrderId();

        if (isFullNameValid && isPhoneNumberValid && isEmailValid && isOrderIdValid) {
            submitForm();
        } else {
            // Focus the first invalid field
            if (!isFullNameValid) fullName.focus();
            else if (!isPhoneNumberValid) phoneNumber.focus();
            else if (!isEmailValid) email.focus();
            else if (!isOrderIdValid) orderId.focus();
        }
    });

    // Validation functions
    function validateFullName() {
        const value = fullName.value.trim();

        if (value === '') {
            showError(fullName, fullNameError, 'Full name is required');
            return false;
        }

        if (value.length < 3) {
            showError(fullName, fullNameError, 'Full name must be at least 3 characters');
            return false;
        }

        // Check if name contains only letters and spaces
        if (!/^[a-zA-Z\s]+$/.test(value)) {
            showError(fullName, fullNameError, 'Full name can only contain letters and spaces');
            return false;
        }

        hideError(fullName, fullNameError);
        return true;
    }

    function validatePhoneNumber() {
        const value = phoneNumber.value.trim();
        const phoneRegex = /^[0-9]{11}$/;

        if (value === '') {
            showError(phoneNumber, phoneNumberError, 'Phone number is required');
            return false;
        }

        if (!phoneRegex.test(value)) {
            showError(phoneNumber, phoneNumberError, 'Phone number must be exactly 11 digits');
            return false;
        }

        hideError(phoneNumber, phoneNumberError);
        return true;
    }

    function validateEmail() {
        const value = email.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (value === '') {
            showError(email, emailError, 'Email address is required');
            return false;
        }

        if (!emailRegex.test(value)) {
            showError(email, emailError, 'Please enter a valid email address');
            return false;
        }

        hideError(email, emailError);
        return true;
    }

    function validateOrderId() {
        const value = orderId.value.trim();

        if (value === '') {
            showError(orderId, orderIdError, 'Order ID is required');
            return false;
        }

        hideError(orderId, orderIdError);
        return true;
    }

    // Helper functions
    function showError(inputElement, errorElement, message) {
        inputElement.classList.add('error');
        errorElement.textContent = message;
    }

    function hideError(inputElement, errorElement) {
        inputElement.classList.remove('error');
        errorElement.textContent = '';
    }

    // Form submission function
    function submitForm() {
        // Disable the submit button to prevent multiple submissions
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Prepare form data
        const formData = {
            fullName: fullName.value.trim(),
            phoneNumber: phoneNumber.value.trim(),
            email: email.value.trim(),
            orderId: orderId.value.trim(),
            transactionId: transactionId.value.trim()
        };

        // Sample API endpoint (replace with actual endpoint later)
        const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

        // Send the form data to the API
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Success handling
                showSuccessMessage('Form submitted successfully! We will review your request and get back to you soon.');
                form.reset();
                // Reset form submitted state
                formSubmitted = false;
            })
            .catch(error => {
                // Error handling
                console.error('Error submitting form:', error);
                alert('There was an error submitting your form. Please try again.');
            })
            .finally(() => {
                // Re-enable the submit button
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Request';
                }, 1000);
            });
    }

    // Success message function
    function showSuccessMessage(message) {
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;

        // Insert after form
        form.parentNode.insertBefore(successDiv, form.nextSibling);

        // Hide form
        form.style.display = 'none';

        // Add success message styles
        const style = document.createElement('style');
        style.textContent = `
            .success-message {
                background-color: #e7f9f4;
                color: #00a67d;
                padding: 20px;
                border-radius: 8px;
                margin-top: 20px;
                text-align: center;
                font-weight: 500;
                animation: fadeIn 0.5s ease-in-out;
                border-left: 4px solid #00a67d;
            }
        `;
        document.head.appendChild(style);
    }

    // Clear all error messages initially
    [fullNameError, phoneNumberError, emailError, orderIdError, transactionIdError].forEach(error => {
        error.textContent = '';
    });
}); 