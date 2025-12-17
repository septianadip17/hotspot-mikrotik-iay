document.addEventListener("DOMContentLoaded", function () {
  updateGreeting();
  startLiveTimer();

  // Notif awal saat masuk
  setTimeout(function () {
    showToast("Status Aktif. Timer berjalan realtime.", "success");
  }, 500);
});

var warningShown = false; 

// --- LOGIKA HITUNG MUNDUR ---
function startLiveTimer() {
  var data = window.mikrotikData;
  var elemenWaktu = document.getElementById("remain-time");

  if (!data || !data.sisaWaktuDetik) return;

  var timeLeft = parseInt(data.sisaWaktuDetik);

  // Jika unlimited
  if (isNaN(timeLeft) || timeLeft <= 0) {
    if (elemenWaktu) elemenWaktu.innerText = "Unlimited";
    return;
  }

  // Update tampilan awal
  if (elemenWaktu) elemenWaktu.innerText = formatWaktu(timeLeft);

  var countdown = setInterval(function () {
    timeLeft--;

    if (elemenWaktu) {
      elemenWaktu.innerText = formatWaktu(timeLeft);
      if (timeLeft < 60) {
        elemenWaktu.style.color = "#ff416c";
        elemenWaktu.style.textShadow = "0 0 5px rgba(255, 65, 108, 0.5)";
      }
    }

    // --- PERINGATAN 3 MENIT (180 Detik) ---
    if (timeLeft <= 180 && timeLeft > 170 && !warningShown) {
      showToast("⚠️ Waktu tinggal 3 Menit! Siapkan voucher baru.", "warning");
      warningShown = true; // Kunci agar tidak spam notif
    }

    // --- PERINGATAN KRITIS (10 Detik) ---
    if (timeLeft === 10) {
      showToast("Waktu habis! Mengalihkan ke halaman Login...", "error");
    }

    // --- AUTO LOGOUT AMAN (5 Detik) ---
    if (timeLeft <= 5) {
      clearInterval(countdown);
      forceLogout();
    }
  }, 1000);
}

function formatWaktu(seconds) {
  if (seconds < 0) return "Habis";
  var jam = Math.floor(seconds / 3600);
  var sisaDetik = seconds % 3600;
  var menit = Math.floor(sisaDetik / 60);
  var det = sisaDetik % 60;

  var hasil = "";
  if (jam > 0) {
    hasil += jam + "j " + menit + "m " + det + "d";
  } else if (menit > 0) {
    hasil += menit + "m " + det + "d";
  } else {
    hasil += det + " detik";
  }
  return hasil;
}

function forceLogout() {
  if (document.logout) {
    document.logout.submit();
  } else {
    window.location.href = window.mikrotikData.linkLogout;
  }
}

// --- UTILS (Greeting & Toast) ---
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

function showToast(message, type) {
  var container = document.getElementById("toast-container");
  if (!container) return;

  var toast = document.createElement("div");
  var typeClass = type || "success";
  toast.className = "toast " + typeClass;

  var icon = "✅";
  if (type === "warning") icon = "⚠️";
  if (type === "error") icon = "⛔";

  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  // Durasi notif: Warning tampil lebih lama (5 detik), lainnya 3 detik
  var duration = type === "warning" ? 5000 : 3000;

  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, duration);
}
