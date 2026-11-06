const PAGINA = process.env.FRONTEND_URL || 'http://localhost:5173'

const sinHtml = (texto) =>
    String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const plantillaMail = ({ titulo, parrafos, textoBoton, linkBoton, notaFinal }) => `
<div style="margin:0;padding:32px 12px;background-color:#09090e;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background-color:#13111c;border:1px solid #2d2640;border-radius:16px;">
    <tr>
      <td style="padding:28px 32px 8px;text-align:center;">
        <img src="${PAGINA}/favicon.png" width="64" height="64" alt="Digital Night" style="display:block;margin:0 auto 12px;border-radius:50%;">
        <div style="color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:3px;">DIGITAL<span style="color:#8b5cf6;">NIGHT</span></div>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px 8px;">
        <h1 style="margin:0 0 16px;color:#ffffff;font-size:24px;text-align:center;">${titulo}</h1>
        ${parrafos.map((p) => `<p style="margin:0 0 14px;color:#cfcde8;font-size:15px;line-height:1.6;text-align:center;">${p}</p>`).join('')}
      </td>
    </tr>
    <tr>
      <td style="padding:8px 32px 24px;text-align:center;">
        <a href="${linkBoton}" style="display:inline-block;padding:14px 28px;background-color:#7c3aed;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;border-radius:12px;">${textoBoton}</a>
      </td>
    </tr>
    ${notaFinal ? `<tr><td style="padding:0 32px 24px;color:#8b8bab;font-size:12px;line-height:1.5;text-align:center;">${notaFinal}</td></tr>` : ''}
    <tr>
      <td style="padding:16px 32px;border-top:1px solid #2d2640;color:#6b6a85;font-size:11px;text-align:center;">
        Digital Night · Plataforma de videojuegos de la escuela<br>
        <a href="${PAGINA}" style="color:#8b5cf6;text-decoration:none;">${PAGINA.replace(/^https?:\/\//, '')}</a>
      </td>
    </tr>
  </table>
</div>`

module.exports = { plantillaMail, sinHtml, PAGINA }
