/* js/main.js */

// Fungsi Ganti Tab (Voucher vs Member)
function switchTab(mode) {
  const voucherBtn = document.getElementById("btn-voucher");
  const memberBtn = document.getElementById("btn-member");
  const passGroup = document.getElementById("password-group");
  const userLabel = document.getElementById("label-user");
  const userInput = document.getElementById("input-user");

  if (mode === "voucher") {
    // Mode Voucher: Aktifkan tombol, sembunyikan password UI
    voucherBtn.classList.add("active");
    memberBtn.classList.remove("active");
    passGroup.style.display = "none"; // Sembunyikan input password
    userLabel.innerText = "Kode Voucher";
    userInput.placeholder = "Masukkan Kode Voucher";
  } else {
    // Mode Member: Tampilkan password UI
    memberBtn.classList.add("active");
    voucherBtn.classList.remove("active");
    passGroup.style.display = "block"; // Munculkan input password
    userLabel.innerText = "Username";
    userInput.placeholder = "Username Member";
  }
}

// Logic saat tombol Connect ditekan
function doLogin() {
  const mode = document.querySelector(".tab-btn.active").id;
  const userInput = document.getElementById("input-user");
  const passInput = document.getElementById("input-pass");

  // Jika Mode Voucher, isi password sama dengan username (User = Pass)
  if (mode === "btn-voucher") {
    passInput.value = userInput.value;
  }

  document.login.submit();
  return false;
}

// Cek Error Message saat halaman load
window.onload = function () {
  const errorBox = document.getElementById("error-box");
  const errorText = document.getElementById("error-content").innerText;

  // Jika ada error dari Mikrotik (bukan kosong atau variabel default)
  if (errorText != "" && errorText != "$(error)") {
    errorBox.style.display = "block";
  }
};
