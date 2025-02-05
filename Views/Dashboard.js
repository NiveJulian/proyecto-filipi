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
  let edit = false;
  let datatable;

  // VERIFICACION
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
          llenar_menu_lateral(respuesta);
          $("#gestion_usuario").show();
          $("#gestion_catalogo").show();
          $("#gestion_ventas").show();
          $("#gestion_lotes").show();
          $("#gestion_pedidos").show();
          $("#content_admin").show();
          await cargarFacturasEmitidas();
          await cargarFacturasRecibidas();
          await cargarVehiculos();
          await cargarVencimientos();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Usuario no puede ingresar",
          });
          location.href = "../index.php";
        }
        CloseLoader();
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

  async function cargarFacturasRecibidas() {
    $.ajax({
      url: "../Controllers/FacturacionController.php",
      type: "POST",
      data: { funcion: "obtener_facturas" },
      dataType: "json",
      success: function (response) {
        let datosChart = {
          labels: [],
          datasets: [
            {
              label: "Total Facturas Recibidas",
              backgroundColor: "rgba(60,141,188,0.9)",
              borderColor: "rgba(60,141,188,0.8)",
              data: [],
            },
          ],
        };

        let tablaBody = $("#tabla-facturas-recibidas tbody");
        tablaBody.empty();

        response.forEach(function (factura) {
          datosChart.labels.push(factura.num_factura);
          datosChart.datasets[0].data.push(factura.total);

          let row = `<tr>
                    <td>${factura.num_factura}</td>
                    <td>${factura.fecha}</td>
                    <td>${factura.razon_social}</td>
                    <td>${factura.total}</td>
                </tr>`;
          tablaBody.append(row);
        });

        let ctx = document
          .getElementById("facturas-recibidas-chart")
          .getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: datosChart,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      },
    });
  }

  async function cargarFacturasEmitidas() {
    $.ajax({
      url: "../Controllers/FacturacionController.php",
      type: "POST",
      data: { funcion: "obtener_facturas_emitidas" },
      dataType: "json",
      success: function (response) {
        let datosChart = {
          labels: [],
          datasets: [
            {
              label: "Total Facturas Emitidas",
              backgroundColor: "rgba(210, 214, 222, 1)",
              borderColor: "rgba(210, 214, 222, 1)",
              data: [],
            },
          ],
        };

        let tablaBody = $("#tabla-facturas-emitidas tbody");
        tablaBody.empty();

        response.forEach(function (factura) {
          datosChart.labels.push(factura.num_factura);
          datosChart.datasets[0].data.push(factura.total);

          let row = `<tr>
                    <td>${factura.num_factura}</td>
                    <td>${factura.fecha}</td>
                    <td>${factura.razon_social}</td>
                    <td>${factura.total}</td>
                </tr>`;
          tablaBody.append(row);
        });

        let ctx = document
          .getElementById("facturas-emitidas-chart")
          .getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: datosChart,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      },
    });
  }

  async function cargarVehiculos() {
    $.ajax({
      url: "../Controllers/vehiculosController.php",
      type: "POST",
      data: { funcion: "obtener_vehiculo" },
      dataType: "json",
      success: function (response) {
        var select = $("#selectVehiculo");
        select.empty();
        response.forEach(function (vehiculo) {
          select.append(
            `<option value="${vehiculo.id}">${vehiculo.vehiculo}</option>`
          );
        });
      },
    });
  }

  async function cargarVencimientos() {
    $.ajax({
      url: "../Controllers/vehiculosController.php",
      type: "POST",
      data: { funcion: "obtener_vencidos" },
      dataType: "json",
      success: function (response) {
        let tablaBody = $("#tablaVencimientos tbody");
        tablaBody.empty();
        response.forEach(function (vehiculo) {
          let fila = `
                    <tr>
                        <td>${vehiculo.vehiculo}</td>
                        <td class="${vehiculo.estado}">${vehiculo.vtv}</td>
                        <td class="${vehiculo.estado}">${vehiculo.cedula}</td>
                        <td class="${vehiculo.estado}">${vehiculo.logistica}</td>
                        <td class="${vehiculo.estado}">${vehiculo.senasa}</td>
                        <td class="${vehiculo.estado}">${vehiculo.seguro}</td>
                        <td class="${vehiculo.estado}">${vehiculo.poliza}</td>
                    </tr>
                `;
          tablaBody.append(fila);
        });
      },
    });
  }

  $("#btnCalcularConsumo").click(function () {
    let idVehiculo = $("#selectVehiculo").val();
    let fechaDesde = $("#fechaDesde").val();
    let fechaHasta = $("#fechaHasta").val();

    if (!fechaDesde || !fechaHasta) {
      toastr.error("Debes seleccionar un rango de fechas.", "Error");
      return;
    }

    let fechaActual = new Date();
    let fechaInicio = new Date(fechaDesde);
    fechaHasta = new Date(fechaHasta);
    let fechaLimite = new Date(
      fechaActual.getFullYear() - 5,
      fechaActual.getMonth(),
      fechaActual.getDate()
    );

    if (fechaInicio < fechaLimite || fechaHasta < fechaLimite) {
      toastr.error(
        "Las fechas no pueden ser mayores a la fecha limite.",
        "Error"
      );
      return;
    }

    if (fechaInicio > fechaHasta) {
      toastr.error(
        "La fecha de inicio no puede ser mayor que la fecha de fin.",
        "Error"
      );
      return;
    }

    $.ajax({
      url: "../Controllers/vehiculosController.php",
      type: "POST",
      data: {
        funcion: "calcularConsumoDeAceite",
        id: idVehiculo,
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
      },
      dataType: "json",
      success: function (response) {
        let resultado = `
                <p>Aceite Motor: ${
                  response.total_aceite_motor ? response.total_aceite_motor : 0
                } litros</p>
                <p>Aceite Hidráulico: ${
                  response.total_aceite_hidraulico
                    ? response.total_aceite_hidraulico
                    : 0
                } litros</p>
                <p>Aceite Transmisión: ${
                  response.total_aceite_transmision
                    ? response.total_aceite_transmision
                    : 0
                } litros</p>
            `;
        $("#resultadoConsumo").html(resultado);
      },
    });
  });

  // LOADER
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
  search: "",
  searchPlaceholder: "Buscar...",
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
