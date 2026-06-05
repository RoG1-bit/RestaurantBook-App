let reservasGlobal = [];
let filtroActual = "todas";


const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

document.addEventListener("click", (e) => {

    if(
        !sidebar.contains(e.target) &&
        !menuBtn.contains(e.target)
    ){
        sidebar.classList.remove("active");
    }

});

async function cargarReservas(){

    try{

        const respuesta = await fetch("http://localhost:3000/api/reservas");
        const reservas = await respuesta.json();

        reservasGlobal = reservas;
        mostrarReservas();

    } catch(error){
        console.error(error);
    }
}

function mostrarReservas(){

    const contenedor = document.getElementById("listaReservas");
    contenedor.innerHTML = "";

    let filtradas = reservasGlobal;

    //  lógica de filtros
    if(filtroActual === "confirmada"){
        filtradas = reservasGlobal.filter(r => r.estado === "Confirmada");
    }

    if(filtroActual === "cancelada"){
        filtradas = reservasGlobal.filter(r => r.estado === "Cancelada");
    }

    if(filtroActual === "todas"){
    filtradas = reservasGlobal;
    }

    filtradas.forEach(reserva => {

        const estadoClase = reserva.estado.toLowerCase();

        const fecha = new Date(reserva.fecha).toLocaleDateString("es-SV", {
            day:"2-digit", month:"long", year:"numeric"
        });

        const hora = new Date(`1970-01-01T${reserva.hora_preferida}`)
        .toLocaleTimeString("es-SV", {
            hour:"numeric", minute:"2-digit", hour12:true
        });

        contenedor.innerHTML += `
        <div class="reserva-card ${estadoClase}">

            <div class="reserva-header">
                <h3>Reserva #${reserva.id_reserva}</h3>

                <span class="estado-${estadoClase}">
                    ${reserva.estado}
                </span>
            </div>

            <p><i class="fa-regular fa-calendar"></i> ${fecha}</p>
            <p><i class="fa-regular fa-clock"></i> ${hora}</p>
            <p><i class="fa-solid fa-users"></i> ${reserva.numero_personas}</p>

            <div class="acciones">

                <button class="btn-editar" data-id="${reserva.id_reserva}">
                    Editar
                </button>

                <button class="btn-cancelar" data-id="${reserva.id_reserva}">
                    Cancelar
                </button>

            </div>

        </div>
        `;
    });
}

document.querySelectorAll(".tab").forEach(btn => {

    btn.addEventListener("click", () => {

        document.querySelectorAll(".tab")
        .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        filtroActual = btn.dataset.filtro;

        mostrarReservas();
    });

});

cargarReservas();