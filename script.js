const API_BASE_URL = "http://localhost:3000/employees";

let isEditing = false;
let editingEmployeeId = null;
let deleteEmployeeId = null;

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
        renderPagination(data); 
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
}

function renderTable(data) {
    const tableBody = document.querySelector("#tabelcreat tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    data.forEach((employee, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td><img src="${employee.avatar}" alt="avatar" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%"> ${employee.salutation} ${employee.firstName} ${employee.lastName} </td>
            <td>${employee.email}</td>
            <td>${employee.phone}</td>
            <td>${employee.dob}</td>
            <td>${employee.gender}</td>
            <td>${employee.country}</td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-secondar" type="button" data-bs-toggle="dropdown">
                        <span class="colo">...</span>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="index1.html?employeeId=${employee.id}" onclick="viewDetails('${employee.id}')">View Details</a></li>
                        <li><a class="dropdown-item" href="#" onclick="editEmployee('${employee.id}')">Edit</a></li>
                        <li><a class="dropdown-item" href="#" onclick="deleteEmployee('${employee.id}')">Delete</a></li>
                    </ul>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

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
            response = await fetch(`${API_BASE_URL}/${editingEmployeeId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
        } else {
            response = await fetch(API_BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
        }

        if (!response.ok) {
            throw new Error(`Failed to ${isEditing ? "update" : "add"} employee.`);
            
        }

        console.log(`Employee ${isEditing ? "updated" : "added"} successfully!`);
        fetchEmployees();
        closeForm();
    } catch (error) {
        console.error(`Error ${isEditing ? "updating" : "adding"} employee:`, error);
        alert(`There was an error ${isEditing ? "updating" : "adding"} the employee. Please try again.`);
    }
};

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

// Delete function

function openModal() {
    document.getElementById("modals").style.display = "block";
}

function closeModal() {
    deleteEmployeeId = null;
    document.getElementById("modals").style.display = "none";
}

async function deleteEmployee(employeeId) {
    console.log("Preparing to delete employee with ID:", employeeId);
    deleteEmployeeId = employeeId;
    openModal(); 
}

document.getElementById("delete").onclick = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/${deleteEmployeeId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            console.log(`Employee with ID ${deleteEmployeeId} deleted successfully.`);
            alert("Employee deleted successfully.");
            fetchEmployees();
        } else {
            alert("Failed to delete employee. Please try again.");
        }
    } catch (error) {
        console.error("Error during delete operation:", error);
        alert("An error occurred while deleting the employee. Please try again.");
    } finally {
        closeModal();
    }
};


/////-search-////


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



// Pagination

let rowsPerPage = 5; // Default rows per page
const rowButton = document.getElementById("row");
const dropdownItems = document.querySelectorAll(".dropdown-item");

dropdownItems.forEach(item => {
    item.addEventListener("click", function (e) {
        e.preventDefault();
        rowsPerPage = parseInt(this.textContent, 10);
        rowButton.textContent = this.textContent; 
        renderPagination(data); 
    });
});

function renderPagination(data) {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";
    const totalPages = Math.ceil(data.length / rowsPerPage);

    if (totalPages === 0) return; 

    let paginationHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<li class="page-item">
            <a href="#" class="page-link ${i === 1 ? "active" : ""}" data-page="${i}">${i}</a>
        </li>`;
    }
    pagination.innerHTML = paginationHTML;

   
    renderTable(data.slice(0, rowsPerPage));

    pagination.addEventListener("click", (e) => {
        if (e.target.classList.contains("page-link")) {
            e.preventDefault();
            document.querySelectorAll(".page-link").forEach(link => link.classList.remove("active"));
            e.target.classList.add("active");

            const pageNumber = parseInt(e.target.getAttribute("data-page"), 10);
            renderTable(data.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage));
        }
    });
    document.getElementById(display).innerHTML="20";
}

async function uploadimage(e,employeeId) {
    e.preventDefault();
    const fileinput=document.getElementById("input_img");
    const file=fileinput.file[0];
    if(!file){
        alert("please upload a file");
        return;
    }
    const formData=new formData();
    formData.append(file);
    try{
        const response=await fetch(`${API_BASE_URL}/${employeeId}/avatars`,{
             method:"POST",
             headers:{
                "content-type":"application/json"
             },
             body:formData
        })
        const data=response.json();
        console.log("upload success fully",data);
    }catch{
        console.error(error);
        alert("fail to fetch file"); 
    }
    document.getElementById("submit").addEventListener("click",uploadimage);
}