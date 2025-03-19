import {
  llenar_menu_superior,
  llenar_menu_lateral,
} from "./layouts/layouts.js";
import {
  allowedOrigins,
  getCompanyData,
} from "../Util/config/allowed-options.js";

$(document).ready(function () {
  Loader("Cargando Datos");
  verificar_sesion();
  toastr.options = {
    preventDuplicates: true,
  };
  $(".select2").select2();

  $('[data-toggle="tooltip"]').tooltip();
  let productos = [];
  let currentStep = 0;

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
          showCardButtons();
          CloseLoader();
          if (!respuesta.company_billing) {
            showButtonIntegrationARCA();
          } else {
            showButtonBilling();
          }
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

  function showCardButtons() {
    let template = `
            <div class="col-md-6 col-12 mb-3"> <!-- 6 columnas en pantallas grandes, 12 en pequeñas -->
                <div class="card-notification">
                    <div class="container" id="registro_recibido">
                        <div class="left-side">
                            <div class="card">
                                <div class="card-line"></div>
                                <div class="buttons"></div>
                            </div>
                            <div class="post">
                                <div class="post-line"></div>
                                <div class="screen">
                                    <div class="dollar">$</div>
                                </div>
                                <div class="numbers"></div>
                                <div class="numbers-line2"></div>
                            </div>
                        </div>
                        <div class="right-side">
                            <div class="new">Registro Egresos</div>
                            <svg viewBox="0 0 451.846 451.847" height="512" width="512" xmlns="http://www.w3.org/2000/svg" class="arrow">
                                <path fill="#cfcfcf" data-old_color="#000000" class="active-path" data-original="#000000" d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-12 mb-3">
                <div class="card-notification">
                    <div class="container" id="registro_emitido">
                        <div class="left-side">
                            <div class="card">
                                <div class="card-line"></div>
                                <div class="buttons"></div>
                            </div>
                            <div class="post">
                                <div class="post-line"></div>
                                <div class="screen">
                                    <div class="dollar">$</div>
                                </div>
                                <div class="numbers"></div>
                                <div class="numbers-line2"></div>
                            </div>
                        </div>
                        <div class="right-side">
                            <div class="new">Registro Ingresos</div>
                            <svg viewBox="0 0 451.846 451.847" height="512" width="512" xmlns="http://www.w3.org/2000/svg" class="arrow">
                                <path fill="#cfcfcf" data-old_color="#000000" class="active-path" data-original="#000000" d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>`;

    $("#content_card_facturation").html(template);
  }

  function showButtonIntegrationARCA() {
    let template = `
    <div class="card-notification" id="open-modal">
                <div class="container">
                    <div class="left-side">
                        <div class="card">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3 text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                            </svg>
                        </div>
                    </div>
                    <div class="right-side">
                        <div class="new">Integrar factura electronica</div>
                        <svg viewBox="0 0 451.846 451.847" height="512" width="512" xmlns="http://www.w3.org/2000/svg" class="arrow">
                            <path fill="#cfcfcf" data-old_color="#000000" class="active-path" data-original="#000000" d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z"></path>
                        </svg>
                    </div>
                </div>
            </div>
    `;
    $("#arca-integration").html(template);
  }

  function showButtonBilling() {
    let template = `
      <div class="card-notification col-md-12" id="open-modal-billing">
          <div class="container">
              <div class="left-side">
                  <div class="card">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3 text-white">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                      </svg>
                  </div>
              </div>
              <div class="right-side">
                  <div class="new">Crear Factura</div>
                  <svg viewBox="0 0 451.846 451.847" height="512" width="512" xmlns="http://www.w3.org/2000/svg" class="arrow">
                      <path fill="#cfcfcf" data-old_color="#000000" class="active-path" data-original="#000000" d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z"></path>
                  </svg>
              </div>
          </div>
      </div>
    `;
    $("#arca-integration").html(template);
  }

  $("#crearFacturaModal").on("shown.bs.modal", function () {
    rellenar_producto();
    rellenar_clientes();
  });

  $("#add-client-modal").on("click", function () {
    $("#crearClienteModal").modal("show");
    $("#crearFacturaModal").modal("hide");
  });

  function rellenar_producto() {
    let funcion = "rellenar_productos";
    $.post("../Controllers/ProductoController.php", { funcion }, (response) => {
      let productos = JSON.parse(response);
      let template = '<option value="">Seleccione un producto</option>';

      productos.forEach((prod) => {
        template += `<option value="${prod.id}" data-nombre="${prod.nombre}" data-precio="${prod.precio}">${prod.nombre} - $${prod.precio}</option>`;
      });

      $("#productos").html(template);
    });
  }

  function rellenar_clientes() {
    let funcion = "rellenar_clientes";
    $.post("../Controllers/ClienteController.php", { funcion }, (response) => {
      let clientes = JSON.parse(response);
      let template = "";

      clientes.forEach((cliente) => {
        template += `
          <option value="${cliente.id}"
                  data-razon-social="${cliente.razon_social || "N/A"}"
                  data-cuit="${cliente.cuit || "N/A"}"
                  data-email="${cliente.email || "N/A"}"
                  data-direccion="${cliente.direccion || "N/A"}"
                  data-condicion-iva="${cliente.condicion_iva || "N/A"}"
          >
            ${cliente.razon_social} (CUIT: ${cliente.cuit})
          </option>`;
      });

      $("#cuitCliente").html(template);
    });
  }

  $("#searchClient").on("input", function () {
    let searchValue = $(this).val().toLowerCase();
    let found = false;

    $("#cuitCliente option").each(function () {
      let razonSocial = $(this).data("razon-social").toLowerCase();

      if (razonSocial.includes(searchValue)) {
        $(this).prop("selected", true);
        found = true;
        return false;
      }
    });

    if (!found) {
      $("#cuitCliente").val("");
    }
  });

  $.fn.modal.Constructor.prototype._enforceFocus = function () {};
  $("#productos").on("change", function () {
    const productoId = $(this).val();
    const productoCodigo = $(this)
      .find(":selected")
      .data("nombre")
      .split(" | ")[0];
    const productoNombre = $(this)
      .find(":selected")
      .data("nombre")
      .split(" | ")[1];
    const productoPrecio = parseFloat($(this).find(":selected").data("precio"));

    if (productoId && productoNombre && productoPrecio) {
      Swal.fire({
        title: `Ingrese la cantidad para "${productoNombre}":`,
        input: "number",
        inputAttributes: {
          min: 1,
          step: 1,
        },
        showCancelButton: true,
        confirmButtonText: "Siguiente",
        cancelButtonText: "Cancelar",
        preConfirm: (cantidad) => {
          if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
            Swal.showValidationMessage("Ingrese una cantidad válida");
          }
          return cantidad;
        },
        didOpen: () => {
          setTimeout(() => {
            const input = Swal.getInput();
            if (input) {
              input.focus();
            }
          }, 100);
        },
      }).then((cantidadResult) => {
        if (cantidadResult.isConfirmed) {
          const cantidad = cantidadResult.value;

          Swal.fire({
            title: `Seleccione la unidad de medida para "${productoNombre}":`,
            input: "select",
            inputOptions: {
              Kilogramo: "Kilogramo",
              Unidad: "Unidad",
              Litro: "Litro",
              Metro: "Metro",
              "Metro Cuadrado": "Metro Cuadrado",
              "Metro Cúbico": "Metro Cúbico",
              Gramo: "Gramo",
              Milímetro: "Milímetro",
              Kilómetro: "Kilómetro",
              Hectárea: "Hectárea",
              Joule: "Joule",
              "Gramo Activo": "Gramo Activo",
              "Miligramo Activo": "Miligramo Activo",
              "Unidad Internacional": "Unidad Internacional",
              Mililitro: "Mililitro",
              "MegaUnidad Internacional": "MegaUnidad Internacional",
              "MUI/ml": "MUI/ml",
              "UI/mg": "UI/mg",
              "MUI/mg": "MUI/mg",
              Miligramos: "Miligramos",
              Microgramos: "Microgramos",
              Nanogramos: "Nanogramos",
              Picogramos: "Picogramos",
              "Centímetro Cúbico": "Centímetro Cúbico",
              "Unidades de medida no informadas":
                "Unidades de medida no informadas",
            },
            showCancelButton: true,
            confirmButtonText: "Agregar",
            cancelButtonText: "Cancelar",
            preConfirm: (medida) => {
              if (!medida) {
                Swal.showValidationMessage("Seleccione una unidad de medida");
              }
              return medida;
            },
            didOpen: () => {
              setTimeout(() => {
                const select = Swal.getInput();
                if (select) {
                  select.focus();
                }
              }, 100);
            },
          }).then((medidaResult) => {
            // Dentro del bloque donde confirmas la unidad de medida
            if (medidaResult.isConfirmed) {
              const medida = medidaResult.value;
              const subtotal = productoPrecio * parseFloat(cantidad);

              const nuevaFila = `
                            <tr data-id="${productoId}">
                              <td>${productoCodigo}</td>
                              <td>${productoNombre}</td>
                              <td>${medida}</td>
                              <td>${cantidad}</td>
                              <td>$${productoPrecio.toFixed(2)}</td>
                              <td>$${subtotal.toFixed(2)}</td>
                              <td>
                                <button type="button" class="btn btn-danger btn-sm eliminar-producto">Eliminar</button>
                              </td>
                            </tr>
                          `;

              const producto = {
                id: productoId,
                quantity: cantidad,
                name: productoNombre,
                code: productoCodigo,
                measurement: medida,
                price: productoPrecio,
                subtotal: subtotal,
              };

              // Agregar el producto al array
              productos.push(producto);

              $("#productosTable").append(nuevaFila);
              calcularTotales();
              $("#productos").val("");
            }
          });
        }
      });
    }
  });
  $(document).on("click", ".eliminar-producto", function () {
    const fila = $(this).closest("tr");
    const productoId = fila.data("id");

    productos = productos.filter((prod) => +prod.id !== +productoId);

    fila.remove();

    calcularTotales();
  });

  $("#crearFactura").on("click", async function () {
    const $boton = $(this);
    $boton.prop("disabled", true);
    $boton.html('<i class="fas fa-spinner fa-spin"></i>');

    const tipoComprobante = $("#tipoComprobante").val();
    const condicionVenta = $("#condicion_venta").val();
    const concepto = $("#concepto").val();
    const razonSocialCliente = $("#cuitCliente option:selected")
      .data("razon-social")
      .toString();
    const direccionCliente = $("#cuitCliente option:selected")
      .data("direccion")
      .toString();
    const cuitCliente = $("#cuitCliente option:selected")
      .data("cuit")
      .toString();
    const condicionIvaCliente = $("#cuitCliente option:selected")
      .data("condicion-iva")
      .toString();
    const company = getCompanyData();

    const dataClient = {
      razon_social: razonSocialCliente,
      direccion: direccionCliente,
      cuit: cuitCliente,
      condicion_iva: condicionIvaCliente,
    };

    const facturaData = {
      concept: +concepto,
      documentNumber: cuitCliente,
      ivaCondition: condicionVenta,
      client: dataClient,
      products: productos,
      company: company,
      invoiceType: tipoComprobante,
      subtotal: parseFloat($("#subtotal").val().replace("$", "")),
      iva: parseFloat($("#iva").val().replace("$", "")),
      total: parseFloat($("#total").val().replace("$", "")),
    };

    const data = {
      invoiceType: tipoComprobante,
      invoiceData: facturaData,
    };

    try {
      const response = await fetch(
        `${allowedOrigins}/invoice-afip/create-invoice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const pdfUrl = result.createPDF.filePath;

        Swal.fire({
          title: "Factura creada",
          text: "La factura se generó correctamente. ¿Quieres descargar el PDF?",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Descargar PDF",
          cancelButtonText: "Cerrar",
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(pdfUrl, "_blank");
          }
        });

        $("#crearFacturaModal").modal("hide");
      } else {
        const error = await response.json();
        toastr.error(`Error: ${error.message}`, "Error");
      }
    } catch (error) {
      console.error("Error:", error);
      toastr.error("Hubo un error al crear la factura.", "Error");
    } finally {
      // Restaurar el botón
      $boton.prop("disabled", false);
      $boton.html("Crear Factura");
    }
  });

  $(document).on("click", "#open-modal-billing", function () {
    $("#crearFacturaModal").modal("show");
  });

  function calcularTotales() {
    let subtotal = 0;

    $("#tablaProductos tbody tr").each(function () {
      const precioUnitarioText = $(this)
        .find("td")
        .eq(4)
        .text()
        .replace("$", "")
        .trim();
      const cantidadText = $(this).find("td").eq(3).text().trim();
      const precioUnitario = parseFloat(precioUnitarioText);
      const cantidad = parseFloat(cantidadText);

      if (!isNaN(precioUnitario) && !isNaN(cantidad)) {
        subtotal += precioUnitario * cantidad;
      } else {
        console.error(
          "Valores inválidos en la fila:",
          precioUnitarioText,
          cantidadText
        );
      }
    });

    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    $("#subtotal").val(`${subtotal.toFixed(2)}`);
    $("#iva").val(`${iva.toFixed(2)}`);
    $("#total").val(`${total.toFixed(2)}`);
  }

  $(document).on("click", "#open-modal", function () {
    $("#integration-modal").modal("show");
  });

  $("#generate-certificates").on("click", async function (e) {
    e.preventDefault();
    const $modal = $(this).closest(".modal");
    const companyName = $modal.find("#company-name").val();
    const password = $modal.find("#password").val();
    const taxId = $modal.find("#tax-id").val();
    const pointOfSale = $modal.find("#point-sale-id").val();

    if (!companyName || !password || !taxId || !pointOfSale) {
      console.log(companyName, password, taxId, pointOfSale);
      toastr.info(
        "Tienes campos vacíos, todos los datos son requeridos, vuelve y rellenalos",
        "Info"
      );
      return;
    }

    try {
      const response = await fetch(
        `${allowedOrigins}/afip/generate-certificate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            taxId: taxId,
            username: taxId,
            password: password,
            alias: companyName,
            pointOfSale: +pointOfSale,
            companyName: companyName,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toastr.success("Certificados generados exitosamente", "Éxito");

        $modal
          .find("#download-link")
          .attr("href", `${allowedOrigins}/${data.csrFilePath}`)
          .show();

        $modal.find(".next-step").click();
      } else {
        console.log(data);
        toastr.error("Hubo un problema al generar los certificados", "Error");
      }
    } catch (error) {
      console.error("Error:", error);
      toastr.error("Hubo un error al generar los certificados", "Error");
    }
  });

  $("#upload-crt").on("change", async function (e) {
    e.preventDefault();

    const file = e.target.files[0];
    if (file && file.name.endsWith(".crt")) {
      const formData = new FormData();
      formData.append("crtFile", file);

      try {
        const response = await $.ajax({
          url: `${allowedOrigins}/afip/upload`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          method: "POST",
          data: formData,
          processData: false,
          contentType: false,
        });

        console.log(response);

        if (response.success) {
          toastr.success("Certificado .crt subido correctamente.", "Exito");
          currentStep++;
          showStep(currentStep);
        } else {
          toastr.error("Error al subir el certificado .crt", "Error");
        }
      } catch (error) {
        console.error("Error:", error);
        toastr.error("Hubo un error al subir el certificado .crt", "Error");
      }
    } else {
      toastr.error("Por favor, selecciona un archivo .crt válido.", "Error");
    }
  });

  $("#finish-process").on("click", function () {
    $("#integration-modal").modal("hide");
    alert("Proceso de integración completado");
  });

  function initializeModal(modalId) {
    let $modal = $(modalId);
    let $steps = $modal.find(".step");

    $modal.data("stepIndex", 0);

    $steps.hide().eq($modal.data("stepIndex")).show();

    function updateSteps() {
      let stepIndex = $modal.data("stepIndex");
      $steps.hide().eq(stepIndex).show();
      $modal.find(".prev-step").toggle(stepIndex > 0);
      $modal.find(".next-step").toggle(stepIndex < $steps.length - 1);
      $modal.find(".finish-step").toggle(stepIndex === $steps.length - 1);
    }

    $modal
      .find(".next-step")
      .off("click")
      .on("click", function () {
        let stepIndex = $modal.data("stepIndex");
        if (stepIndex < $steps.length - 1) {
          $modal.data("stepIndex", stepIndex + 1);
          updateSteps();
        }
      });

    $modal
      .find(".prev-step")
      .off("click")
      .on("click", function () {
        let stepIndex = $modal.data("stepIndex");
        if (stepIndex > 0) {
          $modal.data("stepIndex", stepIndex - 1);
          updateSteps();
        }
      });

    $modal
      .find(".finish-step")
      .off("click")
      .on("click", function () {
        $modal.modal("hide");

        // Solo cerrar sesión si el modal es #integration-modal
        if (modalId === "#integration-modal") {
          Swal.fire({
            title: "Sesión cerrando...",
            text: "En 5 segundos se cerrará la sesión para impactar los cambios.",
            icon: "info",
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
            willClose: () => {
              window.location.href = "../Controllers/Logout.php";
            },
          });
        }
      });

    $modal.on("shown.bs.modal", function () {
      $modal.data("stepIndex", 0);
      updateSteps();
    });
  }

  // Inicializar cada modal con su propio evento
  $("#modal-certificados").on("shown.bs.modal", function () {
    initializeModal("#modal-certificados");
  });

  $("#modal-punto-venta").on("shown.bs.modal", function () {
    initializeModal("#modal-punto-venta");
  });

  $("#modal-generate-cert").on("shown.bs.modal", function () {
    initializeModal("#modal-generate-cert");
  });

  $("#integration-modal").on("shown.bs.modal", function () {
    initializeModal("#integration-modal");
  });

  // Agregar los botones dinámicamente al footer del modal
  $(".footer").append(`
    <button type="button" class="btn btn-secondary prev-step">Anterior</button>
    <button type="button" class="btn btn-primary next-step">Siguiente</button>
    <button type="button" class="btn btn-success finish-step" style="display:none;">Finalizar</button>
  `);

  $(document).on("click", "#registro_recibido", function () {
    window.location.href = "facturacion-recibido.php";
  });

  $(document).on("click", "#registro_emitido", function () {
    window.location.href = "facturacion-emitido.php";
  });

  $("#form-crear-cliente").submit((e) => {
    e.preventDefault();
    let funcion = "crear";
    let id = $("#id_edit_cliente").val();
    let razonsocial = $("#razon_social_cliente").val();
    let nombre = $("#nombre_cliente").val();
    let direccion = $("#direccion_cliente").val();
    let email = $("#email_cliente").val();
    let telefono = $("#telefono_cliente").val();
    let cuit = $("#cuit_cliente").val();
    let condicion_iva = $("#condicion_iva_cliente").val();

    $.post(
      "../Controllers/ClienteController.php",
      {
        id,
        nombre,
        direccion,
        email,
        telefono,
        cuit,
        razonsocial,
        condicion_iva,
        funcion,
      },
      (response) => {
        if (response == "add") {
          toastr.success("Cliente Agregado con exito", "Exito!");
          $("#form-crear-cliente").trigger("reset");
        }
        if (response == "edit") {
          toastr.success("Cliente Editado con exito", "Exito!");
          $("#form-crear-cliente").trigger("reset");
        }
        if (response == "noadd") {
          toastr.error("Cliente no ha sido agregado", "Error!");
          $("#form-crear-cliente").trigger("reset");
        }
      }
    );
    e.preventDefault();
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
