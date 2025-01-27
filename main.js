const API_BASE_URL = "http://localhost:3000/employees";

let isEditing = false; 
let editingEmployeeId = null; 


function openForm() {
    isEditing = false;
    editingEmployeeId = null; 
    document.getElementById("employeeForm").reset(); 
    document.getElementById("formContainer").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm() {
    isEditing = false; 
    editingEmployeeId = null; 
    document.getElementById("formContainer").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}


async function fetchEmployees() {
    try {
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
}

function renderTable(data) {
    const tableBody = document.querySelector("#tabelcreat tbody");
    // tableBody.innerHTML = ""; 
    data.forEach((employee, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${employee.salutation} ${employee.firstName} ${employee.lastName}</td>
            <td>${employee.email}</td>
            <td>${employee.phone}</td>
            <td>${employee.dob}</td>
            <td>${employee.gender}</td>
            <td>${employee.qualifications}</td>
            <td>${employee.address}</td>
            <td>${employee.city}</td>
            <td>${employee.state}</td>
            <td>${employee.country}</td>
            <td>${employee.username}</td>
            <td>${employee.password}</td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-secondary" type="button" data-bs-toggle="dropdown">
                        <span class="colo">...</span>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="index1.html" onclick="viewDetails('${employee.id}')">View Details</a></li>
                        <li><a class="dropdown-item" href="#" onclick="editEmployee('${employee.id}')">Edit</a></li>
                        <li><a class="dropdown-item" href="#" onclick="deleteEmployee('${employee.id}')">Delete</a></li>
                    </ul>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

//////-edit-/////
async function editEmployee(employeeId) {
    console.log("Editing employee with ID:", employeeId);

    try {
        const response = await fetch(`${API_BASE_URL}/${employeeId}`);
        if (!response.ok) throw new Error("Failed to fetch employee data.");

        const employee = await response.json();
        console.log("Employee data fetched:", employee);

        populateForm(employee, employeeId);
    } catch (error) {
        console.error("Error fetching employee details:", error);
        alert("Failed to fetch employee details. Please try again.");
    }
}

function populateForm(employee, employeeId) {
    document.getElementById("inputSalutaion").value = employee.salutation || "";
    document.getElementById("input_fname").value = employee.firstName || "";
    document.getElementById("input_lname").value = employee.lastName || "";
    document.getElementById("inputEmail4").value = employee.email || "";
    document.getElementById("inputPassword4").value = employee.phone || "";
    document.getElementById("birthday").value = convertToDDMMYYYY(employee.dob) || "";
    if (employee.gender) {
        document.querySelector(`input[name="inlineRadioOptions"][value="${employee.gender}"]`).checked = true;
    }
    document.getElementById("inputqulification").value = employee.qualifications || "";
    document.getElementById("inputAddress").value = employee.address || "";
    document.getElementById("inputCity").value = employee.city || "";
    document.getElementById("inputState").value = employee.state || "";
    document.getElementById("inputCountry").value = employee.country || "";
    document.getElementById("inputusername").value = employee.username || "";
    document.getElementById("inputpassword").value = employee.password || "";

    
    isEditing = true;
    editingEmployeeId = employeeId;

    
    document.getElementById("formContainer").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}


document.getElementById("submit").onclick = async (e) => {
    e.preventDefault();

    const formData = getFormData();
    const errors = validateForm(formData);

    if (errors.length) {
        alert(errors.join("\n"));
        return;
    }

    try {
        let response;
        if (isEditing) {
           /////-put-/////
            console.log("Updating employee:", formData);
            response = await fetch(`${API_BASE_URL}/${editingEmployeeId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
        } else {
            ////-post////
            console.log(formData);
            response = await fetch(API_BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
        }

        if (!response.ok) {
            throw new Error(`Failed to ${isEditing ? "update" : "add"} employee.`);
        }

        alert(`Employee ${isEditing ? "updated" : "added"} successfully!`);
        fetchEmployees(); 
        closeForm();
    } catch (error) {
        console.error(`Error ${isEditing ? "updating" : "adding"} employee:`, error);
        alert(`There was an error ${isEditing ? "updating" : "adding"} the employee. Please try again.`);
    }
};

// Utility Functions
function getFormData() {
    return {
        salutation: document.getElementById("inputSalutaion").value,
        firstName: document.getElementById("input_fname").value,
        lastName: document.getElementById("input_lname").value,
        email: document.getElementById("inputEmail4").value,
        phone: document.getElementById("inputPassword4").value,
        dob: convertToDDMMYYYY(document.getElementById("birthday").value),
        gender: document.querySelector('input[name="inlineRadioOptions"]:checked')?.value,
        qualifications: document.getElementById("inputqulification").value,
        address: document.getElementById("inputAddress").value,
        city: document.getElementById("inputCity").value,
        state: document.getElementById("inputState").value,
        country: document.getElementById("inputCountry").value,
        username: document.getElementById("inputusername").value,
        password: document.getElementById("inputpassword").value,
    };
}

function validateForm(data) {
    const errors = [];
    if (!data.salutation) errors.push("Salutation is required.");
    if (!data.firstName) errors.push("First name is required.");
    if (!data.lastName) errors.push("Last name is required.");
    if (!validateEmail(data.email)) errors.push("Invalid email.");
    if (!validatePhone(data.phone)) errors.push("Invalid phone number.");
    if (!data.dob) errors.push("Date of birth is required.");
    if (!data.gender) errors.push("Gender is required.");
    if (!data.qualifications) errors.push("Qualifications are required.");
    if (!data.address) errors.push("Address is required.");
    if (!data.city) errors.push("City is required.");
    if (!data.state) errors.push("State is required.");
    if (!data.country) errors.push("Country is required.");
    if (!data.username) errors.push("Username is required.");
    if (!validatePassword(data.password)) errors.push("Password is invalid.");
    return errors;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
}

function validatePassword(password) {
    return password.length >= 8;
}

function convertToDDMMYYYY(date) {
    if (!date) return null;
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
}


fetchEmployees();




////-Delete-////

let deleteEmployeeId = null;



function openModal() {
    document.getElementById("modals").style.display = "block";
}

function closeModal() {
    deleteEmployeeId = null;
    document.getElementById("modals").style.display = "none";
}
async function deleteEmployee(employeeId) {
     console.log("Deleting employee with ID:", employeeId);
     try{
         const response=await fetch(`${API_BASE_URL}/${employeeId}`)
            if(!response.ok) throw new Error("Failed to fetch employee data.");
            const employee=await response.json();
            console.log("Employee data fetched:", employee);
            deleteEmployeeId=employeeId;
            openModal();
     }catch(error){
         console.error("Error fetching employee details:", error);
         alert("Failed to fetch employee details. Please try again.");
     }
}
document.getElementById("delete").onclick = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/${deleteEmployeeId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            console.log(`Employee with ID ${deleteEmployeeId} deleted successfully.`);
            alert("Employee deleted successfully.");
        } else {
            console.error(`Failed to delete employee. Status: ${response.status}`);
            alert(`Failed to delete employee. Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error during delete operation:", error);
        alert("An error occurred while deleting the employee. Please try again.");
    } finally {
        closeModal();
    }
}

////-View-////


// window.location.href = "index1.html"; 

async function viewDetails(employeeId) {
    console.log("Viewing employee with ID:", employeeId);
    
       try{
          const response=await fetch (`${API_BASE_URL}/${employeeId}`);
            if(!response.ok) throw new Error("Failed to fetch employee data.");
          const employee=await response.json();
            alert(employee);
          }catch(error){
           console.error("Error fetching employee details:", error);
           alert("Failed to fetch employee details. Please try again.");
         }

}


///-Search-///


function Search(){
    input=document.getElementById("search");
    filter=input.value.toUpperCase();
    table=document.getElementById("tabelcreat");
    tr=table.getElementsByTagName("tr");
    for(var i=0;i<tr.length;i++){
        var td=tr[i].getElementsByTagName("td")[0];
        if(td){
            textvalue=td.textContent || td.innerText;
            if(textvalue.toUpperCase().indexOf(filter)>-1){
                tr[i].style.display="";
            }else{
                tr[i].style.display="none";
            }
        }
    }
}
/////---Pagination---////



