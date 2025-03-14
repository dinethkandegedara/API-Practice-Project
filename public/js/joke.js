/**
 * IIFE to toggle the enabling/disabling of specific category checkboxes based on radio selection.
 */
(function () {
  const enableRadio = document.getElementById("enableCheckbox");
  const disableRadio = document.getElementById("disableCheckbox");
  const categoryCheckboxes = document.querySelectorAll(".myCheckbox");

  // When "Specific" is selected, enable category checkboxes.
  enableRadio.addEventListener("change", () => {
    categoryCheckboxes.forEach((checkbox) => (checkbox.disabled = false));
  });

  // When "Any" is selected, disable and uncheck category checkboxes.
  disableRadio.addEventListener("change", () => {
    categoryCheckboxes.forEach((checkbox) => {
      checkbox.disabled = true;
      checkbox.checked = false;
    });
  });
})();

/**
 * IIFE to validate the joke submission form before submission.
 */
(function () {
  const form = document.getElementById("myForm");

  form.addEventListener("submit", function (event) {
    // Validate Joke Type: At least one joke type must be selected.
    const jokeTypeCheckboxes = document.querySelectorAll(".joke-type");
    const isJokeTypeSelected = Array.from(jokeTypeCheckboxes).some(
      (checkbox) => checkbox.checked
    );
    if (!isJokeTypeSelected) {
      alert("Please select at least one option for joke type.");
      event.preventDefault();
      return;
    }

    // Validate Joke Category: If "Any" is not selected, ensure at least one specific category is chosen.
    const isAnyCategory = document.querySelector('input[name="any-category"]:checked')?.value === "yes";
    const specificCategoryCheckboxes = document.querySelectorAll(".myCheckbox");
    const isCategorySelected = Array.from(specificCategoryCheckboxes).some(
      (checkbox) => checkbox.checked
    );
    if (!isAnyCategory && !isCategorySelected) {
      alert("Please select at least one option for joke category.");
      event.preventDefault();
    }
  });
})();

/**
 * Resets the joke form after a short delay.
 */
function resetForm() {
  setTimeout(() => document.getElementById("myForm").reset(), 100);
}
