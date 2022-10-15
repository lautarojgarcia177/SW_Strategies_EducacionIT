console.log("SuperLista");

///////////////////////////////// OBJETOS Y VARIABLES ///////////////////////////////
let items = [];
const btnAgregar = document.querySelector("#btn-entrada-producto");
const btnBorrar = document.querySelector("#btn-borrar-productos");
const btnGuardar = document.querySelector("#btn-storage-guardar");
const btnCargar = document.querySelector("#btn-storage-cargar");
const btnLimpiar = document.querySelector("#btn-storage-limpiar");

///////////////////////////////// FUNCIONES /////////////////////////////////////////
/**
 *
 * nombre: crearItem
 * parametro: objeto *El objeto está desestructurado, es decir, se toma las propiedades por
 * separado para facilitar su acceso
 * retorno: elemento del DOM
 */
function crearItem({ id, nombre, cantidad, precio }) {
  // Creo un método que me permita automatizar la creación de los input ya que es un proceso parecido para ambos
  const inputTemplate = (changeCallback, inputId, labelValue) => {
    const span = document.createElement("span");
    span.classList.add("mdl-list__item-primary-content", "w-20");

    const div = document.createElement("div");
    div.classList.add("mdl-textfield", "mdl-js-textfield");

    const input = document.createElement("input");
    input.classList.add("mdl-textfield__input");
    input.onchange = changeCallback;
    input.type = "text";
    input.id = inputId;
    div.appendChild(input);

    const label = document.createElement("label");
    label.classList.add("mdl-textfield__label");
    label.for = inputId;
    label.innerHTML = labelValue;
    div.appendChild(label);

    span.appendChild(div);

    return span;
  };

  const li = document.createElement("li");
  li.classList.add("mdl-list__item");

  const spanIcon = document.createElement("span");
  spanIcon.classList.add("mdl-list__item-primary-content", "w-10");
  spanIcon.innerHTML = '<i class="material-icons">shopping_cart</i>';
  li.appendChild(spanIcon);

  const spanNombre = document.createElement("span");
  spanNombre.innerHTML = nombre;
  spanNombre.classList.add("mdl-list__item-primary-content", "w-30");
  li.appendChild(spanNombre);

  li.appendChild(
    inputTemplate(
      function (e) {
        items[id].cantidad = Number(e.target.value);
      },
      "cant-" + id,
      cantidad
    )
  );

  li.appendChild(
    inputTemplate(
      function (e) {
        items[id].precio = Number(e.target.value);
      },
      "precio-" + id,
      precio
    )
  );

  return li;
}

/**
 *
 * nombre: renderItems
 * parametro: items (array de items a renderizar)
 * retorno: nada
 * proceso: la lógica es muy simple y consta de tres pasos bien definidos
 *  1) Seleccionar el contenedor (#ul_lista)
 *  2) Vaciar el contenedor, lo que ocasiona que se borren todos los items (innerHTML = "")
 *  3) Volver a llenar el contenedor basado en los items actuales (forEach)
 *      Al redibujar los items desde código, es necesario actualizar los estilos CSS
 *      del ul provistos por MaterialDesign con componentHandler.upgradeElements()
 */
function renderItems(items) {
    let ul = document.querySelector("#ul_lista");
    // Borrar los elementos actuales
    ul.innerHTML = "";
  
    // Cargar los elementos de la lista
    items.forEach(function (producto, indice) {
      ul.appendChild(
        crearItem({
          id: indice,
          nombre: producto.nombre,
          cantidad: producto.cantidad,
          precio: producto.precio,
        })
      );
    });
    // Actualizar los estilos de MaterialDesign
    componentHandler.upgradeElements(ul);
  }


  

function guardar(items) {
  localStorage.setItem("SuperLista_Items", JSON.stringify(items));
}

function cargar() {
  let storage = localStorage.getItem("SuperLista_Items");
  if (storage) {
    return JSON.parse(storage);
  }
  return false; // Si no hay datos guardados, retorna 'false'
}

function limpiar() {
    localStorage.removeItem('SuperLista_Items');
}



function registrarServiceWorker(url) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register(url)
      .then((registracion) => {
        console.log("SW registrado correctamente", registracion.scope);
      })
      .catch((error) => console.log(error));
  }
}

function desregistrarServiceWorker() {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    for (let reg of regs) {
      reg.unregister();
    }
  });
}

///////////////////////////////// EVENTOS ///////////////////////////////////////////
btnAgregar.addEventListener("click", () => {
  let input = document.querySelector("#ingreso-producto");
  let producto = input.value;

  if (producto != "") {
    items.push({
      nombre: producto,
      cantidad: 1,
      precio: 0,
    });

    renderItems(items);
  }

  input.value = "";
});

btnBorrar.addEventListener("click", () => {
  items = [];
  renderItems(items);
});

document.addEventListener("DOMContentLoaded", () => {
  registrarServiceWorker('serviceWorker.js');
  // desregistrarServiceWorker();

  if (cargar() && confirm("Tiene items guardados ¿Desea cargarlos?")) {
    items = cargar();
    renderItems(items);
  }
});

btnGuardar.addEventListener("click", () => {
  guardar(items);
});

btnCargar.addEventListener("click", () => {
  if (cargar()) {
    items = cargar();
    renderItems(items);
  } else {
    alert("No hay items guardados");
  }
});

btnLimpiar.addEventListener('click', () => {
    limpiar(); // Limpia el Storage
    location.reload() // Recarga la pagina
});
