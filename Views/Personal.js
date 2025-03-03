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

  let rolesData = [];
  let edit = false;
  let itemsPerPage = 10;
  // LAYOUTS
  $("#ordenCompraCardBody").hide();

  // Manejar el clic en el botón para mostrar/ocultar el card
  $("#toggleCardBtn").click(function () {
    $("#ordenCompraCardBody").slideToggle();
  });
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
          obtener_personal(1, itemsPerPage);
          rellenar_archivos_personal();
          showPurchaseOrder();
          showAssistPersonal();
          showAssist();
          CloseLoader();
          tablaRoles();
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

  // ORDENES DE COMPRA
  async function showPurchaseOrder() {
    let funcion = "showPurchaseOrder";
    let data = await fetch("../Controllers/ordenCompraController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });
    if (data.ok) {
      let response = await data.text();
      try {
        let ordenes = JSON.parse(response);
        $("#orden_compras_compra").DataTable({
          data: ordenes,
          aaSorting: [],
          scrollX: false,
          autoWidth: false,
          paging: false,
          bInfo: false,
          columns: [
            {
              data: null,
              render: function (data, type, row, meta) {
                return meta.row + 1;
              },
            },
            { data: "id" },
            { data: "proveedor" },
            { data: "autorizado" },
            { data: "fecha" },
            {
              defaultContent: `
                                <button class="imprimir btn btn-sm w-5 h-5 btn-success" type="button">
                                    <i class="fas fa-print" style="color: white;"></i>
                                </button>
                                <button class="anular btn btn-sm w-5 h-5 btn-secondary" type="button">
                                    <i class="fas fa-trash" style="color:white;"></i>
                                </button>`,
            },
          ],
          language: espanol,
          destroy: true,
        });
      } finally {
      }
    } else {
      Swal.fire({
        icon: "error",
        title: data.statusText,
        text: "hubo conflicto de codigo: " + data.status,
      });
    }
  }
  $("#orden_compras_compra tbody").on("click", ".imprimir", function () {
    let id = $(this).closest("tr").find("td:eq(1)").text();
    let funcion = "imprimir";
    $.ajax({
      url: "../Controllers/ordenCompraController.php",
      type: "POST",
      data: {
        funcion: funcion,
        id: id,
      },
      cache: false,
      success: function (response) {
        window.open("../Util/pdf/pdf-ordencompra-" + id + ".pdf", "_blank");
      },
    });
  });
  $("#orden_compras_compra tbody").on("click", ".anular", function () {
    // Realiza una solicitud al controlador PHP para obtener el HTML
    // Puedes usar AJAX para esto
    let id = $(this).closest("tr").find("td:eq(1)").text();
    let funcion = "anular";

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger mr-2",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Estas seguro?",
        text: "No vas a ver mas los datos de la orden N°" + id + " ",
        imageWidth: 100,
        imageHeight: 100,
        showCancelButton: true,
        confirmButtonText: "Si, Borralo",
        cancelButtonText: "No, Cancela!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          $.post(
            "../Controllers/ordenCompraController.php",
            { id, funcion },
            (response) => {
              console.log(response);
              if (response.includes("success")) {
                swalWithBootstrapButtons.fire(
                  "Borrado!",
                  "La orden compra N°" + id + " fue borrada.",
                  "success"
                );
                showPurchaseOrder();
              } else {
                swalWithBootstrapButtons.fire(
                  "No se pudo borrar!",
                  "La orden compra N°" + id + " no fue borrada.",
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
  $("#form-crear-orden-compra").submit(async function (e) {
    e.preventDefault();

    let formData = {
      tipoGasto: $("#order_tipo_gasto").val(),
      autorizado: $("#autorizado").val(),
      proveedor: $("#proveedor").val(),
      observaciones: $("#observaciones").val(),
      datosTabla: await obtenerDatosTabla(),
    };

    $.ajax({
      type: "POST",
      url: "../Controllers/ordenCompraController.php",
      data: { funcion: "crear", ordenCompraData: formData },
      success: function (response) {
        try {
          response = JSON.parse(response);
          if (response.status === "success") {
            toastr.success(
              `Nueva Orden N° ${response.id} Agregado con éxito`,
              "Éxito"
            );
            showPurchaseOrder();
          } else {
            toastr.error("No se pudo agregar la Orden", "Error");
          }
        } catch (e) {
          console.error("Error al analizar la respuesta JSON:", e);
          toastr.error("Error al procesar la respuesta del servidor", "Error");
        }
      },
      error: function (xhr, status, error) {
        console.error("Error en la solicitud AJAX", error);
      },
    });
  });
  //

  async function obtenerDatosTabla() {
    let datosTabla = [];
    $("#tablaMateriales tbody tr").each(function () {
      let cantidad = $(this).find("td:eq(0)").text();
      let detalle = $(this).find("td:eq(1)").text();
      let obra = $(this).find("td:eq(2)").text();
      let equipo = $(this).find("td:eq(3)").text();
      let monto = $(this).find("td:eq(4)").text();
      let total = $(this).find("td:eq(5)").text();

      datosTabla.push({
        cantidad: cantidad,
        detalle: detalle,
        obra: obra,
        equipo: equipo,
        monto: monto,
        total: total,
      });
    });
    return datosTabla;
  }

  // CRUD
  async function obtener_personal(page, itemsPerPage) {
    let funcion = "obtener_personal";
    let data = await fetch("../Controllers/PersonalController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:
        "funcion=" +
        funcion +
        "&page=" +
        page +
        "&itemsPerPage=" +
        itemsPerPage,
    });

    if (data.ok) {
      let response = await data.json();
      try {
        if (
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          let personal = response.data.data;
          const totalRecords = response.data.pagination.totalRecords || 0;

          const totalPages = Math.ceil(totalRecords / itemsPerPage);
          const currentPageRecords = personal;

          let template = "";

          currentPageRecords.forEach((persona) => {
            if (persona.estado == "I") {
              template += `<div class="card bg-secondary d-flex flex-fill">`;
            } else {
              template += `<div class="card bg-light d-flex flex-fill">`;
            }
            template += `<div class="card-header text-muted border-bottom-0">`;
            if (persona.estado == "I") {
              template += `<span class="badge badge-warning roles-span">Inactivo</span>`;
            } else {
              template += `<span class="badge badge-success roles-span">${
                persona.rol || "N/A"
              }</span>`;
            }

            template += `</div>
                        <div class="card-body  pt-0">
                            <div class="row">
                                <div class="col-7">
                                    <h2 class="lead"><b>${
                                      persona.nombre || "N/A"
                                    }</b></h2>
                                    <p class="text-muted text-sm"><b>DNI: </b>${
                                      persona.dni || "N/A"
                                    }</p>
                                    <ul class="ml-4 mb-0 fa-ul text-muted">
                                    <li class="small"><span class="fa-li"><i class="fas fa-map-marker"></i></span> Direccion: ${
                                      persona.direccion || "N/A"
                                    }</li>
                                        <li class="small"><span class="fa-li"><i class="fas fa-building"></i></span> Fecha de ingreso: ${
                                          persona.fecha_ingreso || "N/A"
                                        }</li>
                                        <li class="small"><span class="fa-li"><i class="fas fa-heartbeat"></i></span> Obra Social: ${
                                          persona.obra_social || "N/A"
                                        }</li>
                                        <li class="small"><span class="fa-li"><i class="fas fa-id-card"></i></span> Carnet: ${
                                          persona.carnet || "N/A"
                                        }</li>
                                        <li class="small"><span class="fa-li"><i class="fas fa-calendar-check"></i></span> Fecha Alta: ${
                                          persona.fecha_alta || "N/A"
                                        }</li>
                                        <li class="small"><span class="fa-li"><i class="fas fa-calendar-times"></i></span> Fecha Baja: ${
                                          persona.fecha_baja || "N/A"
                                        }</li>
                                        <li class="small"><span class="fa-li"><i class="fas fa-address-card"></i></span> Cuil: ${
                                          persona.cuil || "N/A"
                                        }</li>
                                    </ul>
                                </div>
                                <div class="col-5 text-center">
                                    <img src="${
                                      persona.avatar ||
                                      "ruta_por_defecto_si_es_null"
                                    }" alt="user-avatar" class="img-circle img-fluid">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="text-right">
                                <button perId="${persona.id}" 
                                        perNombre="${persona.nombre || "N/A"}" 
                                        perObrasocial="${
                                          persona.obra_social || "N/A"
                                        }"
                                        perFechaingreso="${
                                          persona.fecha_ingreso || "N/A"
                                        }"
                                        perFechaalta="${
                                          persona.fecha_alta || "N/A"
                                        }"
                                        perDireccion="${
                                          persona.direccion || "N/A"
                                        }" 
                                        perDni="${persona.dni || "N/A"}" 
                                        perCarnet="${persona.carnet || "N/A"}"
                                        perFechabaja="${
                                          persona.fecha_baja || "N/A"
                                        }"
                                        perCuil="${persona.cuil || "N/A"}" 
                                        class="editar btn btn-sm bg-success" type="button" data-toggle="modal" data-target="#crear-personal">
                                    
                                        <i class="fas fa-pencil-alt" style="color: white;"></i>
                                </button>
                                <button perId="${persona.id}" 
                                        perNombre="${persona.nombre || "N/A"}"
                                        type="button" class="borrar btn btn-sm btn-danger">
                                    <i class="fas fa-trash" style="color:white;"></i>
                                </button>
                                <button id="${persona.id}" 
                                        nombre="${persona.nombre}" 
                                        avatar="${persona.avatar}" 
                                        class="avatar btn btn-sm btn-info" type="button" data-toggle="modal" data-target="#cambiarlogo">
                                    <i class="fas fa-image" style="color: white;"></i>
                                </button>
                                <button perId="${persona.id}" 
                                        perNombre="${persona.nombre || "N/A"}" 
                                        perDni="${persona.dni || "N/A"}" 
                                        perCuil="${persona.cuil || "N/A"}" 
                                        perFechaingreso="${
                                          persona.fecha_ingreso || "N/A"
                                        }" 
                                        perObrasocial="${
                                          persona.obra_social || "N/A"
                                        }"
                                        perDireccion="${
                                          persona.direccion || "N/A"
                                        }" 
                                        class="ver btn btn-sm btn-primary" type="button" data-toggle="modal" data-target="#vista_personal">
                                    <i class="fas fa-eye" style="color: white;"></i>
                                </button>
                            </div>
                        </div>
                                    </div>`;
          });

          $("#personal").html(template);
          generarPaginacion(page, totalPages);
        } else {
          const personalList = document.getElementById("personal");
          personalList.innerHTML = "No hay personal registrado.";
          generarPaginacion(1, 1);
        }
      } finally {
      }
    } else {
      Swal.fire({
        icon: "error",
        title: data.statusText,
        text: "Hubo un conflicto de código: " + data.status,
      });
    }
  }
  function generarPaginacion(currentPage, totalPages) {
    const paginationContainer = document.getElementById("pagination-container");
    const paginationHTML = [];

    if (totalPages === 0) {
      paginationContainer.innerHTML =
        '<p class="text-center">No hay personal registrado</p>';
      return;
    }
    const maxPagesToShow = 5;

    const startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
    for (let i = startPage; i <= endPage; i++) {
      paginationHTML.push(`
                    <li class="page-item ${i === currentPage ? "active" : ""}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `);
    }

    paginationContainer.innerHTML = paginationHTML.join("");
    const paginationLinks = paginationContainer.querySelectorAll(".page-link");
    paginationLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const newPage = parseInt(link.getAttribute("data-page"));
        obtener_personal(newPage, itemsPerPage);
      });
    });
  }
  $("#form-crear-personal").submit((e) => {
    e.preventDefault();
    let funcion = "";
    let id = $("#id_edit_personal").val();
    let nombre = $("#nombre").val();
    let direccion = $("#direccion").val();

    let cuil = $("#cuil").val();

    let dni = $("#dni").val();

    let rol = $("#roles_form").val();

    let obrasocial = $("#obrasocial").val();
    let fecha_alta = $("#fecha_alta").val();

    let fecha_baja = $("#fecha_baja").val();
    let fecha_ingreso = $("#fecha_ingreso").val();

    let carnet = $("#carnet").val();

    if (edit == true) {
      funcion = "editar";
    } else {
      funcion = "crear";
    }
    $.post(
      "../Controllers/PersonalController.php",
      {
        funcion,
        id,
        nombre,
        direccion,
        cuil,
        rol,
        dni,
        obrasocial,
        carnet,
        fecha_alta,
        fecha_baja,
        fecha_ingreso,
      },
      (response) => {
        if (response == "add") {
          toastr.success(
            "Nuevo Personal " + nombre + " Agregado con exito",
            "Exito!"
          );
          $("#form-crear-personal").trigger("reset");

          obtener_personal(1, itemsPerPage);
          showAssist();
        }
        if (response == "edit") {
          toastr.success("Pesonal " + nombre + " editado", "Exito!");
          $("#form-crear-personal").trigger("reset");

          obtener_personal(1, itemsPerPage);
          showAssist();
        }

        if (response == "noadd") {
          toastr.error("No se pudo agregar el Pesonal ", "Error!");
          $("#form-crear-personal").trigger("reset");
        }

        edit = false;
      }
    );
  });
  $(document).on("click", ".avatar", (e) => {
    let funcion = "cambiar_avatar";
    const elemento = $(this)[0].activeElement;
    const id = $(elemento).attr("id");
    const nombre = $(elemento).attr("nombre");
    const avatar = $(elemento).attr("avatar");
    $("#logoactual").attr("src", avatar);
    $("#nombre_img").html(nombre);
    $("#funcion").val(funcion);
    $("#id_logo_prod").val(id);
    $("#avatar").val(avatar);
  });
  $("#form-logo-prod").submit((e) => {
    let formData = new FormData($("#form-logo-prod")[0]);
    $.ajax({
      url: "../Controllers/PersonalController.php",
      type: "POST",
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
    }).done(function (response) {
      const json = JSON.parse(response);
      console.log(json);
      if (json.alert == "edit") {
        toastr.success("Imagen Agregada", "Exito!");
        $("#form-logo-prod").trigger("reset");
        location.href = "../Views/Personal.php";
      } else {
        toastr.error("La imagen no cumple con los requisitos", "Error!");
        $("#form-logo-prod").trigger("reset");
      }
    });
    e.preventDefault();
  });
  $(document).on("click", ".borrar", (e) => {
    let funcion = "borrar";
    const elemento = $(this)[0].activeElement;
    const id = $(elemento).attr("perId");
    const nombre = $(elemento).attr("perNombre");

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger mr-2",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Estas seguro?",
        text: "No vas a ver mas los datos de " + nombre + "!",
        imageWidth: 100,
        imageHeight: 100,
        showCancelButton: true,
        confirmButtonText: "Si, Borralo",
        cancelButtonText: "No, Cancela!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          $.post(
            "../Controllers/PersonalController.php",
            { id, funcion },
            (response) => {
              edit = false;
              if (response == "borrado") {
                swalWithBootstrapButtons.fire(
                  "Borrado!",
                  "Personal: " + nombre + " y todos sus datos fueron borrados.",
                  "success"
                );

                obtener_personal(1, itemsPerPage);
              } else {
                swalWithBootstrapButtons.fire(
                  "No se pudo borrar!",
                  `Los datos <b>` + nombre + `</b> no fue borrado.`,
                  "error"
                );
              }
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelado",
            `Los datos de <b>` + nombre + `</b> estan a salvo`,
            "error"
          );
        }
      });
  });
  $(document).on("click", ".editar", (e) => {
    const elemento = $(this)[0].activeElement;
    const id = $(elemento).attr("perid");
    const nombre = $(elemento).attr("perNombre");
    const direccion = $(elemento).attr("perDireccion");
    const cuil = $(elemento).attr("perCuil");
    const dni = $(elemento).attr("perDni");
    const obrasocial = $(elemento).attr("perObrasocial");
    const fecha_ingreso = $(elemento).attr("perFechaingreso");
    const fecha_alta = $(elemento).attr("perFechaalta");
    const fecha_baja = $(elemento).attr("perFechabaja");
    const carnet = $(elemento).attr("perCarnet");

    $("#id_edit_personal").val(id);
    $("#nombre").val(nombre);
    $("#direccion").val(direccion);
    $("#cuil").val(cuil);
    $("#dni").val(dni);
    $("#obrasocial").val(obrasocial);
    $("#fecha_alta").val(fecha_alta);
    $("#fecha_baja").val(fecha_baja);
    $("#fecha_ingreso").val(fecha_ingreso);
    $("#carnet").val(carnet);
    edit = true;
  });
  //

  // ASISTENCIA

  //LOCALSTORAGE
  function RecuperarAsistenciasLS() {
    let asistencias;
    if (localStorage.getItem("asistencias") === null) {
      asistencias = [];
    } else {
      asistencias = JSON.parse(localStorage.getItem("asistencias"));
    }
    return asistencias;
  }

  function AgregarAsistenciaLS(asistencia) {
    let asistencias = RecuperarAsistenciasLS();

    const indiceExistente = asistencias.findIndex(
      (a) => a.empleadoId === asistencia.empleadoId
    );

    if (indiceExistente !== -1) {
      asistencias[indiceExistente] = asistencia;
    } else {
      asistencias.push(asistencia);
    }

    localStorage.setItem("asistencias", JSON.stringify(asistencias));
  }

  function obtenerUltimaActualizacion() {
    return localStorage.getItem("ultimaActualizacion") || null;
  }

  function guardarUltimaActualizacion() {
    const fechaActual = new Date().toISOString();
    localStorage.setItem("ultimaActualizacion", fechaActual);
  }

  function EliminarAsistenciaLS(id) {
    let asistencias;
    asistencias = RecuperarAsistenciasLS();
    asistencias.forEach(function (asistencia, indice) {
      if (asistencia.empleadoId == id) {
        asistencias.splice(indice, 1);
      }
    });
    localStorage.setItem("asistencias", JSON.stringify(asistencias));
  }

  function EliminarAsistenciasLS() {
    localStorage.removeItem("asistencias");
  }
  //
  async function enviarDatosServidor(personalIds) {
    try {
      const asistenciasAlmacenadas = RecuperarAsistenciasLS();

      for (const personalId of personalIds) {
        const asistenciaEnLocalStorage = asistenciasAlmacenadas.find(
          (asist) => asist.empleadoId === personalId
        );

        if (asistenciaEnLocalStorage) {
          const asistenciaEmpleado = {
            empleadoId: asistenciaEnLocalStorage.empleadoId,
            turnos: asistenciaEnLocalStorage.turnos,
            totalDias: asistenciaEnLocalStorage.totalDias,
            adelanto: asistenciaEnLocalStorage.adelanto || 0,
            comida: asistenciaEnLocalStorage.comida || 0,
            viaje: asistenciaEnLocalStorage.viaje || 0,
            domingos: asistenciaEnLocalStorage.domingos || 0,
            extras: asistenciaEnLocalStorage.extras || 0,
            bonificacion: asistenciaEnLocalStorage.bonificacion || 0,
            fecha_inicio: asistenciaEnLocalStorage.fecha_inicio,
            fecha_final: asistenciaEnLocalStorage.fecha_final,
            sueldoMensual: asistenciaEnLocalStorage.sueldoMensual,
            sueldoSemanal: asistenciaEnLocalStorage.sueldoSemanal,
            sueldoMensualRol: asistenciaEnLocalStorage.sueldoMensualRol,
            sueldoSemanalRol: asistenciaEnLocalStorage.sueldoSemanalRol,
          };
          let funcion = "registrarAsistencia";

          let json = JSON.stringify(asistenciaEmpleado);
          let id = JSON.stringify(asistenciaEnLocalStorage.empleadoId);

          $.post(
            "../Controllers/asistenciaController.php",
            { funcion, id, json },
            (response) => {
              console.log(response);
            }
          );
        } else {
          console.error(
            "Asistencia no encontrada en el almacenamiento local para el personalId:",
            personalId
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
      console.log(error);
    }
  }
  async function enviarDatosAsistencia(asistenciaId) {
    try {
      const empleadoId = $(
        `#fila-${asistenciaId} .asistencia-checkbox:first`
      ).data("personal-id");
      const turnosDetallados = [];

      $(`#fila-${asistenciaId} .asistencia-checkbox:checked`).each(function () {
        const dia = $(this).data("dia");
        const turno = $(this).data("turno");
        turnosDetallados.push({ dia, turno });
      });

      const turnosSimplificados = {};
      turnosDetallados.forEach((turno) => {
        const { dia, turno: tipoTurno } = turno;
        if (!turnosSimplificados[dia]) {
          turnosSimplificados[dia] = {};
        }
        turnosSimplificados[dia][tipoTurno] = 1; // 1 indica presencia del turno
      });

      const totalDias = $(`#fila-${asistenciaId} .total-dias`).text();
      const rol = $(`#fila-${asistenciaId} select[name="rol"]`).val();
      const comida = $(`#fila-${asistenciaId} input[name="comida"]`).val();
      const viaje = $(`#fila-${asistenciaId} input[name="viaje"]`).val();
      const domingos = $(`#fila-${asistenciaId} input[name="domingos"]`).val();
      const extras = $(`#fila-${asistenciaId} input[name="extras"]`).val();
      const bonificacion = $(
        `#fila-${asistenciaId} input[name="bonificacion"]`
      ).val();
      const adelanto = $(`#fila-${asistenciaId} input[name="adelanto"]`).val();
      const fecha_inicio = $(`#fecha_inicio`).val();
      const fecha_final = $(`#fecha_final`).val();

      const asistenciaEmpleado = {
        empleadoId,
        turnos: turnosSimplificados,
        totalDias,
        rol,
        comida,
        viaje,
        domingos,
        extras,
        bonificacion,
        adelanto,
        fecha_inicio,
        fecha_final,
        sueldoMensual: $(
          `#fila-${asistenciaId} #sueldoMensual_${asistenciaId}`
        ).text(),
        sueldoSemanal: $(
          `#fila-${asistenciaId} #sueldoSemanal_${asistenciaId}`
        ).text(),
        sueldoMensualRol:
          $(`#fila-${asistenciaId} #sueldoMensualRol_${asistenciaId}`).text() ||
          0,
        sueldoSemanalRol:
          $(`#fila-${asistenciaId} #sueldoSemanalRol_${asistenciaId}`).text() ||
          0,
      };

      console.log(asistenciaEmpleado);
      AgregarAsistenciaLS(asistenciaEmpleado);
    } catch (error) {
      // console.error('Error:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "hubo conflicto al guardar las asistencias " + error,
      });
    }
  }
  async function showAssist() {
    let funcion = "obtener_datos_empleados";
    let data = await fetch("../Controllers/asistenciaController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (data.ok) {
      let response = await data.text();
      try {
        let registrado = JSON.parse(response);

        $("#tablaEmpleados tbody").empty();

        await cargarRoles();

        registrado.forEach((asistencia) => {
          let rowHtml = `
                            <tr id="fila-${asistencia.id}" data-personal-id="${asistencia.id}" data-rol-id="${asistencia.rol_id}" data-rol-nombre="${asistencia.nombre_rol}">
                                <td>${asistencia.nombre}</td>
                                
                                <td class="text-center text-sm">
                                    <span class="rol-span" id="rol_span_${asistencia.id}"><b>${asistencia.nombre_rol}</b></span>
                                </td>
                                <td style="width: 50px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="lunes" data-turno="manana" style="padding: 20px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="lunes" data-turno="tarde">
                                    <input class="form-control" type="text" name="job" id="trabajo_${asistencia.id}" placeholder="Trabajo">
                                </t placeholder="Trabajo"d>
                                <td style="width: 50px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="martes" data-turno="manana" style="padding: 20px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="martes" data-turno="tarde">
                                    <input class="form-control" type="text" name="job" id="trabajo_${asistencia.id}" placeholder="Trabajo">

                                </td>
                                <td style="width: 50px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="miercoles" data-turno="manana" style="padding: 20px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="miercoles" data-turno="tarde"> 
                                    <input class="form-control" type="text" name="job" id="trabajo_${asistencia.id}" placeholder="Trabajo">

                                </td>
                                <td style="width: 50px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="jueves" data-turno="manana" style="padding: 20px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="jueves" data-turno="tarde">
                                    <input class="form-control" type="text" name="job" id="trabajo_${asistencia.id}" placeholder="Trabajo">

                                </td>
                                <td style="width: 50px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="viernes" data-turno="manana" style="padding: 20px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="viernes" data-turno="tarde">
                                    <input class="form-control" type="text" name="job" id="trabajo_${asistencia.id}" placeholder="Trabajo">

                                </td>
                                <td style="width: 50px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="sabado" data-turno="manana" style="padding: 20px;">
                                    <input class="form-control" type="text" name="job" id="trabajo_${asistencia.id}" placeholder="Trabajo">

                                </td>
                                <td><span class="form-control total-dias"></span></td>
                                <td><input class="form-control" type="number" name="adelanto" id="adelanto_${asistencia.id}"></td>

                                <td>
                                    <input class="form-control" type="number" name="comida" id="comida_${asistencia.id}">
                                </td>

                                <td><input class="form-control" type="number" name="viaje" id="viaje_${asistencia.id}"></td>
                                <td><input class="form-control" type="number" name="domingos" id="domingos_${asistencia.id}"></td>
                                <td><input class="form-control" type="number" name="extras" id="extras_${asistencia.id}"></td>
                                <td><input class="form-control" type="number" name="bonificacion" id="bonificacion_${asistencia.id}"></td>
                                <td>
                                    <span class="form-control sueldoMensual" id="sueldoMensual_${asistencia.id}">0</span>
                                    <span class="form-control sueldoMensualRol d-none" id="sueldoMensualRol_${asistencia.id}"></span>
                                </td>
                                <td>
                                    <span class="form-control sueldoSemanal" id="sueldoSemanal_${asistencia.id}">0</span>
                                    <span class="form-control sueldoSemanalRol d-none" id="sueldoSemanalRol_${asistencia.id}"></span>

                                </td>
                                <td class="d-flex">
                                    <button class="btn btn-success enviar-btn btn-sm  m-1" type="button" data-asistencia-id="${asistencia.id}">
                                        <i class="fas fa-save" style="color: white;"></i>
                                    </button>
                                    <button class="btn btn-danger borrar-btn btn-sm  m-1" type="button" data-asistencia-id="${asistencia.id}">
                                        <i class="fas fa-trash" style="color: white;"></i>
                                    </button>
                                </td>
                        </tr>`;

          $("#tablaEmpleados tbody").append(rowHtml);

          $(`#fila-${asistencia.id} .asistencia-checkbox`).each(function () {
            const dia = $(this).data("dia");
            const turno = $(this).data("turno");

            // Verificar si la asistencia tiene este día y turno en el localStorage
            const asistenciasAlmacenadas = RecuperarAsistenciasLS();
            const asistenciaEnLocalStorage = asistenciasAlmacenadas.find(
              (asist) => asist.empleadoId === asistencia.id
            );

            if (
              asistenciaEnLocalStorage &&
              asistenciaEnLocalStorage.turnos &&
              typeof asistenciaEnLocalStorage.turnos === "object" &&
              asistenciaEnLocalStorage.turnos[dia] &&
              asistenciaEnLocalStorage.turnos[dia][turno]
            ) {
              $(this).prop("checked", true);
            }
          });
          const asistenciasAlmacenadas = RecuperarAsistenciasLS();
          const asistenciaEnLocalStorage = asistenciasAlmacenadas.find(
            (asist) => asist.empleadoId === asistencia.id
          );
          const fila = $(`#fila-${asistencia.id}`);
          configurarSumaTotalDias(asistencia.id);
          fila
            .find(
              'input[name="adelanto"], input[name="comida"], input[name="viaje"], input[name="domingos"], input[name="extras"], input[name="bonificacion"]'
            )
            .on("input", function () {
              calcularSueldoSemanalPorTurno(
                fila,
                asistencia.sueldo_mensual,
                asistencia.sueldo_semanal
              );
            });
          if (asistenciaEnLocalStorage && asistenciaEnLocalStorage.empleadoId) {
            fila
              .find(".total-dias")
              .text(asistenciaEnLocalStorage.totalDias || "");
            fila
              .find('input[name="adelanto"]')
              .val(asistenciaEnLocalStorage.adelanto || 0);
            fila
              .find('input[name="comida"]')
              .val(asistenciaEnLocalStorage.comida || 0);
            fila
              .find('input[name="viaje"]')
              .val(asistenciaEnLocalStorage.viaje || 0);
            fila
              .find('input[name="domingos"]')
              .val(asistenciaEnLocalStorage.domingos || 0);
            fila
              .find('input[name="extras"]')
              .val(asistenciaEnLocalStorage.extras || 0);
            fila
              .find('input[name="bonificacion"]')
              .val(asistenciaEnLocalStorage.bonificacion || 0);
            fila
              .find(`#sueldoMensual_${asistencia.id}`)
              .text(asistenciaEnLocalStorage.sueldoMensual || 0);
            fila
              .find(`#sueldoSemanal_${asistencia.id}`)
              .text(asistenciaEnLocalStorage.sueldoSemanal || 0);
          }
          if (asistenciaEnLocalStorage && asistenciaEnLocalStorage.rol) {
            const roleId = asistenciaEnLocalStorage.rol;
            const selectedRole = rolesData.find(
              (rol) => rol.id === parseInt(roleId, 10)
            );

            if (selectedRole) {
              const roleName = selectedRole.nombre;

              $(`#rol_span_${asistencia.id}`).text(roleName);
              fila.find(".rol-span").show();
              fila.find(".rol-select").hide();

              const sueldoMensualRol =
                parseFloat(selectedRole.sueldo_mensual) || 0;
              const sueldoSemanalRol =
                parseFloat(selectedRole.sueldo_semanal) || 0;

              fila
                .find(
                  'input[name="adelanto"], input[name="comida"], input[name="viaje"], input[name="domingos"], input[name="extras"], input[name="bonificacion"]'
                )
                .on("input", function () {
                  calcularSueldoSemanalPorTurno(
                    fila,
                    sueldoMensualRol,
                    sueldoSemanalRol
                  );
                });
              asistenciaEnLocalStorage.sueldoMensualRol = sueldoMensualRol;
              asistenciaEnLocalStorage.sueldoSemanalRol = sueldoSemanalRol;

              $(`#rol_span_${asistencia.id}`).text(roleName);
            }
          } else {
            cargarRoles();
          }
        });
        generarBotonesRolesAsignados(rolesData);
        $("#registrarSemanaBtn").on("click", async function () {
          const fechaInicio = $("#fecha_inicio").val();
          const fechaFinal = $("#fecha_final").val();

          // Verificar si las fechas de inicio y final están seleccionadas
          if (fechaInicio && fechaFinal) {
            const asistenciasAlmacenadas = RecuperarAsistenciasLS();

            if (asistenciasAlmacenadas.length > 0) {
              const confirmResult = await Swal.fire({
                title: "Confirmación",
                text: "¿Estás seguro de que deseas registrar la semana?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Sí, registrar",
                cancelButtonText: "Cancelar",
              });

              // Verificar la respuesta del usuario
              if (confirmResult !== undefined && confirmResult.isConfirmed) {
                try {
                  const personalIds = asistenciasAlmacenadas.map(
                    (asistencia) => asistencia.empleadoId
                  );

                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Se realizó el registro correctamente",
                    showConfirmButton: false,
                    timer: 1500,
                  });

                  enviarDatosServidor(personalIds);
                  EliminarAsistenciasLS();
                  showAssist();
                  showAssistPersonal();
                  // location.href = '../Views/Personal.php'
                } catch (error) {
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text:
                      "Hubo conflicto en el sistema. Póngase en contacto con el administrador: " +
                      error,
                  });
                }
              }
            } else {
              Swal.fire({
                icon: "error",
                title: "No existen asistencias",
                text: "No hay asistencias para registrar o faltan datos a registrar.",
              });
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Fechas no seleccionadas",
              text: "Debes seleccionar una fecha de inicio y una fecha final antes de registrar la semana.",
            });
          }
        });
        $(".enviar-btn").on("click", function (e) {
          e.preventDefault();
          const asistenciaId = $(this).data("asistencia-id");
          enviarDatosAsistencia(asistenciaId);
          showAssist();
        });
        $(".borrar-btn").on("click", function (e) {
          e.preventDefault();
          const asistenciaId = $(this).data("asistencia-id");
          EliminarAsistenciaLS(asistenciaId);
          showAssist();
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            "hubo conflicto en el sistema, pongase en contacto con el administrador " +
            error,
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
  function calcularSueldoSemanalPorTurno(
    fila,
    sueldoMensualGlobal,
    sueldoSemanalGlobal
  ) {
    const totalDias = parseFloat(fila.find(".total-dias").text()) || 0;

    // Obtener el valor seleccionado en el dropdown de roles
    const roleId = fila.data("rol-id");
    const selectedRole = rolesData.find(
      (rol) => rol.id === parseInt(roleId, 10)
    );

    const adelanto = parseFloat(fila.find('input[name="adelanto"]').val()) || 0;
    const viaje = parseFloat(fila.find('input[name="viaje"]').val()) || 0;
    const domingos = parseFloat(fila.find('input[name="domingos"]').val()) || 0;
    const extras = parseFloat(fila.find('input[name="extras"]').val()) || 0;
    const bonificacion =
      parseFloat(fila.find('input[name="bonificacion"]').val()) || 0;

    if (selectedRole) {
      const sueldoMensualRol = parseFloat(selectedRole.sueldo_mensual) || 0;
      const sueldoSemanalRol = parseFloat(selectedRole.sueldo_semanal) || 0;

      const personalId = fila.data("personal-id");

      const sueldoSemanalElement = fila.find(`#sueldoSemanal_${personalId}`);
      const sueldoMensualElement = fila.find(`#sueldoMensual_${personalId}`);

      const sueldoSemanalRolElement = fila.find(
        `#sueldoSemanalRol_${personalId}`
      );
      const sueldoMensualRolElement = fila.find(
        `#sueldoMensualRol_${personalId}`
      );

      sueldoMensualRolElement.text(sueldoMensualRol);
      sueldoSemanalRolElement.text(sueldoSemanalRol);

      const sueldoSemanalEscondido = $(
        `#sueldoSemanalRol_${personalId}`
      ).text();
      let sueldoSemanal = parseInt(sueldoSemanalEscondido, 10);

      const asistenciasAlmacenadas = RecuperarAsistenciasLS();
      const asistenciaEnLocalStorage = asistenciasAlmacenadas.find(
        (asist) => asist.empleadoId === personalId
      );

      // Verificar si hay valor en el localStorage y si el sueldo calculado es mayor
      if (asistenciaEnLocalStorage && asistenciaEnLocalStorage.rol) {
        let sueldoSemanalPorTurnoLS = totalDias * (sueldoSemanalGlobal / 6);

        sueldoSemanalPorTurnoLS +=
          viaje + domingos + extras + bonificacion - adelanto;

        const sueldoMensualSegunTurnoLS =
          sueldoSemanalPorTurnoLS * 4 || sueldoMensualGlobal;

        sueldoSemanalElement.text(sueldoSemanalPorTurnoLS.toFixed(2));
        sueldoMensualElement.text(sueldoMensualSegunTurnoLS.toFixed(2));
      } else {
        let sueldoSemanalPorTurno = totalDias * (sueldoSemanal / 6);

        sueldoSemanalPorTurno +=
          viaje + domingos + extras + bonificacion - adelanto;
        const sueldoMensualSegunTurno = sueldoSemanalPorTurno * 4;

        sueldoSemanalElement.text(sueldoSemanalPorTurno.toFixed(2));
        sueldoMensualElement.text(sueldoMensualSegunTurno.toFixed(2));
      }
    } else {
      const personalId = fila.data("personal-id");

      const sueldoSemanalElement = fila.find(`#sueldoSemanal_${personalId}`);
      const sueldoMensualElement = fila.find(`#sueldoMensual_${personalId}`);

      const asistenciasAlmacenadas = RecuperarAsistenciasLS();
      const asistenciaEnLocalStorage = asistenciasAlmacenadas.find(
        (asist) => asist.empleadoId === personalId
      );

      // Verificar si hay valor en el localStorage y si el sueldo calculado es mayor
      if (asistenciaEnLocalStorage && asistenciaEnLocalStorage.rol) {
        let sueldoSemanalPorTurnoLS = totalDias * (sueldoSemanalGlobal / 6);

        sueldoSemanalPorTurnoLS +=
          viaje + domingos + extras + bonificacion - adelanto;

        const sueldoMensualSegunTurnoLS = sueldoSemanalPorTurnoLS * 4;

        sueldoSemanalElement.text(sueldoSemanalPorTurnoLS.toFixed(2));
        sueldoMensualElement.text(sueldoMensualSegunTurnoLS.toFixed(2));
      }
    }
  }
  function configurarSumaTotalDias(personalId) {
    // Detectar cambios en los checkboxes con la clase 'asistencia-checkbox'
    $(".asistencia-checkbox").change(function () {
      let totalDias = 0;

      $(this)
        .closest("tr")
        .find(".asistencia-checkbox:checked")
        .each(function () {
          const dia = $(this).data("dia");
          const turno = $(this).data("turno");

          // Sumar 1 si el checkbox corresponde al sábado, de lo contrario sumar 0.5
          if (dia === "sabado") {
            totalDias += 1;
          } else {
            totalDias += 0.5;
          }
        });

      // Obtener el elemento 'total-dias' específico de la fila actual
      let $totalDiasElement = $(this).closest("tr").find(".total-dias");

      // Verificar si el checkbox se está marcando o desmarcando
      if ($(this).prop("checked")) {
        // Checkbox marcado, sumar el valor del turno
        $totalDiasElement.text(totalDias);
      } else {
        // Checkbox desmarcado, restar el valor del turno
        $totalDiasElement.text(totalDias - 0.5);
      }

      // Llamar a la función para calcular el sueldo semanal por turno
      const fila = $(this).closest("tr");
      const sueldoMensualGlobal =
        parseFloat(
          fila.find(`#sueldoMensual_${fila.data("personal-id")}`).text()
        ) || 0;
      const sueldoSemanalGlobal =
        parseFloat(
          fila.find(`#sueldoSemanal_${fila.data("personal-id")}`).text()
        ) || 0;

      const asistenciasAlmacenadas = RecuperarAsistenciasLS();
      const asistenciaEnLocalStorage = asistenciasAlmacenadas.find(
        (asist) => asist.empleadoId === personalId
      );

      if (personalId !== undefined) {
        if (asistenciaEnLocalStorage && asistenciaEnLocalStorage.empleadoId) {
          calcularSueldoSemanalPorTurno(
            fila,
            asistenciaEnLocalStorage.sueldoMensualRol,
            sueldoSemanalGlobal.sueldoSemanalRol
          );
        } else {
          calcularSueldoSemanalPorTurno(
            fila,
            sueldoMensualGlobal,
            sueldoSemanalGlobal
          );
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error contactese con el desarrollador",
        });
      }
    });
  }
  async function cargarRoles() {
    let data = await fetch("../Controllers/rolesController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=obtener_roles",
    });

    if (data.ok) {
      let response = await data.text();
      try {
        rolesData = JSON.parse(response);

        $('[name^="rol"]').empty();

        rolesData.forEach((rol) => {
          $('[name^="rol"]').append(
            `<option value="${rol.id}" data-sueldo-mensual="${rol.sueldo_mensual}" data-sueldo-semanal="${rol.sueldo_semanal}">${rol.nombre}</option>`
          );
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
  async function showAssistPersonal() {
    let funcion = "obtener_asistencias";
    let data = await fetch("../Controllers/asistenciaController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (data.ok) {
      let response = await data.text();

      try {
        let asistencias = JSON.parse(response);
        if (asistencias.length > 0) {
          $("#tablaAsistencia").DataTable({
            data: asistencias,
            aaSorting: [],
            scrollX: false,
            autoWidth: false,
            paging: false,
            bInfo: false,
            columns: [
              {
                data: null,
                render: function (data, type, row, meta) {
                  // Devuelve el número de fila más 1
                  return meta.row + 1;
                },
              },
              { data: "cantidad_recibos" },
              {
                data: null,
                render: function (data, type, row, meta) {
                  // Devuelve el número de fila más 1
                  return (
                    "Desde: " +
                    row.fecha_inicio +
                    " / Hasta: " +
                    row.fecha_final
                  );
                },
              },
              { data: "creacion_asistencias" },
              { data: "semanal_total" },
              {
                data: null,
                render: function (data, type, row) {
                  return `<button class="recibo-sueldo btn btn-success" type="button" data-id="${row.id}">
                                                <i class="fas fa-print" style="color: white;"></i>
                                            </button>
                                            <button class="borrar-recibo btn btn-danger" type="button" data-id="${row.id}">
                                                <i class="fas fa-trash" style="color: white;"></i>
                                            </button>
                                            `;
                },
              },
            ],
            language: espanol,
            destroy: true,
          });
        } else {
          $("#tablaAsistencia").text("No hay asistencias registradas.");
        }
      } catch (error) {
        console.error(error);
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
  async function tablaRoles() {
    let funcion = "obtener_roles";
    let data = await fetch("../Controllers/rolesController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (data.ok) {
      let response = await data.text();

      try {
        let roles = JSON.parse(response);
        if (roles.length > 0) {
          $("#tablaRoles").DataTable({
            data: roles,
            aaSorting: [],
            scrollX: false,
            autoWidth: false,
            paging: false,
            bInfo: false,
            columns: [
              { data: "nombre" },
              { data: "sueldo_semanal" },
              { data: "sueldo_mensual" },
            ],
            language: espanol,
            destroy: true,
            createdRow: function (row, data, dataIndex) {
              // Asignar un ID único basado en el valor de la columna "nombre"
              $(row).attr(
                "id",
                "fila-" + data.nombre.replace(/\s+/g, "-").toLowerCase()
              );
            },
          });
        } else {
          $("#tablaRoles").text("No hay asistencias registradas.");
        }
      } catch (error) {
        console.error(error);
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
  async function generarBotonesRolesAsignados(rolesData) {
    let funcion = "empleados_rol";
    let data = await fetch("../Controllers/PersonalController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (data.ok) {
      let response = await data.text();
      try {
        let rolesAsignados = JSON.parse(response);

        // Usar un conjunto para almacenar roles únicos
        let rolesUnicos = new Set();
        rolesAsignados.forEach((rol) => {
          rolesUnicos.add(rol.nombre);
        });

        // Limpiar el contenedor de botones antes de agregar nuevos
        $(".btn-group-rol").empty();

        // Crear botones solo para roles únicos
        rolesUnicos.forEach((nombreRol) => {
          const button = $("<button>")
            .attr("type", "button")
            .addClass("btn btn-secondary m-1 filtro-rol")
            .attr("data-rol-nombre", nombreRol) // Usar el nombre del rol como identificador
            .text(nombreRol);

          $(".btn-group-rol").append(button);
        });

        // Asignar evento de clic para los botones de filtro por rol
        $(".filtro-rol").on("click", function () {
          const rolNombre = $(this).data("rol-nombre");
          filtrarEmpleadosPorRol(rolNombre);
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      console.error("Hubo un problema al obtener los roles asignados");
    }
  }
  function filtrarEmpleadosPorRol(rolNombre) {
    $("#tablaEmpleados tbody tr").hide();
    $(`#tablaEmpleados tbody tr[data-rol-nombre="${rolNombre}"]`).show();
  }
  function LoaderPDF(mensaje) {
    if (!mensaje) {
      mensaje = "Creando PDF...";
    }
    Swal.fire({
      position: "center",
      html: '<i class="fas fa-2x fa-sync-alt fa-spin"></i>',
      title: mensaje,
      showConfirmButton: false,
      allowOutsideClick: false, // Evita que el usuario pueda cerrar el cuadro de diálogo haciendo clic fuera de él
    });
  }

  $("#buscarPersonal").on("input", function () {
    var filtro = $(this).val().toLowerCase(); // Obtener el valor de búsqueda y convertir a minúsculas

    // Filtrar las filas de la tabla
    $("#tablaEmpleados tbody tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(filtro) > -1); // Mostrar/ocultar según el filtro
    });
  });
  $("#tablaAsistencia tbody").on("click", ".recibo-sueldo", function () {
    // Mostrar el loader
    LoaderPDF();

    let funcion = "imprimir";
    let creacion = $(this).closest("tr").find("td:eq(3)").text();
    let cadenaFechas = $(this).closest("tr").find("td:eq(2)").text();

    const regex = /\d{4}-\d{2}-\d{2}/g;

    // Extraer todas las coincidencias
    const fechas = cadenaFechas.match(regex);

    $.ajax({
      url: "../Controllers/asistenciaController.php",
      type: "POST",
      data: {
        funcion: funcion,
        fechaInicio: fechas[0],
        fechaFinal: fechas[1],
        fechaCreacion: creacion,
      },
      dataType: "json",
      cache: false,
      success: function (response) {
        Swal.close();
        window.open(response.archivo, "_blank");
      },
      error: function () {
        Swal.close();
        toastr.error("Hubo un error al procesar la solicitud.", "Error");
      },
    });
  });
  $("#tablaAsistencia tbody").on("click", ".borrar-recibo", function () {
    let funcion = "borrar";
    const creacion = $(this).closest("tr").find("td:eq(3)").text();

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger mr-2",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Estas seguro?",
        text:
          "No vas a ver mas los datos de estas asistencias creadas el " +
          creacion,
        imageWidth: 100,
        imageHeight: 100,
        showCancelButton: true,
        confirmButtonText: "Si, Borralo",
        cancelButtonText: "No, Cancelar",
        reverseButtons: false,
      })
      .then((result) => {
        if (result.value) {
          $.post(
            "../Controllers/asistenciaController.php",
            { creacion, funcion },
            (response) => {
              console.log(response);
              if (response == "borrado") {
                swalWithBootstrapButtons.fire(
                  "Borrado!",
                  "Todos sus datos fueron borrados correctamente.",
                  "success"
                );
                showAssistPersonal();
              } else {
                swalWithBootstrapButtons.fire(
                  "No se pudo borrar!",
                  `Los datos creados en fecha/hora <b>` +
                    creacion +
                    `</b> no pudo ser borrado por alguna razon.`,
                  "error"
                );
              }
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelado",
            `Los datos de fecha/hora <b>` + creacion + `</b> estan a salvo`,
            "info"
          );
        }
      });
  });
  $("#enviarViandasBtn").on("click", function () {
    // Obtener el valor del input de viandas
    let viandasValor = $("#valor_viandas").val();

    let funcion = "valor_vianda";

    // Verificar si el valor no está vacío
    if (viandasValor !== "") {
      // Realizar la solicitud AJAX
      $.ajax({
        type: "POST",
        url: "../Controllers/pagosExtraController.php",
        data: {
          funcion: funcion,
          viandas_valor: viandasValor,
        },
        success: function (response) {
          // console.log('Solicitud exitosa:', response);
          toastr.success(
            "Valor de la vianda fue actualizada con exito!",
            "Éxito"
          );
        },
        error: function (error) {
          // Manejar errores de la solicitud AJAX
          toastr.error(
            "El valor de la vianda no pudo ser actualizada, verificar error: " +
              error,
            "Error"
          );
        },
      });
    } else {
      toastr.warning("El valor de viandas está vacío", "Error");
    }
  });
  $("#enviarRolesBtn").on("click", function () {
    // Obtener el valor del input de viandas
    let roles = $("#roles").val();
    let valor_sueldo_semanal = $("#valor_sueldo_semanal").val();
    let valor_sueldo_mensual = $("#valor_sueldo_mensual").val();

    let funcion = "actualizar_sueldo_rol";

    $.ajax({
      type: "POST",
      url: "../Controllers/rolesController.php",
      data: {
        funcion: funcion,
        roles: roles,
        valor_sueldo_semanal: valor_sueldo_semanal,
        valor_sueldo_mensual: valor_sueldo_mensual,
      },
      success: function (response) {
        console.log(response);
        toastr.success("Valores actualizados con exito!", "Éxito");
        tablaRoles();
        let table = $("#tablaRoles").DataTable();
        let updatedRow = table.row(0).node(); // Cambia esto para obtener la fila específica

        // Agregar la clase temporal a la fila actualizada
        $(updatedRow).addClass("table-success");

        // Quitar la clase temporal después de 3 segundos (3000 milisegundos)
        setTimeout(function () {
          $(updatedRow).removeClass("table-success");
        }, 3000);
      },
      error: function (xhr, status, error) {
        // Manejar errores de la solicitud AJAX
        console.log("Error en la solicitud AJAX:", xhr.responseText);
        toastr.error(
          "Los valores no se pudieron enviar correctamente, verificar error: " +
            error,
          "Error"
        );
      },
    });
  });

  $("#crearRolesBtn").on("click", function () {
    // Obtener el valor del input de viandas
    let roles = $("#rol_name").val();
    let valor_sueldo_semanal = $("#valor_sueldo_semanal_rol").val();
    let valor_sueldo_mensual = $("#valor_sueldo_mensual_rol").val();

    let funcion = "crear_rol";

    if (roles !== undefined) {
      $.ajax({
        type: "POST",
        url: "../Controllers/rolesController.php",
        data: {
          funcion: funcion,
          roles: roles,
          valor_sueldo_semanal: valor_sueldo_semanal,
          valor_sueldo_mensual: valor_sueldo_mensual,
        },
        success: function (response) {
          console.log(response);
          toastr.success("Valores actualizados con exito!", "Éxito");
          tablaRoles();
          let table = $("#tablaRoles").DataTable();
          let updatedRow = table.row(0).node(); // Cambia esto para obtener la fila específica

          // Agregar la clase temporal a la fila actualizada
          $(updatedRow).addClass("table-success");

          // Quitar la clase temporal después de 3 segundos (3000 milisegundos)
          setTimeout(function () {
            $(updatedRow).removeClass("table-success");
          }, 3000);
        },
        error: function (xhr, status, error) {
          // Manejar errores de la solicitud AJAX
          console.log("Error en la solicitud AJAX:", xhr.responseText);
          toastr.error(
            "Los valores no se pudieron enviar correctamente, verificar error: " +
              error,
            "Error"
          );
        },
      });
    } else {
      toastr.warning("El valor de viandas está vacío", "Error");
    }
  });

  $("#tipo_archivo_crear").on("click", function () {
    // Obtener el valor del input de viandas
    let tipo_archivo = $("#tipo_archivo").val();

    let funcion = "crear_tipo_archivo";

    if (roles !== undefined) {
      $.ajax({
        type: "POST",
        url: "../Controllers/ArchivosController.php",
        data: {
          funcion: funcion,
          tipo_archivo: tipo_archivo,
        },
        success: function (response) {
          toastr.success("Valores actualizados con exito!", "Éxito");
          rellenar_archivos_personal();
        },
        error: function (xhr, status, error) {
          // Manejar errores de la solicitud AJAX
          toastr.error(
            "Los valores no se pudieron enviar correctamente, verificar error: " +
              error,
            "Error"
          );
        },
      });
    } else {
      toastr.warning("El valor de viandas está vacío", "Error");
    }
  });

  // ARCHIVOS
  function rellenar_archivos_personal() {
    let funcion = "rellenar_archivos_personal";
    $.post("../Controllers/ArchivosController.php", { funcion }, (response) => {
      let archivos = JSON.parse(response);
      let template = "";

      if (archivos.length === 0) {
        $("#tipo_archivos_personal").empty();
        return;
      } else {
        archivos.forEach((archivo) => {
          template += `
                        <option value="${archivo.id}">${archivo.nombre}</option>
                    `;
        });
      }

      $("#tipo_archivos_personal").html(template);
    });
  }
  $("#archivo").change(function () {
    let archivos = this.files;
    let archivosLista = $("#personal-archivos-lista");

    for (let i = 0; i < archivos.length; i++) {
      let archivo = archivos[i];

      if (archivo.type === "application/pdf") {
        let archivoItem = $(`
            <li class="list-group-item d-flex justify-content-between align-items-center archivo-list-item">
            <div class="d-flex align-items-center">
                <i class="fas fa-file-pdf text-danger me-2"></i>
                <span class="archivo-name">${archivo.name}</span>
            </div>
            <div>
                <i class="fas fa-check text-success me-3"></i>
                <button class="btn btn-sm text-center btn-danger p-2 eliminar-archivo">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </li>`);

        archivosLista.append(archivoItem);
      } else {
        toastr.error(
          'El archivo "' +
            archivo.name +
            '" no es un PDF válido. Solo se permiten archivos PDF.',
          "Error"
        );
      }
    }
  });
  $("#personal-archivos-lista").on("click", ".eliminar-archivo", function () {
    const archivoItem = $(this).closest(".archivo-list-item");
    const archivoName = archivoItem.find(".archivo-name").text();

    const input = document.getElementById("archivo");
    for (let i = 0; i < input.files.length; i++) {
      if (input.files[i].name === archivoName) {
        input.files = new DataTransfer().files;
        break;
      }
    }
    archivoItem.remove();
  });
  $(document).on("click", ".ver", function (e) {
    e.preventDefault();
    const id = $(this).attr("perId");
    obtenerArchivosPersonal(id);
    const nombre = $(this).attr("perNombre");
    const dni = $(this).attr("perDni");
    const cuil = $(this).attr("perCuil");
    const fecha_ingreso = $(this).attr("perFechaingreso");
    const obra_social = $(this).attr("perObrasocial");
    const direccion = $(this).attr("perDireccion");

    let funcion = "adjuntar_archivo_personal";
    const idTipoArchivo = $("#tipo_archivos_personal").val();

    $("#personal-archivos-lista").empty();
    $("#funcion-personal-pdf").val(funcion);
    const nombreArchivo = $("#archivo").val();
    $("#nombre-archivo-pdf").val(nombreArchivo);
    $("#id-personal-pdf").val(id);
    $("#id-tipo-archivo-pdf").val(idTipoArchivo);

    $("#nombre_int").text(nombre);
    $("#dni_int").text(dni);
    $("#cuil_int").text(cuil);
    $("#fecha_ingreso_int").text(fecha_ingreso);
    $("#obra_social_int").text(obra_social);
    $("#direccion_int").text(direccion);
    $("#id_int").text(id);
  });
  $("#form-adjuntar-archivo-personal").submit((e) => {
    e.preventDefault();
    const formData = new FormData($("#form-adjuntar-archivo-personal")[0]);
    $.ajax({
      url: "../Controllers/ArchivosController.php",
      type: "POST",
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
    }).done(function (response) {
      const json = JSON.parse(response);
      if (json.alert == "edit") {
        toastr.success(
          "Archivo PDF adjuntado con éxito! Ya puedes verlo reflejado en la busqueda de tus archivos",
          "Éxito"
        );
        $("#form-adjuntar-archivo-personal").trigger("reset");
        $("#archivo").trigger("reset");
        $("#archivos-lista").empty();
        const id = $(".ver").attr("perId");
        obtenerArchivosPersonal(id);
      } else if (json.alert == "exist") {
        toastr.error(
          "No se pudo registrar el archivo, verifique si selecciono alguno",
          "Error"
        );
        $("#form-adjuntar-archivo-personal").trigger("reset");
        $("#archivo").trigger("reset");
        $("#archivos-lista").empty();
      } else if (json.alert == "novalid") {
        toastr.error(
          "El archivo no es un PDF válido o supera el límite de tamaño permitido",
          "Error"
        );
        $("#form-adjuntar-archivo-personal").trigger("reset");
        $("#archivo").trigger("reset");
        $("#archivos-lista").empty();
      } else if (json.alert == "noedit") {
        toastr.error(
          "Ya existe un archivo con el mismo nombre y vehículo.",
          "Error"
        );
        $("#form-adjuntar-archivo-personal").trigger("reset");
        $("#archivo").trigger("reset");
        $("#archivos-lista").empty();
      } else {
        toastr.error(
          "El archivo no cumple con los requisitos de tamaño. No se pudo subir el archivo",
          "Error"
        );
        $("#form-adjuntar-archivo-personal").trigger("reset");
        $("#archivo").trigger("reset");
        $("#archivos-lista").empty();
      }
    });
  });
  $("#tipo_archivos_personal").on("change", function () {
    const idTipoArchivo = $(this).val();
    $("#id-tipo-archivo-pdf").val(idTipoArchivo);
  });
  async function obtenerArchivosPersonal(personalId) {
    let funcion = "obtener_archivos_personal";
    let data = new FormData();
    data.append("funcion", funcion);
    data.append("personal_id", personalId);

    try {
      const response = await fetch("../Controllers/ArchivosController.php", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const archivos = await response.json();

        const selectTipoArchivo = document.getElementById(
          "tipo_archivos-select"
        );
        selectTipoArchivo.innerHTML = "";

        const tiposDeArchivoUnicos = [
          ...new Set(archivos.map((archivo) => archivo.tipo_archivo_personal)),
        ];

        if (tiposDeArchivoUnicos.length > 0) {
          tiposDeArchivoUnicos.forEach((tipoArchivo) => {
            const option = document.createElement("option");
            option.value = tipoArchivo;
            option.textContent = tipoArchivo;
            selectTipoArchivo.appendChild(option);
          });

          mostrarArchivosFiltrados(archivos, tiposDeArchivoUnicos[0]);
          selectTipoArchivo.style.display = "block";
        } else {
          selectTipoArchivo.style.display = "none";
          const archivosList = document.getElementById("archivos-list");
          archivosList.innerHTML = `<p>No hay archivos adjuntos</p><br><p>Cerrá esta <b>Pestaña Emergente</b> y volve a abrir para ver reflejado los cambios</p>.`;
        }

        selectTipoArchivo.addEventListener("change", (e) => {
          const selectedTipoArchivo = selectTipoArchivo.value;
          const archivosFiltrados = archivos.filter(
            (archivo) => archivo.tipo_archivo_personal === selectedTipoArchivo
          );

          let archivosTemplate = "";

          archivosFiltrados.forEach((archivo) => {
            archivosTemplate += `
                            <li class="archivo-item mb-1 mr-1">
                                <span class="nombre-archivo">${archivo.nombre}</span>
                                <button data-id="${archivo.id}" data-ruta="${archivo.ruta}" class="btn btn-success float-end descargar"><i class="fas fa-print" style="color: white;"></i></button>
                                <button data-id="${archivo.id}" data-ruta="${archivo.ruta}" class="btn btn-danger float-end borrar-archivo" data-tipo="${archivo.tipo_archivo_personal}"><i class="fas fa-trash" style="color: white;"></i></button></li>
                            <hr>
                        `;
          });
          e.preventDefault();

          const archivosList = document.getElementById("archivos-list");
          archivosList.innerHTML = archivosTemplate;

          const botonesBorrar = document.querySelectorAll(".borrar-archivo");
          botonesBorrar.forEach((boton) => {
            boton.addEventListener("click", (e) => {
              e.preventDefault();
              let id = boton.getAttribute("data-id");
              let ruta = boton.getAttribute("data-ruta");
              let tipo = boton.getAttribute("data-tipo");
              borrarArchivo(id, ruta, tipo);
            });
          });
          const botonesDescargar = document.querySelectorAll(".descargar");
          botonesDescargar.forEach((boton) => {
            boton.addEventListener("click", (e) => {
              e.preventDefault();
              let id = boton.getAttribute("data-id");
              let ruta = boton.getAttribute("data-ruta");
              descargarPDF(id, ruta);
            });
          });
        });
      } else {
        console.error("Error al obtener archivos.");
      }
    } catch (error) {
      console.error("Error en la solicitud fetch:", error);
    }
  }
  function mostrarArchivosFiltrados(archivos, selectedTipoArchivo) {
    const archivosFiltrados = archivos.filter(
      (archivo) => archivo.tipo_archivo_personal === selectedTipoArchivo
    );

    let archivosTemplate = "";

    archivosFiltrados.forEach((archivo) => {
      archivosTemplate += `
                <li class="archivo-item mb-1 mr-1">
                    <span class="nombre-archivo">${archivo.nombre}</span>
                    <button data-id="${archivo.id}" data-ruta="${archivo.ruta}" class="btn btn-success float-end descargar"><i class="fas fa-print" style="color: white;"></i></button>
                    <button data-id="${archivo.id}" data-ruta="${archivo.ruta}" class="btn btn-danger float-end borrar-archivo"><i class="fas fa-trash" style="color: white;"></i></button>
                </li>
                <hr>
            `;
    });

    const archivosList = document.getElementById("archivos-list");
    archivosList.innerHTML = archivosTemplate;

    const botonesBorrar = document.querySelectorAll(".borrar-archivo");
    botonesBorrar.forEach((boton) => {
      boton.addEventListener("click", (e) => {
        e.preventDefault();
        let id = boton.getAttribute("data-id");
        let ruta = boton.getAttribute("data-ruta");
        borrarArchivo(id, ruta);
      });
    });

    const botonesDescargar = document.querySelectorAll(".descargar");
    botonesDescargar.forEach((boton) => {
      boton.addEventListener("click", (e) => {
        e.preventDefault();
        let id = boton.getAttribute("data-id");
        let ruta = boton.getAttribute("data-ruta");
        descargarPDF(id, ruta);
      });
    });
  }
  function descargarPDF(id, ruta) {
    window.open(ruta, "_blank");
  }
  async function borrarArchivo(id, ruta) {
    let funcion = "borrar_archivo";
    let data = new FormData();
    data.append("funcion", funcion);
    data.append("id", id);
    data.append("ruta", ruta);
    const resultado = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el archivo permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      try {
        const response = await fetch("../Controllers/ArchivosController.php", {
          method: "POST",
          body: data,
        });

        if (response.ok) {
          Swal.fire(
            "Archivo eliminado",
            "El archivo se ha eliminado con éxito.",
            "success"
          );

          const id = $(".ver").attr("perId");
          obtenerArchivosPersonal(id);
        } else {
          console.error("Error al intentar borrar el archivo.");
          Swal.fire("Error", "No se pudo eliminar el archivo.", "error");
        }
      } catch (error) {
        console.error("Error en la solicitud fetch:", error);
        Swal.fire(
          "Error",
          "Ocurrió un error en la solicitud de eliminación.",
          "error"
        );
      }
    }
  }
  // FIN ARCHIVOS
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
