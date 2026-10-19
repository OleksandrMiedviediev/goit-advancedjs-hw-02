const form = document.querySelector(".feedback-form");
const email = form.elements.email;
const textarea = form.elements.message;
const localStorageKey = "feedback-form-state";

const formData = JSON.parse(localStorage.getItem(localStorageKey)) ?? {
  email: "",
  message: "",
};

email.value = formData.email;
textarea.value = formData.message;

form.addEventListener("input", (evt) => {
  formData.email = email.value.trim();
  formData.message = textarea.value.trim();
  localStorage.setItem(localStorageKey, JSON.stringify(formData));
});

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  if (!email.value || !textarea.value) {
    alert("Please fill in all fields");
    return;
  }
  console.log(formData);
  localStorage.removeItem(localStorageKey);
  formData.email = "";
  formData.message = "";
  form.reset();
});
