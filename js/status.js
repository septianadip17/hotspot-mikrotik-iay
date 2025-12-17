/* js/status.js */

// Fungsi untuk Parsing Waktu Mikrotik (contoh: "1h 5m 20s" menjadi detik)
function parseMikrotikTime(timeStr) {
  // Mikrotik time format varies, this is a simple approximation check
  // If it detects just "m" and "s" without "h" or "d", it might be low.

  // Simplifikasi: Kita cek stringnya saja
  let isLow = false;

  // Jika format hanya "Xs" (detik saja) atau "Xm Ys" (menit di bawah 5)
  if (timeStr.indexOf("d") === -1 && timeStr.indexOf("h") === -1) {
    // Tidak ada hari dan jam, berarti sisa menit/detik

    // Ambil angka depan (menit)
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
  // Ambil nilai dari elemen HTML (yang diisi Mikrotik)
  const timeElem = document.getElementById("remain-time");
  const bytesElem = document.getElementById("remain-bytes");

  // Cek Waktu
  if (timeElem) {
    let timeVal = timeElem.innerText; // Isinya misal "4m 20s"
    if (parseMikrotikTime(timeVal)) {
      timeElem.classList.add("critical-value"); // Efek kedip merah
      showToast("Perhatian! Waktu sesi Anda tinggal sebentar lagi.");
    }
  }

  // Cek Kuota
  if (bytesElem) {
    let bytesVal = bytesElem.innerText; // Isinya misal "10 MiB"
    if (parseMikrotikBytes(bytesVal)) {
      bytesElem.classList.add("critical-value"); // Efek kedip merah
      showToast("Perhatian! Sisa kuota data Anda menipis.");
    }
  }
});
