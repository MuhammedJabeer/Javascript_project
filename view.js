
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
       <h6 id="age">${calculateAge(dob)}</h6>
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

//  async  function deleteEmployee(employeeId){
//         try{
//             const response= await fetch(`${API_BASE_URL}/${employeeId}`, {
//                method: "DELETE",
//                headers: { "Content-Type": "application/json" },
//            });
//              if(response.ok){
//               localStorage.setItem('del','Are you sure you want to do this?')
//                console.log("deleted succeccfully");
//                document.getElementById("error").innerHTML = "Deleted successfully.";
               
//              }else{
//                    alert("error");
//              }
//         }catch(error){
//            console.error(error);
//         }
//     }

//    if(localStorage.getItem('del')){
//       swal("Are you sure you want to do this?", {
//          buttons: ["Oh noez!", "Aww yiss!"],
//        });
       
//    }


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



function editEmployee() {
   const urlParams = new URLSearchParams(window.location.search);
   const employeeId = urlParams.get('employeeId');

   if (!employeeId) {
       alert("No Employee ID found!");
       return;
   }


   console.log("Editing Employee ID:", employeeId);

   // Redirect to index.html with employeeId as a query param
   window.location.href = `index.html?employeeId=${employeeId}`;
}




 
  

    fetchAndDisplayEmployeeDetails();
