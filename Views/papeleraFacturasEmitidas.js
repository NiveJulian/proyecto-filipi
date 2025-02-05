import {
  llenar_menu_superior,
  llenar_menu_lateral,
} from "./layouts/layouts.js";

$(document).ready(function () {
  Loader("Cargando Datos");
  verificar_sesion();
  toastr.options = {
    preventDuplicates: true,
  };
  let datatable;

  // VERIFICACIONES
  async function verificar_sesion() {
    let funcion = "verificar_sesion";
    let data = await fetch("../Controllers/UsuariosController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });
    if (data.ok) {
      let response = await data.text();
      try {
        let repuesta = JSON.parse(response);
        if (repuesta.length !== 0) {
          llenar_menu_superior(repuesta);
          llenar_menu_lateral(repuesta);
          obtener_facturas_emitidas_eliminadas();
          CloseLoader();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Usuario no puede ingresar",
          });
          location.href = "../index.php";
        }
      } catch (error) {
        console.error(error);
        console.log(response);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "hubo conflicto en el sistema, pongase en contacto con el administrador",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: data.statusText,
        text: "hubo conflicto de codigo: " + data.status,
      });
    }
  }

  $("#papelera").on("click", function () {
    // Cambiar la pestaña activa a "Recibidos"
    $('.nav-pills .nav-link[href="#recibido"]').addClass("active");
    $('.nav-pills .nav-link[href="#emitido"]').removeClass("active");

    // Mostrar la pestaña activa
    $("#recibido").addClass("active");
    $("#emitido").removeClass("active");

    // Agregar aquí cualquier otra lógica que necesites al hacer clic en "Papelera" en facturas emitidas
  });

  async function obtener_facturas_emitidas_eliminadas() {
    let funcion = "obtener_facturas_emitidas_eliminadas";
    let data = await fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (data.ok) {
      let response = await data.text();
      try {
        let facturas = JSON.parse(response);
        datatable = $("#tab_emitidos").DataTable({
          data: facturas,
          aaSorting: [],
          scrollX: false,
          autoWidth: false,
          paging: false,
          bInfo: false,
          columns: [
            { data: "datos_factura" },
            { data: "numero_factura" },
            { data: "cliente" },
            { data: "fecha_anulado" },
            {
              defaultContent: `
                                <button class="activarEmitido btn btn-primary" type="button" data-toggle="modal" data-target="#crear-factura-emitido" title="Activar Factura">
                                    <i class="fas fa-check" style="color: white;"></i>
                                </button>`,
            },
          ],
          language: espanol,
          destroy: true,
        });
      } catch (error) {
        console.error(error);
        console.log(response);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un conflicto en el sistema, póngase en contacto con el administrador",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: data.statusText,
        text: "Hubo conflicto de código: " + data.status,
      });
    }
  }

  $("#tab_emitidos tbody").on("click", ".activarEmitido", function () {
    let datos = datatable.row($(this).parents()).data();

    // Verificar si los datos están presentes
    if (datos && datos.numero_factura) {
      let datosArray = datos.numero_factura.split("-");
      let numFactura = datosArray[2];

      let idFactura = datos.idFactura;

      Swal.fire({
        title: "¿Estás seguro?",
        text:
          'Estas por activar en seccion "EMITIDOS" nuevamente la factura con numero: ' +
          numFactura,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, activar factura",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Llamar a la función de activación si el usuario confirma
          await activarFacturaEmitida(idFactura);
        }
      });
    }
  });

  async function activarFacturaEmitida(idFactura) {
    let funcion = "activarFacturaEmitida";
    let data = await fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion + "&&idFactura=" + idFactura,
    });

    if (data.ok) {
      let response = await data.text();

      if (response == "activado") {
        Swal.fire("Factura activa nuevamente", "", "success");
        obtener_facturas_emitidas_eliminadas();
      } else {
        Swal.fire(
          "Error al activar la factura",
          "Hubo un problema al activar la factura",
          "error"
        );
      }
    } else {
      Swal.fire({
        icon: "error",
        title: data.statusText,
        text: "Hubo un problema al comunicarse con el servidor",
      });
    }
  }

  function Loader(mensaje) {
    if (mensaje == "" || mensaje == null) {
      mensaje = "Cargando datos...";
    }
    Swal.fire({
      position: "center",
      html: '<i class="fas fa-2x fa-sync-alt fa-spin"></i>',
      title: mensaje,
      showConfirmButton: false,
    });
  }
  function CloseLoader(mensaje, tipo) {
    if (mensaje == "" || mensaje == null) {
      Swal.close();
    } else {
      Swal.fire({
        position: "center",
        icon: tipo,
        title: mensaje,
        showConfirmButton: false,
      });
    }
  }
  // FIN LOADER
});
let espanol = {
  processing: "Procesando...",
  lengthMenu: "Mostrar _MENU_ registros",
  zeroRecords: "No se encontraron resultados",
  emptyTable: "Ningún dato disponible en esta tabla",
  infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
  infoFiltered: "(filtrado de un total de _MAX_ registros)",
  search: "Buscar:",
  infoThousands: ",",
  loadingRecords: "Cargando...",
  paginate: {
    first: "Primero",
    last: "Último",
    next: "Siguiente",
    previous: "Anterior",
  },
  aria: {
    sortAscending: ": Activar para ordenar la columna de manera ascendente",
    sortDescending: ": Activar para ordenar la columna de manera descendente",
  },
  buttons: {
    copy: "Copiar",
    colvis: "Visibilidad",
    collection: "Colección",
    colvisRestore: "Restaurar visibilidad",
    copyKeys:
      "Presione ctrl o u2318 + C para copiar los datos de la tabla al portapapeles del sistema. <br /> <br /> Para cancelar, haga clic en este mensaje o presione escape.",
    copySuccess: {
      1: "Copiada 1 fila al portapapeles",
      _: "Copiadas %ds fila al portapapeles",
    },
    copyTitle: "Copiar al portapapeles",
    csv: "CSV",
    excel: "Excel",
    pageLength: {
      "-1": "Mostrar todas las filas",
      _: "Mostrar %d filas",
    },
    pdf: "PDF",
    print: "Imprimir",
    renameState: "Cambiar nombre",
    updateState: "Actualizar",
    createState: "Crear Estado",
    removeAllStates: "Remover Estados",
    removeState: "Remover",
    savedStates: "Estados Guardados",
    stateRestore: "Estado %d",
  },
};
