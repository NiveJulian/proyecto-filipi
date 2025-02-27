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
  async function obtenerPermisos(rol_id) {
    let funcion = "obtener_permisos";
    let data = await fetch("../Controllers/UsuariosController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion + "&rol_id=" + rol_id,
    });
    if (data.ok) {
      let response = await data.text();
      try {
        let respuesta = JSON.parse(response);
        return respuesta; // Retornar los permisos
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "hubo conflicto en el sistema, pongase en contacto con el administrador",
        });
        return [];
      }
    } else {
      Swal.fire({
        icon: "error",
        title: data.statusText,
        text: "hubo conflicto de codigo: " + data.status,
      });
      return [];
    }
  }
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
        let respuesta = JSON.parse(response);
        if (respuesta.length !== 0) {
          llenar_menu_superior(respuesta);
          let permisos = await obtenerPermisos(respuesta.id_tipo);
          llenar_menu_lateral(respuesta, permisos);
          obtener_facturas_recibidas_eliminadas();
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

  async function obtener_facturas_recibidas_eliminadas() {
    let funcion = "obtener_facturas_recibidas_eliminadas";
    let data = await fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (data.ok) {
      let response = await data.text();
      try {
        let facturas = JSON.parse(response);
        datatable = $("#tab_recibidos").DataTable({
          data: facturas,
          aaSorting: [],
          scrollX: false,
          autoWidth: false,
          paging: false,
          bInfo: false,
          columns: [
            { data: "datos_factura" },
            { data: "numero_facturas" },
            { data: "datos_proveedor" },
            { data: "datos_vehiculo" },
            { data: "fecha_anulado" },
            {
              defaultContent: `
                                <button class="activarRecibido btn btn-primary" type="button" data-toggle="modal" data-target="#crear-factura-emitido" title="Activar Factura">
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

  $("#tab_recibidos tbody").on("click", ".activarRecibido", function () {
    let datos = datatable.row($(this).parents()).data();

    if (datos && datos.idFactura) {
      let idFactura = datos.idFactura;
      let dividirDatos = datos.numero_facturas.split("-");
      let numFactura = dividirDatos[2];

      Swal.fire({
        title: "¿Estás seguro?",
        text:
          'Estas por activar en seccion "RECIBIDOS" nuevamente la factura con numero: ' +
          numFactura,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, activar factura",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await activarFacturaRecibida(idFactura);
        }
      });
    }
  });
  async function activarFacturaRecibida(idFactura) {
    let funcion = "activarFacturaRecibida";
    let data = await fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion + "&&idFactura=" + idFactura,
    });

    if (data.ok) {
      let response = await data.text();

      if (response == "activado") {
        Swal.fire("Factura activa nuevamente", "success");
        obtener_facturas_recibidas_eliminadas();
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
