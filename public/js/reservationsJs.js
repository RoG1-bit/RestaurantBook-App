// ================= MENU =================

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


// ================= USUARIO LOGUEADO =================

const usuario =
JSON.parse(localStorage.getItem("usuario"));

if(usuario){

    document.getElementById("nombre").value =
    usuario.nombre;

    document.getElementById("correo").value =
    usuario.correo;
}

// ================= HORARIOS =================

let horaSeleccionada = "19:00:00";

document.querySelectorAll(".horas button")
.forEach(btn => {

    btn.addEventListener("click", () => {

        document.querySelectorAll(".horas button")
        .forEach(b => b.classList.remove("seleccionada"));

        btn.classList.add("seleccionada");

        horaSeleccionada =
        btn.dataset.hora;

        console.log(
            "Hora seleccionada:",
            horaSeleccionada
        );

    });

});



const horaDefault =
document.querySelector(
    '[data-hora="19:00:00"]'
);

if(horaDefault){
    horaDefault.classList.add("seleccionada");
}


// ================= FORMULARIO =================

const formReserva =
document.getElementById("formReserva");

if(formReserva){

    formReserva.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const telefono =
            document.getElementById("telefono").value;

            const correo =
            document.getElementById("correo").value;

            const datos = {

                id_usuario: 1,

                nombre_cargo:
                document.getElementById("nombre").value,

                contacto:
                `${telefono} - ${correo}`,

                fecha:
                document.getElementById("fecha").value,

                hora_preferida:
                horaSeleccionada,

                numero_personas:
                document.getElementById("personas").value,

                solicitudes_especiales:
                document.getElementById("solicitudes").value

            };

            console.log(datos);

            try{

                const respuesta =
                await fetch(
                    "http://localhost:3000/api/reservas",
                    {
                        method: "POST",
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

            }
            catch(error){

                console.error(error);

                alert(
                    "Error al crear reserva"
                );

            }

        }
    );

}