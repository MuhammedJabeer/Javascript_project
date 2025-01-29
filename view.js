
    const API_BASE_URL = "http://localhost:3000/employees"; 

    // Function to fetch query parameter
    function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }

   

    // Function to fetch and display employee details
    async function fetchAndDisplayEmployeeDetails() {
      const employeeId = getQueryParam("employeeId"); // Get employeeId from URL
      if (!employeeId) {
        document.getElementById("employeeconatiner").innerHTML = "Invalid Employee ID.";
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/${employeeId}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const employee = await response.json();

        renderEmployeeDetails(employee);
      } catch (error) {
        console.error("Error fetching employee details:", error);
        document.getElementById("employeeconatiner").innerHTML = "Failed to load employee details.";
      }
    }

    // Function to render employee details
    function renderEmployeeDetails(employee) {
      const profile = `
        <div id="md" class="Medium_Profile">
    <div class="background">
       <img src="image/Background Image.png" alt="background">
    </div>
    <div class="avatar">
       <img class="photo" src="" alt="avatar">
    </div>
    <div class="name">
       <h2 id="name">${employee.salutation} ${employee.firstName} ${employee.lastName}</h2>
       <p id="mail">${employee.email}</p>
    </div>
    <div class="group">
       <div class="group1">
       <div class="gender">
           <p>Gender</p>
           <h6 id="gender">${employee.gender}</h6>
    </div>
    <div class="age">
       <p>Age</p>
       <h6 id="age">${calculateAge('01-12-2003')}</h6>
    </div>
    <div class="dob">
       <p>Date of Birth</p>
       <h6 id="dob">${employee.dob}</h6>
    </div>
       </div>
<div class="group2">
   <div class="phone">
       <p>Phone</p>
       <h6 id="phone">${employee.phone}</h6>
   </div>
       <div class="qualification">
           <p>Qualification</p>
           <h6 id="Qulification">${employee.qualifications}</h6>
       </div>
   </div>

<div class="group3">
<div class="address">
   <p>Address</p>
   <h6 id="address">${employee.address}</h6>
   </div>
   <div class="username">
       <p>Username</p>
       <h6 id="username">${employee.username}</h6>
   </div>
</div>
<div class="footer">
   <button class="delete" id="delete"  onclick="deleteEmployee('${employee.id}')">Delete</button>
   <button class="edited" onclick="editEmployee('${employee.id}')">Edit Details</button>
</div>

   </div>`;

      document.getElementById("employeeconatiner").innerHTML = profile;
      
    }
    function calculateAge(dob) {
      if (!dob) return "Not Available";
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }

 async  function deleteEmployee(employeeId){
        try{
            const response= await fetch(`${API_BASE_URL}/${employeeId}`, {
               method: "DELETE",
               headers: { "Content-Type": "application/json" },
           });
             if(response.ok){
               console.log("deleted succeccfully");
               document.getElementById("error").innerHTML = "Deleted successfully.";
               
             }else{
                   alert("error");
             }
        }catch(error){
           console.error(error);
        }
    }

   

   function editEmployee() {

      alert("go back to dashboard edit the employee");
      const urlParams = new URLSearchParams(window.location.search);
      const employeeId = urlParams.get('employeeId');
    
      window.location.href = `index.html?employeeId=${employeeId}`;
      console.log(employeeId);
  }



 
  

    fetchAndDisplayEmployeeDetails();
