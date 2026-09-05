const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const form = document.getElementById('form-ruleta');
const btnGirar = document.getElementById('btn-girar');
const resultadoDiv = document.getElementById('resultado');

// TU NÚMERO DE WHATSAPP
const TU_NUMERO_WHATSAPP = "542996579303";

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

// 🔒 REVISAR SI YA GIRÓ ANTES
function verificarSiYaGiro() {
  const usuarioGuardado = localStorage.getItem('ruleta_usuario_ig');
  const premioGuardado = localStorage.getItem('ruleta_premio');

  if (usuarioGuardado && premioGuardado) {
    btnGirar.disabled = true;
    btnGirar.textContent = "Ya participaste";
    
    // Deshabilitar los campos de texto
    const inputNombre = document.getElementById('nombre');
    if (inputNombre) inputNombre.disabled = true;

    const mensajeWA = encodeURIComponent(`¡Hola! Mi usuario de Instagram es ${usuarioGuardado} y gané: ${premioGuardado}`);
    const urlWA = `https://wa.me/${TU_NUMERO_WHATSAPP}?text=${mensajeWA}`;

    resultadoDiv.innerHTML = `
      ⚠️ <strong>Ya utilizaste tu giro disponible.</strong><br>
      Tu premio asignado fue: <strong>${premioGuardado}</strong><br><br>
      <a href="${urlWA}" target="_blank" style="display:inline-block; background-color:#25D366; color:white; padding:14px 20px; border-radius:10px; text-decoration:none; font-weight:bold; font-size:16px; box-shadow:0 4px 10px rgba(37,211,102,0.3);">Reclamar Premio por WhatsApp</a>
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
    
    // Dibujar Sector
    ctx.fillStyle = colores[i];
    ctx.beginPath();
    ctx.arc(centroX, centroY, radio, angulo, angulo + arc, false);
    ctx.lineTo(centroX, centroY);
    ctx.fill();

    // Borde blanco entre secciones
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Dibujar Texto
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

  // Si ya giró previamente en este celular/pantalla, frena el formulario
  if (localStorage.getItem('ruleta_premio')) {
    alert("Ya has participado anteriormente con este dispositivo.");
    return;
  }

  const usuarioIg = document.getElementById('nombre').value.trim();
  if (!usuarioIg) return;

  girando = true;
  btnGirar.disabled = true;
  resultadoDiv.classList.add('hidden');

  let velocidad = Math.random() * 8 + 22;
  const desaceleracion = 0.985;

  function animar() {
    velocidad *= desaceleracion;
    anguloActual += (velocidad * Math.PI) / 180;
    dibujarRuleta();

    if (velocidad > 0.05) {
      requestAnimationFrame(animar);
    } else {
      girando = false;
      
      const gradosTotales = (anguloActual * 180 / Math.PI) % 360;
      let indiceGanador = Math.floor((360 - (gradosTotales % 360) + 270) % 360 / (360 / numOpciones));
      
      const premioGanado = opciones[indiceGanador];
      
      // 🔒 GUARDAR EN EL NAVEGADOR PARA QUE NO PUEDA VOLVER A GIRAR
      localStorage.setItem('ruleta_usuario_ig', usuarioIg);
      localStorage.setItem('ruleta_premio', premioGanado);

      btnGirar.textContent = "Ya participaste";

      const mensajeWA = encodeURIComponent(`¡Hola! Mi usuario de Instagram es ${usuarioIg} y giré la ruleta. Gané: ${premioGanado}`);
      const urlWA = `https://wa.me/${TU_NUMERO_WHATSAPP}?text=${mensajeWA}`;

      resultadoDiv.innerHTML = `
        🎉 ¡Felicidades <strong>${usuarioIg}</strong>!<br>
        Ganaste: <strong>${premioGanado}</strong><br><br>
        <a href="${urlWA}" target="_blank" style="display:inline-block; background-color:#25D366; color:white; padding:14px 20px; border-radius:10px; text-decoration:none; font-weight:bold; font-size:16px; box-shadow:0 4px 10px rgba(37,211,102,0.3);">Reclamar Premio por WhatsApp</a>
      `;
      resultadoDiv.classList.remove('hidden');
    }
  }

  animar();
});
