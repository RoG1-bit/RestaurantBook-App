
// ================= MENU =================
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

// Usuario logueado
const usuario =
JSON.parse(localStorage.getItem("usuario"));
const correoUsuario = usuario.correo;

// Modal Editar
const modal = document.getElementById("modalEditar");
const btnCerrar = document.getElementById("btnCerrar");

let reservaSeleccionada = null;

const formEditar =
document.getElementById("formEditarReserva");

// Modal cancelar 
const modalCancelar = document.getElementById("modalCancelar");
const btnNoCancelar = document.getElementById("btnNoCancelar");
const btnSiCancelar = document.getElementById("btnSiCancelar");


let idReservaCancelar = null;

btnCerrar.addEventListener("click", () => {
    modal.classList.remove("active");
});

// ================= cancelar accion =================
btnNoCancelar.addEventListener("click", () => {
    modalCancelar.classList.remove("active");
    idReservaCancelar = null;
});


//cancelar

btnSiCancelar.addEventListener("click", async () => {

    try{

        await fetch(
            `http://localhost:3000/api/reservas/${idReservaCancelar}/cancelar`,
            { method: "PUT" }
        );

        modalCancelar.classList.remove("active");
        idReservaCancelar = null;

        cargarReservas();

    }catch(error){
        console.error(error);
    }

});

// Cargando datos
async function cargarReservas(){

    try{

        const respuesta = await fetch(
           "http://localhost:3000/api/reservas"
            );

            const reservas = await respuesta.json();

            const reservasUsuario =
            reservas.filter(r =>
                r.contacto.includes(usuario.correo)
            );

mostrarReservas(reservasUsuario);

    }
    catch(error){
        console.error(error);
    }
}


// ================= MOSTRAR EN PANTALLA =================
function mostrarReservas(reservas){

    const contenedor = document.getElementById("listaReservas");

    contenedor.innerHTML = "";

    reservas.forEach(reserva => {

        const estadoClase = reserva.estado.toLowerCase();

        const fecha = new Date(reserva.fecha).toLocaleDateString("es-SV", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        const hora = new Date(`1970-01-01T${reserva.hora_preferida}`)
        .toLocaleTimeString("es-SV", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });

        contenedor.innerHTML += `
        <div class="reserva-card ${estadoClase}">

            <div class="reserva-header">

                <h3>Reserva #${reserva.id_reserva}</h3>

                <span class="estado-${estadoClase}">
                    ${reserva.estado}
                </span>

            </div>

            <p>
                <i class="fa-regular fa-calendar"></i>
                ${fecha}
            </p>

            <p>
                <i class="fa-regular fa-clock"></i>
                ${hora}
            </p>

            <p>
                <i class="fa-solid fa-users"></i>
                ${reserva.numero_personas} personas
            </p>

            <div class="acciones">

                <button 
                class="btn-editar"
                data-id="${reserva.id_reserva}"
                data-fecha="${reserva.fecha}"
                data-hora="${reserva.hora_preferida}"
                data-personas="${reserva.numero_personas}">
                    <i class="fa-solid fa-pen"></i>
                    Editar
                </button>

                <button class="btn-cancelar" data-id="${reserva.id_reserva}">
                    <i class="fa-solid fa-ban"></i>
                    Cancelar
                </button>

            </div>

        </div>
        `;
    });
}


//  CLICK GLOBAL (TODO EN UNO) 
document.addEventListener("click", async (e) => {

    // ----- SIDEBAR -----
    if(
        !sidebar.contains(e.target) &&
        !menuBtn.contains(e.target)
    ){
        sidebar.classList.remove("active");
    }

    // ----- EDITAR -----
    const btnEditar =
    e.target.closest(".btn-editar");

    if(btnEditar){

        reservaSeleccionada =
        btnEditar.dataset.id;

        document.getElementById("editFecha").value =
        btnEditar.dataset.fecha.split("T")[0];
        

        document.getElementById("editHora").value =
        btnEditar.dataset.hora;

        document.getElementById("editPersonas").value =
        btnEditar.dataset.personas;

        modal.classList.add("active");
    }

    // ----- CANCELAR RESERVA -----
    if(e.target.closest(".btn-cancelar")){

    const btn = e.target.closest(".btn-cancelar");
    idReservaCancelar = btn.dataset.id;

    modalCancelar.classList.add("active");
}

});

// ================= guardar ================
formEditar.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();
             console.log("Guardar presionado");
        const datos = {

            fecha:
            document.getElementById("editFecha").value,

            hora_preferida:
            document.getElementById("editHora").value,

            numero_personas:
            document.getElementById("editPersonas").value

        };

        try{

            const respuesta =
            await fetch(
                `http://localhost:3000/api/reservas/${reservaSeleccionada}`,
                {
                    method: "PUT",
                    headers:{
                        "Content-Type":
                        "application/json"
                    },
                    body:
                    JSON.stringify(datos)
                }
            );

            const resultado =
            await respuesta.json();

            alert(resultado.mensaje);

            modal.classList.remove("active");

            cargarReservas();

        }
        catch(error){

            console.error(error);

        }

    }
);

// ================= INICIAR APP =================
cargarReservas();