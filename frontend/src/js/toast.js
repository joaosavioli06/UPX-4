(function () {

  function ensureToastDiv() {
    let toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    return toast;
  }

  function showToast(message, type = "info", duration = 3000) {
    const toast = ensureToastDiv();

    toast.className = "toast";

    switch (type) {
      case "success":
        toast.classList.add("toast-success");
        break;
      case "error":
        toast.classList.add("toast-error");
        break;
      case "warning":
        toast.classList.add("toast-warning");
        break;
      default:
        toast.classList.add("toast-info");
    }

    toast.textContent = message;
    toast.classList.add("show");

    if (toast.__timeout) clearTimeout(toast.__timeout);

    toast.__timeout = setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
  }

  window.showToast = showToast;

})();
