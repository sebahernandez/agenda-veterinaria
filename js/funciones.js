import Citas from './clases/Citas.js'
import UI from './clases/UI.js'
import {
    mascotaInput, 
    propietarioInput, 
    telefonoInput, 
    fechaInput, 
    horaInput,
    sintomasInput, 
    formulario  
} from './selectores.js'
import {db} from '../js/db.js'

const ui = new UI();

const administrarCitas = new Citas();

let editando;

// Objeto con la información de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}

// Agrega datos al objeto de cita
export function datosCita(e) {
    citaObj[e.target.name] = e.target.value;

}   


// Valida y agrega una nueva cita a la clase de citas
export function nuevaCita(e){
    e.preventDefault();

    // Extraer la información del objeto de cita
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // validar 
    if(
    mascota === '' || 
    propietario === '' || 
    telefono === '' || 
    fecha === '' || 
    hora === '' || 
    sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if(editando) {
        ui.imprimirAlerta('Editado correctamente');
        // Pasar el objeto de la cita a edición
        administrarCitas.editarCita({...citaObj});

        // edita en indexBD
        const transaction = db.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas')

        objectStore.put(citaObj)

        transaction.oncomplete = () => {
            ui.imprimirAlerta("Guardado Correctamente");
            formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';
  
            // Quitar modo edición
            editando = false;
            ui.imprimirCitas();
        
        }

        transaction.onerror = () =>{
            console.log('Hubo un error')
        }
       
    }else{
       // Generar un ID único
        citaObj.id = Date.now();

        // Creando una nueva cita
        administrarCitas.agregarCita({...citaObj});

        // Insertar registro en indexedDB
        const transaction = db.transaction(['citas'], 'readwrite')
        // Habilitar el objectStore
        const objectStore = transaction.objectStore('citas')


        // Inserta cita a la base de datos.
        objectStore.add(citaObj);

        transaction.oncomplete = () =>{
            console.log('Cita agregada')
            // Mensaje de agregado correctamente
            ui.imprimirAlerta('Se agregó correctamente');
        }

        ui.imprimirCitas();

    }
    // Reiniciar el objeto para la validación
    reiniciarObjeto();

    formulario.reset();

   
}

export function reiniciarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

export function eliminarCita(id) {
    const transaction = db.transaction(['citas'], 'readwrite')
    const objectStore = transaction.objectStore('citas')

    objectStore.delete(id);

    transaction.oncomplete = () => {
        console.log(`Cita ${id} eliminada`);
        // Refrescar las citas
        ui.imprimirCitas();
          // Muestra un mensaje
        ui.imprimirAlerta('La cita se eliminó correctamente');
    }

    transaction.onerror = () =>{
        console.log('Hubo un error');
    }
   
}

// carga los datos y el modo edición
export function cargarEdicion(cita) {

    
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Llenar los inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;
    
        // Cambiar el texto del botón
        formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    
        editando = true; 
    
}