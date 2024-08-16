module.exports = function formatDate(dateValue) {
  const date = new Date(dateValue);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based in JS
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
