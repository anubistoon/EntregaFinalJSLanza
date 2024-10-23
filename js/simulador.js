let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

function mostrarPacientes() {
    const listaPacientes = document.getElementById("listaPacientes");
    listaPacientes.innerHTML = "";

    if (pacientes.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No hay pacientes registrados.";
        listaPacientes.appendChild(li);
    } else {
        pacientes.forEach((paciente, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>Nº${index + 1}</strong> - 
                <span>Nombre: ${paciente.nombre}</span>, 
                <span>Edad: ${paciente.edad}</span>, 
                <span>Síntomas: ${paciente.sintomas.join(", ")}</span>
                <button class="eliminar" data-index="${index}">Eliminar</button>
            `;
            listaPacientes.appendChild(li);
        });

        document.querySelectorAll('.eliminar').forEach(btn => {
            btn.addEventListener('click', eliminarPaciente);
        });
    }
}

document.getElementById("pacienteForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const edad = parseInt(document.getElementById("edad").value.trim());
    const sintomas = document.getElementById("sintomas").value.trim().split(",").map(s => s.trim());

    if (!nombre || /[^a-zA-Z\s]/.test(nombre) || !apellido || /[^a-zA-Z\s]/.test(apellido) || isNaN(edad) || edad <= 0 || sintomas.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, complete correctamente los campos.'
        });
        return;
    }

    const paciente = {
        nombre: `${nombre} ${apellido}`,
        edad: edad,
        sintomas: sintomas
    };

    pacientes.push(paciente);
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
    mostrarPacientes();
    document.getElementById("pacienteForm").reset();

    Swal.fire({
        icon: 'success',
        title: 'Paciente registrado',
        text: 'El paciente ha sido registrado exitosamente.'
    });
});

function eliminarPaciente(event) {
    const index = event.target.dataset.index;
    pacientes.splice(index, 1);
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
    mostrarPacientes();

    Swal.fire({
        icon: 'success',
        title: 'Paciente eliminado',
        text: 'El paciente ha sido eliminado exitosamente.'
    });
}

document.getElementById("borrarBtn").addEventListener("click", () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Esto eliminará todos los pacientes!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            pacientes = [];
            localStorage.removeItem("pacientes");
            mostrarPacientes();
            Swal.fire(
                'Eliminado',
                'La lista de pacientes ha sido borrada.',
                'success'
            );
        }
    });
});

function cargarDatosExternos() {
    fetch('https://anubistoon.github.io/EntregaFinalJSLanza/data/pacientes.json')
        .then(response => response.json())
        .then(data => {
            pacientes = data;
            localStorage.setItem("pacientes", JSON.stringify(pacientes));
            mostrarPacientes();
            Swal.fire({
                icon: 'info',
                title: 'Datos cargados',
                text: 'Se han cargado pacientes desde el archivo externo.'
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar el archivo JSON.'
            });
            console.error("Error al cargar el archivo JSON:", error);
        });
}

document.getElementById("cargarBtn").addEventListener("click", cargarDatosExternos);

mostrarPacientes();
