

const API_BASE_URL = "http://localhost:3000/employees";

let isEditing = false;
let editingEmployeeId = null;
let deleteEmployeeId = null;

function openForm() {
    isEditing = false;
    editingEmployeeId = null;
    document.getElementById("employeeForm").reset();
    // document.getElementById("uploadimage").reset();
    document.getElementById("formContainer").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeForm() {
    isEditing = false;
    editingEmployeeId = null;
    document.getElementById("formContainer").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

let employeesData = []; // Store fetched data globally
let rowsPerPage = 5; // Default rows per page

document.addEventListener("DOMContentLoaded", async () => {
    await fetchEmployees();
});

async function fetchEmployees() {
    try {
        const response = await fetch(API_BASE_URL);
        employeesData = await response.json(); // Store in global variable
        renderPagination();
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
}

function renderPagination() {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";
    const totalPages = Math.ceil(employeesData.length / rowsPerPage);
    if (totalPages === 0) return;

    let paginationHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<li class="page-item">
            <a href="#" class="page-link ${i === 1 ? "active" : ""}" data-page="${i}">${i}</a>
        </li>`;
    }
    pagination.innerHTML = paginationHTML;
    document.getElementById("display").innerHTML=Math.ceil(employeesData.length/rowsPerPage);
    // Automatically load the first page
    renderTable(1);

    // Add event listeners to pagination links
    document.querySelectorAll(".page-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelectorAll(".page-link").forEach(link => link.classList.remove("active"));
            e.target.classList.add("active");

            const pageNumber = parseInt(e.target.getAttribute("data-page"), 10);
            renderTable(pageNumber);
        });
    });
}

function renderTable(pageNumber) {
    const tableBody = document.querySelector("#tabelcreat tbody");
    tableBody.innerHTML = "";

    const start = (pageNumber - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = employeesData.slice(start, end);

    pageData.forEach((employee, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <th scope="row">${start + index + 1}</th>
          <td><img src="${employee.avatarUrl || 'image/OIP (1).png'}" alt="avatar" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%"> ${employee.salutation} ${employee.firstName} ${employee.lastName}</td>
            <td>${employee.email}</td>
            <td>${employee.phone}</td>
            <td>${employee.dob}</td>
            <td>${employee.gender}</td>
            <td>${employee.country}</td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-secondary" type="button" data-bs-toggle="dropdown">
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

// Handle rows per page change
document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", function (e) {
        e.preventDefault();
        rowsPerPage = parseInt(this.textContent, 10);
        document.getElementById("row").textContent = this.textContent;
        renderPagination(); // Re-render pagination with new rows per page
    });
});
 

//////-edit-/////

async function editEmployee(employeeId) {
    console.log("Editing employee with ID:", employeeId);
    try {
        const response = await fetch(`${API_BASE_URL}/${employeeId}`);
        if (!response.ok) throw new Error("Failed to fetch employee data.");
        const employee = await response.json();
        console.log("Employee data fetched:", employee);
        document.getElementById("read").innerHTML="Edit Employee";
        document.getElementById("submit").innerHTML="Save Changes";
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
    

    if (Object.keys(errors).length > 0) {
        displayErrors(errors); // Show validation errors in form
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
            // imagefetch(employeeId);
        } else {
            response = await fetch(API_BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            // imagefetch(employeeId);
            const newEmployee = await response.json();
            imagefetch(newEmployee.id);
        }
        
        if (!response.ok) {
            throw new Error(`Failed to ${isEditing ? "update" : "add"} employee.`);
            
        }
        // setTimeout(()=>{
        // Swal.fire({
        //     icon: 'success',
        //     title: isEditing ? 'Employee updated successfully!' : 'Employee added successfully!',
        //     text: 'The employee has been successfully saved.',
        //     confirmButtonText: 'OK',
        //     timer:null,
        // });
    if(isEditing){
        localStorage.setItem('notification',  'updated');
    }
    else{
        localStorage.setItem('notification',  'added');
    }

        console.log(`Employee ${isEditing ? "updated" : "added"} successfully! ${employeeId}`);
        fetchEmployees();
        closeForm();
       
    } catch (error) {
        console.error(`Error ${isEditing ? "updating" : "adding"} employee:`, error);
        alert(`There was an error ${isEditing ? "updating" : "adding"} the employee. Please try again.`);
    }
};
if(localStorage.getItem('notification')){
    Swal.fire({
        icon: 'success',
        // title: isEditing ? 'Employee updated successfully!' : 'Employee added successfully!',
        title: `Employee ${localStorage.getItem('notification')} successfully`,
        text: 'The employee has been successfully saved.',
        confirmButtonText: 'OK',
        timer:null});
        localStorage.removeItem('notification')
}

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
    const errors = {};
    if (!data.salutation) errors.salutation = "Salutation is required.";
    if (!data.firstName) errors.firstName="First name is required.";
    if (!data.lastName) errors.lastName="Last name is required.";
    if (!validateEmail(data.email)) errors.email="Invalid email.";
    if (!validatePhone(data.phone)) errors.phone="Invalid phone number.";
    if (!data.dob) errors.dob="Date of birth is required.";
    if (!data.gender) errors.gender="Gender is required.";
    if (!data.qualifications) errors.qualifications="Qualifications are required.";
    if (!data.address) errors.address="Address is required.";
    if (!data.city) errors.city="City is required.";
    if (!data.state) errors.state="State is required.";
    if (!data.country) errors.country="Country is required.";
    if (!data.username) errors.username="Username is required.";
    if (!validatePassword(data.password)) errors.password="Password is invalid.";
    return errors;
}

function displayErrors(errors) {
    document.querySelectorAll(".error").forEach(el => el.textContent = "");

    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`${field}Error`);
        if (errorElement) {
            errorElement.textContent = errors[field];
        }
    });
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

async function deleteEmployee(employeeId) {
    try {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
        });
 
        if (result.isConfirmed) {
            const response = await fetch(`${API_BASE_URL}/${employeeId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
 
            if (response.ok) {
                console.log("Deleted successfully");
                document.getElementById("error").innerHTML = "Deleted successfully.";
                Swal.fire("Deleted!", "The employee record has been removed.", "success");
            } else {
                Swal.fire("Error", "Failed to delete employee.", "error");
            }
        } else {
            console.log("Deletion cancelled.");
        }
    } catch (error) {
        console.error(error);
        Swal.fire("Error", "An unexpected error occurred.", "error");
    }
 }
 

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




////-avatar--///



let profilepic=document.getElementById("uploadimage");
let inputfile=document.getElementById("input_img");

inputfile.onchange=()=>{
    profilepic.src=URL.createObjectURL(inputfile.files[0]);
}


async function imagefetch(employeeId) {
    console.log(employeeId);
    const inputfile = document.getElementById('input-img');
    if (inputfile.files.length > 0) {
        const formData = new FormData();
        formData.append("avatar", inputfile.files[0]);
        const response = await fetch(`http://localhost:3000/employees/${employeeId}/avatars`, {
            method: "POST",
            body: formData,
        });
        const image = await response.json();
        console.log(image);
    }
}




