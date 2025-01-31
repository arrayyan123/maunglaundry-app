<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt</title>
  <style>
    @page {
        margin: 0;
        size: auto;
    }
    body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        height: auto;
        overflow: visible;
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
<body>
  <div class="header">
    <img src="{{ asset('assets/images/Logo_maung.png') }}" alt="Logo Maung Laundry">
    <div class="no-telp">
      <p>CALL/WA: 0815 7942 086</p>
    </div>
  </div>

  @if ($transactions->isNotEmpty())
    <p style="font-size: 30px; margin-left: 10px; font-weight: bold;">Nama: {{ $transactions[0]->customer->name }}</p>
    <p style="font-size: 30px; margin-left: 10px; font-weight: bold;">No HP: {{ $transactions[0]->customer->phone }}</p>
    <p style="font-size: 30px; margin-left: 10px; font-weight: bold;">Alamat: {{ $transactions[0]->customer->address }}</p>
    @endif

  <table>
    <thead>
      <tr>
        <th style="font-size: 27px; font-weight: bold;">Tanggal Masuk</th>
        <th style="font-size: 27px; font-weight: bold;">Jenis</th>
        <th style="font-size: 27px; font-weight: bold;">Jmlh</th>
        <th style="font-size: 27px; font-weight: bold;">Harga Sat/Kg</th>
        <th style="font-size: 27px; font-weight: bold;">Sub Total</th>
      </tr>
    </thead>
    <tbody>
      @foreach ($transactions as $transaction)
        @foreach ($transaction->details as $detail)
        <tr>
          <td style="font-size: 27px; font-weight: bold;">
              {{ \Carbon\Carbon::parse($transaction->start_date)->locale('id')->isoFormat('dddd, D MMM YYYY') }}
          </td>
          <td style="font-size: 27px; font-weight: bold;">{{ $detail->servicePrice->nama_produk }}</td>
          <td style="font-size: 27px; font-weight: bold;">{{ number_format($detail->quantity, 0, ',', '.') }}</td>
          <td style="font-size: 27px; font-weight: bold;">{{ number_format($detail->servicePrice->harga, 0, ',', '.') }}</td>
          <td style="font-size: 27px; font-weight: bold;">{{ number_format($detail->price, 0, ',', '.') }}</td>
        </tr>
        @endforeach
      @endforeach
    </tbody>
  </table>

  <!-- Section untuk Note & Total -->
  <table class="note-total">
    {{-- @foreach ($transactions as $transaction)
        <tr>
            <td class="note" colspan="2">NOTE:</td>
            <td class="note" colspan="2">{{ $transaction->note ? $transaction->note->content : 'Tidak ada catatan' }}</td>
        </tr>
    @endforeach --}}
    <tr>
      <td class="note" colspan="2">TOTAL</td>
      <td class="note" colspan="2">Rp {{ number_format($transactions->sum(fn($transaction) => $transaction->details->sum('price')), 0, ',', '.') }}</td>
    </tr>
  </table>
  <div style="margin-left: 10px; page-break-after: avoid;">
    <ul>
      <h1>Perhatian:</h1>
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
