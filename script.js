/* Cakes by Nutty: order form behaviour
   No server is needed. Pressing "Send my order" opens the customer's
   email app with the order filled in, addressed to the email below. */

const ORDER_EMAIL = "cakesbynutty@gmail.com";
const PHONE_DISPLAY = "071 575 1371";

const form = document.getElementById("order-form");
const status = document.getElementById("form-status");
const itemSelect = document.getElementById("item");
const dateInput = document.getElementById("date");

// Earliest date a customer can pick is tomorrow
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
dateInput.min = tomorrow.toISOString().slice(0, 10);

// "Order this cake" buttons pick the item and jump to the form
document.querySelectorAll("[data-order]").forEach((button) => {
  button.addEventListener("click", () => {
    const wanted = button.dataset.order;
    const match = [...itemSelect.options].find((o) => o.text.trim() === wanted);
    if (match) itemSelect.value = match.value || match.text;
    document.getElementById("order").scrollIntoView();
    document.getElementById("name").focus({ preventScroll: true });
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Check required fields and mark any that are empty
  let firstEmpty = null;
  form.querySelectorAll("[required]").forEach((field) => {
    const empty = !field.value.trim();
    field.classList.toggle("invalid", empty);
    if (empty && !firstEmpty) firstEmpty = field;
  });
  if (firstEmpty) {
    status.textContent = "Please fill in the fields marked in red.";
    firstEmpty.focus();
    return;
  }

  const data = new FormData(form);
  const lines = [
    "New order for Cakes by Nutty",
    "",
    "Name: " + data.get("name"),
    "Phone: " + data.get("phone"),
    "Order: " + data.get("item"),
    "Date needed: " + data.get("date"),
    "Collection or delivery: " + data.get("method"),
    "Details: " + (data.get("details") || "None"),
  ];

  const subject = "Order: " + data.get("item") + " for " + data.get("date");
  const link =
    "mailto:" + ORDER_EMAIL +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(lines.join("\n"));

  status.textContent =
    "Your email app should open with the order ready. If it does not, email " +
    ORDER_EMAIL + " or call " + PHONE_DISPLAY + ".";
  window.location.href = link;
});

// Clear the red marking as soon as someone fixes a field
form.addEventListener("input", (event) => {
  if (event.target.classList) event.target.classList.remove("invalid");
});
