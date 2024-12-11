<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f7;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background-color: #4c74af;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .email-body {
            padding: 20px;
        }
        .email-body p {
            line-height: 1.6;
            margin: 0 0 15px;
        }
        .email-button {
            display: inline-block;
            background-color: #4c74af;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
        }
        .email-footer {
            background-color: #f4f4f7;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #666666;
        }
        .header {
            text-align: center;
            margin-top: 40px;
            margin-bottom: 20px;
        }
        .header img {
            max-width: 350px;
            height: auto;
            margin-bottom: 50px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Reset Password</h1>
        </div>
        <div class="email-body">
            <div class="header">
                <img src="http://localhost:8000/assets/images/Logo_maung.png" alt="Logo Maung Laundry">
            </div>
            <p>Halo,</p>
            <p>Anda telah meminta untuk mereset password Anda. Klik tombol di bawah ini untuk melanjutkan:</p>
            <p style="text-align: center; color:#f4f4f7 ;">
                <a href="{{ url('/customer/reset-password/' . $token) }}" class="email-button">Reset Password</a>
            </p>
            <p>Jika Anda tidak meminta ini, abaikan email ini.</p>
            <p>Terima kasih,</p>
            <p>Tim Kami</p>
            <p>Maung Laundry</p>
        </div>
        <div class="email-footer">
            <p>Email ini dikirim secara otomatis. Jangan balas email ini.</p>
        </div>
    </div>
</body>
</html>
