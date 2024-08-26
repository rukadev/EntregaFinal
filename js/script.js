fetch("./../data.json")
    .then(response => response.json())
    .then(productos => principal(productos))
    .catch(error => console.log(error))

// función principal del programa.
function principal(paletas) {
    productos(paletas)
    filtrosCategoria(paletas)
    let carrito = obtenerCarrito()
    renCarrito(carrito, paletas)
    let input = document.getElementById("buscador")
    input.addEventListener("keyup", (e) => enter(paletas, e))
    let botonBuscar = document.getElementById("buscar")
    botonBuscar.addEventListener("click", () => filtrarPorNombre(paletas, input.value))
    let verCarrito = document.getElementById("verCarrito")
    verCarrito.addEventListener("click", verOcultar)
    let botonComprar = document.getElementById("comprar")
    botonComprar.addEventListener("click", finalizarComprar)
}

// función para filtrar productos por su nombre en el buscador.
function filtrarPorNombre(paletas, valorBusqueda) {
    let productosFiltrados = paletas.filter(producto => producto.nombre.includes(valorBusqueda.toUpperCase()))
    productos(productosFiltrados)
}

// función para filtrar productos.
function nuevoFiltrado(e, paletas) {
    let tarjet = paletas.filter(producto => producto.marca.includes(e.target.value))
    productos(tarjet)
}

// función para filtrar productos con el enter.
function enter(paletas, e) {
    if (e.keyCode === 13) {
        let valorBusquedaLower = e.target.value.toLowerCase()
        let productosFiltrados = paletas.filter(({ nombre }) => 
            nombre.toLowerCase().includes(valorBusquedaLower)
        )
        productos(productosFiltrados)
    }
}

// función para crear filtrado por categorías de los productos según su marca.
function filtrosCategoria(paletas) {
    let categorias = []
    let contenedorFiltros = document.getElementById("filtros")
    paletas.forEach(paleta => {
        if (!categorias.includes(paleta.marca)) {
            categorias.push(paleta.marca)
            let botonFiltro = document.createElement("button")
            botonFiltro.innerText = paleta.marca
            botonFiltro.value = paleta.marca
            botonFiltro.id = paleta.marca
            botonFiltro.addEventListener("click", (e) => nuevoFiltrado(e, paletas))
            contenedorFiltros.appendChild(botonFiltro)
        }
    });
    let botonTodos = document.getElementById("todos")
    botonTodos.addEventListener("click", (e) => nuevoFiltrado(e, paletas))
}

// función para ocultar los productos y ver el carrito.
function verOcultar(e) {
    if (e.target.innerText === "CARRITO") {
        e.target.innerText = "PRODUCTOS"
    } else {
        e.target.innerText = "CARRITO"
    }
    let contenedorProductos = document.getElementById("paginaProductos")
    let contenedorCarrito = document.getElementById("paginaCarrito")
    contenedorCarrito.classList.toggle("oculto")
    contenedorProductos.classList.toggle("oculto")
}

// función para crear las tajetas de los productos a vender.
function productos(paletas) {
    let contenedorProductos = document.getElementById("productos")
    contenedorProductos.innerHTML = ""
    paletas.forEach(paleta => {
        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.innerHTML += `
            <article class=grillaCont>
                <img src=./img/${paleta.rutaImg}>
                <ul>
                    <li>
                        <strong>$${paleta.precio}</strong>
                    </li>
                    <li>${paleta.nombre}</li>
                    <li>${paleta.marca.toUpperCase()}</li>
                    <li><button id=${paleta.id}>Añadir al carro</button></li>
                </ul>
            </article>
        `
        contenedorProductos.appendChild(tarjetaProducto)
        let botonCarrito = document.getElementById(paleta.id)
        botonCarrito.addEventListener("click", (e) => agregarAlCarrito(e, paletas))
    });
}

// función para agregar productos al carrito.
function agregarAlCarrito(e, paletas) {
    let carrito = obtenerCarrito()
    let idProducto = Number(e.target.id)
    let productoBuscado = paletas.find(producto => producto.id === idProducto)
    let indiceProdCarrito = carrito.findIndex(producto => producto.id === idProducto)
    let text = "Producto agregado al carrito"
    let bg = "#28f"
    if (indiceProdCarrito !== -1) {
        if (carrito[indiceProdCarrito].stock > 0) {
            carrito[indiceProdCarrito].unidades++
            carrito[indiceProdCarrito].subtotal = carrito[indiceProdCarrito].precio * carrito[indiceProdCarrito].unidades
            carrito[indiceProdCarrito].stock--
            alertaToastify(text, bg)
        } else {
            let text = "No hay más stock disponible"
            let bg = "#d55"
            alertaToastify(text, bg)
        }
    } else {
        if (productoBuscado.stock > 1) {
            carrito.push({
                id: productoBuscado.id,
                nombre: productoBuscado.nombre,
                precio: productoBuscado.precio,
                unidades: 1,
                subtotal: productoBuscado.precio,
                rutaImg: productoBuscado.rutaImg,
                marca: productoBuscado.marca,
                stock: productoBuscado.stock - 1
            })
            alertaToastify(text, bg)
        } else {
            let text = "No hay más stock disponible"
            let bg = "#d55"
            alertaToastify(text, bg)
        }
    }
    setearCarrito(carrito)
    renCarrito(carrito, paletas)
}

// función para información de productos en el carrito.
function renCarrito(carrito, paletas) {
    let contenedorCarrito = document.getElementById("contenedorCarrito")
    contenedorCarrito.innerHTML = ""
    carrito.forEach(({ id, nombre, precio, unidades, subtotal, marca, rutaImg }) => {
        let tarjetaCarrito = document.createElement("div")
        tarjetaCarrito.className = "tarjetaCarrito"
        tarjetaCarrito.id = "tc" + id
        tarjetaCarrito.innerHTML += `
            <img class=img-carrito src=./img/${rutaImg}>
            <div class="center mq">
                <h4>Nombre</h4>
                <p>${marca}</p>
                <p>${nombre}</p>
            </div>
            <div class="center mq">
                <h4>Precio c/u</h4>
                <p>$${precio}</p>
            </div>
            <div class="center">
                <h4>Unidad/es</h4>
                <div class="unidades">
                    <button id=ru${id}>-</button>
                    <p>${unidades}</p>
                    <button id=su${id}>+</button>
                </div>
            </div>
            <div class="center mq">
                <h4 id=st>Subtotal</h4>
                <p>$${subtotal}</p>
            </div>
            <div class=center>
                <button id=be${id} class=btn-eliminar>Eliminar</button>
            </div>
        `
        contenedorCarrito.appendChild(tarjetaCarrito)
        let btnEliminar = document.getElementById("be" + id)
        btnEliminar.addEventListener("click", (e) => eliminarProducto(e))
        montoTotal(carrito)
        let botonResta = document.getElementById("ru" + id)
        botonResta.addEventListener("click", (e) => restarUnidad(e, paletas))
        let botonSuma = document.getElementById("su" + id)
        botonSuma.addEventListener("click", (e) => sumarUnidad(e, paletas))
    })
}

// función para finalizar la compra en el carrito.
function finalizarComprar() {
    let carritoStorage = localStorage.getItem("carrito")
    let contenedorCarrito = document.getElementById("contenedorCarrito")
    let contenedorTotal = document.getElementById("total")
    if (carritoStorage) {
        let title = "Muchas gracias por su compra!"
        let text = ""
        let icon = "success"
        let confirmButtonText = "Aceptar"
        localStorage.removeItem("carrito")
        contenedorCarrito.innerHTML = ""
        contenedorTotal.innerText = ""
        alertaSweet(title, text, icon, confirmButtonText)
    } else {
        let title = "No hay productos en el carrito"
        let text = "Por favor agregar productos al carrito para finalizar compra"
        let icon = "error"
        let confirmButtonText = "Aceptar"
        alertaSweet(title, text, icon, confirmButtonText)
        contenedorCarrito.innerHTML = ""
    }
}

// función para sumar unidades dentro del carrito.
function sumarUnidad(e, paletas) {
    let id = Number(e.target.id.substring(2))
    let carrito = obtenerCarrito()
    let productoOriginal = paletas.find(producto => producto.id === id)
    let productoCarrito = carrito.find(producto => producto.id === id)
    if (productoOriginal.stock > productoCarrito.unidades) {
        productoCarrito.unidades++
        productoCarrito.subtotal = productoCarrito.precio * productoCarrito.unidades
        productoCarrito.stock--
        let text = "Producto sumado al carrito"
        let bg = "#28f"
        alertaToastify(text, bg)
    } else {
        let text = "No hay más stock disponible"
        let bg = "#d55"
        alertaToastify(text, bg)
    }
    setearCarrito(carrito)
    renCarrito(carrito, paletas)
}

// función para restar unidades dentro del carrito.
function restarUnidad(e, paletas) {
    let id = Number(e.target.id.substring(2))
    let carrito = obtenerCarrito()
    let productoCarrito = carrito.find(producto => producto.id === id)
    if (productoCarrito.unidades > 1) {
        productoCarrito.unidades--
        productoCarrito.subtotal = productoCarrito.precio * productoCarrito.unidades
        productoCarrito.stock++
        setearCarrito(carrito)
        renCarrito(carrito, paletas)
        let text = "Se quito una unidad"
        let bg = "#555"
        alertaToastify(text, bg)
    } else {
        eliminarProducto(e)
    }
}

// función para eliminar producto del carrito.
function eliminarProducto(e) {
    let id = Number(e.target.id.substring(2))
    let carrito = obtenerCarrito()
    carrito = carrito.filter(producto => producto.id !== id)
    setearCarrito(carrito)
    let nodoProducto = document.getElementById("tc" + id)
    nodoProducto.remove()
    let carritoStorage = localStorage.getItem("carrito")
    let text = "Se elimino el producto del carrito"
    let bg = "#d55"
    alertaToastify(text, bg)
    if (carritoStorage === "[]") {
        localStorage.removeItem("carrito")
    }
    montoTotal(carrito)
}

// función para saber el total a pagar.
function montoTotal(carrito) {
    let total = carrito.reduce((acum, prod) => {
        let subtotal = prod.precio * prod.unidades;
        return acum + subtotal;
    }, 0)
    let contenedorTotal = document.getElementById("total")
    contenedorTotal.innerHTML = ""
    let infoTotal = document.createElement("h4")
    infoTotal.innerText = `Total $${total}`
    contenedorTotal.appendChild(infoTotal)
}

// función para obtener información del localStorage.
function obtenerCarrito() {
    let carrito = []
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
    }
    return carrito
}

// función para setear información al localStorage.
function setearCarrito(carrito) {
    let carritoJSON = JSON.stringify(carrito)
    localStorage.setItem("carrito", carritoJSON)
}

// función para mostrar alerta agregar producto al carrito.
function alertaToastify(text, background) {
    Toastify({
        text,
        duration: 2000,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background
        },
    }).showToast();
}

// función para mostrar alerta finalizar compra.
function alertaSweet(title, text, icon, confirmButtonText) {
    Swal.fire({
        title,
        text,
        icon,
        confirmButtonText
    })
}