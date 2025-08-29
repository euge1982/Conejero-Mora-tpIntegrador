const botonCalcular = document.getElementById('botonCalcular');
const formulario = document.getElementById('formulario');
const resultado = document.getElementById('resultado');
const botonFinalizar = document.getElementById('finalizar');
let respuestas = {};

// Evento click en el boton "Calcular mi huella de carbono"
botonCalcular.addEventListener('click', () => {
  botonCalcular.classList.add('hidden');
  document.getElementById('introduccion').classList.add('hidden');
  document.getElementById('datosPersonales').classList.remove('hidden');
  document.getElementById('nextButton').classList.remove('hidden');
  document.getElementById('backButton').classList.remove('hidden');
  

  const sections = document.querySelectorAll(".section");
  const nextBtn = document.getElementById("nextButton");
  const backBtn = document.getElementById("backButton");

  let current = 0;

  // Boton siguiente
  nextBtn.addEventListener("click", () => {
    // Validar inputs de la seccion actual
    const currentSection = sections[current]; // Seccion actual
    // Obtener todos los inputs dentro de la seccion actual
    const inputs = currentSection.querySelectorAll("input, select");
    let valido = true;   // Bandera para verificar si todos los inputs son validos

    // Validar cada input
    inputs.forEach(input => {
      if ((input.type === "text" || input.type === "number") && input.value.trim() === "") {
        valido = false;
        input.classList.add("border-red-500"); // 👈 marcar error visual
      } else if (input.tagName === "SELECT" && input.value.trim() === "") {
        valido = false;
        input.classList.add("border-red-500");
      } else {
        input.classList.remove("border-red-500");
      }
    });
    // Si no es valido, mostrar alerta y salir
    if (!valido) {
      alert("Por favor, completa todos los campos antes de continuar.");
      return;
    }
    // Si es valido, guardar respuestas
    inputs.forEach(input => {
      respuestas[input.name || input.id] = input.value;
    });

    // Ocultar la sección actual
    sections[current].classList.add("hidden");

    // Avanzar al siguiente índice
    current++;

    // Si no hay más secciones
    if (current >= sections.length) {
      // Calcular huella de carbono
      const huella = calcularHuellaCarbono(respuestas);
      //document.getElementById('resultado').textContent = `${huella.toFixed(2)} kg CO2eq`;
      alert("Tu huella de carbono es: " + huella.toFixed(2) + " kg CO2eq");
      nextBtn.classList.add("hidden");
      backBtn.classList.add("hidden");
      nextBtn.textContent = "Siguiente";
      botonCalcular.classList.remove('hidden');
      //current = 0; // Reiniciar al inicio
      document.getElementById('introduccion').classList.remove('hidden');
      return;
    }

    // Mostrar la siguiente sección
    sections[current].classList.remove("hidden");

    // Cambiar texto del botón si es la última sección
    if (current === sections.length - 1) {
      nextBtn.textContent = "Finalizar";
    }
    else {
      nextBtn.textContent = "Siguiente";
    }
  });

  // Boton atras
  backButton.addEventListener("click", () => {
    
    // Si esta en la primera seccion
    if (current === 0){
      // Oculto los botones
      nextBtn.classList.add("hidden");
      backBtn.classList.add("hidden");

      // Muestro introduccion y boton calcular
      document.getElementById('introduccion').classList.remove('hidden');
      botonCalcular.classList.remove('hidden');
      sections[current].classList.add("hidden");
    //  return;
    }   
    
    // Si no esta en la primera seccion
    if (current > 0) {
      // Ocultar la sección actual
      sections[current].classList.add("hidden");

      // Retroceder al índice anterior
      current--;
      // Mostrar la sección anterior
      sections[current].classList.remove("hidden");
    }

    // Cambiar texto del botón si es la última sección
    if (current < sections.length - 1) {
      nextBtn.textContent = "Siguiente";
    }
  });

});

function calcularHuellaCarbono(respuestas) {
  let huellaTotal = 0;

  // DATOS PERSONALES
  // Tipo de casa
  const tipoCasa = respuestas['Tipo de casa'];
  switch (tipoCasa) {
    case "Casa":  huellaTotal += 20; break;
    case "Departamento": huellaTotal += 1; break;
    case "Casa rural": huellaTotal += 25; break;
    case "Casilla rodante": huellaTotal += 15; break;
    default: huellaTotal += 5; break;
  };

  // TRANSPORTE
  // Auto
  const tipoAuto = respuestas['Auto'];
  const kmAuto = parseFloat(respuestas['Km/semana']) || 0;
  switch (tipoAuto) {
    case "Nafta": huellaTotal += kmAuto * 0.2; break;
    case "Gasoil": huellaTotal += kmAuto * 0.18; break;
    case "Electrico": huellaTotal += kmAuto * 0.05; break;
    default: huellaTotal += 0; break;
  };

  // Moto/ Monopatin
  const tipoMoto = respuestas['Moto/Monopatin'];
  const kmMoto = parseFloat(respuestas['Km/semana']) || 0;
  switch (tipoMoto) {
    case "Nafta": huellaTotal += kmMoto * 0.11; break;
    case "Electrico": huellaTotal += kmMoto * 0.03; break;
    default: huellaTotal += 0; break;
  };

  // Transporte publico y bicicleta/caminar
  const kmTransportePublico = parseFloat(respuestas['Transporte público (km/semana)']) || 0;
  const kmBiciCaminar = parseFloat(respuestas['Bicicleta / Caminar (km/semana)']) || 0;
  huellaTotal += kmTransportePublico * 0.05;
  huellaTotal += kmBiciCaminar * 0.05;

  // VIAJES
  // Viajes en avion
  const viajesEnAvion = parseInt(respuestas['Viajes en avion']) || 0;
  const tipoVuelo = respuestas['Selecciona tipo de vuelo'];
  switch (tipoVuelo) {
    case "Nacional corto (< 1000 km)": huellaTotal += viajesEnAvion * 100; break;
    case "Nacional largo (1000-3000 km)": huellaTotal += viajesEnAvion * 200; break;
    case "Internacional (< 5000 km)": huellaTotal += viajesEnAvion * 1000; break;
    case "Internacional largo (> 5000 km)": huellaTotal += viajesEnAvion * 2000; break;
    default: huellaTotal += 0; break;
  };

  // ALIMENTACION
  const carne = respuestas['¿Cuántas veces por semana consumes carnes rojas?'];
  switch (carne) {
    case "Nunca": huellaTotal += 0; break;
    case "1 o 2": huellaTotal += 3; break;
    case "3 o 4": huellaTotal += 7; break;
    case "Mas de 5": huellaTotal += 13; break;
  };

   if(respuestas["¿Consumes productos lácteos?"] === "Sí") huellaTotal += 2;
  if(respuestas["¿Consumes frutas y verduras de temporada?"] === "No") huellaTotal += 2;
  if(respuestas["¿Consumes alimentos orgánicos/locales?"] === "No") huellaTotal += 2;
  const pescado = respuestas["¿Consumes pescado?"];
  switch(pescado){
    case "Nunca": huellaTotal += 0; break;
    case "1 a 2 veces": huellaTotal += 1.5; break;
    case "3 a 4 veces": huellaTotal += 3.5; break;
    case "5 o más": huellaTotal += 6; break;
  }

  // --- NIÑOS Y MASCOTAS ---
  const ninos = parseInt(respuestas["¿Cuántos menores de edad viven contigo?"]) || 0;
  huellaTotal += ninos * 1;
  const mascotas = parseInt(respuestas["¿Cuántas mascotas tienes?"]) || 0;
  huellaTotal += mascotas * 2;

  // --- ENERGÍA ---
  const consumoElectrico = parseFloat(respuestas["¿Cuál es tu consumo eléctrico mensual aprox? (kWh)"]) || 0;
  huellaTotal += consumoElectrico * 0.2;
  const calefaccion = respuestas["¿Qué tipo de calefacción usas?"];
  switch(calefaccion){
    case "Gas natural": huellaTotal += 10; break;
    case "Eléctrica": huellaTotal += 20; break;
    case "Leña": huellaTotal += 5; break;
  }

  // --- BASURA ---
  if(respuestas["¿Reciclas regularmente tus residuos?"] === "No") huellaTotal += 5;
  if(respuestas["¿Compras agua embotellada?"] === "Sí") huellaTotal += 3;

  // --- ROPA ---
  const ropa = respuestas["¿Compras ropa nueva cada mes?"];
  switch(ropa){
    case "Sí": huellaTotal += 5; break;
    case "Pocas veces": huellaTotal += 2; break;
    case "Frecuentemente": huellaTotal += 8; break;
  }

  // --- AGUA ---
  const minutosDucha = parseInt(respuestas["¿Cuántos minutos dura tu ducha diaria en promedio?"]) || 0;
  huellaTotal += minutosDucha * 0.2;
  if(respuestas["¿Utilizas el lavarropas o lavavajillas más de 3 veces por semana?"] === "Sí") huellaTotal += 2;
  if(respuestas["¿Dejas correr el agua mientras lavas platos o dientes?"] === "Sí") huellaTotal += 1;

  return huellaTotal; // en kg CO2eq aproximados


}

