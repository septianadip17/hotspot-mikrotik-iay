/* js/status.js */

function parseMikrotikTime(timeStr) {
  let isLow = false;

  if (timeStr.indexOf("d") === -1 && timeStr.indexOf("h") === -1) {
    let parts = timeStr.split("m");
    if (parts.length > 1) {
      let minutes = parseInt(parts[0]);
      if (minutes <= 5) isLow = true; // Warning jika di bawah 5 menit
    } else if (timeStr.indexOf("s") !== -1) {
      isLow = true; // Warning jika tinggal detik
    }
  }

  return isLow;
}

// Fungsi Parse Data (Cek jika kuota < 50MiB)
function parseMikrotikBytes(byteStr) {
  // Format Mikrotik: 50.5 MiB, 1.2 GiB, 500 KiB
  if (byteStr.indexOf("MiB") !== -1) {
    let value = parseFloat(byteStr);
    if (value < 50) return true; // Warning jika di bawah 50 MiB
  }
  if (byteStr.indexOf("KiB") !== -1) return true; // Warning jika sisa KiB
  return false;
}

// Fungsi Menampilkan Toast Notification
function showToast(message) {
  const container = document.getElementById("toast-container");

  // Buat elemen toast baru
  const toast = document.createElement("div");
  toast.className = "toast show";
  toast.innerHTML = `
        <div class="toast-icon">⚠️</div>
        <div class="toast-message">${message}</div>
    `;

  container.appendChild(toast);

  // Hapus otomatis setelah 5 detik
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 5000);
}

// Main Logic saat Status Page Load
document.addEventListener("DOMContentLoaded", function () {
  const timeElem = document.getElementById("remain-time");
  const bytesElem = document.getElementById("remain-bytes");

  // Cek Waktu
  if (timeElem) {
    let timeVal = timeElem.innerText;
    if (parseMikrotikTime(timeVal)) {
      timeElem.classList.add("critical-value");
      showToast("Perhatian! Waktu sesi Anda tinggal sebentar lagi.");
    }
  }

  // Cek Kuota
  if (bytesElem) {
    let bytesVal = bytesElem.innerText;
    if (parseMikrotikBytes(bytesVal)) {
      bytesElem.classList.add("critical-value");
      showToast("Perhatian! Sisa kuota data Anda menipis.");
    }
  }
});
