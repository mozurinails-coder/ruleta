const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const form = document.getElementById('form-ruleta');
const btnGirar = document.getElementById('btn-girar');
const resultadoDiv = document.getElementById('resultado');

// CONFIGURACIÓN DE TUS REDES
const TU_NUMERO_WHATSAPP = "542996579303";
const TU_INSTAGRAM = "mozuri.nails"; // Tu usuario oficial con punto

// Tus 8 premios
const opciones = [
  "5% OFF",
  "10% OFF",
  "Uñas Gratis",
  "15% Descuento",
  "Premio Sorpresa",
  "$3000 OFF",
  "$5000 OFF",
  "20% OFF"
];

// 8 colores contrastantes
const colores = [
  "#49688F",
  "#122D52",
  "#ADC1DB",
  "#080852",
  "#BEBEFA",
  "#161663",
  "#99C1FF",
  "#011029"
];

const numOpciones = opciones.length;
const arc = (2 * Math.PI) / numOpciones;

let anguloActual = 0;
let girando = false;
let urlWhatsAppGlobal = "";

// Función para abrir Instagram y desbloquear WhatsApp
function compartirEnInstagram() {
  const btnWA = document.getElementById('btn-whatsapp');
  if (btnWA) {
    btnWA.disabled = false;
    btnWA.style.backgroundColor = "#25D366";
    btnWA.style.cursor = "pointer";
    btnWA.style.opacity = "1";
    btnWA.innerHTML = "2. Enviar captura por WhatsApp 💬";
  }

  // Intenta abrir el creador de historias o el perfil
  window.location.href = "instagram://story-camera";
  
  setTimeout(() => {
    window.open(`https://www.instagram.com/${TU_INSTAGRAM}/`, '_blank');
  }, 1000);
}

function irAWhatsApp() {
  if (urlWhatsAppGlobal) {
    window.open(urlWhatsAppGlobal, '_blank');
  }
}

// 🔒 REVISAR SI YA GIRÓ ANTES
function verificarSiYaGiro() {
  const usuarioGuardado = localStorage.getItem('ruleta_usuario_ig');
  const premioGuardado = localStorage.getItem('ruleta_premio');

  if (usuarioGuardado && premioGuardado) {
    btnGirar.disabled = true;
    btnGirar.textContent = "Ya participaste";
    
    const inputNombre = document.getElementById('nombre');
    if (inputNombre) inputNombre.disabled = true;

    const mensajeWA = encodeURIComponent(`¡Hola! Mi usuario de Instagram es @${usuarioGuardado}. Gané "${premioGuardado}" en la ruleta y aquí te adjunto la captura de mi Historia etiquetando a @${TU_INSTAGRAM}.`);
    urlWhatsAppGlobal = `https://wa.me/${TU_NUMERO_WHATSAPP}?text=${mensajeWA}`;

    resultadoDiv.innerHTML = `
      <div style="background: #ffffff; border: 2px solid #cbd5e1; padding: 18px; border-radius: 14px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        <p style="margin: 0 0 10px 0; color: #e11d48; font-weight: bold; font-size: 15px;">
          ⚠️ Ya utilizaste tu giro disponible.
        </p>
        <p style="font-size: 17px; color: #1e293b; margin: 0 0 15px 0;">
          Tu premio asignado fue: <strong>${premioGuardado}</strong>
        </p>
        
        <div style="background: #f8fafc; border: 1px dashed #94a3b8; padding: 12px; border-radius: 10px; margin-bottom: 15px;">
          <p style="font-size: 13px; color: #475569; margin: 0 0 10px 0; line-height: 1.4;">
            📸 <strong>Pasos para reclamar:</strong><br>
            1. Subí la captura a tu historia etiquetando a <strong>@${TU_INSTAGRAM}</strong>.<br>
            2. Tocá el botón verde y envianos la captura por chat.
          </p>
          <button type="button" onclick="compartirEnInstagram()" style="background-color: #E1306C; color: white; border: none; padding: 12px 15px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%; font-size: 14px; margin-bottom: 5px;">
            1. Abrir Instagram para subir Historia 📸
          </button>
        </div>

        <button id="btn-whatsapp" disabled onclick="irAWhatsApp()" style="background-color: #94a3b8; color: white; border: none; padding: 13px 20px; border-radius: 10px; font-weight: bold; font-size: 15px; width: 100%; cursor: not-allowed; opacity: 0.6; transition: all 0.3s;">
          🔒 Primero abrí Instagram
        </button>
      </div>
    `;
    resultadoDiv.classList.remove('hidden');
    return true;
  }
  return false;
}

function dibujarRuleta() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centroX = canvas.width / 2;
  const centroY = canvas.height / 2;
  const radio = centroX - 15;

  for (let i = 0; i < numOpciones; i++) {
    const angulo = anguloActual + i * arc;
    
    ctx.fillStyle = colores[i];
    ctx.beginPath();
    ctx.arc(centroX, centroY, radio, angulo, angulo + arc, false);
    ctx.lineTo(centroX, centroY);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 17px Segoe UI, sans-serif";
    
    const anguloTexto = angulo + arc / 2;
    const distanciaTexto = radio * 0.65;
    
    ctx.translate(
      centroX + Math.cos(anguloTexto) * distanciaTexto,
      centroY + Math.sin(anguloTexto) * distanciaTexto
    );
    
    ctx.rotate(anguloTexto + Math.PI / 2);
    ctx.fillText(opciones[i], -ctx.measureText(opciones[i]).width / 2, 0);
    ctx.restore();
  }

  // Círculo central decorativo
  ctx.beginPath();
  ctx.arc(centroX, centroY, 28, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 4;
  ctx.stroke();
}

dibujarRuleta();
verificarSiYaGiro();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (girando) return;

  if (localStorage.getItem('ruleta_premio')) {
    alert("Ya has participado anteriormente con este dispositivo.");
    return;
  }

  const usuarioIg = document.getElementById('nombre').value.trim();
  if (!usuarioIg) return;

  girando = true;
  btnGirar.disabled = true;
  resultadoDiv.classList.add('hidden');

  // 1. Seleccionar ganador 100% al azar entre las 8 opciones
  const indiceGanador = Math.floor(Math.random() * numOpciones);
  const premioGanado = opciones[indiceGanador];

  // 2. Calcular el ángulo exacto para que frene alineado con la flecha superior
  const anguloSector = (2 * Math.PI) / numOpciones;
  const anguloObjetivoSector = (3 * Math.PI / 2) - (indiceGanador * anguloSector) - (anguloSector / 2);

  // Entre 5 y 8 vueltas de giro
  const vueltasCompletas = (Math.floor(Math.random() * 4) + 5) * 2 * Math.PI;
  const anguloFinal = vueltasCompletas + anguloObjetivoSector;

  let tiempoInicio = null;
  const duracionAnimacion = 4500; // 4.5 segundos

  function animarRuleta(timestamp) {
    if (!tiempoInicio) tiempoInicio = timestamp;
    const progreso = (timestamp - tiempoInicio) / duracionAnimacion;

    if (progreso < 1) {
      // Curva de frenado progresivo (Ease-Out)
      const easeOut = 1 - Math.pow(1 - progreso, 3);
      anguloActual = easeOut * anguloFinal;
      dibujarRuleta();
      requestAnimationFrame(animarRuleta);
    } else {
      // Final de la animación
      anguloActual = anguloFinal % (2 * Math.PI);
      dibujarRuleta();
      girando = false;

      // Guardar participación en el navegador
      localStorage.setItem('ruleta_usuario_ig', usuarioIg);
      localStorage.setItem('ruleta_premio', premioGanado);

      btnGirar.textContent = "Ya participaste";

      const mensajeWA = encodeURIComponent(`¡Hola! Mi usuario de Instagram es @${usuarioIg}. Gané "${premioGanado}" en la ruleta y aquí te adjunto la captura de mi Historia etiquetando a @${TU_INSTAGRAM}.`);
      urlWhatsAppGlobal = `https://wa.me/${TU_NUMERO_WHATSAPP}?text=${mensajeWA}`;

      resultadoDiv.innerHTML = `
        <div style="background: #ffffff; border: 2px solid #cbd5e1; padding: 18px; border-radius: 14px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <h3 style="margin-top: 0; color: #122D52; font-size: 20px;">🎉 ¡Felicidades @<strong>${usuarioIg}</strong>!</h3>
          <p style="font-size: 18px; margin: 8px 0; color: #0f172a;">Ganaste: <strong>${premioGanado}</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 12px 0;">

          <div style="background: #f8fafc; border: 1px dashed #49688F; padding: 12px; border-radius: 10px; margin-bottom: 15px;">
            <p style="font-size: 14px; color: #334155; margin: 0 0 10px 0; line-height: 1.4;">
              📸 <strong>Para validar tu premio:</strong><br>
              1. Sácale captura a esta pantalla.<br>
              2. Tocá el botón rosa para abrir Instagram y subir la historia etiquetando a <strong>@${TU_INSTAGRAM}</strong>.<br>
              3. Al tocarlo, se activará el botón verde para enviarnos el comprobante por WhatsApp.
            </p>
            <button type="button" onclick="compartirEnInstagram()" style="background-color: #E1306C; color: white; border: none; padding: 12px 15px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%; font-size: 14px; margin-bottom: 5px;">
              1. Abrir Instagram para subir Historia 📸
            </button>
          </div>

          <button id="btn-whatsapp" disabled onclick="irAWhatsApp()" style="background-color: #94a3b8; color: white; border: none; padding: 13px 20px; border-radius: 10px; font-weight: bold; font-size: 15px; width: 100%; cursor: not-allowed; opacity: 0.6; transition: all 0.3s;">
            🔒 Primero abrí Instagram
          </button>
        </div>
      `;
      resultadoDiv.classList.remove('hidden');
    }
  }

  requestAnimationFrame(animarRuleta);
});
