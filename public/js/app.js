/**
 * Script Frontend Vanilla JavaScript (public/js/app.js)
 * Fitur: Validasi Form Klien, Resep Dinamis, Pencarian Tabel Langsung,
 * Konfirmasi Hapus Data, Auto-dismiss Notifikasi, dan Sidebar Mobile.
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Auto-dismiss Pesan Notifikasi (Flash Alert) setelah 4 detik
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach((alert) => {
    // Tombol close manual
    const closeBtn = alert.querySelector('.alert-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 400);
      });
    }

    // Hilang otomatis
    setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-10px)';
      setTimeout(() => alert.remove(), 400);
    }, 4500);
  });

  // 2. Toggle Sidebar Navigasi pada Tampilan Mobile
  const mobileToggle = document.getElementById('mobileToggle');
  const sidebar = document.querySelector('.sidebar');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });

    // Tutup sidebar jika pengguna klik di luar area sidebar
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target) && sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
      }
    });
  }

  // 3. Konfirmasi Dialog Sebelum Hapus Data
  const confirmForms = document.querySelectorAll('form[data-confirm]');
  confirmForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      const message = form.getAttribute('data-confirm') || 'Apakah Anda yakin ingin menghapus data ini?';
      if (!confirm(message)) {
        e.preventDefault();
      }
    });
  });

  // 4. Pencarian Tabel Langsung (Live Table Filter)
  const liveSearchInputs = document.querySelectorAll('[data-table-filter]');
  liveSearchInputs.forEach((input) => {
    const targetTableId = input.getAttribute('data-table-filter');
    const table = document.getElementById(targetTableId);
    if (!table) return;

    input.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const rows = table.querySelectorAll('tbody tr');

      rows.forEach((row) => {
        // Jangan filter baris kosong (no-data)
        if (row.classList.contains('no-filter')) return;

        const rowText = row.textContent.toLowerCase();
        if (rowText.includes(term)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  // 5. Validasi Form Pasien di Sisi Klien
  const formPasien = document.getElementById('formPasien');
  if (formPasien) {
    formPasien.addEventListener('submit', (e) => {
      const nikInput = formPasien.querySelector('#nik');
      const namaInput = formPasien.querySelector('#nama');
      const hpInput = formPasien.querySelector('#no_hp');

      // Validasi NIK (Wajib 16 digit angka)
      if (nikInput) {
        const nikVal = nikInput.value.trim();
        if (!/^\d{16}$/.test(nikVal)) {
          alert('NIK harus terdiri dari tepat 16 digit angka!');
          nikInput.focus();
          e.preventDefault();
          return false;
        }
      }

      // Validasi Nama
      if (namaInput && namaInput.value.trim().length < 3) {
        alert('Nama lengkap pasien minimal 3 karakter!');
        namaInput.focus();
        e.preventDefault();
        return false;
      }

      // Validasi Nomor HP
      if (hpInput) {
        const hpVal = hpInput.value.trim();
        if (!/^\d{10,15}$/.test(hpVal.replace(/[-\s]/g, ''))) {
          alert('Nomor HP tidak valid! Masukkan 10-15 digit angka.');
          hpInput.focus();
          e.preventDefault();
          return false;
        }
      }
    });
  }

  // 6. Validasi Form Pemeriksaan Dokter
  const formPemeriksaan = document.getElementById('formPemeriksaan');
  if (formPemeriksaan) {
    formPemeriksaan.addEventListener('submit', (e) => {
      const suhuInput = formPemeriksaan.querySelector('#suhu');
      const beratInput = formPemeriksaan.querySelector('#berat_badan');
      const tdInput = formPemeriksaan.querySelector('#tekanan_darah');

      // Validasi Suhu Tubuh (harus logis antara 35 s.d 42 derajat celcius)
      if (suhuInput) {
        const suhu = parseFloat(suhuInput.value);
        if (isNaN(suhu) || suhu < 35.0 || suhu > 43.0) {
          alert('Nilai suhu tubuh tidak valid! Masukkan antara 35.0 s.d 43.0 °C.');
          suhuInput.focus();
          e.preventDefault();
          return false;
        }
      }

      // Validasi Berat Badan
      if (beratInput) {
        const bb = parseFloat(beratInput.value);
        if (isNaN(bb) || bb <= 0 || bb > 350) {
          alert('Nilai berat badan tidak valid! Masukkan angka lebih dari 0 kg.');
          beratInput.focus();
          e.preventDefault();
          return false;
        }
      }

      // Validasi Format Tekanan Darah (misal: 120/80)
      if (tdInput) {
        const tdVal = tdInput.value.trim();
        if (!/^\d{2,3}\/\d{2,3}$/.test(tdVal)) {
          alert('Format tekanan darah harus berupa sistol/diastol (contoh: 120/80)!');
          tdInput.focus();
          e.preventDefault();
          return false;
        }
      }

      // Validasi Baris Resep: Jika obat dipilih, jumlah dan aturan pakai wajib diisi
      const rows = document.querySelectorAll('#prescriptionBody tr');
      let validResep = true;
      rows.forEach((row) => {
        const selectObat = row.querySelector('.select-obat');
        const inputJumlah = row.querySelector('.input-jumlah');
        const inputAturan = row.querySelector('.input-aturan');

        if (selectObat && selectObat.value) {
          const jml = parseInt(inputJumlah.value, 10);
          if (isNaN(jml) || jml <= 0) {
            alert('Jumlah obat pada resep harus minimal 1!');
            inputJumlah.focus();
            validResep = false;
            return;
          }
          if (!inputAturan.value.trim()) {
            alert('Aturan pakai obat wajib diisi!');
            inputAturan.focus();
            validResep = false;
            return;
          }
        }
      });

      if (!validResep) {
        e.preventDefault();
        return false;
      }
    });
  }

  // 7. Pengelolaan Baris Resep Obat Dinamis (+ Tambah Baris, - Hapus Baris)
  const btnTambahObat = document.getElementById('btnTambahObat');
  const prescriptionBody = document.getElementById('prescriptionBody');

  if (btnTambahObat && prescriptionBody) {
    // Fungsi Menambah Baris Baru
    btnTambahObat.addEventListener('click', () => {
      // Ambil template pilihan obat dari elemen tersembunyi atau baris pertama
      const obatTemplate = document.getElementById('obatOptionsTemplate');
      const optionsHtml = obatTemplate ? obatTemplate.innerHTML : '';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <select name="obat_id[]" class="form-control select-obat" required>
            <option value="">-- Pilih Obat --</option>
            ${optionsHtml}
          </select>
        </td>
        <td>
          <input type="number" name="jumlah[]" class="form-control input-jumlah" min="1" placeholder="Jml" required>
        </td>
        <td>
          <input type="text" name="aturan_pakai[]" class="form-control input-aturan" placeholder="Contoh: 3 x 1 tablet sesudah makan" required>
        </td>
        <td class="text-center">
          <button type="button" class="btn btn-outline-danger btn-sm btn-hapus-baris" title="Hapus obat ini">
            &times; Hapus
          </button>
        </td>
      `;

      prescriptionBody.appendChild(tr);
    });

    // Event Delegation untuk Menghapus Baris Resep
    prescriptionBody.addEventListener('click', (e) => {
      if (e.target.closest('.btn-hapus-baris')) {
        const row = e.target.closest('tr');
        // Jangan hapus jika hanya tersisa 1 baris kosong (cukup reset nilainya)
        const totalRows = prescriptionBody.querySelectorAll('tr').length;
        if (totalRows <= 1) {
          row.querySelectorAll('input, select').forEach((el) => (el.value = ''));
        } else {
          row.remove();
        }
      }
    });
  }

});
