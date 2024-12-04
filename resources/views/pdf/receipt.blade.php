<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt</title>
  <style>
    @page {
        margin: 0; /* Hapus margin di seluruh halaman PDF */
    }
    body {
        margin: 10px;
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
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
    }
    .header img {
      max-width: 550px;
      height: auto;
      margin-bottom: 50px;
    }
    .no-telp {
      margin-top: 10px;
      border-style: solid;
      border-width: 5px;
      padding: 10px;
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
      font-size: 18px;
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
<body>
  <div class="header">
    <img src="{{ public_path('assets/images/Picture1.png') }}" alt="Logo Maung Laundry">
    <div class="no-telp">
      <p>CALL/WA: 0815 7942 086</p>
    </div>
  </div>

  <p style="font-size: 20px; margin-left: 10px;">Nama: {{ $transaction->customer->name }}</p>
  <p style="font-size: 20px; margin-left: 10px;">No HP: {{ $transaction->customer->phone }}</p>
  <p style="font-size: 20px; margin-left: 10px;">Alamat: {{$transaction->customer->address }}</p>
  <p style="font-size: 20px; margin-left: 10px;">Tanggal Masuk: {{ \Carbon\Carbon::parse($transaction->start_date)->format('l, d F Y') }}</p>

  <table>
    <thead>
      <tr>
        <th style="font-size: 20px;">Jenis</th>
        <th style="font-size: 20px;">Jmlh</th>
        <th style="font-size: 20px;">Harga Sat/Kg</th>
        <th style="font-size: 20px;">Sub Total</th>
      </tr>
    </thead>
    <tbody>
      @foreach ($transaction->details as $detail)
      <tr>
        <td style="font-size: 20px;">{{ $detail->servicePrice->nama_produk }}</td>
        <td style="font-size: 20px;">{{ number_format($detail->quantity, 0, ',', '.') }}</td>
        <td style="font-size: 20px;">{{ number_format($detail->servicePrice->harga, 0, ',', '.') }}</td>
        <td style="font-size: 20px;">{{ number_format($detail->price, 0, ',', '.') }}</td>
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
      <td class="total">Rp {{ number_format($detail->price, 0, ',', '.') }}</td>
    </tr>
    <tr>
      <td class="note" colspan="2">NOTE: {{$noteContent}}</td>
      <td class="dp">DP</td>
      <td class="dp">Rp {{ number_format($transaction->dp, 0, ',', '.') }}</td>
    </tr>
    <tr>
      <td colspan="2"></td>
      <td class="sisa">SISA</td>
      <td class="sisa">Rp {{ number_format($transaction->sisa, 0, ',', '.') }}</td>
    </tr>
  </table>
</body>
</html>