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
          obtenerTiposRegistrosFactura();
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

  async function mesesFaturasRecibidas() {
    let funcion = "obtener_meses_recibidos_calc";
    let data = await fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (data.ok) {
      let response = await data.json();
      response.forEach((mes) => {
        mes.nombre = mesesEnEspañol[mes.nombre.split("-")[1]]; // Obtener el nombre del mes y convertirlo
      });
      console.log(response);
      return response;
    } else {
      console.error("Error al obtener los meses");
      return [];
    }
  }

  async function obtenerTiposRegistrosFactura() {
    let funcion = "obtenerRegistroRecibido";
    let data = await fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (data.ok) {
      try {
        let response = await data.json();

        if (response && response.facturas && Array.isArray(response.facturas)) {
          let tiposRegistro = response.tipos_registro;

          let meses = await mesesFaturasRecibidas();

          //POR MES

          let selectMes = $("#selectMes");
          selectMes.empty();
          selectMes.append('<option value="">Todos los meses</option>'); // Opción por defecto
          meses.forEach((mes) => {
            selectMes.append(
              `<option value="${mes.valor}">${mes.nombre}</option>`
            );
          });

          // Manejar el evento de cambio en el selector de meses
          selectMes.on("change", async function () {
            var selectedMonth = $(this).val();
            await actualizarWidgets(
              selectedMonth,
              $("#selectGasto").val(),
              response,
              tiposRegistro
            );
          });

          //POR TIPO DE REGISTGRO

          let selectTipoRegistro = $("#selectGasto");
          selectTipoRegistro.empty();
          selectTipoRegistro.append(
            '<option value="">Todos los gastos</option>'
          ); // Opción por defecto
          tiposRegistro.forEach((opcion) => {
            if (opcion.estado === "A") {
              selectTipoRegistro.append(
                `<option value="${opcion.id}">${opcion.nombre}</option>`
              );
            }
          });

          // Manejar el evento de cambio en el selector de tipos de registro
          selectTipoRegistro.on("change", async function () {
            var selectedTipoRegistro = $(this).val();
            await actualizarWidgets(
              $("#selectMes").val(),
              selectedTipoRegistro,
              response,
              tiposRegistro
            );
          });

          // Llamada inicial sin mes ni tipo de registro seleccionado
          await actualizarWidgets(null, null, response, tiposRegistro);
        } else {
          console.error(
            "La propiedad 'facturas' no está definida o no es un array en la respuesta."
          );
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Esta habiendo un problema");
    }
  }

  async function actualizarWidgets(
    mesSeleccionado,
    tipoRegistroSeleccionado,
    response,
    tiposRegistro
  ) {
    let widgetsContent = "";
    if (Array.isArray(response.facturas)) {
      console.log(tipoRegistroSeleccionado);
      console.log(mesSeleccionado);
      response.facturas.forEach((factura) => {
        const tipoRegistro = tiposRegistro.find(
          (opcion) => opcion.id === factura.id && opcion.estado === "A"
        );
        if (
          tipoRegistro &&
          (mesSeleccionado === "" ||
            mesSeleccionado === null ||
            factura.mes === mesSeleccionado) &&
          (tipoRegistroSeleccionado === null ||
            tipoRegistro.id === tipoRegistroSeleccionado)
        ) {
          const totalPorTipoRegistro = parseFloat(factura.total);
          const mes = mesEnTexto(factura.mes);
          widgetsContent += generarWidget(
            tipoRegistro,
            totalPorTipoRegistro,
            mes
          );
        }
      });
    } else {
      console.error(
        "La propiedad response.facturas no es un array:",
        response.facturas
      );
    }

    $("#widgets").html(widgetsContent);
  }

  function generarWidget(tipoRegistro, totalPorTipoRegistro, mes) {
    if (tipoRegistro && tipoRegistro.nombre && mes) {
      return `
                <div class="col-md-4 col-12">
                    <div class="info-box bg-gradient-info">
                        <span class="info-box-icon"><i class="fas fa-chart-line" style="color:#78DA26;"></i></span>
                        <div class="info-box-content">
                            <span class="info-box-text">${
                              tipoRegistro.nombre
                            }</span>
                            <span class="info-box-number">${totalPorTipoRegistro.toLocaleString(
                              "es-AR",
                              { style: "currency", currency: "ARS" }
                            )} Es el total del mes de <b>${mes}</b></span>
                        </div>
                    </div>
                </div>`;
    } else {
      console.error(
        "El tipo de registro o el mes son inválidos:",
        tipoRegistro,
        mes
      );
      return ""; // Devolvemos una cadena vacía en caso de error
    }
  }

  function mesEnTexto(numeroMes) {
    const mesesEnTexto = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return mesesEnTexto[numeroMes - 1]; // Restamos 1 porque el array de meses comienza desde 0
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
