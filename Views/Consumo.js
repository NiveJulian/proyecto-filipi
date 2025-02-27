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
  let mantenimientoCount = 1;

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
        return respuesta;
      } catch (error) {
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
          $("#gestion_usuario").show();
          $("#gestion_catalogo").show();
          $("#gestion_ventas").show();
          $("#gestion_lotes").show();
          $("#gestion_pedidos").show();
          obtener_vehiculos();
          obtener_tabla_mantenimiento();
          CloseLoader();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Usuario no puede ingresar",
          });
          location.href = "../index.php";
        }
      } catch {
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
  //

  function formatearFecha(fecha) {
    if (!fecha || fecha === "0000-00-00" || isNaN(new Date(fecha).getTime())) {
      return null;
    }

    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate().toString().padStart(2, "0");
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, "0");
    const anio = fechaObj.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }
  function obtenerIdVehiculo() {
    let urlActual = window.location.href;
    let indiceId = urlActual.indexOf("?id=");
    if (indiceId !== -1) {
      return urlActual.substring(indiceId + 4);
    }
    return null;
  }

  //CONSUMO
  $("#form-control-combustible").submit((e) => {
    e.preventDefault();

    let horas = $("#horas").val(); // Ejemplo: "12:30"
    let horas_trabajo = $("#horas_trabajo").val();
    let lugar_trabajo = $("#lugar_trabajo").val();
    let aceite_motor = $("#aceite_motor").val();
    let aceite_hidraulico = $("#aceite_hidraulico").val();
    let aceite_transmision = $("#aceite_transmision").val();
    let cantidadCombustible = $("#cantidad_combustible").val();
    let fechaRegistro = $("#fecha_asignada").val();

    if (!horas || !lugar_trabajo || !cantidadCombustible || !fechaRegistro) {
      toastr.error(
        "Todos los campos obligatorios deben estar completos.",
        "Error"
      );
      return;
    }

    // Convertir horas en formato "HH:MM" a número decimal
    let [hh, mm] = horas_trabajo.split(":").map(Number);
    horas_trabajo = hh + mm / 60; // Convierte "12:30" en 12.5

    if (horas < 0 || isNaN(cantidadCombustible) || cantidadCombustible < 0) {
      toastr.error(
        "La cantidad de combustible deben ser números positivos.",
        "Error"
      );
      return;
    }

    let fechaActual = new Date();
    let fechaIngresada = new Date(fechaRegistro);
    if (fechaIngresada > fechaActual) {
      toastr.error(
        "La fecha de registro no puede ser mayor a la fecha actual.",
        "Error"
      );
      return;
    }

    let urlActual = window.location.href;
    let indiceId = urlActual.indexOf("?id=");
    if (indiceId !== -1) {
      let idVehiculo = urlActual.substring(indiceId + 4);
      if (horas_trabajo) {
        horas_trabajo = parseInt(horas_trabajo) * 10000;
      }
      let idConsumo = $("#id_consumo_edit").val();
      const mantenimiento = $('input[name="mantenimiento[]"]')
        .map(function () {
          return $(this).val();
        })
        .get();

      let funcion = edit ? "editar_consumo" : "registrar_consumo";

      $.post(
        "../Controllers/vehiculosController.php",
        {
          funcion,
          idVehiculo,
          idConsumo,
          horas, // Ahora es un número decimal
          horas_trabajo,
          lugar_trabajo,
          aceite_hidraulico,
          aceite_motor,
          aceite_transmision,
          cantidadCombustible,
          mantenimiento,
          fechaRegistro,
        },
        (response) => {
          if (response == "add") {
            obtener_tabla_combustible();
            toastr.success(
              "Se registró con éxito el consumo del vehículo",
              "Éxito"
            );
            $("#form-control-combustible").trigger("reset");
          } else if (response == "edit") {
            toastr.success(
              "Se editó con éxito los datos de consumo del vehículo",
              "Éxito"
            );
            obtener_tabla_combustible();
            $("#form-control-combustible").trigger("reset");
          } else {
            toastr.error(
              "No se ha podido registrar con éxito el consumo del vehículo",
              "Error"
            );
            $("#form-control-combustible").trigger("reset");
          }
        }
      );
    }
  });

  $("#formMantenimiento").submit((e) => {
    e.preventDefault();

    let tipo = $("#tipo").val();
    let descripcion = $("#descripcion").val();
    let fecha = $("#fecha").val();
    let costo = $("#costo").val();
    let taller = $("#taller").val();
    let estado = $("#estado").val();

    if (!tipo || !descripcion || !fecha || !costo || !estado) {
      toastr.error(
        "Todos los campos obligatorios deben estar completos.",
        "Error"
      );
      return;
    }

    if (isNaN(costo) || costo < 0) {
      toastr.error(
        "El costo de combustible deben ser números positivos.",
        "Error"
      );
      return;
    }

    let fechaActual = new Date();
    let fechaIngresada = new Date(fecha);
    if (fechaIngresada > fechaActual) {
      toastr.error(
        "La fecha de registro no puede ser mayor a la fecha actual.",
        "Error"
      );
      return;
    }

    let urlActual = window.location.href;
    let indiceId = urlActual.indexOf("?id=");
    if (indiceId !== -1) {
      let idVehiculo = urlActual.substring(indiceId + 4);
      let funcion = edit
        ? "editar_consumo_mantenimiento"
        : "registrarConsumoMantenimiento";

      $.post(
        "../Controllers/vehiculosController.php",
        {
          funcion,
          idVehiculo,
          tipo,
          fecha,
          descripcion,
          costo,
          taller,
          estado,
        },
        (response) => {
          if (response == "add") {
            toastr.success(
              "Se registró con éxito el consumo del vehículo",
              "Éxito"
            );
            $("#form-control-combustible").trigger("reset");
            obtener_tabla_mantenimiento();
          } else if (response == "edit") {
            toastr.success(
              "Se editó con éxito los datos de consumo del vehículo",
              "Éxito"
            );
            $("#form-control-combustible").trigger("reset");
            obtener_tabla_mantenimiento();
          } else {
            toastr.error(
              "No se ha podido registrar con éxito el consumo del vehículo",
              "Error"
            );
            $("#form-control-combustible").trigger("reset");
          }
        }
      );
    }
  });
  $("#mantenimiento-container").on("click", ".agregar-mantenimiento", (e) => {
    e.preventDefault();
    mantenimientoCount++;
    const newMantenimientoField = `
          <div class="input-group mb-2">
              <input type="text" class="form-control mr-1" name="mantenimiento[]" placeholder="Ingresar mantenimiento">
              <div class="input-group-append">
                  <button class="btn btn-danger ml-1 eliminar-mantenimiento" type="button">Eliminar</button>
              </div>
          </div>
      `;

    $("#mantenimiento-container").append(newMantenimientoField);
  });
  $("#mantenimiento-container").on("click", ".eliminar-mantenimiento", (e) => {
    if (mantenimientoCount > 1) {
      mantenimientoCount--;
      $(e.target).closest(".input-group").remove();
    }
  });

  $("#consumo_aceite").on("click", function (e) {
    e.preventDefault();

    let fechaDesde = $("#fecha_desde_aceites").val();
    let fechaHasta = $("#fecha_hasta_aceites").val();

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

    let idVehiculo = obtenerIdVehiculo();
    let datos = {
      funcion: "calcularConsumoDeAceite",
      id: idVehiculo,
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
    };

    $.ajax({
      url: "../Controllers/vehiculosController.php",
      method: "POST",
      data: datos,
      dataType: "json",
      success: function (response) {
        $("#total_aceites").empty();
        if (
          response.total_aceite_motor !== null ||
          response.total_aceite_hidraulico !== null ||
          response.total_aceite_transmision !== null
        ) {
          let detallesAceites = `
              <li><b>Aceite de Motor</b>:<br> ${response.total_aceite_motor} litros</li>
              <li><b>Aceite Hidráulico</b>: <br>${response.total_aceite_hidraulico} litros</li>
              <li><b>Aceite de Transmisión</b>: <br> ${response.total_aceite_transmision} litros</li>
          `;
          $("#total_aceites").html(detallesAceites);
        } else {
          toastr.error(
            "El rango de fecha no existe. No se pudo obtener los datos necesarios para calcular el consumo por rango de fecha",
            "Error"
          );
          $("#fecha_desde").trigger("reset");
          $("#fecha_hasta").trigger("reset");
        }
      },
      error: function () {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema con la solicitud, por favor intenta nuevamente.",
        });
      },
    });
  });

  async function obtener_historicos() {
    let funcion = "obtener_historicos";
    let urlActual = window.location.href;
    let indiceId = urlActual.indexOf("?id=");
    if (indiceId !== -1) {
      let id = urlActual.substring(indiceId + 4);
      let data = await fetch("../Controllers/vehiculosController.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "funcion=" + funcion + "&id=" + id,
      });
      data;
      if (data.ok) {
        let response = await data.text();
        try {
          let resumen = JSON.parse(response);
          let template = resumen.total_litros / resumen.total_horas;
          if (!resumen.total_litros || !resumen.total_horas) {
            return 0;
          } else {
            $("#historial_horas").text(resumen.total_horas);
            $("#hist_litros_comb").text(resumen.total_litros);
            $("#total_historico").html(template);
          }
        } catch {
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
  }
  async function seguimientoDeService() {
    let funcion = "seguimientoDeService";
    let urlActual = window.location.href;
    let indiceId = urlActual.indexOf("?id=");

    if (indiceId !== -1) {
      let id = urlActual.substring(indiceId + 4);
      let response = await fetch("../Controllers/vehiculosController.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `funcion=${funcion}&id=${id}`,
      });

      if (response.ok) {
        let data = await response.json();

        if (data.ultima_hora && data.prox_servis) {
          $("#ultimo_service").text(data.ultima_hora + " Hrs");
          $("#prox_service").text(data.prox_servis + " Hrs");
        } else {
          $("#ultimo_service").text("00" + " Hrs");
          $("#prox_service").text("00" + " Hrs");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: response.statusText,
          text: "Hubo un conflicto de código: " + response.status,
        });
      }
    }
  }
  async function obtener_vehiculos() {
    let funcion = "obtener_comsumos";
    let urlActual = window.location.href;
    let indiceId = urlActual.indexOf("?id=");
    if (indiceId !== -1) {
      await obtener_tabla_combustible();
      await obtener_historicos();
      await seguimientoDeService();
      $("#content_admin_table, #content_admin_calc").show();

      let id = urlActual.substring(indiceId + 4);
      let data = await fetch("../Controllers/vehiculosController.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "funcion=" + funcion + "&id=" + id,
      });
      if (data.ok) {
        let response = await data.text();
        try {
          let vehiculo = JSON.parse(response);
          let template = "";
          template += `<img src='../Util/img/vehiculos/${vehiculo.avatar}' class="avatar-vehiculo" style="width: 100px; heigth: 100px;"/> `;

          $("#vehiculo_info").html(template);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un conflicto en el sistema. Por favor, póngase en contacto con el administrador.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: data.statusText,
          text: "Hubo un conflicto de código: " + data.status,
        });
      }
    } else {
      $("#seleccionar_vehiculo").modal("show");
      rellenar_vehiculo();
    }
  }
  async function obtener_tabla_combustible() {
    let funcion = "obtener_calculos";
    let urlActual = window.location.href;
    let indiceId = urlActual.indexOf("?id=");
    if (indiceId !== -1) {
      let id = urlActual.substring(indiceId + 4);
      let data = await fetch("../Controllers/vehiculosController.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "funcion=" + funcion + "&id=" + id,
      });

      if (data.ok) {
        let response = await data.text();
        try {
          let resumen = JSON.parse(response);
          let { vehiculo, codigo } = resumen[0];
          let tituloReporte = `Reporte de Consumo - ${vehiculo} (${codigo})`;

          function calcularTotales(data) {
            return {
              totalCantidad: data.reduce(
                (sum, row) => sum + parseFloat(row.cantidad || 0),
                0
              ),
              totalAceiteMotor: data.reduce(
                (sum, row) => sum + parseFloat(row.aceite_motor || 0),
                0
              ),
              totalAceiteHidraulico: data.reduce(
                (sum, row) => sum + parseFloat(row.aceite_hidraulico || 0),
                0
              ),
              totalAceiteTransmision: data.reduce(
                (sum, row) => sum + parseFloat(row.aceite_transmision || 0),
                0
              ),
            };
          }

          function agregarFilaTotales(data) {
            let totales = calcularTotales(data);
            return {
              fecha: "<b>Total</b>",
              horas: "",
              trabajo: "",
              horas_trabajo: "",
              cantidad: `<b>${totales.totalCantidad}</b>`,
              aceite_motor: `<b>${totales.totalAceiteMotor}</b>`,
              aceite_hidraulico: `<b>${totales.totalAceiteHidraulico}</b>`,
              aceite_transmision: `<b>${totales.totalAceiteTransmision}</b>`,
              mantenimiento: "",
              id: "total",
            };
          }

          let resumenConTotales = [...resumen, agregarFilaTotales(resumen)];

          let tabla = $("#consumo_vehiculos").DataTable({
            data: resumenConTotales,
            aaSorting: [],
            scrollX: false,
            autoWidth: false,
            paging: false,
            bInfo: false,
            dom:
              "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
              "<'row'<'col-sm-12'tr>>" +
              "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            buttons: [
              {
                extend: "excelHtml5",
                text: '<i class="fas fa-file-excel text-white"></i> Excel',
                className: "btn btn-success btn-sm mr-2 rounded-lg text-center",
                titleAttr: "Exportar a Excel",
                title: tituloReporte,
                exportOptions: { columns: ":not(:last-child)" },
              },
              {
                extend: "pdfHtml5",
                text: '<i class="fas fa-file-pdf text-white"></i> PDF',
                className: "btn btn-danger btn-sm mr-2 rounded-lg",
                titleAttr: "Exportar a PDF",
                title: "Reporte de Consumo",
                pageSize: "A4",
                orientation: "landscape",
                exportOptions: { columns: ":not(:last-child)" },
              },
              {
                extend: "print",
                text: '<i class="fas fa-print text-white"></i> Imprimir',
                className: "btn btn-secondary btn-sm text-white rounded-lg",
                titleAttr: "Imprimir reporte",
                exportOptions: { columns: ":not(:last-child)" },
              },
            ],
            columns: [
              {
                data: null,
                render: function (data, type, row, meta) {
                  return row.id === "total" ? "" : meta.row + 1;
                },
              },
              { data: "fecha" },
              { data: "horas" },
              { data: "trabajo" },
              { data: "horas_trabajo" },
              { data: "cantidad" },
              {
                data: "aceite_motor",
                render: (data) => (data === "0" ? "" : data),
              },
              {
                data: "aceite_hidraulico",
                render: (data) => (data === "0" ? "" : data),
              },
              {
                data: "aceite_transmision",
                render: (data) => (data === "0" ? "" : data),
              },
              { data: "mantenimiento" },
              {
                data: null,
                render: function (data, type, row, meta) {
                  if (row.id === "total") {
                    return "";
                  }
                  return `
                                    <button class="editar btn btn-success btn-sm" 
                                            data-id="${row.id}" 
                                            data-fecha="${row.fecha}" 
                                            data-trabajo="${row.trabajo}" 
                                            data-horas="${row.horas}" 
                                            data-cantidad="${row.cantidad}" 
                                            data-motor="${row.aceite_motor}" 
                                            data-hidraulico="${row.aceite_hidraulico}" 
                                            data-transmision="${row.aceite_transmision}" 
                                            data-mantenimiento="${row.mantenimiento}" 
                                            type="button" data-toggle="modal" data-target="#crear_consumo">
                                        <i class="fas fa-pencil" style="color: white;"></i>
                                    </button>
                                    <button class="anular btn btn-danger btn-sm" 
                                            data-id="${row.id}" 
                                            type="button">
                                        <i class="fas fa-times" style="color:white;"></i>
                                    </button>
                                `;
                },
              },
            ],
            language: espanol,
            destroy: true,
          });

          $("#aplicar_filtro").click(function () {
            let tipoFiltro = $("#filtro_fecha").val();
            let fechaSeleccionada = new Date($("#fecha_seleccionada").val());

            let fechaInicio, fechaFin;

            if (tipoFiltro === "dia") {
              fechaInicio = new Date(fechaSeleccionada);
              fechaFin = new Date(fechaSeleccionada);
            } else if (tipoFiltro === "semana") {
              let diaSemana = fechaSeleccionada.getDay();
              fechaInicio = new Date(fechaSeleccionada);
              fechaInicio.setDate(fechaSeleccionada.getDate() - diaSemana);
              fechaFin = new Date(fechaInicio);
              fechaFin.setDate(fechaInicio.getDate() + 6);
            } else if (tipoFiltro === "mes") {
              fechaInicio = new Date(
                fechaSeleccionada.getFullYear(),
                fechaSeleccionada.getMonth(),
                1
              );
              fechaFin = new Date(
                fechaSeleccionada.getFullYear(),
                fechaSeleccionada.getMonth() + 1,
                0
              );
            }

            let datosFiltrados = resumen.filter((row) => {
              let fechaRow = new Date(row.fecha);
              return fechaRow >= fechaInicio && fechaRow <= fechaFin;
            });

            datosFiltrados.push(agregarFilaTotales(datosFiltrados));

            tabla.clear().rows.add(datosFiltrados).draw();
          });

          $("#borrar_filtro").click(function () {
            tabla.clear().rows.add(resumenConTotales).draw();
          });

          $(".dt-buttons").addClass("btn-group");
          $(".dt-buttons button").removeClass("dt-button").addClass("btn");
        } catch {}
      }
    }
  }
  async function obtener_tabla_mantenimiento() {
    let funcion = "obtener_tabla_mantenimiento";
    let urlActual = window.location.href;
    let indiceId = urlActual.indexOf("?id=");
    if (indiceId !== -1) {
      let id = urlActual.substring(indiceId + 4);
      let data = await fetch("../Controllers/vehiculosController.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "funcion=" + funcion + "&id=" + id,
      });

      if (data.ok) {
        let response = await data.text();
        try {
          let resumen = JSON.parse(response);
          let { vehiculo, codigo } = resumen[0];
          let tituloReporte = `Reporte de mantenimiento - ${vehiculo} (${codigo})`;

          function calcularTotales(data) {
            return {
              costo: data.reduce(
                (sum, row) => sum + parseFloat(row.costo || 0),
                0
              ),
            };
          }

          function agregarFilaTotales(data) {
            let totales = calcularTotales(data);
            return {
              tipo: "<b>Total</b>",
              descripcion: "",
              fechas_mantenimiento: "",
              taller: "",
              estado_mantenimiento: "",
              id: "total",
              costo: `<b>${totales.costo}</b>`,
            };
          }

          let resumenConTotales = [...resumen, agregarFilaTotales(resumen)];

          let tabla = $("#listaMantenimientos").DataTable({
            data: resumenConTotales,
            aaSorting: [],
            scrollX: false,
            autoWidth: false,
            paging: false,
            bInfo: false,
            dom:
              "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
              "<'row'<'col-sm-12'tr>>" +
              "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            buttons: [
              {
                extend: "excelHtml5",
                text: '<i class="fas fa-file-excel text-white"></i> Excel',
                className: "btn btn-success btn-sm mr-2 rounded-lg text-center",
                titleAttr: "Exportar a Excel",
                title: tituloReporte,
                exportOptions: { columns: ":not(:last-child)" },
              },
              {
                extend: "pdfHtml5",
                text: '<i class="fas fa-file-pdf text-white"></i> PDF',
                className: "btn btn-danger btn-sm mr-2 rounded-lg",
                titleAttr: "Exportar a PDF",
                title: "Reporte de Consumo",
                pageSize: "A4",
                orientation: "landscape",
                exportOptions: { columns: ":not(:last-child)" },
              },
              {
                extend: "print",
                text: '<i class="fas fa-print text-white"></i> Imprimir',
                className: "btn btn-secondary btn-sm text-white rounded-lg",
                titleAttr: "Imprimir reporte",
                exportOptions: { columns: ":not(:last-child)" },
              },
            ],
            columns: [
              {
                data: null,
                render: function (data, type, row, meta) {
                  return row.id === "total" ? "" : meta.row + 1;
                },
              },
              { data: "tipo" },
              { data: "descripcion" },
              { data: "fechas_mantenimiento" },
              {
                data: "taller",
                render: (data) => (data === null ? "" : data),
              },
              {
                data: "estado_mantenimiento",
                render: (data) => (data === null ? "" : data),
              },
              { data: "costo", render: (data) => (data === "0" ? "" : data) },
              {
                data: null,
                render: function (data, type, row, meta) {
                  if (row.id === "total") {
                    return "";
                  }
                  return `
                                    <button class="editar btn btn-success btn-sm" 
                                            data-id="${row.id}" 
                                            data-nombre="${row.nombre}" 
                                            data-tipo="${row.tipo}" 
                                            data-descripcion="${row.descripcion}" 
                                            data-fechas_mantenimiento="${row.fechas_mantenimiento}" 
                                            data-costo="${row.costo}" 
                                            data-estado_mantenimiento="${row.estado_mantenimiento}" 
                                            data-taller="${row.taller}" 
                                            data-vehiculo="${row.vehiculo_id}" 
                                            type="button" data-toggle="modal" data-target="#crear_consumo">
                                        <i class="fas fa-pencil" style="color: white;"></i>
                                    </button>
                                    <button class="anular btn btn-danger btn-sm" 
                                            data-id="${row.id}" 
                                            type="button">
                                        <i class="fas fa-times" style="color:white;"></i>
                                    </button>
                                `;
                },
              },
            ],
            language: espanol,
            destroy: true,
          });

          $("#aplicar_filtro_mantenimiento").click(function () {
            let tipoFiltro = $("#filtro_fecha_mantenimiento").val();
            let fechaSeleccionada = new Date(
              $("#fecha_seleccionada_mantenimiento").val()
            );

            let fechaInicio, fechaFin;

            if (tipoFiltro === "dia") {
              fechaInicio = new Date(fechaSeleccionada);
              fechaFin = new Date(fechaSeleccionada);
            } else if (tipoFiltro === "semana") {
              let diaSemana = fechaSeleccionada.getDay();
              fechaInicio = new Date(fechaSeleccionada);
              fechaInicio.setDate(fechaSeleccionada.getDate() - diaSemana);
              fechaFin = new Date(fechaInicio);
              fechaFin.setDate(fechaInicio.getDate() + 6);
            } else if (tipoFiltro === "mes") {
              fechaInicio = new Date(
                fechaSeleccionada.getFullYear(),
                fechaSeleccionada.getMonth(),
                1
              );
              fechaFin = new Date(
                fechaSeleccionada.getFullYear(),
                fechaSeleccionada.getMonth() + 1,
                0
              );
            }

            let datosFiltrados = resumen.filter((row) => {
              let fechaRow = new Date(row.fechas_mantenimiento);
              return fechaRow >= fechaInicio && fechaRow <= fechaFin;
            });

            datosFiltrados.push(agregarFilaTotales(datosFiltrados));

            tabla.clear().rows.add(datosFiltrados).draw();
          });

          $("#borrar_filtro_mantenimiento").click(function () {
            tabla.clear().rows.add(resumenConTotales).draw();
          });

          $(".dt-buttons").addClass("btn-group");
          $(".dt-buttons button").removeClass("dt-button").addClass("btn");
        } catch {}
      }
    }
  }
  function rellenar_vehiculo() {
    let funcion = "rellenar_vehiculos";
    $.post(
      "../Controllers/vehiculosController.php",
      { funcion },
      (response) => {
        let vehiculos = JSON.parse(response);
        let template = "";

        $("#vehiculo").empty();

        vehiculos.forEach((vehiculo) => {
          template += `<option value="${vehiculo.id}" data-vehiculo="${vehiculo.vehiculo}">Vehiculo: ${vehiculo.vehiculo} [Patente: ${vehiculo.codigo}]</option>`;
        });

        $("#vehiculo").html(template);
      }
    );
  }
  $("#vehiculo_seleccionado").on("click", function () {
    let vehiculoId = $("#vehiculo").val();
    if (vehiculoId) {
      window.location.href = window.location.pathname + "?id=" + vehiculoId;
    } else {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, selecciona un vehículo.",
      });
    }
  });
  $("#consumo_vehiculos tbody").on("click", ".editar", function () {
    let id = $(this).data("id");
    let fecha = $(this).data("fecha");
    let horas = $(this).data("horas");
    let trabajo = $(this).data("trabajo");
    let cantidad = $(this).data("cantidad");
    let motor = $(this).data("motor");
    let hidraulico = $(this).data("hidraulico");
    let transmision = $(this).data("transmision");
    let mantenimiento = $(this).data("mantenimiento");

    $("#id_consumo_edit").val(id);
    $("#horas").val(horas);
    $("#lugar_trabajo").val(trabajo);
    $("#aceite_motor").val(motor);
    $("#aceite_hidraulico").val(hidraulico);
    $("#aceite_transmision").val(transmision);
    $("#cantidad_combustible").val(cantidad);
    $('input[name="mantenimiento[]"]')
      .map(function () {
        return $(this).val(mantenimiento);
      })
      .get();

    $("#fecha_asignada").val(fecha);

    edit = true;
  });
  $("#consumo_vehiculos tbody").on("click", ".anular", function () {
    let idConsumo = $(this).data("id");

    let funcion = "anular_consumo";
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary mr-2",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Estas seguro?",
        text: "No vas a ver mas los datos del registro N°" + idConsumo,
        imageWidth: 100,
        imageHeight: 100,
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          $.post(
            "../Controllers/vehiculosController.php",
            { idConsumo, funcion },
            (response) => {
              if (response.includes("anulado")) {
                swalWithBootstrapButtons.fire(
                  "Borrado!",
                  "El consumo N°" +
                    idConsumo +
                    " fue anulado. Se encotrará inactivo en la base de datos, comuniquese con su desarrollador para revertir la situacion",
                  "success"
                );
                obtener_tabla_combustible();
              } else {
                swalWithBootstrapButtons.fire(
                  "No se pudo borrar!",
                  "El consumo N°" + idConsumo + " no fue anulado.",
                  "error"
                );
              }
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelado",
            "Tu orden de compra esta a salvo :)",
            "error"
          );
        }
      });
  });
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
