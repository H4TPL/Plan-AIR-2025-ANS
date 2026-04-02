// ==========================================
// 🔳 QR CODE / UDOSTĘPNIANIE
// ==========================================

function showQRCode() {
    document.getElementById('qrModal').style.display = 'flex';
    document.getElementById('qrcode').innerHTML = '';

    new QRCode(document.getElementById('qrcode'), {
        text: window.location.href.split('#')[0],
        width: 200,
        height: 200,
        colorDark: "#1f2937",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}