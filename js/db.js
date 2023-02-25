import UI from '../js/clases/UI.js'

document.addEventListener('DOMContentLoaded', function() {
    openDatabase();

    setTimeout( function (){
            /* crearMascota(); */
        }, 2000)
    });

   export let db;

   function openDatabase() {
    // crear base de datos version 1.0 
    let citasDB = window.indexedDB.open('citas', 1);

   // Se ejecuta si hay un error al abrir la base de datos
    citasDB.onerror = function(e){
        console.log("Error al abrir la base de datos");
    }

    // Se ejecuta si se ha creado correctamente la base de datos
    citasDB.onsuccess = function(e){
        db = e.target.result;

        // cargar citas al mostrar , pero indexdb ya esta listo
        const ui = new UI();
        ui.imprimirCitas();
        console.log("Base de datos abierta correctamente");
    }

    citasDB.onupgradeneeded = function(event) { 
        let db = event.target.result;
        console.log(db)
      
        // Crea un almacén de objetos para almacenar los datos
        let objectStore = db.createObjectStore("citas", { 
            keyPath: "id",
            autoIncrement: true
        });
      

        objectStore.createIndex("Mascota", "Mascota", { unique:false });
        objectStore.createIndex("Propietario", "Propietario", { unique:false});
        objectStore.createIndex("Telefono", "Telefono", {unique:false});
        objectStore.createIndex("Fecha", "Fecha", {unique:false});
        objectStore.createIndex("Hora", "Hora", {unique:false});
        objectStore.createIndex("Sintomas", "Sintomas", {unique:false});
        objectStore.createIndex("id", "id", {unique:true});
        };

    }

/* function crearMascota(){
    const transaction = db.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');

        transaction.oncomplete = function(){
            console.log('Transacción completada')
        }

        transaction.onerror = function(){
            console.log('Error en la transacción')
        }
        const nuevaMascota ={
            NombreMascota : 'lupita',
            Propietario: 'Chicho', 
            Telefono: 56979044361,
            Fecha: '29 de diciembre',
            Hora:'20:00hrs',
            Sintomas: 'No come la perra ql'

        }

        let peticion = objectStore.add(nuevaMascota);
        console.log(peticion);
}
 */
