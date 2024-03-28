// Function to retrieve users from local storage
function fetchUsersFromLocalStorage() {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
}

// Function to update local storage with users
function updateLocalStorage(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Function to display users
function displayUsers(users) {
    const userListDiv = document.querySelector('#usersList');
    userListDiv.innerHTML = ''; // Clear existing content
    users.forEach((user) => {
        const userDiv = document.createElement('div');
        userDiv.innerHTML = `${user.name} <button class="delete-btn" data-id="${user.id}">Delete</button>`;
        userListDiv.appendChild(userDiv);
    });
}

// Fetch users from local storage and display
document.addEventListener('DOMContentLoaded', () => {
    const users = fetchUsersFromLocalStorage();
    displayUsers(users);
});

// Event listener for form submission to add user
document.querySelector('#addUserForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const userNameInput = document.querySelector('#userName');
    const userName = userNameInput.value.trim();
    if (userName) {
        const users = fetchUsersFromLocalStorage();
        const existingUser = users.find(user => user.name.toLowerCase() === userName.toLowerCase());
        if (existingUser) {
            alert('User with the same name already exists.');
        } else {
            const newUser = { id: Date.now(), name: userName };
            users.push(newUser);
            updateLocalStorage(users);
            displayUsers(users);
            userNameInput.value = '';
        }
    } else {
        alert('Please enter a valid username.');
    }
});

// Event delegation for delete button
document.querySelector('#usersList').addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const userId = parseInt(event.target.dataset.id);
        let users = fetchUsersFromLocalStorage();
        users = users.filter(user => user.id !== userId);
        updateLocalStorage(users);
        displayUsers(users);
    }
});

// Function to clear all users from the list and local storage
function clearAllUsers() {
    const userListDiv = document.querySelector('#usersList');
    userListDiv.innerHTML = ''; // Clear displayed list on the site
    localStorage.removeItem('users'); // Clear user data from local storage
}

// Event listener for clearing all users
document.querySelector('#clearAllUsersBtn').addEventListener('click', () => {
    clearAllUsers();
});


// Function to filter users based on search query
function filterUsers(users, query) {
    return users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
}

// Event listener for search input
document.querySelector('#searchUserInput').addEventListener('input', (event) => {
    const searchQuery = event.target.value.trim();
    const users = fetchUsersFromLocalStorage();
    const filteredUsers = filterUsers(users, searchQuery);

    if (filteredUsers.length > 0) {
        displayUsers(filteredUsers);
    } else {
        // If no users found, display a message or handle accordingly
        const userListDiv = document.querySelector('#usersList');
        userListDiv.innerHTML = 'No users found.';
    }
});


// Global variables for pagination
let currentPageIndex = 0;
const usersPerPage = 5;

// Function to display users for a specific page
function displayUsersForPage(users, page) {
    const startIndex = page * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const paginatedUsers = users.slice(startIndex, endIndex);
    displayUsers(paginatedUsers);
}

// Function to update pagination controls
function updatePaginationControls(users) {
    const numPages = Math.ceil(users.length / usersPerPage);
    const currentPageSpan = document.querySelector('#currentPage');
    currentPageSpan.textContent = `Page ${currentPageIndex + 1}`;

    const prevPageBtn = document.querySelector('#prevPageBtn');
    prevPageBtn.disabled = currentPageIndex === 0;

    const nextPageBtn = document.querySelector('#nextPageBtn');
    nextPageBtn.disabled = currentPageIndex === numPages - 1;
}

// Event listener for previous page button
document.querySelector('#prevPageBtn').addEventListener('click', () => {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        const users = fetchUsersFromLocalStorage();
        displayUsersForPage(users, currentPageIndex);
        updatePaginationControls(users);
    }
});

// Event listener for next page button
document.querySelector('#nextPageBtn').addEventListener('click', () => {
    const users = fetchUsersFromLocalStorage();
    const numPages = Math.ceil(users.length / usersPerPage);
    if (currentPageIndex < numPages - 1) {
        currentPageIndex++;
        displayUsersForPage(users, currentPageIndex);
        updatePaginationControls(users);
    }
});

// Function to initialize pagination
function initializePagination(users) {
    currentPageIndex = 0;
    displayUsersForPage(users, currentPageIndex);
    updatePaginationControls(users);
}

// Fetch users from local storage and initialize pagination
document.addEventListener('DOMContentLoaded', () => {
    const users = fetchUsersFromLocalStorage();
    initializePagination(users);
});



/* As we are fecthing data from local storage and not from backend API, we do not need this function
  fetchUsers((users) => {
    const users = fetchUsersFromLocalStorage();
    displayUsers(users);
  });
*/



