document.addEventListener("DOMContentLoaded", function () {
  // 1. Jalankan fitur sapaan waktu (Pagi/Siang/Sore)
  updateGreeting();

  // 2. Jalankan timer hitung mundur
  startLiveTimer();

  // 3. Tampilkan notifikasi sukses (hijau)
  setTimeout(function () {
    showToast("Berhasil terhubung! Koneksi aman.", "success");
  }, 500);
});

// --- LOGIKA HITUNG MUNDUR (LIVE TIMER) ---
function startLiveTimer() {
  // Ambil data dari HTML
  var data = window.mikrotikData;
  var elemenWaktu = document.getElementById("remain-time");

  // Validasi data (Pastikan HTML mengirim sisaWaktuDetik)
  if (!data || !data.sisaWaktuDetik) return;

  // Ubah ke angka (integer)
  var timeLeft = parseInt(data.sisaWaktuDetik);

  // Jika unlimited atau error, set teks Unlimited
  if (isNaN(timeLeft) || timeLeft <= 0) {
    if (elemenWaktu) elemenWaktu.innerText = "Unlimited";
    return;
  }

  console.log("Sisa waktu awal: " + timeLeft + " detik");

  // Update tampilan awal langsung (tanpa nunggu 1 detik)
  if (elemenWaktu) elemenWaktu.innerText = formatWaktu(timeLeft);

  // Mulai Loop Interval (Setiap 1 Detik)
  var countdown = setInterval(function () {
    timeLeft--; // Kurangi 1 detik

    // Update teks di layar
    if (elemenWaktu) {
      elemenWaktu.innerText = formatWaktu(timeLeft);
    }

    // --- TITIK KRISIS (AUTO LOGOUT) ---
    // Jika waktu sisa 2 detik atau kurang, paksa logout
    if (timeLeft <= 2) {
      clearInterval(countdown);
      forceLogout();
    }
  }, 1000);
}

// --- FUNGSI FORMAT TAMPILAN (INDONESIA) ---
// Mengubah angka detik (misal 3665) jadi teks "1j 1m 5d"
function formatWaktu(seconds) {
  if (seconds < 0) return "Habis";

  var jam = Math.floor(seconds / 3600);
  var sisaDetik = seconds % 3600;
  var menit = Math.floor(sisaDetik / 60);
  var det = sisaDetik % 60;

  var hasil = "";
  if (jam > 0) {
    hasil += jam + "j ";
    hasil += menit + "m ";
    hasil += det + "d";
  } else if (menit > 0) {
    hasil += menit + "m ";
    hasil += det + "d";
  } else {
    hasil += det + " detik";
  }

  return hasil;
}

// --- FUNGSI PAKSA LOGOUT ---
function forceLogout() {
  showToast("Waktu Habis! Mengalihkan ke Logout...", "error");

  // Tunggu 1.5 detik agar user sempat baca notifikasi merah
  setTimeout(function () {
    if (document.logout) {
      document.logout.submit();
    } else {
      // Fallback jika form tidak ditemukan
      window.location.href = window.mikrotikData.linkLogout;
    }
  }, 1500);
}

// --- FITUR GREETING (SAPAAN) ---
function updateGreeting() {
  var greetingElement = document.getElementById("greeting-text");
  var hour = new Date().getHours();
  var text = "Halo,";

  if (hour >= 5 && hour < 11) text = "Selamat Pagi,";
  else if (hour >= 11 && hour < 15) text = "Selamat Siang,";
  else if (hour >= 15 && hour < 18) text = "Selamat Sore,";
  else text = "Selamat Malam,";

  if (greetingElement) greetingElement.innerText = text;
}

// --- FITUR TOAST NOTIFICATION ---
function showToast(message, type) {
  var container = document.getElementById("toast-container");
  if (!container) return;

  var toast = document.createElement("div");
  toast.className = "toast " + (type === "success" ? "success" : "");
  var icon = type === "success" ? "✅" : "⚠️";

  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
