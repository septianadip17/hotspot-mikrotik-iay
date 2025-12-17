document.addEventListener("DOMContentLoaded", function () {
  updateGreeting();
  startLiveTimer();
  setTimeout(function () {
    showToast("Berhasil terhubung! Koneksi aman.", "success");
  }, 500);
});

// --- LOGIKA HITUNG MUNDUR (LIVE TIMER) ---
function startLiveTimer() {
  var data = window.mikrotikData;

  if (!data || !data.sisaWaktu) return;
  var timeLeft = parseInt(data.sisaWaktu);
  if (isNaN(timeLeft) || timeLeft <= 0) return;
  console.log("Sisa waktu awal: " + timeLeft + " detik");

  var countdown = setInterval(function () {
    timeLeft--;
    var displayTime = document.getElementById("remain-time");
    if (displayTime) {
      displayTime.innerText = formatTime(timeLeft);
    }

    // --- TITIK KRISIS ---
    if (timeLeft <= 3) {
      clearInterval(countdown);
      forceLogout();
    }
  }, 1000);
}

function forceLogout() {
  showToast("Waktu Habis! Mengalihkan ke Logout...", "error");
  setTimeout(function () {
    if (document.logout) {
      document.logout.submit();
    } else {
      window.location.href = window.mikrotikData.linkLogout;
    }
  }, 1000);
}

function formatTime(seconds) {
  if (seconds < 0) return "0s";
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = seconds % 60;

  // Format string: "1h 5m 30s" atau "30s"
  var result = "";
  if (h > 0) result += h + "h ";
  if (m > 0) result += m + "m ";
  result += s + "s";
  return result;
}

// --- FITUR BAWAAN (GREETING & TOAST) ---
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
