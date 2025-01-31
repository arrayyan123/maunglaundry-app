<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt</title>
  <style>
    @page {
        margin: 0;
        size:  auto;
    }
    body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f4f4f4;
      font-weight: bold;
    }
    .header {
      text-align: center;
      margin-top: 40px;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
    }
    .header img {
      max-width: 450px;
      height: auto;
      margin-bottom: 50px;
    }
    .no-telp {
      margin-top: 10px;
      border-style: solid;
      border-width: 5px;
      padding: 10px;
      font-weight: bold;
    }
    .no-telp p {
      font-size: 35px;
      margin: 0;
    }
    .note-total {
      margin-top: 20px;
      width: 100%;
      border-collapse: collapse;
    }
    .note-total td {
      border: 1px solid #000;
      padding: 8px;
      font-size: 28px;
    }
    .note-total .note {
      font-weight: bold;
    }
    .note-total .total, .note-total .dp, .note-total .sisa {
      text-align: right;
      font-weight: bold;
    }
  </style>
</head>
<body style="page-break-inside: avoid;">
  <div class="header">
    {{-- logo --}}
    <img src="{{ asset('assets/images/Logo_maung.png') }}" alt="Logo Maung Laundry">
    <div class="no-telp">
      <p>CALL/WA: 0815 7942 086</p>
    </div>
  </div>

  <p style="font-size: 30px; margin-left: 10px; font-weight: bold;">Nama: {{ $transaction->customer->name }}</p>
  <p style="font-size: 30px; margin-left: 10px; font-weight: bold;">No HP: {{ $transaction->customer->phone }}</p>
  <p style="font-size: 30px; margin-left: 10px; font-weight: bold;">Alamat: {{$transaction->customer->address }}</p>
  <p style="font-size: 30px; margin-left: 10px; font-weight: bold;">
      Tanggal Masuk: {{ \Carbon\Carbon::parse($transaction->start_date)->locale('id')->isoFormat('dddd, D MMM YYYY') }}
  </p>

  <table style="page-break-inside: avoid;">
    <thead>
      <tr>
        <th style="font-size: 30px; font-weight: bold;">Jenis</th>
        <th style="font-size: 20px; font-weight: bold;">Jmlh</th>
        <th style="font-size: 20px; font-weight: bold;">Harga Sat/Kg</th>
        <th style="font-size: 20px; font-weight: bold;">Sub Total</th>
      </tr>
    </thead>
    <tbody>
      @foreach ($transaction->details as $detail)
      <tr>
        <td style="font-size: 30px; font-weight: bold;">{{ $detail->servicePrice->nama_produk }}</td>
        <td style="font-size: 30px; font-weight: bold;">{{ number_format($detail->quantity, 0, ',', '.') }}</td>
        <td style="font-size: 30px; font-weight: bold;">{{ number_format($detail->servicePrice->harga, 0, ',', '.') }}</td>
        <td style="font-size: 30px; font-weight: bold;">{{ number_format($detail->price, 0, ',', '.') }}</td>
      </tr>
      @endforeach
      <!-- Baris kosong untuk kesesuaian dengan gambar -->
      <tr>
        <td colspan="4" style="height: 20px;"></td>
      </tr>
    </tbody>
  </table>

  <!-- Section untuk Note & Total -->
  <table class="note-total">
    <tr>
      <td class="note" colspan="2">PAYMENT: {{ $transaction->status_payment }}</td>
      <td class="total">TOTAL</td>
      <td class="total">Rp {{ number_format($transaction->details->sum('price'), 0, ',', '.') }}</td>
    </tr>
    <tr>
      <td class="note" colspan="2">NOTE: {{$noteContent}}</td>
      <td class="dp">DP</td>
      <td class="dp">
        @if ($transaction->status_payment === 'partial')
          Rp {{ number_format($transaction->downPayment->dp ?? 0, 0, ',', '.') }}
        @else
          Rp 0
        @endif
      </td>
    </tr>
    <tr>
      <td colspan="2"></td>
      <td class="sisa">SISA</td>
      <td class="sisa">
        @if ($transaction->status_payment === 'partial')
          Rp {{ number_format($transaction->downPayment->remaining ?? 0, 0, ',', '.') }}
        @else
          Rp 0
        @endif
      </td>
    </tr>
  </table>
  <div style="min-height: 100mm; page-break-inside: avoid;">
    <h1>Perhatian:</h1>
    <ul>
      <li style="font-size: 26px; margin-left: 10px; font-weight: bold;">Cucian yang rusak/luntur karena sifat bahan / kain bukan tanggung jawab kami </li>
      <li style="font-size: 26px; margin-left: 10px; font-weight: bold;">Pengaduan atau komplain kami layani 1x24 jam setelah pengambilan</li>
      <li style="font-size: 26px; margin-left: 10px; font-weight: bold;">Harap hitung dan periksa barang / jumlah pakaian ketika sebelum pencucian,
        kami tidak bertanggung jawab atas kehilangan</li>
    </ul>
  </div>
  <script>
    window.onload = function() {
        window.print();
    };
</script>
</body>
</html>