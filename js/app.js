const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
  formulario.addEventListener('submit', buscarClima);

})

function buscarClima(e) {
  e.preventDefault();

  // Validar
  const ciudad = document.querySelector('#ciudad').value;
  const pais = document.querySelector('#pais').value;

  if (ciudad === '' || pais === '') {
    // Hubo un error
    mostrarError('Ambos campos son obligatorios')

    return
  }

  // consultamos la API
  consultarAPI(ciudad, pais);

}

function mostrarError(mensaje) {

  const alerta = document.querySelector('.bg-red-100');

  if (!alerta) {
    // crear una alerta
    const alerta = document.createElement('div');

    alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded',
      'max-w-md', 'mx-auto', 'mt-6', 'text-center');

    alerta.innerHTML = `
      <strong class="font-bold">Error!</strong>
      <strong class="block">${mensaje}</strong>
    `;

    container.appendChild(alerta);

    // Eliminamos la alerta despues de 3 segundos
    setTimeout(() => {
      alerta.remove()
    }, 3000);
  }
}

function consultarAPI(ciudad, pais) {

  const appId = 'cfd27e72a03707a2de95f48463a60c53';

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

  fetch(url)
    .then(respuesta => {
      return respuesta.json();
    })
    .then(datos => {
      limpiarHTML() //limpiamos el html previo

      if (datos.cod === "404") {
        mostrarError('Ciudad no encontrada')
        return;
      }

      // Imprime la respuesta en el HTML
      mostrarClima(datos);
    })

}

function mostrarClima(datos) {
  const { main: { temp, temp_max, temp_min } } = datos;

  const centigrados = kelvinACentigrados(temp);
  const max = kelvinACentigrados(temp_max);
  const min = kelvinACentigrados(temp_min);

  const actual = document.createElement('p');
  actual.innerHTML = `${centigrados} &#8451`;
  actual.classList.add('font-bold', 'text-6xl');

  const tempMaxima = document.createElement('p');
  tempMaxima.innerHTML = `${max} &#8451`;
  tempMaxima.classList.add('text-xl');

  const resultadoDiv = document.createElement('div');
  resultadoDiv.classList.add('text-center', 'text-white');

  resultadoDiv.appendChild(actual);
  resultadoDiv.appendChild(tempMaxima);

  resultado.appendChild(resultadoDiv);
}

// const kelvinACentigrados = grados => parseInt(grados - 272.15);
function kelvinACentigrados(grados) {
  return parseInt(grados - 272.15)
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}