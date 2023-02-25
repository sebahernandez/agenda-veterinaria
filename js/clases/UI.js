import { eliminarCita, cargarEdicion} from "../funciones.js";
import { contenedorCitas, heading } from "../selectores.js";
import {db} from '../db.js'


 class UI {
    imprimirAlerta(mensaje, tipo) {
      // Crear el div
      const divMensaje = document.createElement('div');
      divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
  
      // Agregar clase en base al tipo de error
      if(tipo) {
          divMensaje.classList.add('alert-danger');
      }else{
          divMensaje.classList.add('alert-success');
      }
  
      // Mensaje de error
      divMensaje.textContent = mensaje;
  
      // Agregar al DOM
      document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));
      // Quitar la alerta
  
      setTimeout(() => {
          divMensaje.remove();
  
      },5000);
    }
  
    imprimirCitas() {
        this.limpiarHTML();

        // leer contenido de la base de datos
        const objectStore = db.transaction('citas').objectStore('citas')

        const fnTextoHeading = this.textoHeading;

        const total = objectStore.count();
        total.onsuccess = function(){
            fnTextoHeading(total.result)
        }
        
        objectStore.openCursor().onsuccess = function(e){
            const cursor = e.target.result;
            if(cursor){
                const {mascota, propietario, fecha, hora, sintomas, id } = cursor.value;
    
                // crear la tarjeta de Bootstrap con los datos de la cita
                const citasContainer = document.getElementById('citas-container');
                const card = document.createElement('div');
                card.classList.add('card', 'mb-3');
    
                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
    
                const mascotaTitle = document.createElement('h5');
                mascotaTitle.classList.add('card-title');
                mascotaTitle.textContent = `Nombre Mascota: ${mascota}`;
    
                const propietarioText = document.createElement('p');
                propietarioText.classList.add('card-text');
                propietarioText.innerHTML = `<span class="fw-bold">Propietario:</span> ${propietario}`;
    
                const fechaText = document.createElement('p');
                fechaText.classList.add('card-text');
                fechaText.innerHTML = `<span class="fw-bold">Fecha:</span> ${fecha}`;
    
                const horaText = document.createElement('p');
                horaText.classList.add('card-text');
                horaText.innerHTML = `<span class="fw-bold">Hora:</span> ${hora}`;
    
                const sintomasText = document.createElement('p');
                sintomasText.classList.add('card-text');
                sintomasText.innerHTML = `<span class="fw-bold">Síntomas:</span> ${sintomas}`;

                   // crear los botones de edición y eliminación
                    const btnEditar = document.createElement('button');
                    const cita = cursor.value;
                    btnEditar.onclick = () => cargarEdicion(cita);
                    btnEditar.classList.add('btn', 'btn-primary', 'me-2', 'mr-2');
                    btnEditar.innerHTML = 'Editar';

                    const btnEliminar = document.createElement('button');
                    btnEliminar.onclick = () => eliminarCita(id);
                    btnEliminar.classList.add('btn', 'btn-danger');
                    btnEliminar.innerHTML = 'Eliminar';
            
                // agregar los elementos al DOM
                cardBody.appendChild(mascotaTitle);
                cardBody.appendChild(propietarioText);
                cardBody.appendChild(fechaText);
                cardBody.appendChild(horaText);
                cardBody.appendChild(sintomasText);
                cardBody.appendChild(btnEditar);
                cardBody.appendChild(btnEliminar);
                card.appendChild(cardBody);
                citasContainer.appendChild(card);
    
                // avanzar al siguiente resultado
                cursor.continue();
            }
           
        }
    }

    textoHeading(resultado) {
        console.log(resultado);
        if (resultado > 0) {
          heading.textContent = 'Administra tus citas';
        } else {
          heading.textContent = 'No hay citas';
        }
      }


      limpiarHTML() {
          while(contenedorCitas.firstChild) {
              contenedorCitas.removeChild(contenedorCitas.firstChild);
          }
      }
  
  }

  export default UI;