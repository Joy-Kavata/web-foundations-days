const loadBtn = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const statusP = document.getElementById("status");
const usersList = document.getElementById("users-list");

let allUsers = [];

function renderUsers(usersToDisplay) {
    usersList.innerHTML = "";

    if (usersToDisplay.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No users match your filter.";
        li.style.fontStyle = "italic";
        li.style.color = "#666";
        usersList.appendChild(li);
        return;
    }

    usersToDisplay.forEach(user => {
        const li = document.createElement("li");
        li.className = "user-card";
        li.style.border = "1px solid #ccc";
        li.style.padding = "1rem";
        li.style.marginBottom = "0.75rem";
        li.style.borderRadius = "4px";

        const nameH3 = document.createElement("h3");
        nameH3.textContent = user.name;
        nameH3.style.margin = "0 0 0.5rem 0";

        const emailP = document.createElement("p");
        emailP.textContent = `Email: ${user.email}`;
        emailP.style.margin = "0 0 0.25rem 0";

        const cityP = document.createElement("p");
        cityP.textContent = `City: ${user.address.city}`;
        cityP.style.margin = "0 0 0.25rem 0";

        const companyP = document.createElement("p");
        companyP.textContent = `Company: ${user.company.name}`;
        companyP.style.margin = "0";

        li.appendChild(nameH3);
        li.appendChild(emailP);
        li.appendChild(cityP);
        li.appendChild(companyP);

        usersList.appendChild(li);
    });
}

async function loadUsers() {
    loadBtn.disabled = true;
    statusP.textContent = "Loading users...";
    usersList.innerHTML = "";

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        
        if (!response.ok) {
            throw new Error(`Failed to load users (Status: ${response.status})`);
        }

        allUsers = await response.json();
        statusP.textContent = `Successfully loaded ${allUsers.length} users.`;
        renderUsers(allUsers);
    } catch (error) {
        statusP.textContent = `Error: ${error.message}`;
    } finally {
        loadBtn.disabled = false;
    }
}

loadBtn.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
    const searchTerm = filterInput.value.trim().toLowerCase();
    const filtered = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm)
    );
    renderUsers(filtered);
});