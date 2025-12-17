// Fungsi untuk ganti Tab (Voucher/Member)
function switchTab(mode) {
  var inputPassGroup = document.getElementById("password-group");
  var labelUser = document.getElementById("label-user");
  var btnVoucher = document.getElementById("btn-voucher");
  var btnMember = document.getElementById("btn-member");
  var inputUser = document.getElementById("input-user");
  var inputPass = document.getElementById("input-pass");

  if (mode === "voucher") {
    // Tampilan Voucher
    inputPassGroup.style.display = "none";
    labelUser.innerText = "Kode Voucher";
    inputUser.placeholder = "Masukkan Kode";

    // Kosongkan password agar logika login menganggap ini voucher
    inputPass.value = "";

    btnVoucher.classList.add("active");
    btnMember.classList.remove("active");

    // Fokus balik ke input user
    inputUser.focus();
  } else {
    // Tampilan Member
    inputPassGroup.style.display = "block";
    labelUser.innerText = "Username";
    inputUser.placeholder = "Username Member";

    btnMember.classList.add("active");
    btnVoucher.classList.remove("active");

    inputUser.focus();
  }
}

// Dijalankan saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  var inputUser = document.getElementById("input-user");
  if (inputUser) {
    inputUser.focus();
  }
});
