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
  let productosSeleccionados = [];
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
          $("#gestion_usuario").show();
          $("#gestion_catalogo").show();
          $("#gestion_ventas").show();
          $("#gestion_lotes").show();
          $("#gestion_pedidos").show();
          $("#cat-carrito").show();
          $("#content_admin").show();
          obtenerControlSalida();
          obtenerEnvios();
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
        text: "hubo conflicto de codigo, pongase en contacto con soporte",
      });
    }
  }

  function obtenerControlSalida() {
    let funcion = "obtener_todos_control_salida";
    $.post(
      "../Controllers/ControlSalidaController.php",
      { funcion },
      (response) => {
        let controlesSalida = JSON.parse(response);
        let template = "";
        let lastDate = "";
        let count = 0;

        controlesSalida.forEach((control) => {
          if (control.fecha !== lastDate) {
            if (lastDate !== "") {
              template += `</div>`;
            }
            template += `
                        <div class="time-label">
                            <span class="bg-danger text-white p-2 rounded">${control.fecha}</span>
                            <button class="btn btn-sm btn-toggle btn-primary" data-toggle="collapse" data-target="#date-${count}" aria-expanded="true" aria-controls="date-${count}">
                                -
                            </button>
                        </div>
                        <div id="date-${count}" class="collapse show">`;
            lastDate = control.fecha;
            count++;
          }

          let productosTemplate = "";
          if (control.productos && control.productos.length > 0) {
            productosTemplate = `<div class="productos-list"><strong>Productos:</strong><ul>`;
            control.productos.forEach((producto) => {
              productosTemplate += `<li>${producto.nombre} (Cantidad: ${producto.cantidad})</li>`;
            });
            productosTemplate += `</ul></div>`;
          }

          template += `
                    <i class="fas fa-truck bg-blue me-3"></i>
                    <div class="timeline-item border p-3 mb-3">
                        <div class="d-flex align-items-center">
                            <div class="timeline-item-content flex-grow-1">
                                <span class="time"><i class="fas fa-clock"></i> ${control.hora}</span>
                                <h3 class="timeline-header"><a href="#">${control.empresa}</a></h3>
                                <div class="timeline-body">
                                    Vehículo: ${control.vehiculo_codigo} - ${control.vehiculo_nombre}<br>
                                    Motivo: ${control.motivo}<br>
                                    Observación: ${control.observacion}<br>
                                    Chofer: ${control.chofer_nombre}
                                    ${productosTemplate} <!-- Mostrar la lista de productos -->
                                </div>
                                <div class="timeline-footer">
                                    <button class="btn btn-primary btn-sm btn-generar-remito" 
                                            data-fecha="${control.fecha}" 
                                            data-id="${control.id}" 
                                            data-numero-remito="${control.id}" 
                                            data-chofer="${control.chofer_nombre}" 
                                            data-empresa="${control.empresa}"
                                            data-patente="${control.vehiculo_codigo}" 
                                            data-productos="${control.productos}" 
                                            type="button" data-toggle="modal" data-target="#remito-salida">Generar remito</button>
                                    <button class="btn btn-danger btn-sm btn-delete" data-id="${control.id}">Borrar</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
        });

        template += `</div>`;
        $("#timeline").html(template);

        $(".btn-toggle").on("click", function () {
          let $button = $(this);
          let isExpanded = $button.attr("aria-expanded") === "true";

          if (isExpanded) {
            $button.text("+");
          } else {
            $button.text("-");
          }
        });

        $(".btn-delete").on("click", function () {
          let id = $(this).attr("data-id");
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-primary",
              cancelButton: "btn btn-secondary mr-2",
            },
            buttonsStyling: false,
          });

          swalWithBootstrapButtons
            .fire({
              icon: "question",
              title: "¿Estás seguro?",
              text: "¡No vas a ver más este registro!",
              imageWidth: 100,
              imageHeight: 100,
              showCancelButton: true,
              confirmButtonText: "Confirmar",
              cancelButtonText: "Cancelar",
              reverseButtons: true,
            })
            .then((result) => {
              if (result.isConfirmed) {
                eliminarControlSalida(id);
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire(
                  "Cancelado",
                  "Tu registro está a salvo",
                  "error"
                );
              }
            });
        });

        $(".btn-generar-remito").on("click", function () {
          let id = $(this).attr("data-id");
          let fecha = $(this).attr("data-fecha");
          let empresa = $(this).attr("data-empresa");
          let chofer = $(this).attr("data-chofer");
          let patente = $(this).attr("data-patente");
          let numeRemito = $(this).attr("data-numero-remito");

          let numeroRemito = numeRemito.toString().padStart(7, "0");

          let productos = $(this).attr("data-productos");
          let listaProductos = JSON.parse(productos);

          console.log(listaProductos);

          $("#num-remito").text(numeroRemito);
          $("#remito-fecha").text(fecha);
          $("#remito-empresa").text(empresa);
          $("#remito-chofer").text(chofer);
          $("#remito-patente").text(patente);

          $("#remito-salida").modal("show");
        });
      }
    );
  }

  function obtenerEnvios() {
    let funcion = "obtener_todos_envios";
    $.post("../Controllers/EnviosController.php", { funcion }, (response) => {
      let envios = JSON.parse(response);
      let clientes = {};

      envios.forEach((envio) => {
        if (!clientes[envio.cliente_nombre]) {
          clientes[envio.cliente_nombre] = [];
        }
        clientes[envio.cliente_nombre].push(envio);
      });

      let tabsTemplate = `<ul class="nav nav-tabs bg-white" id="clientesTab" role="tablist">`;
      let contentTemplate = `<div class="tab-content" id="clientesTabContent">`;

      Object.keys(clientes).forEach((cliente, index) => {
        let activeClass = index === 0 ? "active" : "";
        let activeContentClass = index === 0 ? "show active" : "";

        tabsTemplate += `
                <li class="nav-item">
                    <a class="nav-link ${activeClass}" id="tab-${index}" data-toggle="tab" href="#cliente-${index}" role="tab" aria-controls="cliente-${index}" aria-selected="${
          index === 0
        }">
                        ${cliente}
                    </a>
                </li>`;

        contentTemplate += `
                <div class="tab-pane fade ${activeContentClass}" id="cliente-${index}" role="tabpanel" aria-labelledby="tab-${index}">
                    <div class="timeline" id="envios-cliente-${index}"></div>
                </div>`;
      });

      tabsTemplate += `</ul>`;
      contentTemplate += `</div>`;

      $("#clientesTab").html(tabsTemplate);
      $("#clientesTabContent").html(contentTemplate);

      Object.keys(clientes).forEach((cliente, index) => {
        let enviosCliente = clientes[cliente];
        let enviosTemplate = "";

        let lastDate = "";
        let countDate = 0;

        enviosCliente.forEach((envio) => {
          if (envio.fecha !== lastDate) {
            if (lastDate !== "") enviosTemplate += `</div></div>`;
            enviosTemplate += `
                        <div class="time-label mt-4">
                            <span class="bg-dark text-white p-2 rounded">${envio.fecha}</span>
                            <button class="btn btn-sm btn-toggle btn-primary ms-2" data-toggle="collapse" data-target="#date-${countDate}" aria-expanded="true">
                                -
                            </button>
                        </div>
                        <div id="date-${countDate}" class="collapse show">`;
            lastDate = envio.fecha;
            countDate++;
          }

          let badgeClass = "bg-info";
          if (envio.estado === "Demorado") badgeClass = "bg-warning";
          if (envio.estado === "Cancelado") badgeClass = "bg-danger";
          if (envio.estado === "Entregado") badgeClass = "bg-success";
          if (envio.estado === "Pendiente de carga")
            badgeClass = "bg-light text-dark";

          enviosTemplate += `
                    <div class="card mb-3 shadow-lg">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h5 class="text-right badge badge-primary text-md">🚛 Número de despacho: ${envio.numero_despacho}</h5>
                                    <p class="card-text"><strong>Destino:</strong> ${envio.destino}</p>
                                    <p class="card-text"><strong>Estado:</strong> <span class="badge ${badgeClass}">${envio.estado}</span></p>
                                    <p class="card-text"><strong>Chofer:</strong> ${envio.chofer}</p>
                                    <p class="card-text"><strong>Vehículo:</strong> ${envio.vehiculo} [ ${envio.vehiculo_codigo} ]</p>
                                </div>

                                <div class="col-md-6">
                                    <div class="documentos">
                                        <h6>📂 Documentos disponibles:</h6>
                                        <ul class="list-group" id="documentos-list-${envio.id}">
                                            <li class="list-group-item text-muted">Cargando documentos...</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-light">
                            <div class="btn-group gap-2">
                                <button class="btn btn-success btn-md btn-subir-doc" data-id="${envio.id}">📄 Subir Documentación</button>
                                <button class="btn btn-primary btn-md btn-cambiar-estado" data-id="${envio.id}">🔄 Cambiar Estado</button>
                            </div>
                        </div>
                    </div>`;
        });

        enviosTemplate += `</div></div>`;
        $(`#envios-cliente-${index}`).html(enviosTemplate);
      });

      envios.forEach((envio) => {
        obtenerDocumentos(envio.id);
      });

      $(".btn-toggle").on("click", function () {
        let $button = $(this);
        let isExpanded = $button.attr("aria-expanded") === "true";
        $button.text(isExpanded ? "+" : "-");
      });

      $(".btn-subir-doc").on("click", function () {
        let envioId = $(this).attr("data-id");
        $("#modal-subir-doc").modal("show");
        $("#envio-id-doc").val(envioId);
      });

      $(".btn-cambiar-estado").on("click", function () {
        let envioId = $(this).attr("data-id");
        $("#modal-cambiar-estado").modal("show");
        $("#envio-id-estado").val(envioId);
      });
    });
  }

  function obtenerDocumentos(envioId) {
    $.post(
      "../Controllers/EnviosController.php",
      { funcion: "obtener_documentos", envioId },
      (response) => {
        let documentos = JSON.parse(response);
        let template = "";

        if (documentos.length > 0) {
          documentos.forEach((doc) => {
            template += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${doc.tipo_documento}
                        <div>
                            <a href="${doc.url}" class="btn btn-sm btn-outline-primary" download>⬇️ Descargar</a>
                            <button class="btn btn-sm btn-outline-secondary btn-imprimir" data-url="${doc.url}">🖨️ Imprimir</button>
                        </div>
                    </li>`;
          });
        } else {
          template = `<li class="list-group-item text-muted">No hay documentos disponibles.</li>`;
        }

        $(`#documentos-list-${envioId}`).html(template);
      }
    );
  }

  $(document).on("click", ".btn-imprimir", function () {
    let url = $(this).attr("data-url");
    let win = window.open(url, "_blank");
    win.print();
  });

  $("#form-cambiar-estado").on("submit", (e) => {
    e.preventDefault();
    let envioId = $("#envio-id-estado").val();
    let nuevoEstado = $("#nuevo-estado").val();

    let data = {
      funcion: "cambiar_estado_envio",
      id: envioId,
      estado: nuevoEstado,
    };

    $.ajax({
      url: "../Controllers/EnviosController.php",
      type: "POST",
      data: data,
      success: function (response) {
        let result = JSON.parse(response);

        toastr.success(result.message, "Exito");
        obtenerEnvios();
      },
      error: function (xhr, status, error) {
        toastr.error(
          "Ocurrió un error al cambiar el estado del envio: " + error,
          "Error"
        );
      },
    });
  });

  $("#form-subir-documento").submit((e) => {
    e.preventDefault();

    let nombreDoc = $("#nombre-doc").val();
    let envioId = $("#envio-id-doc").val();
    let archivo = $("#documento-envio")[0].files[0];

    if (!archivo) {
      toastr.error("Debe seleccionar un archivo antes de subir.", "Error");
      return;
    }

    let data = new FormData();
    data.append("funcion", "subir-documento");
    data.append("nombre-doc", nombreDoc);
    data.append("envio-id-doc", envioId);
    data.append("pdf", archivo);

    $.ajax({
      url: "../Controllers/EnviosController.php",
      type: "POST",
      data: data,
      cache: false,
      processData: false,
      contentType: false,
    }).done(function (response) {
      const json = JSON.parse(response);

      if (json.alert === "edit") {
        toastr.success("Archivo PDF adjuntado con éxito!", "Éxito");
        $("#form-subir-documento").trigger("reset");
        $("#modal-subir-doc").modal("hide");
        obtenerEnvios();
      } else if (json.alert === "exist") {
        toastr.error("El archivo ya existe en la base de datos.", "Error");
      } else if (json.alert === "novalid") {
        toastr.error(
          "El archivo no es un PDF válido o es demasiado grande.",
          "Error"
        );
      } else if (json.alert === "noedit") {
        toastr.error("Hubo un error al subir el archivo.", "Error");
      } else {
        toastr.error("Error desconocido al subir el archivo.", "Error");
      }
    });
  });

  function actualizarFechaRemito() {
    let today = new Date();
    let fecha =
      today.getDate() +
      "/" +
      (today.getMonth() + 1) +
      "/" +
      today.getFullYear();
    $("#remito-fecha").text(fecha);
  }

  $("#form-remito").on("submit", (e) => {
    e.preventDefault();

    let remitoData = {
      remitoNumero: $("#num-remito").text(),
      cliente: $("#remito-cliente").text(),
      cuit: $("#remito-cuit").text(),
      correo: $("#remito-correo").text(),
      fecha: $("#remito-fecha").text(),
      detalles: [],
      transportista: {
        empresa: $("#remito-empresa").text(),
        chofer: $("#remito-chofer").text(),
        patente: $("#remito-patente").text(),
      },
      funcion: "imprimir-remito",
    };

    $("#remito-tbody tr").each(function () {
      let row = $(this);
      let detalle = {
        cantidad: row.find("td").eq(0).text(),
        descripcion: row.find("td").eq(1).text(),
        valor: row.find("td").eq(2).text(),
      };
      remitoData.detalles.push(detalle);
    });

    $.ajax({
      url: "../Controllers/ControlSalidaController.php",
      type: "POST",
      data: remitoData,
      success: function (response) {
        let responseObject = JSON.parse(response);

        Loader("Creando PDF...");

        window.open(responseObject.pdfUrl, "_blank");
        CloseLoader();
      },
      error: function (xhr, status, error) {
        alert("Ocurrió un error al enviar el remito: " + error);
      },
    });
  });

  $("#agregar-detalle").on("click", function () {
    let cantidad = $("#cantidad-detail").val();
    let detalle = $("#detalle").val();
    let valor = $("#valor").val();

    if (cantidad && detalle && valor) {
      let row = `
        <tr>
            <td>${cantidad}</td>
            <td>${detalle}</td>
            <td>${valor}</td>
        </tr>`;
      $("#remito-tbody").append(row);

      $("#cantidad").val("");
      $("#detalle").val("");
      $("#valor").val("");
    } else {
      toastr.info(
        "Por favor, complete todos los campos antes de agregar.",
        "Info"
      );
    }
  });

  $("#remito-salida").on("show.bs.modal", function (event) {
    let button = $(event.relatedTarget);
    let numeroRemito = button.data("numero-remito");
    $("#num-remito").text(numeroRemito);
    rellenar_clientes();
    actualizarFechaRemito();
    rellenarRemito();
  });

  function rellenarRemito() {
    let funcion = "obtener_todos_control_salida";
    $.post(
      "../Controllers/ControlSalidaController.php",
      { funcion },
      (response) => {
        let datos = JSON.parse(response);
        console.log(datos);

        datos.forEach((data) => {
          listarEnTablaRemito(data.productos);
        });

        $("#cliente").on("change", function () {
          let selectedOption = $(this).find(":selected");
          let razonSocial = selectedOption.data("razon-social") || "N/A";
          let cuit = selectedOption.data("cuit") || "N/A";
          let email = selectedOption.data("email") || "N/A";

          $("#remito-empresa").text(razonSocial);
          $("#remito-cuit").text(cuit);
          $("#remito-correo").text(email);
        });
      }
    );
  }

  function listarEnTablaRemito(productos) {
    let tbody = $("#remito-tbody");
    tbody.empty();

    productos.forEach((producto) => {
      tbody.append(`
            <tr>
                <td>${producto.codigo}</td>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.precio || "N/A"}</td>
                <td>${calcularTotal(producto)}</td>
            </tr>
        `);
    });
  }

  function calcularTotal(producto) {
    let precio = parseFloat(producto.precio) || 0;
    let cantidad = parseFloat(producto.cantidad) || 0;
    return precio * cantidad;
  }

  function eliminarControlSalida(id) {
    $.post(
      "../Controllers/ControlSalidaController.php",
      { funcion: "eliminar_control_salida", id: id },
      (response) => {
        if (response === "success") {
          toastr.success(
            "El registro se ha eliminado correctamente.",
            "Exito!"
          );
          obtenerControlSalida();
        } else {
          toastr.error("Error al eliminar el registro.!", "Error!");
        }
      }
    );
  }

  $("#agregar-producto").click(function () {
    let productoId = $("#producto").val();
    let productoNombre = $("#producto option:selected").text();
    let loteId = $("#lote").val();
    let loteNombre = $("#lote option:selected").text();
    let cantidad = $("#cantidad-producto").val();

    if (productoId && loteId && cantidad > 0) {
      productosSeleccionados.push({
        id: productoId,
        nombre: productoNombre,
        lote_id: loteId,
        lote_nombre: loteNombre,
        cantidad: cantidad,
      });

      actualizarListaProductos();
      $("#cantidad-producto").val("");
    } else {
      toastr.error(
        "Debes seleccionar un producto, un almacén y una cantidad válida.",
        "Error!"
      );
    }
  });

  function actualizarListaProductos() {
    let lista = "";
    productosSeleccionados.forEach((producto, index) => {
      lista += `
            <div class="producto-item mb-2">
                <span>${producto.nombre} (${producto.cantidad} unidades) - ${producto.lote_nombre}</span>
                <button type="button" class="btn btn-danger btn-sm float-right" onclick="eliminarProducto(${index})">Eliminar</button>
            </div>`;
    });
    $("#lista-productos").html(lista);
  }

  window.eliminarProducto = function (index) {
    productosSeleccionados.splice(index, 1);
    actualizarListaProductos();
  };

  $("#form-crear-control").submit(function (e) {
    e.preventDefault();

    let productosJSON = JSON.stringify(productosSeleccionados);

    $.post(
      "../Controllers/ControlSalidaController.php",
      {
        funcion: "verificar_stock",
        productos: productosJSON,
      },
      function (response) {
        let result = JSON.parse(response);

        if (result.status === "warning") {
          if (confirm(result.message)) {
            enviarFormulario();
          }
        } else if (result.status === "success") {
          enviarFormulario();
        } else {
          toastr.error("Error al verificar el stock", "Error!");
        }
      }
    );
  });

  function enviarFormulario() {
    let datos = {
      funcion: "crear",
      fecha: $("#fecha").val(),
      hora: $("#hora").val(),
      vehiculo: $("#vehiculo").val(),
      chofer: $("#chofer").val(),
      empresa: $("#empresa").val(),
      motivo: $("#motivo").val(),
      observacion: $("#observacion").val(),
      productos: JSON.stringify(productosSeleccionados),
    };

    $.post(
      "../Controllers/ControlSalidaController.php",
      datos,
      function (response) {
        let result = JSON.parse(response);
        if (result.status === "success") {
          toastr.success(result.message, "Éxito!");
          $("#form-crear-control").trigger("reset");
          productosSeleccionados = [];
          actualizarListaProductos();
          obtenerControlSalida();
        } else {
          toastr.error("Error al registrar el control de salida", "Error!");
        }
      }
    );
  }

  $("#crear_estado_envio").submit(function (e) {
    e.preventDefault();

    let nombre = $("#estado_envio").val();

    if (!nombre) {
      toastr.info("El campo nombre está vacío", "Info");
      return;
    }

    let datos = {
      funcion: "crear_estado_envio",
      nombre,
    };

    $.post("../Controllers/EnviosController.php", datos, function (response) {
      let result = JSON.parse(response);
      if (result.status == "success") {
        toastr.success(result.message, "Éxito!");
        $("#crear_estado_envio").trigger("reset");
      } else {
        toastr.error(result.message, "Error!");
      }
    });
  });

  $("#form-crear-seguimiento-viaje").submit(function (e) {
    e.preventDefault();
    Loader("Creando viaje");

    let vehiculo_id = $("#vehiculo_id").val();
    let chofer_id = $("#chofer_id").val();
    let cliente_id = $("#cliente_id").val();
    let estado_id = $("#estado_id").val();
    let lugar_salida = $("#lugar_salida").val();
    let destino = $("#destino").val();
    let peso = $("#peso").val();
    let precio = $("#precio").val();
    let numero_despacho = $("#numero_despacho").val();

    let datos = {
      funcion: "crear",
      vehiculo_id,
      chofer_id,
      cliente_id,
      estado_id,
      lugar_salida,
      destino,
      peso,
      precio,
      numero_despacho,
    };

    $.post("../Controllers/EnviosController.php", datos, function (response) {
      let result = JSON.parse(response);
      if (result.status == "success") {
        toastr.success(result.message, "Éxito!");
        $("#form-crear-seguimiento-viaje").trigger("reset");
        CloseLoader(result.message);
        obtenerEnvios();
      } else {
        toastr.error(result.message, "Error!");
      }
    });
  });

  function rellenar_producto() {
    let funcion = "rellenar_productos";
    $.post("../Controllers/ProductoController.php", { funcion }, (response) => {
      let productos = JSON.parse(response);
      let template = "";

      $("#producto").empty();

      productos.forEach((prod) => {
        template += `<option value="${prod.id}" data-prod="${prod.nombre}">Patente: ${prod.nombre}</option>`;
      });
      $("#producto").html(template);
    });
  }

  function rellenar_almacen() {
    let funcion = "rellenar_almacenes";
    $.post("../Controllers/LoteController.php", { funcion }, (response) => {
      let almacenes = JSON.parse(response);
      let template = "";

      $("#lote").empty();

      almacenes.forEach((almacen) => {
        template += `<option value="${almacen.id}" data-nombre="${almacen.nombre}">${almacen.nombre}</option>`;
      });

      $("#lote").html(template);
    });
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
          template += `<option value="${vehiculo.id}" data-vehiculo="${vehiculo.vehiculo}">Patente: ${vehiculo.codigo}</option>`;
        });

        $("#vehiculo").html(template);
        $("#vehiculo_id").html(template);
      }
    );
  }

  function rellenar_personal() {
    let funcion = "obtener_camioneros";
    $.post("../Controllers/PersonalController.php", { funcion }, (response) => {
      let personales = JSON.parse(response);
      let template = "";
      personales.forEach((personal) => {
        template += `<option value="${personal.id}">${personal.nombre}</option>`;
      });

      $("#chofer").html(template);
      $("#chofer_id").html(template);
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
        >
          ${cliente.razon_social}
        </option>`;
      });

      $("#cliente_id").html(template);
      $("#cliente").html(template);
    });
  }

  function rellenar_estados_envios() {
    let funcion = "rellenar_estado_envio";
    $.post("../Controllers/EnviosController.php", { funcion }, (response) => {
      let estados = JSON.parse(response);
      let template = "";
      estados.forEach((estado) => {
        template += `<option value="${estado.id}">${estado.nombre}</option>`;
      });

      $("#estado_id").html(template);
      $("#nuevo-estado").html(template);
    });
  }

  $("#crear-salida").on("shown.bs.modal", function () {
    rellenar_vehiculo();
    rellenar_personal();
    rellenar_almacen();
    rellenar_producto();
  });

  $("#crear-seguimiento-viaje").on("shown.bs.modal", function () {
    rellenar_vehiculo();
    rellenar_personal();
    rellenar_clientes();
    rellenar_estados_envios();
  });

  $("#modal-cambiar-estado").on("shown.bs.modal", function () {
    rellenar_estados_envios();
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
