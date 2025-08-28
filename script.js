const botonCalcular = document.getElementById('botonCalcular');
const formulario = document.getElementById('formulario');
//const resultado = document.getElementById('resultado');
const botonFinalizar = document.getElementById('finalizar');

botonCalcular.addEventListener('click', () => {
    botonCalcular.classList.add('hidden');
    document.getElementById('introduccion').classList.add('hidden');
    document.getElementById('datosPersonales').classList.remove('hidden');
    document.getElementById('nextButton').classList.remove('hidden');

    

});

const sections = document.querySelectorAll(".section");
const nextBtn = document.getElementById("nextButton");

let current = 0;

nextBtn.addEventListener("click", () => {
  // Ocultar la sección actual
  sections[current].classList.add("hidden");

  // Avanzar al siguiente índice
  current++;

  // Si no hay más secciones
  if (current >= sections.length) {
    alert("aca va el calculo de la huella de carbono mostrada en un modal?");
    nextBtn.classList.add("hidden");
    botonCalcular.classList.remove('hidden');
    document.getElementById('introduccion').classList.remove('hidden');
    return;
  }

  // Mostrar la siguiente sección
  sections[current].classList.remove("hidden");

  // Cambiar texto del botón si es la última sección
  if (current === sections.length - 1) {
    nextBtn.textContent = "Finalizar";
  }
});
