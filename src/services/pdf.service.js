import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const logoPath = path.resolve('src/assets/logo.png');

export const generarPDF = async (data) => {
  try {
    // 🔥 usar chromium del sistema (Railway)
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ],
      executablePath: '/usr/bin/chromium-browser',
      headless: true
    });

    const page = await browser.newPage();

    // logo base64
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');

    // folio real 5 dígitos
    const folio = Math.floor(10000 + Math.random() * 90000);

    const html = `
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial; padding: 40px; font-size: 12px; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th, td {
    border: 1px solid #000;
    padding: 6px;
  }

  th {
    background-color: #facc15;
    color: #000;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  td:nth-child(1),
  td:nth-child(3),
  td:nth-child(4) {
    text-align: right;
  }

  .header {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
  }

  .empresa { text-align: right; }

  .titulo {
    text-align: center;
    margin: 20px 0;
    font-size: 22px;
  }

  .cliente {
    margin-top: 10px;
    border: 1px solid #000;
    padding: 10px;
  }

  .totales {
    width: 300px;
    margin-left: auto;
    margin-top: 20px;
    border-top: 2px solid #000;
    padding-top: 10px;
  }

  .totales p {
    display: flex;
    justify-content: space-between;
  }

  .firma {
    position: fixed;
    bottom: 40px;
    width: 100%;
    text-align: center;
  }

  .linea-firma {
    width: 250px;
    margin: 0 auto;
    border-top: 1px solid #000;
  }
</style>
</head>

<body>

<div class="header">
  <img src="data:image/png;base64,${logoBase64}" width="120"/>

  <div class="empresa">
    <strong>Tu Empresa S.A. de C.V.</strong><br>
    Mexicali, B.C.<br><br>

    Fecha: ${new Date().toLocaleDateString('es-MX')}<br>
    Cotización #: ${folio}
  </div>
</div>

<div class="titulo"><strong>COTIZACIÓN</strong></div>

<div class="cliente">
  <strong>Cliente:</strong> ${data.cliente || ''}<br>
  Teléfono: ${data.telefono || ''}<br>
  Dirección: ${data.direccion || ''}<br>
  Ciudad: ${data.ciudad || ''}
</div>

<table>
<thead>
<tr>
  <th>Cantidad</th>
  <th>Descripción</th>
  <th>Precio Unitario</th>
  <th>Importe</th>
</tr>
</thead>

<tbody>
${data.items.map(item => {
  const totalItem = item.cantidad * item.precio;
  return `
  <tr>
    <td>${item.cantidad}</td>
    <td>${item.descripcion}</td>
    <td>${item.precio.toFixed(2)}</td>
    <td>${totalItem.toFixed(2)}</td>
  </tr>`;
}).join('')}
</tbody>
</table>

<div class="totales">
  <p><span>Subtotal:</span> <span>${(data.subtotal || 0).toFixed(2)}</span></p>
  <p><span>IVA:</span> <span>${(data.iva || 0).toFixed(2)}</span></p>
  <p><strong>Total:</strong> <strong>${(data.total || 0).toFixed(2)}</strong></p>
</div>

<div class="firma">
  <p>Atentamente:</p>
  <br><br>
  <div class="linea-firma"></div>
  <p><strong>${data.representante || ''}</strong></p>
  <p>Departamento de Ventas</p>
</div>

</body>
</html>
`;

    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true
    });

    await browser.close();

    return pdf;

  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  }
};