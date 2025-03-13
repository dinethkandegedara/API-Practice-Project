// Get elements
const enableRadio = document.getElementById("enableCheckbox");
const disableRadio = document.getElementById("disableCheckbox");
const checkboxes = document.querySelectorAll(".myCheckbox");

// Function to enable all checkboxes
enableRadio.addEventListener("change", function () {
  checkboxes.forEach(checkbox => {
    checkbox.disabled = false;
  });
});

// Function to disable all checkboxes
disableRadio.addEventListener("change", function () {
  checkboxes.forEach(checkbox => {
    checkbox.disabled = true;
    checkbox.checked = false; // Uncheck all when disabled
  });
});


//joke type enter confirmation
document.getElementById("myForm").addEventListener("submit", function(event) {
const checkboxes = document.querySelectorAll(".joke-type");
let checkedCount = 0;

checkboxes.forEach(checkbox => {
if (checkbox.checked) {
    checkedCount++;
}
});

if (checkedCount === 0) {
alert("Please select at least one option for joke type.");
event.preventDefault(); // Stop form submission
}
});

//joke category enter confirmation

document.getElementById("myForm").addEventListener("submit", function(event) {
    const checkboxes = document.querySelectorAll(".myCheckbox");
    let checkedCount = 0;
    
    if (document.querySelector('input[name="any-category"]:checked')?.value === "yes"){

    }
    else {
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkedCount++;
            }
            });
            
            if (checkedCount === 0) {
            alert("Please select at least one option for joke category.");
            event.preventDefault(); 
            }
            
    }
});

function resetForm() {
  setTimeout(() => document.getElementById("myForm").reset(), 100);
}