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
  let totalOriginal;
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
          calcularTotal();
          await obtener_facturas_emitidas();
          rellenar_clientes();
          rellenar_vehiculo();
          rellenar_factura();
          await calcularSituacionFrenteAlIVA();
          await obtenerTotalDeTotales();
          await obtenerOpcionesFacturaEmitida();
          await obtenerMesesEmitidos();
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

  async function obtenerMesesEmitidos() {
    let funcion = "obtener_meses_emitidos";
    let data = await fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (data.ok) {
      let response = await data.json();
      let selectMes = $("#filtroMes");
      selectMes.empty();
      selectMes.append('<option value="">Todos los meses</option>');
      response.forEach((mes) => {
        selectMes.append(
          `<option value="${mes.valor}">${
            mesesEnEspañol[mes.nombre.split("-")[1]]
          }</option>`
        );
      });
      return response;
    } else {
      return [];
    }
  }

  $("#filtroMes").on("change", async function () {
    let mesSeleccionado = $(this).val();

    if (mesSeleccionado !== "") {
      let partes = mesSeleccionado.split("-");
      let año = partes[0];
      let mes = partes[1];

      let fechaInicio = `${año}-${mes}-01`;
      let fechaFin = `${año}-${mes}-31`;

      await obtenerFacturasPorFecha(fechaInicio, fechaFin);
    } else {
      await obtener_facturas_emitidas();
    }
  });

  async function obtenerFacturasPorFecha(fechaInicio, fechaFin) {
    let funcion = "obtener_facturas_por_fecha";
    let tipo_factura = "emitido";
    let data = await fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `funcion=${funcion}&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}&tipo_factura=${tipo_factura}`,
    });

    if (data.ok) {
      let response = await data.text();
      try {
        let facturas = JSON.parse(response);
        actualizarTabla(facturas);
      } catch (error) {
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
        text: "Hubo un conflicto en el sistema, póngase en contacto con el administrador",
      });
    }
  }

  async function obtener_facturas_emitidas() {
    let funcion = "obtener_facturas_emitidas";
    let data = await fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (data.ok) {
      let response = await data.text();
      try {
        let facturas = JSON.parse(response);

        facturas.forEach((objeto) => {
          objeto.subtotal = formatCurrency(objeto.subtotal, "$ ");
          objeto.iva = formatCurrency(objeto.iva, "$ ");
          objeto.itc = formatCurrency(objeto.itc, "$ ");
          objeto.idc = formatCurrency(objeto.idc, "$ ");
          objeto.perc_iibb = formatCurrency(objeto.perc_iibb, "$ ");
          objeto.perc_iva = formatCurrency(objeto.perc_iva, "$ ");
          objeto.otros_im = formatCurrency(objeto.otros_im, "$ ");
          objeto.descuento = formatCurrency(objeto.descuento, "$ ");
          objeto.total = formatCurrency(objeto.total, "$ ");
        });
        if (!$.fn.DataTable.isDataTable("#obtener-emitidas")) {
          inicializarDataTables(facturas);
        } else {
          actualizarTabla(facturas);
        }
      } catch (error) {
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

  function inicializarDataTables(facturas) {
    datatable = $("#obtener-emitidas").DataTable({
      data: facturas,
      aaSorting: [],
      scrollX: true,
      autoWidth: false,
      paging: true,
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
          title: "Reporte de Facturas Emitidas",
          exportOptions: {
            columns: ":not(:last-child)",
          },
        },
        {
          extend: "pdfHtml5",
          text: '<i class="fas fa-file-pdf text-white"></i> PDF',
          className: "btn btn-danger btn-sm mr-2 rounded-lg",
          titleAttr: "Exportar a PDF",
          title: "Reporte de Facturas Emitidas",
          pageSize: "A4",
          orientation: "landscape",
          customize: function (doc) {
            doc.defaultStyle.fontSize = 8;
            doc.styles.tableHeader.fontSize = 9;
            doc.styles.tableBodyEven.alignment = "center";
            doc.styles.tableBodyOdd.alignment = "center";
            doc.content[1].table.widths = Array(
              doc.content[1].table.body[0].length + 1
            )
              .join("*")
              .split("");
            doc.pageMargins = [10, 10, 10, 10];
          },
          exportOptions: {
            columns: ":not(:last-child)",
            modifier: {
              page: "all",
            },
          },
        },
        {
          extend: "print",
          text: '<i class="fas fa-print text-white"></i> Imprimir',
          className: "btn btn-secondary btn-sm text-white mr-2 rounded-lg",
          titleAttr: "Imprimir reporte",
          title: "Reporte de Facturas Emitidas",
          exportOptions: {
            columns: ":not(:last-child)",
          },
        },
        {
          text: '<i class="fas fa-solid fa-file-import text-white"></i> Importar',
          className: "btn btn-primary btn-sm text-white rounded-lg",
          action: function () {
            $("#modalImportFactura").modal("show");
          },
        },
      ],
      columns: [
        { data: "fecha" },
        { data: "razon_social" },
        { data: "num_factura" },
        { data: "subtotal" },
        { data: "iva" },
        { data: "itc" },
        { data: "idc" },
        { data: "perc_iibb" },
        { data: "perc_iva" },
        { data: "otros_im" },
        { data: "descuento" },
        { data: "total" },
        { data: "tipo_gasto" },
        {
          defaultContent: `
                    <button class="editar btn btn-success" type="button" data-toggle="modal" data-target="#crear-factura-emitido">
                        <i class="fas fa-pencil-alt" style="color: white;"></i>
                    </button>
                    <button class="anular btn btn-danger" type="button">
                        <i class="fas fa-times" style="color:white;"></i>
                    </button>`,
        },
      ],
      language: espanol,
      destroy: true,
    });

    $(".dt-buttons").addClass("btn-group");
    $(".dt-buttons button").removeClass("dt-button").addClass("btn");
  }

  function actualizarTabla(facturas) {
    if (datatable) {
      Loader();

      datatable.clear();
      setTimeout(() => {
        CloseLoader();
        inicializarDataTables(facturas);
        datatable.draw();
      }, 1000);
    } else {
      console.error("DataTables no está inicializado.");
    }
  }

  function formatCurrency(value, symbol = "") {
    return (
      symbol +
      parseFloat(value)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")
    );
  }
  function removeCurrencyFormat(value) {
    return value.replace(/[$,]/g, "");
  }

  $("#btnImportFactura").on("click", function (e) {
    Loader("Importando datos...");
    let fileInput = document.getElementById("fileImportFactura");
    let file = fileInput.files[0];

    if (!file) {
      toastr.info("Seleccione un archivo para importar.", "Info");
      CloseLoader();
      return;
    }

    let formData = new FormData();
    formData.append("file", file);
    formData.append("funcion", "importar_facturas");

    fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          toastr.success(data.message, "Éxito");
        } else if (data.status === "warning") {
          toastr.warning(data.message, "Advertencia");
          if (data.errores && data.errores.length > 0) {
            Swal.fire({
              icon: "warning",
              title: "Errores encontrados",
              html: data.errores.join("<br>"), // Mostrar todos los errores en una lista
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Hubo un error en la importación.",
          });
        }
        obtener_facturas_emitidas();
      })
      .catch((error) => {
        toastr.error(
          "Error al procesar la solicitud: " + error.message,
          "Error"
        );
      })
      .finally(() => {
        CloseLoader();
      });
  });

  $("#form-crear-factura-emitido").submit(function (e) {
    e.preventDefault();

    let id = $("#editar_factura_id_emitido").val();

    let tipoVenta = $("#tipo_registro_id_emitido").val();
    let tipoRegistroIdEmitido = $("#tipo_registro_emitido").val();

    let fecha = $("#fecha_emitido").val();
    let comprobante = $("#tipoFactura").val();
    let punto_venta = $("#punto_venta_emitido").val();
    let numeroFactura = $("#numero_factura_emitido").val();
    let razonSocial = $("#razon_social_emitido").val();
    let subtotal = parseFloat($("#subtotal_emitido").val()) || 0;

    let iva = parseFloat($("#calc_iva_emitido").text()) || 0;
    let itcValue = parseFloat($("#calc_itc_emitido").text()) || 0;
    let idcValue = parseFloat($("#calc_idc_emitido").text()) || 0;
    let percIibb = parseFloat($("#calc_perc_iibb_emitido").text()) || 0;
    let percIvaValue = parseFloat($("#calc_perc_iva_emitido").text()) || 0;
    let otrosImpuestos =
      parseFloat($("#calc_otro_impuestos_emitido").text()) || 0;
    let descuentoValue = parseFloat($("#calc_descuento_emitido").text()) || 0;

    calcularTotal();
    let totalNuevo = parseFloat($("#total_emitido").text()) || 0;

    if (
      !razonSocial ||
      !fecha ||
      !comprobante ||
      !punto_venta ||
      !numeroFactura ||
      isNaN(subtotal) ||
      subtotal < 0
    ) {
      toastr.error(
        "Hay algun dato que pasaste por alto que es importante para el registro",
        "Error"
      );
      return;
    }

    let funcion = edit ? "editar_factura_emitida" : "registrar_factura_emitida";

    $.ajax({
      type: "POST",
      url: "../Controllers/FacturacionController.php",
      data: {
        id: id,
        funcion: funcion,
        fecha_emitido: fecha,
        comprobante_emitido: comprobante,
        puntoVenta_emitido: punto_venta,
        tipoRegistroIdEmitido: tipoRegistroIdEmitido,
        tipoVenta_emitido: tipoVenta,
        numeroFactura_emitido: numeroFactura,
        razonSocial_emitido: razonSocial,
        subtotal_emitido: subtotal,
        iva_emitido: iva,
        itc_emitido: itcValue,
        idc_emitido: idcValue,
        percIibb_emitido: percIibb,
        percIva_emitido: percIvaValue,
        otrosImpuestos_emitido: otrosImpuestos,
        descuento_emitido: descuentoValue,
        total_emitido:
          totalNuevo !== totalOriginal ? totalNuevo : totalOriginal,
      },
      success: function (response) {
        if (response === "add") {
          toastr.success("Factura creada con éxito", "Éxito");
          $("#form-crear-factura").trigger("reset");
        } else if (response === "edit") {
          toastr.success("Factura editada con éxito", "Éxito");
          $("#form-crear-factura").trigger("reset");
        } else {
          toastr.error("No se pudo crear la factura", "Error");
        }
        edit = false;
      },
      error: function (xhr, status, error) {
        console.log(error);
        console.error(xhr.responseText);
        toastr.error("Hubo un error en el servidor", "Error");
      },
    });
  });

  $("#tipo_registro_emitido").change(function () {
    calcularTotal();

    let tipoRegistroIdEmitido = $(this).val();
    $("#tipo_registro_id_emitido").val(tipoRegistroIdEmitido);

    if (totalOriginal !== 0) {
      $("#total_emitido").text(totalOriginal);
    }
  });

  $("#obtener-emitidas tbody").on("click", ".editar", function () {
    let datos = datatable.row($(this).parents()).data();
    let id = datos.id;
    let factura = datos.num_factura;
    let dividirDatos = factura.split("-");
    let tipo_factura = datos.id_tipo_factura;
    let punto_venta = dividirDatos[1];
    let numero_factura = dividirDatos[2];

    let tipos_registro = datos.id_registro;

    let fecha = datos.fecha;
    let razon_social = datos.id_cliente;
    let cuit = datos.cuit;
    let subtotal = removeCurrencyFormat(datos.subtotal);
    let iva = removeCurrencyFormat(datos.iva);
    let idc = removeCurrencyFormat(datos.idc);
    let itc = removeCurrencyFormat(datos.itc);
    let otros_im = removeCurrencyFormat(datos.otros_im);
    let perc_iibb = removeCurrencyFormat(datos.perc_iibb);
    let perc_iva = removeCurrencyFormat(datos.perc_iva);
    let descuento = removeCurrencyFormat(datos.descuento);
    let total = removeCurrencyFormat(datos.total);

    totalOriginal = total;

    $("#tipo_registro_div").show();
    let tipoRegistroActual = tipos_registro;
    cargarOpcionesTipoRegistro(tipoRegistroActual);
    $("#tipo_registro_id_emitido").val(tipoRegistroActual);

    $("#editar_factura_id_emitido").val(id);
    $("#razon_social_emitido").val(razon_social);
    $("#fecha_emitido").val(fecha);
    $("#punto_venta_emitido").val(punto_venta);
    $("#tipoFactura").val(tipo_factura);
    $("#numero_factura_emitido").val(numero_factura);
    $("#cuitcuit_emitido").val(cuit);
    $("#subtotal_emitido").val(subtotal);
    $("#calc_iva_emitido").text(iva);
    $("#iva").val(+iva);
    $("#calc_itc_emitido").text(itc);
    $("#calc_idc_emitido").text(idc);
    $("#calc_perc_iibb_emitido").text(perc_iibb);
    $("#calc_perc_iva_emitido").text(perc_iva);
    $("#calc_otro_impuestos_emitido").text(otros_im);
    $("#calc_descuento_emitido").text(descuento);
    $("#total_emitido").text(totalOriginal);

    edit = true;
  });

  $("#obtener-emitidas tbody").on("click", ".anular", function () {
    let datos = datatable.row($(this).parents()).data();
    let idFactura = datos.id;
    let factura = datos.num_factura;
    let dividirDatos = factura.split("-");
    let numero_factura = dividirDatos[2];

    Swal.fire({
      title: "¿Estás seguro?",
      text:
        'Podrás revertir esto, en la seccion "Papelera" buscalo como: ' +
        numero_factura,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, anular factura",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await anularFactura(idFactura, numero_factura);
      }
    });
  });

  $("#detalles_tipos_registros").on();

  async function anularFactura(idFactura, numero_factura) {
    let funcion = "anular";
    let data = await fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:
        "funcion=" +
        funcion +
        "&&idFactura=" +
        idFactura +
        "&&numeroFactura=" +
        numero_factura,
    });

    if (data.ok) {
      let response = await data.text();

      if (response == "borrado") {
        Swal.fire("Factura anulada con éxito", "", "success");
        obtener_facturas_emitidas();
      } else {
        Swal.fire(
          "Error al anular la factura",
          "Hubo un problema al anular la factura",
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
  $("#form-crear-tipo-registro-venta").submit(function (e) {
    e.preventDefault();
    let idTipoRegistroVenta = $("#id_edit_tipo_registro_venta").val();
    let funcion = "crear_tipo_registro_venta";
    let tipoRegistroVenta = $("#create_tipo_registro_venta").val();
    if (edit == true) {
      funcion = "editar_tipo_registro_venta";
    } else {
      funcion = "crear_tipo_registro_venta";
    }
    $.ajax({
      type: "POST",
      url: "../Controllers/FacturacionController.php",
      data: {
        funcion: funcion,
        id: idTipoRegistroVenta,
        tipo_registro_venta: tipoRegistroVenta,
      },
      success: async function (response) {
        console.log(response);
        if (response === "add") {
          toastr.success("Tipo de registro creado con éxito", "Éxito");
          await obtenerOpcionesFacturaEmitida();
          $("#form-crear-tipo-registro-venta").trigger("reset");
        } else if (response === "edit") {
          toastr.success("Tipo de registro editado con éxito", "Éxito");
          await obtenerOpcionesFacturaEmitida();
          $("#form-crear-tipo-registro-venta").trigger("reset");
        } else {
          toastr.error("No se pudo crear el tipo de registro", "Error");
        }
        edit = false;
      },
      error: function (xhr, status, error) {
        console.log(error);
        console.error(xhr.responseText);
        toastr.error("Hubo un error en el servidor", "Error");
      },
    });
  });
  async function obtenerTiposRegistroVentaTable() {
    let funcion = "rellenar_tipo_registro_venta";
    let data = await fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });
    if (data.ok) {
      let response = await data.text();

      try {
        let tipoRegistro = JSON.parse(response);
        datatable = $("#table-tipos-registros-venta").DataTable({
          data: tipoRegistro,
          aaSorting: [],
          searching: true,
          scrollX: false,
          autoWidth: false,
          paging: true,
          bInfo: false,
          columns: [
            { data: "id" },
            { data: "nombre" },
            {
              data: null,
              render: function (data, type, row) {
                return `
                  <button class="editar-tipo-registro btn btn-success" data-id="${row.id}" data-nombre="${row.nombre}" type="button" data-toggle="modal" data-target="#crear-tipos-registro-venta">
                      <i class="fas fa-pencil-alt" style="color: white;"></i>
                  </button>
                  <button class="borrar-tipo-registro btn btn-danger" data-id="${row.id}" type="button">
                      <i class="fas fa-times" style="color:white;"></i>
                  </button>`;
              },
            },
          ],
          language: espanol,
          destroy: true,
        });
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
        text: "hubo conflicto de codigo, pongase en contacto con el administrador",
      });
    }
  }
  $(document).on("click", ".editar-tipo-registro", function () {
    let id = $(this).data("id");
    let nombre = $(this).data("nombre");

    $("#id_edit_tipo_registro_venta").val(id);
    $("#create_tipo_registro_venta").val(nombre);

    edit = true;
    let modal = $("#ver-tipos-registro-venta");
    modal.hide();
  });

  $(document).on("click", ".borrar-tipo-registro", function () {
    let id = $(this).data("id");
    $("#ver-tipos-registro-venta").modal("hide");

    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let deleteData = await fetch(
          "../Controllers/FacturacionController.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `funcion=eliminar_tipo_registro_venta&id=${id}`,
          }
        );

        if (deleteData.ok) {
          Swal.fire("Eliminado", "El registro ha sido eliminado", "success");
          await obtenerTiposRegistroVentaTable();
          await obtenerOpcionesFacturaEmitida();
        } else {
          Swal.fire("Error", "No se pudo eliminar el registro", "error");
        }
      }
    });
  });
  //

  function cargarOpcionesTipoRegistro(tipoRegistroSeleccionado) {
    let funcion = "rellenar_tipo_registro_venta";

    $.ajax({
      url: "../Controllers/FacturacionController.php",
      method: "POST",
      data: {
        funcion: funcion,
      },
      success: function (response) {
        response = JSON.parse(response);
        if (Array.isArray(response) && response.length > 0) {
          $("#tipo_registro_emitido").empty();

          response.forEach(function (opcion) {
            let selected =
              opcion.id === tipoRegistroSeleccionado ? "selected" : "";
            $("#tipo_registro_emitido").append(
              '<option value="' +
                opcion.id +
                '" ' +
                selected +
                ">" +
                opcion.nombre +
                "</option>"
            );
          });

          $("#tipo_registro_div").show();
        } else {
          console.error("La respuesta no es un array o está vacía.");
          $("#tipo_registro_div").hide();
        }
      },
      error: function (error) {
        console.error("Error al cargar opciones de tipo de registro:", error);
      },
    });
  }

  function calcularTotal() {
    $("#calc_iva_emitido").text("0.00");
    $("#calc_itc_emitido").text("0.00");
    $("#calc_idc_emitido").text("0.00");
    $("#calc_perc_iibb_emitido").text("0.00");
    $("#calc_perc_iva_emitido").text("0.00");
    $("#calc_otro_impuestos_emitido").text("0.00");
    $("#calc_descuento_emitido").text("0.00");

    let subtotal = parseFloat($("#subtotal_emitido").val()) || 0;

    function mostrarImpuesto(impuestoId, campoResultadoId) {
      let impuesto = parseFloat($("#" + impuestoId).val()) || 0;

      $("#" + campoResultadoId).text(impuesto.toFixed(2));

      return impuesto;
    }

    let totalImpuestos = 0;

    totalImpuestos += mostrarImpuesto("iva", "calc_iva_emitido");
    totalImpuestos += mostrarImpuesto("itc", "calc_itc_emitido");
    totalImpuestos += mostrarImpuesto("idc", "calc_idc_emitido");
    totalImpuestos += mostrarImpuesto("perc_iibb", "calc_perc_iibb_emitido");
    totalImpuestos += mostrarImpuesto("perc_iva", "calc_perc_iva_emitido");
    totalImpuestos += mostrarImpuesto(
      "otros_impuestos",
      "calc_otro_impuestos_emitido"
    );

    let descuentoPorcentaje = parseFloat($("#descuento").val()) || 0;

    let descuento = (descuentoPorcentaje * subtotal) / 100;

    $("#calc_descuento_emitido").text(descuento.toFixed(2));

    let total = subtotal - descuento + totalImpuestos;

    $("#total_emitido").text(total.toFixed(2));
  }
  $(
    "#subtotal_emitido, #iva, #itc, #idc, #perc_iibb, #perc_iva, #otros_impuestos, #descuento"
  ).on("input", function () {
    calcularTotal();
  });
  function rellenar_clientes() {
    let funcion = "rellenar_clientes";
    $.post("../Controllers/ClienteController.php", { funcion }, (response) => {
      let proveedores = JSON.parse(response);
      let template = "";

      $("#razon_social_emitido").empty();

      proveedores.forEach((proveedor) => {
        template += `<option value="${proveedor.id}" data-cuit="${proveedor.cuit}">${proveedor.razon_social}</option>`;
      });

      $("#razon_social_emitido").html(template);
    });
  }
  $("#razon_social_emitido").change(function () {
    let cuit = $(this).find(":selected").attr("data-cuit");
    $("#cuit_emitido").val(cuit);
  });
  function rellenar_vehiculo() {
    let funcion = "rellenar_vehiculos";
    $.post(
      "../Controllers/vehiculosController.php",
      { funcion },
      (response) => {
        let archivos = JSON.parse(response);
        let template = "";

        $("#equipo_emitido").empty();

        archivos.forEach((archivo) => {
          template += `
                    <option value="${archivo.id}">V: ${archivo.vehiculo} | P: ${archivo.codigo}</option>
                `;
        });
        $("#equipo_emitido").html(template);
      }
    );
  }
  function rellenar_factura() {
    let funcion = "rellenar_factura";
    $.post(
      "../Controllers/FacturacionController.php",
      { funcion },
      (response) => {
        let comprobantes = JSON.parse(response);
        let template = "";

        $("#tipoFactura").empty();

        comprobantes.forEach((comprobante) => {
          template += `
                    <option value="${comprobante.id}">${comprobante.nombre}</option>
                `;
        });
        $("#tipoFactura").html(template);
      }
    );
  }
  async function obtenerOpcionesFacturaEmitida() {
    let funcion = "rellenar_tipo_registro_venta";
    let data = await fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (data.ok) {
      let response = await data.text();
      try {
        let facturas = JSON.parse(response);
        await obtenerTiposRegistroVentaTable();

        let template = "";

        facturas.forEach((opcion) => {
          template += `<div class="cards col-sm-6 mb-1 text-center" id="${opcion.id}" style="cursor: pointer;">
                            <div class="card blue">
                                <p class="tip">${opcion.nombre}</p>
                                <p class="second-text"></p>
                            </div>
                        </div>`;
        });

        $("#opciones_factura").html(template);

        $(".cards").click(function () {
          let index = $(".cards").index(this);

          let opcion = facturas[index];

          document.getElementById("opciones-factura").style.display = "none";

          $("#opciones-factura").hide();

          $("#tipo_venta").val(opcion.nombre);

          $("#tipo_registro_id_emitido").val(opcion.id);

          $("#crear-factura-emitido").modal("show");
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un conflicto en el sistema, póngase en contacto con el administrador.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: data.statusText,
        text: "Hubo un conflicto de código: " + data.status,
      });
    }
  }
  $("#punto_venta_emitido").on("input", function () {
    actualizarValor(this);
  });
  function actualizarValor(input) {
    let dosUltimosDigitos = input.value.slice(-2);
    input.value = "00" + dosUltimosDigitos;
  }

  $("#razon_social").on(function () {
    let cuit = $(this).find(":selected").attr("data-cuit");
    $("#cuit_emitido").val(cuit);
  });
  $("#iva-toggle").change(function () {
    if (this.checked) {
      $("#iva-input-group").show();
    } else {
      $("#iva-input-group").hide();
    }
  });
  $("#itc-toggle").change(function () {
    if (this.checked) {
      $("#itc-input-group").show();
    } else {
      $("#itc-input-group").hide();
    }
  });
  $("#idc-toggle").change(function () {
    if (this.checked) {
      $("#idc-input-group").show();
    } else {
      $("#idc-input-group").hide();
    }
  });
  $("#iibb-toggle").change(function () {
    if (this.checked) {
      $("#iibb-input-group").show();
    } else {
      $("#iibb-input-group").hide();
    }
  });
  $("#periva-toggle").change(function () {
    if (this.checked) {
      $("#perciva-input-group").show();
    } else {
      $("#perciva-input-group").hide();
    }
  });
  $("#imp-toggle").change(function () {
    if (this.checked) {
      $("#otrosimp-input-group").show();
    } else {
      $("#otrosimp-input-group").hide();
    }
  });
  $("#desc-toggle").change(function () {
    if (this.checked) {
      $("#descuento-input-group").show();
    } else {
      $("#descuento-input-group").hide();
    }
  });
  $("#moreInfo").on("click", () => {
    location.href = "../Views/calculosMensualesEmitidos.php";
  });
  $("#papelera").on("click", () => {
    location.href = "../Views/papeleraFacturas.php";
  });

  //

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

  async function obtenerTotalDeTotales() {
    let funcion = "obtener_calculo_total_emitido";
    let data = await fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (data.ok) {
      try {
        let facturas = await data.json();
        let totalDeTotales = facturas.reduce((total, factura) => {
          return total + parseFloat(factura.total) || 0;
        }, 0);

        $("#total_totales").text(formatCurrency(totalDeTotales, "$"));

        return totalDeTotales;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un conflicto en el sistema, póngase en contacto con el programador.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: data.statusText,
        text: "Hubo un conflicto de código: " + data.status,
      });
    }
  }

  async function calcularSituacionFrenteAlIVA() {
    try {
      const ivaDebito = parseFloat(await obtenerCalculosEmitidos()) || 0;
      const ivaCredito = parseFloat(await obtenerCalculosRecibidos()) || 0;

      const situacionFrenteAlIVA = ivaDebito - ivaCredito;

      $("#situacion_fisco").text(formatCurrency(situacionFrenteAlIVA, "$"));
    } catch (error) {
      console.error("Error al calcular la situación frente al IVA:", error);
    }
  }
  async function obtenerCalculosEmitidos() {
    let funcion = "obtener_calculo_iva_venta";
    let data = await fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (data.ok) {
      try {
        let response = await data.text();

        let facturas = isValidJson(response) ? JSON.parse(response) : [];

        let montoTotalIVAVenta = 0;

        facturas.forEach((factura) => {
          montoTotalIVAVenta += parseFloat(factura.iva) || 0;
        });

        $("#iva_venta").text(formatCurrency(montoTotalIVAVenta, "$"));

        return montoTotalIVAVenta;
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un conflicto en el sistema, póngase en contacto con el programador.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: data.statusText,
        text: "Hubo un conflicto de código: " + data.status,
      });
    }
  }

  async function obtenerCalculosRecibidos() {
    let funcion = "obtener_calc";
    let data = await fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (data.ok) {
      try {
        let response = await data.text();

        let facturas = isValidJson(response) ? JSON.parse(response) : [];

        let montoTotalIVA = 0;
        facturas.forEach((factura) => {
          montoTotalIVA += parseFloat(factura.iva) || 0;
        });

        $("#iva_compra").text(formatCurrency(montoTotalIVA, "$"));
        return montoTotalIVA;
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un conflicto en el sistema, póngase en contacto con el programador.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: data.statusText,
        text: "Hubo un conflicto de código: " + data.status,
      });
    }
  }
  function isValidJson(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
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
const mesesEnEspañol = {
  January: "Enero",
  February: "Febrero",
  March: "Marzo",
  April: "Abril",
  May: "Mayo",
  June: "Junio",
  July: "Julio",
  August: "Agosto",
  September: "Septiembre",
  October: "Octubre",
  November: "Noviembre",
  December: "Diciembre",
};
