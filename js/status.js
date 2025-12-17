document.addEventListener("DOMContentLoaded", function () {
  updateGreeting();
  if (!checkAutoLogout()) {
    setTimeout(function () {
      showToast("Berhasil terhubung! Koneksi Aman.", "success");
    }, 500);
  }
});

// --- FUNGSI AUTO LOGOUT (JIKA HABIS) ---
function checkAutoLogout() {
  var data = window.mikrotikData;
  if (!data) return false;
  var kuotaHabis = false;
  var waktuHabis = false;
  if (
    data.sisaKuota &&
    (data.sisaKuota === "0" || data.sisaKuota.startsWith("0 B"))
  ) {
    kuotaHabis = true;
  }

  // checking time
  if (data.sisaWaktu === "0s" || data.sisaWaktu === "00:00:00") {
    waktuHabis = true;
  }

  // EKSEKUSI LOGOUT
  if (kuotaHabis || waktuHabis) {
    console.log("Paket habis, melakukan auto-logout...");
    showToast("Paket Habis! Mengalihkan ke Logout...", "error");
    setTimeout(function () {
      document.logout.submit();
    }, 1500);

    return true;
  }

  return false;
}

// --- FUNGSI GREETING (SAPAAN) ---
function updateGreeting() {
  var greetingElement = document.getElementById("greeting-text");
  var hour = new Date().getHours();
  var text = "Halo,";

  if (hour >= 5 && hour < 11) {
    text = "Selamat Pagi,";
  } else if (hour >= 11 && hour < 15) {
    text = "Selamat Siang,";
  } else if (hour >= 15 && hour < 18) {
    text = "Selamat Sore,";
  } else {
    text = "Selamat Malam,";
  }

  if (greetingElement) {
    greetingElement.innerText = text;
  }
}

// --- FUNGSI TOAST NOTIFICATION ---
function showToast(message, type) {
  var container = document.getElementById("toast-container");
  var toast = document.createElement("div");
  toast.className = "toast";
  if (type === "success") {
    toast.classList.add("success");
  }

  var icon = type === "success" ? "✅" : "⚠️";

  toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span>${message}</span>
    `;

  // Masukkan ke container
  container.appendChild(toast);

  // animation trigger
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // animation gone
  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(function () {
      toast.remove();
    }, 500);
  }, 3000);
}
