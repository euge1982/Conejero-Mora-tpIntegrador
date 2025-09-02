document.addEventListener('DOMContentLoaded', () => {
  // Obtenemos las referencias a los elementos del DOM
  const botonCalcular = document.getElementById('botonCalcular');
  const formulario = document.getElementById('formulario');
  const resultado = document.getElementById('resultado');
  const sections = document.querySelectorAll(".section");
  const nextBtn = document.getElementById("nextButton");
  const backBtn = document.getElementById("backButton");
  const introduccion = document.getElementById('introduccion');
  const datosPersonales = document.getElementById('datosPersonales');
  const reiniciarBtn = document.getElementById('reiniciarBtn');
  const huellaValor = document.getElementById('huellaValor');
  const mensajePersonalizado = document.getElementById('mensajePersonalizado');
  const huellaNombre = document.getElementById('huellaNombre');

  // Declaramos variables
  let current = 0;
  let respuestas = {};

  // --------- FUNCIONES AUXILIARES ---------

  // FUNCION PARA CALCULAR LA HUELLA DE CARBONO
  function calcularHuellaCarbono(respuestas) {
    let huellaTotal = 0;

    // DATOS PERSONALES
    // Tipo de casa
    const tipoCasa = respuestas["tipoCasa"];
    switch (tipoCasa) {
      case "Casa":  huellaTotal += 20; break;
      case "Departamento": huellaTotal += 1; break;
      case "Casa rural": huellaTotal += 25; break;
      case "Casilla rodante": huellaTotal += 15; break;
      default: huellaTotal += 5; break;
    };

    // TRANSPORTE
    // Auto
    const tipoAuto = respuestas["auto"];
    const kmAuto = parseFloat(respuestas["kmAuto"]) || 0;
    switch (tipoAuto) {
      case "Nafta": huellaTotal += kmAuto * 0.2; break;
      case "Gasoil": huellaTotal += kmAuto * 0.18; break;
      case "Electrico": huellaTotal += kmAuto * 0.05; break;
      default: huellaTotal += 0; break;
    };

    // Moto/ Monopatin
    const tipoMoto = respuestas["moto/monopatin"];
    const kmMoto = parseFloat(respuestas["kmMotoMono"]) || 0;
    switch (tipoMoto) {
      case "Nafta": huellaTotal += kmMoto * 0.11; break;
      case "Electrico": huellaTotal += kmMoto * 0.03; break;
      default: huellaTotal += 0; break;
   };

    // Transporte publico y bicicleta/caminar
    const kmTransportePublico = parseFloat(respuestas["transportePublico"]) || 0;
    const kmBiciCaminar = parseFloat(respuestas["biciCaminar"]) || 0;
    huellaTotal += kmTransportePublico * 0.05;
    huellaTotal += kmBiciCaminar * 0.05;

    // VIAJES
    // Viajes en avion
    const viajesEnAvion = parseInt(respuestas["numeroViajes"]) || 0;
    const tipoVuelo = respuestas["tipoVuelo"];
    switch (tipoVuelo) {
      case "Nacional corto (< 1000 km)": huellaTotal += viajesEnAvion * 100; break;
      case "Nacional largo (1000-3000 km)": huellaTotal += viajesEnAvion * 200; break;
      case "Internacional (< 5000 km)": huellaTotal += viajesEnAvion * 1000; break;
      case "Internacional largo (> 5000 km)": huellaTotal += viajesEnAvion * 2000; break;
      default: huellaTotal += 0; break;
    };

    // ALIMENTACION
    const carne = respuestas["carnesRojas"];
    switch (carne) {
      case "Nunca": huellaTotal += 0; break;
      case "1 o 2": huellaTotal += 3; break;
      case "3 o 4": huellaTotal += 7; break;
      case "Mas de 5": huellaTotal += 13; break;
    };

    if(respuestas["lacteos"] === "Sí") huellaTotal += 2;
    if(respuestas["frutasVerduras"] === "No") huellaTotal += 2;
    if(respuestas["alimentosOrganicos"] === "No") huellaTotal += 2;
    const pescado = respuestas["pescado"];
    switch(pescado){
      case "Nunca": huellaTotal += 0; break;
      case "1 a 2 veces": huellaTotal += 1.5; break;
      case "3 a 4 veces": huellaTotal += 3.5; break;
      case "5 o más": huellaTotal += 6; break;
    };

    // NIÑOS Y MASCOTAS
    const ninos = parseInt(respuestas["ninos"]) || 0;
    huellaTotal += ninos * 1;
    const mascotas = parseInt(respuestas["mascotas"]) || 0;
    huellaTotal += mascotas * 2;

    // ENERGIA
    const consumoElectrico = parseFloat(respuestas["consumoElectrico"]) || 0;
    huellaTotal += consumoElectrico * 0.2;
    const calefaccion = respuestas["calefaccion"];
    switch(calefaccion){
      case "Gas natural": huellaTotal += 10; break;
      case "Eléctrica": huellaTotal += 20; break;
      case "Leña": huellaTotal += 5; break;
    };

    // BASURA
    if(respuestas["reciclas"] === "No") huellaTotal += 5;
    if(respuestas["aguaEmbotellada"] === "Sí") huellaTotal += 3;

    // ROPA
    const ropa = respuestas["ropaNueva"];
    switch(ropa){
      case "Sí": huellaTotal += 5; break;
      case "Pocas veces": huellaTotal += 2; break;
      case "Frecuentemente": huellaTotal += 8; break;
    };

    // AGUA
    const minutosDucha = parseInt(respuestas["minutosDucha"]) || 0;
    huellaTotal += minutosDucha * 0.2;
    if(respuestas["lavados"] === "Sí") huellaTotal += 2;
    if(respuestas["aguaCorriendo"] === "Sí") huellaTotal += 1;

    huellaTotal = huellaTotal/1000*52; // pasamos de kilos a toneladas y se anualiza el resultado
    return huellaTotal; // en tCO2e aproximados

  };

  // FUNCION PARA MOSTRAR EL RESULTADO
  function mostrarResultado(huella) {
    // Se llenan los datos
    huellaNombre.textContent = `${respuestas['nombre']} tu huella de carbono es: `;
    huellaValor.textContent = `${huella.toFixed(2)} tCO2e por año`;
    
    // Mensaje personalizado segun el resultado de la huella
    if (huella < 2) mensajePersonalizado.textContent = "¡Excelente! Tu huella de carbono es baja. Sigue así y considera compartir tus hábitos con otros.";
    else if (huella < 5) mensajePersonalizado.textContent = "Buen trabajo, pero hay margen de mejora. Considera reducir el uso del auto y aumentar el reciclaje.";
    else if (huella < 10) mensajePersonalizado.textContent = "Tu huella es moderada. Intenta hacer cambios en tu dieta y transporte para reducirla.";
    else mensajePersonalizado.textContent = "Tu huella es alta. Es crucial que tomes medidas significativas en todas las áreas para reducir tu impacto.";
  
    // Se muestra el resultado en pantalla
    resultado.classList.remove('hidden');
    console.log(respuestas);

  };

  // --------- EVENTOS ---------

  // EVENTO CLICK EN EL BOTON "CALCULAR HUELLA"
  botonCalcular.addEventListener('click', () => {
    botonCalcular.classList.add('hidden');
    introduccion.classList.add('hidden');
    datosPersonales.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
    backBtn.classList.remove('hidden');
    current = 0;
  
  });

  // EVENTO CLICK EN EL BOTON "SIGUIENTE"
  nextBtn.addEventListener("click", () => {
    // Tenemos que validar inputs de la seccion actual
    // Obtenemos la seccion actual
    const currentSection = sections[current];

    // Obtenemos todos los inputs dentro de la seccion actual
    const inputs = currentSection.querySelectorAll("input, select");
    
    // Bandera para verificar si todos los inputs son validos
    let valido = true;

    // Validamos cada input recorriendo los inputs
    inputs.forEach(input => {
      // Si el input es de tipo text o number y esta vacio, no es valido
      if ((input.type === "text" || input.type === "number") && input.value.trim() === "") {
        valido = false;
        input.classList.add("border-red-500");   // marcamos el error visualmente
      }   // Si el input es de tipo select y no hay ninguno seleccionado, no es valido 
      else if (input.tagName === "SELECT" && input.value.trim() === "") {
        valido = false;
        input.classList.add("border-red-500");
      }   // Si es valido, quitamos cualquier marca de error previa 
      else {
        input.classList.remove("border-red-500");
      }
    });

    // Si no es valido, mostramos un alert y salimos
    if (!valido) {
      alert("Por favor, completa todos los campos antes de continuar.");
      return;
    }

    // Si es valido, guardamos las respuestas
    inputs.forEach(input => {   
      respuestas[input.name] = input.value;
    });

    // Ocultamos la seccion actual
    sections[current].classList.add("hidden");

    // Avanzamos al siguiente indice
    current++;

    // Si no hay mas secciones
    if (current >= sections.length) {
      // Calculamos la huella de carbono
      const huella = calcularHuellaCarbono(respuestas);

      // Mostramos el resultado en pantalla
      mostrarResultado(huella);

      // Ocultamos los botones de navegacion
      nextBtn.classList.add("hidden");
      backBtn.classList.add("hidden");

      // Reiniciamos el texto del boton
      nextBtn.textContent = "Siguiente";

      // Reiniciamos el indice para una posible nueva medicion
      current = 0;   
      return;
    }

    // Mostramos la siguiente seccion
    sections[current].classList.remove("hidden");

    // Cambiamos el texto del boton si es la ultima seccion
    if (current === sections.length - 1) nextBtn.textContent = "Finalizar";
   
  });

  // EVENTO CLICK EN EL BOTON "ATRAS"
  backBtn.addEventListener("click", () => {
    // Si esta en la primera seccion
    if (current === 0){
      // Ocultamos los botones
      nextBtn.classList.add("hidden");
      backBtn.classList.add("hidden");

      // Reiniciamos el formulario
      formulario.reset();
      respuestas = {};

      // Mostramos introduccion y boton calcular
      introduccion.classList.remove('hidden');
      botonCalcular.classList.remove('hidden');
      
      // Ocultamos la seccion actual
      sections[current].classList.add("hidden");
      return;
    }   
    
    // Si no esta en la primera seccion
    if (current > 0) {
      // Ocultamos la seccion actual
      sections[current].classList.add("hidden");

      // Retrocedemos al indice anterior
      current--;

      // Mostramos la seccion anterior
      sections[current].classList.remove("hidden");
    }

    // Cambiamos el texto del boton si es la ultima seccion
    if (current < sections.length - 1) {
      nextBtn.textContent = "Siguiente";
    }

  });

  // EVENTO CLICK EN EL BOTON "REINICIAR"
  reiniciarBtn.addEventListener('click', () => {
    // Ocultamos el resultado
    resultado.classList.add('hidden');

    // Mostramos introduccion y boton calcular
    introduccion.classList.remove('hidden');
    botonCalcular.classList.remove('hidden');
    
    // Reiniciamos formulario
    formulario.reset();
    respuestas = {};

    // Ocultamos los botones de navegacion
    nextBtn.classList.add('hidden');
    backBtn.classList.add('hidden');

  });

});
    // tema claro/oscuro 
const btnToggle = document.getElementById('themeToggle');
const label = document.getElementById('themeLabel');

btnToggle?.addEventListener('click', () => {
  const root = document.documentElement;
  const isDark = root.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  if (label) label.textContent = isDark ? 'Claro' : 'Oscuro';
});

// Refresca la etiqueta en la carga
document.addEventListener('DOMContentLoaded', () => {
  const isDark = document.documentElement.classList.contains('dark');
  if (label) label.textContent = isDark ? 'Claro' : 'Oscuro';
});
