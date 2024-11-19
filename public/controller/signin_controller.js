import { createNewUser } from "./firebase_auth.js";

export async function onClickCreateUser(e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the modal element
    const createUserModal = document.getElementById('createUserModal');

    // Initialize the modal
    const modal = new bootstrap.Modal(createUserModal);

    // Show the modal
    modal.show();

    // Attach submit event listener to the form inside the modal
    const form = createUserModal.querySelector('form');
    form.onsubmit = async (event) => {
        event.preventDefault();

        const email = form.querySelector('#new-user-email').value;
        const password = form.querySelector('#new-user-password').value;

        try {
            await createNewUser(email, password);
            alert('User account created successfully!');
            modal.hide();
        } catch (error) {
            alert('Error creating user: ' + error.message);
        }
    };
};
