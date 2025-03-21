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

  async function mesesFaturasEmitidas() {
    let funcion = "obtener_meses_emitidos_calc";
    let data = await fetch("../Controllers/FacturacionController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (data.ok) {
      let response = await data.json();
      return response;
    } else {
      console.error("Error al obtener los meses");
      return [];
    }
  }

  async function obtenerTiposRegistrosFactura() {
    let funcion = "obtenerRegistroEmitido";
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

          let meses = await mesesFaturasEmitidas();

          let selectMes = $("#selectMes");
          selectMes.empty();
          selectMes.append('<option value="">Todos los meses</option>');
          meses.forEach((mes) => {
            selectMes.append(
              `<option value="${mes.valor}">${mes.nombre}</option>`
            );
          });

          selectMes.on("change", async function () {
            var selectedMonth = $(this).val();
            await actualizarWidgetsPorMes(
              selectedMonth,
              response,
              tiposRegistro
            );
          });

          //POR TIPO DE REGISTGRO

          let selectTipoRegistro = $("#selectGasto");
          selectTipoRegistro.empty();
          selectTipoRegistro.append(
            '<option value="">Todos los gastos</option>'
          );
          tiposRegistro.forEach((opcion) => {
            if (opcion.estado === "A") {
              selectTipoRegistro.append(
                `<option value="${opcion.id}">${opcion.nombre}</option>`
              );
            }
          });

          selectTipoRegistro.on("change", async function () {
            var selectedTipoRegistro = $(this).val();
            await actualizarWidgetsPorTipoRegistro(
              selectedTipoRegistro,
              response,
              tiposRegistro
            );
          });

          await actualizarWidgetsPorTipoRegistro(null, response, tiposRegistro);
          await actualizarWidgetsPorMes(null, response, tiposRegistro);
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

  async function actualizarWidgetsPorMes(
    mesSeleccionado,
    response,
    tiposRegistro
  ) {
    let totalesPorTipoMes = {};

    const facturasFiltradas = mesSeleccionado
      ? response.facturas.filter((factura) => factura.mes == mesSeleccionado)
      : response.facturas;

    facturasFiltradas.forEach((factura) => {
      const mes = factura.mes;
      if (!totalesPorTipoMes[mes]) {
        totalesPorTipoMes[mes] = {};
      }

      tiposRegistro.forEach((opcion) => {
        if (opcion.id == factura.id && opcion.estado === "A") {
          if (!totalesPorTipoMes[mes][opcion.id]) {
            totalesPorTipoMes[mes][opcion.id] = {
              totalPorTipoRegistro: 0,
              totalActivas: 0,
            };
          }

          let totalPorTipoRegistro = parseFloat(factura.total);
          totalesPorTipoMes[mes][opcion.id].totalPorTipoRegistro +=
            totalPorTipoRegistro;
          totalesPorTipoMes[mes][opcion.id].totalActivas +=
            totalPorTipoRegistro;
        }
      });
    });

    let tabsContent = "";

    for (const mes in totalesPorTipoMes) {
      if (totalesPorTipoMes.hasOwnProperty(mes)) {
        for (const tipoRegistroId in totalesPorTipoMes[mes]) {
          if (totalesPorTipoMes[mes].hasOwnProperty(tipoRegistroId)) {
            const tipoRegistro = tiposRegistro.find(
              (opcion) => opcion.id == tipoRegistroId
            );

            if (!tipoRegistro) {
              continue;
            }

            const totalPorTipoRegistro =
              totalesPorTipoMes[mes][tipoRegistroId].totalPorTipoRegistro;
            const totalActivas =
              totalesPorTipoMes[mes][tipoRegistroId].totalActivas;
            const porcentaje = (
              (totalPorTipoRegistro / totalActivas) *
              100
            ).toFixed(2);

            let widgetId = `widget-${tipoRegistroId}-mes${mes}`;

            tabsContent += `
                            <div class="col-md-4 col-12" id="${widgetId}">
                                <div class="info-box bg-gradient-info">
                                    <span class="info-box-icon"><i class="fas fa-chart-line" style="color:#78DA26;"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">${
                                          tipoRegistro.nombre ||
                                          "Nombre no disponible"
                                        }</span>
                                        <span class="info-box-number">${totalPorTipoRegistro.toLocaleString(
                                          "es-AR",
                                          { style: "currency", currency: "ARS" }
                                        )} Es el total</span>
                                        <div class="progress">
                                            <div class="progress-bar" style="width: ${porcentaje}%"></div>
                                        </div>
                                        <span class="progress-description">${porcentaje}% Incremental en 30 días</span>
                                    </div>
                                </div>
                            </div>`;
          }
        }
      }
    }

    $("#widgets").html(tabsContent);
  }

  async function actualizarWidgetsPorTipoRegistro(
    tipoRegistroSeleccionado,
    response,
    tiposRegistro
  ) {
    let totalesPorTipoRegistro = {};

    const facturasFiltradas = tipoRegistroSeleccionado
      ? response.facturas.filter(
          (factura) => factura.id == tipoRegistroSeleccionado
        )
      : response.facturas;

    facturasFiltradas.forEach((factura) => {
      const nombre = factura.nombre;
      if (!totalesPorTipoRegistro[nombre]) {
        totalesPorTipoRegistro[nombre] = {};
      }

      tiposRegistro.forEach((opcion) => {
        if (opcion.id == factura.id && opcion.estado === "A") {
          if (!totalesPorTipoRegistro[nombre][opcion.id]) {
            totalesPorTipoRegistro[nombre][opcion.id] = {
              totalPorTipoRegistro: 0,
              totalActivas: 0,
            };
          }

          let totalPorTipoRegistro = parseFloat(factura.total);
          totalesPorTipoRegistro[nombre][opcion.id].totalPorTipoRegistro +=
            totalPorTipoRegistro;
          totalesPorTipoRegistro[nombre][opcion.id].totalActivas +=
            totalPorTipoRegistro;
        }
      });
    });

    let tabsContent = "";

    for (const nombre in totalesPorTipoRegistro) {
      if (totalesPorTipoRegistro.hasOwnProperty(nombre)) {
        for (const tipoRegistroId in totalesPorTipoRegistro[nombre]) {
          if (totalesPorTipoRegistro[nombre].hasOwnProperty(tipoRegistroId)) {
            const tipoRegistro = tiposRegistro.find(
              (opcion) => opcion.id == tipoRegistroId
            );

            if (!tipoRegistro) {
              continue;
            }

            const totalPorTipoRegistro =
              totalesPorTipoRegistro[nombre][tipoRegistroId]
                .totalPorTipoRegistro;
            const totalActivas =
              totalesPorTipoRegistro[nombre][tipoRegistroId].totalActivas;
            const porcentaje = (
              (totalPorTipoRegistro / totalActivas) *
              100
            ).toFixed(2);

            let widgetId = `widget-${tipoRegistroId}-nombre${nombre}`;

            tabsContent += `
                                <div class="col-md-4 col-12" id="${widgetId}">
                                    <div class="info-box bg-gradient-info">
                                        <span class="info-box-icon"><i class="fas fa-chart-line" style="color:#78DA26;"></i></span>
                                        <div class="info-box-content">
                                            <span class="info-box-text">${
                                              tipoRegistro.nombre ||
                                              "Nombre no disponible"
                                            }</span>
                                            <span class="info-box-number">${totalPorTipoRegistro.toLocaleString(
                                              "es-AR",
                                              {
                                                style: "currency",
                                                currency: "ARS",
                                              }
                                            )} Es el total</span>
                                            <div class="progress">
                                                <div class="progress-bar" style="width: ${porcentaje}%"></div>
                                            </div>
                                            <span class="progress-description">${porcentaje}% Incremental en 30 días</span>
                                        </div>
                                    </div>
                                </div>`;
          }
        }
      }
    }

    $("#widgets").html(tabsContent);
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
});
