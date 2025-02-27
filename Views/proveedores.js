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
  let telefonosCount = 1;

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
          $("#gestion_usuario").show();
          $("#gestion_catalogo").show();
          $("#gestion_ventas").show();
          $("#gestion_lotes").show();
          $("#gestion_pedidos").show();
          $("#content_admin").show();
          obtener_proveedores();
          buscar_prov();
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
  // PROVEEDOR
  $("#form-crear").submit(function (e) {
    e.preventDefault();
    try {
      let funcion = "";

      const telefonos = $('input[name="telefonos[]"]')
        .map(function () {
          return $(this).val();
        })
        .get();
      let id = $("#id_edit_prov").val();
      let razonsocial = $("#razonsocial").val();
      let nombre = $("#nombre").val();
      let direccion = $("#direccion").val();
      let cuit = $("#cuit").val();
      let condicion_iva = $("#condicion_iva").val();
      let cbu = $("#cbu").val();
      let cvu = $("#cvu").val();

      if (!razonsocial || !nombre || !direccion || !cuit || !condicion_iva) {
        toastr.error(
          "Todos los campos obligatorios deben ser completados",
          "Error!"
        );
        return;
      }

      if (edit == true) {
        funcion = "editar";
      } else {
        funcion = "crear";
      }
      $.post(
        "../Controllers/ProveedorController.php",
        {
          id,
          nombre,
          direccion,
          cuit,
          razonsocial,
          condicion_iva,
          cbu,
          cvu,
          telefonos,
          funcion,
        },
        (response) => {
          if (response == "add") {
            toastr.success("Proveedor Agregado con exito", "Exito!");
            $("#form-crear").trigger("reset");
            obtener_proveedores();
            buscar_prov();
          }
          if (response == "edit") {
            toastr.success("Proveedor Editado con exito", "Exito!");
            $("#form-crear").trigger("reset");
            obtener_proveedores();
            buscar_prov();
          }
          if (response == "noadd") {
            toastr.error("No se ha podido agregar proveedor", "Exito!");
            $("#form-crear").trigger("reset");
          }
          edit = false;
        }
      );
    } catch (error) {
      console.log(error);
    }
  });
  async function obtener_proveedores() {
    let funcion = "obtener_proveedores";
    let request = await fetch("../Controllers/ProveedorController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });
    if (request.ok) {
      let response = await request.text();
      try {
        let proveedores = JSON.parse(response);
        let template = "";
        proveedores.forEach((proveedor) => {
          // Generar una lista de teléfonos
          const telefonosList = proveedor.telefonos
            .map((telefono) => {
              return `<li class="small"><span class="fa-li"><i class="fab fa-whatsapp"></i></span>${telefono}</li>`;
            })
            .join("");

          template += `
                        <div  class="col-12 col-sm-8 col-md-4">
                            <div class="card bg-light d-flex flex-fill">
                                <div class="card-header text-muted border-bottom-0">
                                    <h1 class="badge badge-success">Proveedor</h1>
                                </div>
                                <div class="card-body pt-0">
                                    <div class="row">
                                        <div class="col-9">
                                        <h2 class="lead"><b>${
                                          proveedor.nombre
                                        }</b></h2>
                                        <ul class="ml-4 mb-0 fa-ul text-muted">
                                            <li class="small"><span class="fa-li"><i class="fas fa-lg fa-building"></i></span><span class="badge badge-info"> Direccion:</span> ${
                                              proveedor.direccion
                                            }</li>
                                            <li class="small"><span class="fa-li"><i class="fas fa-landmark"></i></span><span class="badge badge-info"> Razon Social:</span> ${
                                              proveedor.razon_social
                                            }</li>
                                            <li class="small"><span class="fa-li"><i class="fas fa-id-card"></i></span><span class="badge badge-info"> C.U.I.T:</span> ${
                                              proveedor.cuit
                                            }</li>
                                            ${
                                              proveedor.cbu
                                                ? `<li class="small"><span class="fa-li"><i class="fas fa-university"></i></span><span class="badge badge-info"> CBU:</span> ${proveedor.cbu}</li>`
                                                : ""
                                            }
                                            ${
                                              proveedor.cvu
                                                ? `<li class="small"><span class="fa-li"><i class="fas fa-university"></i></span><span class="badge badge-info"> CVU:</span> ${proveedor.cvu}</li>`
                                                : ""
                                            }
                                        </ul>
                                        <ul class="ml-4 mb-0 fa-ul text-muted">
                                            <li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span><span class="badge badge-info"> Teléfonos:</span> 
                                                <ul>${telefonosList}</ul>
                                            </li>
                                        </ul>
                                        </div>
                                        <div class="col-3 text-center">
                                        <img src="${
                                          proveedor.avatar
                                        }" alt="user-avatar" class="img-circle img-fluid img-md">
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <div class="text-right">
                                        <button data-id="${proveedor.id}" 
                                                data-nombre="${
                                                  proveedor.nombre
                                                }" 
                                                data-direccion="${
                                                  proveedor.direccion
                                                }" 
                                                data-razonsocial="${
                                                  proveedor.razon_social
                                                }" 
                                                data-cuit="${proveedor.cuit}" 
                                                data-condicionIva="${
                                                  proveedor.condicion_iva
                                                }" 
                                                data-avatar="${
                                                  proveedor.avatar
                                                }"   type="button" data-toggle="modal" data-target="#crearproveedor" class="editar-proveedor btn btn-sm btn-success">
                                            <i class="fas fa-pencil-alt" style="color: white;"></i>
                                        </button>
                                        <button data-id="${proveedor.id}" 
                                                data-nombre="${
                                                  proveedor.nombre
                                                }" 
                                                data-direccion="${
                                                  proveedor.direccion
                                                }" 
                                                data-razonsocial="${
                                                  proveedor.razon_social
                                                }" 
                                                data-cuit="${proveedor.cuit}" 
                                                data-condicionIva="${
                                                  proveedor.condicion_iva
                                                }" 
                                                data-avatar="${
                                                  proveedor.avatar
                                                }"  class="borrar-proveedor btn btn-sm btn-secondary">
                                            <i class="fas fa-trash-alt" style="color: white;"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
        });
        $("#all_proveedores").html(template);
      } catch (error) {
        console.log(error);
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un conflicto en el sistema, póngase en contacto con el administrador",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: request.statusText,
        text: "Hubo un conflicto en el sistema, póngase en contacto con el administrador",
      });
    }
  }
  async function buscar_prov(consulta) {
    let funcion = "buscar";
    let formData = new FormData();
    formData.append("funcion", funcion);

    if (consulta !== "") {
      formData.append("consulta", consulta);
    }

    let request = await fetch("../Controllers/ProveedorController.php", {
      method: "POST",
      body: formData,
    });

    if (request.ok) {
      let response = await request.text();
      try {
        let proveedores = JSON.parse(response);
        let template = "";

        proveedores.forEach((proveedor) => {
          const telefonosList = proveedor.telefonos
            .map((telefono) => {
              return `<li class="small"><span class="fa-li"><i class="fab fa-whatsapp"></i></span>${telefono}</li>`;
            })
            .join("");
          template += `
                        <div class="d-flex justify-content-center align-items-center col-12 col-sm-2 col-md-12">
                            
                            <div class="card bg-light d-flex flex-fill">
                                <div class="card-header text-muted border-bottom-0">
                                    <h1 class="badge badge-success">Proveedor</h1>
                                </div>
                                <div class="card-body pt-0">
                                    <div class="row">
                                        <div class="col-7">
                                        <h2 class="lead"><b>${
                                          proveedor.nombre
                                        }</b></h2>
                                        <ul class="ml-4 mb-0 fa-ul text-muted">
                                            <li class="small"><span class="fa-li"><i class="fas fa-lg fa-building"></i></span> Direccion: ${
                                              proveedor.direccion
                                            }</li>
                                            <li class="small"><span class="fa-li"><i class="fas fa-lg fa-at"></i></span> Razon Social: ${
                                              proveedor.razon_social
                                            }</li>
                                            ${
                                              proveedor.cbu
                                                ? `<li class="small"><span class="fa-li"><i class="fas fa-university"></i></span><span class="badge badge-info"> CBU:</span> ${proveedor.cbu}</li>`
                                                : ""
                                            }
                                            ${
                                              proveedor.cvu
                                                ? `<li class="small"><span class="fa-li"><i class="fas fa-university"></i></span><span class="badge badge-info"> CVU:</span> ${proveedor.cvu}</li>`
                                                : ""
                                            }
                                            <li class="small"><span class="fa-li">
                                                <i class="fas fa-lg fa-phone"></i></span><span class="badge badge-info">Teléfonos:</span> 
                                                <ul>${telefonosList}</ul>
                                            </li>
                                        </ul>
                                            
                                        </div>
                                        <div class="col-5 text-center">
                                        <img src="${
                                          proveedor.avatar
                                        }" alt="user-avatar" class="img-circle img-fluid img-lg">
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <div class="text-right">
                                        <button data-id="${proveedor.id}" 
                                                data-nombre="${
                                                  proveedor.nombre
                                                }" 
                                                data-direccion="${
                                                  proveedor.direccion
                                                }" 
                                                data-razonsocial="${
                                                  proveedor.razon_social
                                                }" 
                                                data-cuit="${proveedor.cuit}" 
                                                data-condicionIva="${
                                                  proveedor.condicion_iva
                                                }" 
                                                data-avatar="${
                                                  proveedor.avatar
                                                }" type="button" data-toggle="modal" data-target="#crearproveedor" class="editar-buscador btn btn-sm btn-success">
                                            <i class="fas fa-pencil-alt"></i>
                                        </button>
                                        <button data-id="${proveedor.id}" 
                                                data-nombre="${
                                                  proveedor.nombre
                                                }" 
                                                data-direccion="${
                                                  proveedor.direccion
                                                }" 
                                                data-razonsocial="${
                                                  proveedor.razon_social
                                                }" 
                                                data-cuit="${proveedor.cuit}" 
                                                data-condicionIva="${
                                                  proveedor.condicion_iva
                                                }" 
                                                data-avatar="${
                                                  proveedor.avatar
                                                }" class="borrar-buscador btn btn-sm btn-danger">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
        });
        const cardBody = document.getElementById("cardBody");
        const proveedoresContainer = document.getElementById("proveedores");

        // Cambiar la altura del elemento card-body
        cardBody.style.height = "auto";
        proveedoresContainer.innerHTML = template;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un conflicto en el sistema, póngase en contacto con el administrador",
        });
      }
    } else {
      console.log(request);
      Swal.fire({
        icon: "error",
        title: request.statusText,
        text: "Hubo un conflicto de código: " + request.status,
      });
    }
  }

  $("#telefonos-container").on("click", ".agregar-telefono", function (e) {
    e.preventDefault();
    telefonosCount++;
    const newTelefonoField = `
            <div class="input-group mb-2">
                <input type="text" class="form-control" name="telefonos[]" placeholder="Ingresar teléfono">
                <div class="input-group-append">
                    <button class="btn btn-danger eliminar-telefono" type="button">Eliminar</button>
                </div>
            </div>
        `;

    $("#telefonos-container").append(newTelefonoField);
  });

  $("#telefonos-container").on("click", ".eliminar-telefono", function () {
    if (telefonosCount > 1) {
      telefonosCount--;
      $(this).closest(".input-group").remove();
    }
  });
  $("#cbu-toggle").change(function () {
    if (this.checked) {
      // Si el checkbox está marcado, muestra el campo "N° Motor"
      $("#cbu-input-group").show();
    } else {
      // Si el checkbox no está marcado, oculta el campo "N° cbu"
      $("#cbu-input-group").hide();
    }
  });
  $("#cvu-toggle").change(function () {
    if (this.checked) {
      // Si el checkbox está marcado, muestra el campo "N° Motor"
      $("#cvu-input-group").show();
    } else {
      // Si el checkbox no está marcado, oculta el campo "N° Motor"
      $("#cvu-input-group").hide();
    }
  });
  $(document).on("keyup", "#buscar-proveedor", function () {
    let valor = $(this).val();
    if (valor != "") {
      buscar_prov(valor);
    } else {
      buscar_prov();
    }
  });
  $(document).on("click", ".avatar", (e) => {
    funcion = "cambiar_logo";
    const elemento =
      $(this)[0].activeElement.parentElement.parentElement.parentElement
        .parentElement;
    const id = $(elemento).attr("provId");
    const nombre = $(elemento).attr("provNombre");
    const avatar = $(elemento).attr("provAvatar");
    $("#logoactual").attr("src", avatar);
    $("#nombre_img").html(nombre);
    $("#id_logo_prov").val(id);
    $("#funcion").val(funcion);
    $("#avatar").val(avatar);
  });
  $("#form-logo").submit((e) => {
    let formData = new FormData($("#form-logo")[0]);
    $.ajax({
      url: "../Controllers/ProveedorController.php",
      type: "POST",
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
    }).done(function (response) {
      const json = JSON.parse(response);
      if (json.alert == "edit") {
        $("#logoactual").attr("src", json.ruta);
        $("#edit-prov").hide("slow");
        $("#edit-prov").show(1000);
        $("#edit-prov").hide(5000);
        $("#form-logo").trigger("reset");
        buscar_prov();
      } else {
        $("#noedit-prov").hide("slow");
        $("#noedit-prov").show(1000);
        $("#noedit-prov").hide(2000);
        $("#form-logo").trigger("reset");
        buscar_prov();
      }
    });
    e.preventDefault();
  });
  $(document).on("click", ".editar-proveedor", function (e) {
    const id = $(this).data("id");
    const nombre = $(this).data("nombre");
    const direccion = $(this).data("direccion");
    const razonsocial = $(this).data("razonsocial");
    const cuit = $(this).data("cuit");
    const condicionIva = $(this).data("condicioniva");
    const cbu = $(this).data("cbu");
    const cvu = $(this).data("cvu");

    $("#id_edit_prov").val(id);
    $("#nombre").val(nombre);
    $("#direccion").val(direccion);
    $("#razonsocial").val(razonsocial);
    $("#cuit").val(cuit);
    $("#condicion_iva").val(condicionIva);
    $("#cbu").val(cbu);
    $("#cvu").val(cvu);
    edit = true;

    // Limpia el formulario al cerrar el modal
    const buttonClose = document.getElementById("close-prov");
    buttonClose.addEventListener("click", (e) => {
      e.preventDefault();
      $("#form-crear").trigger("reset");
    });
  });
  $(document).on("click", ".borrar-proveedor", function (e) {
    // Obtén los datos del proveedor desde los atributos "data-" del botón
    let id = $(this).data("id");
    let nombre = $(this).data("nombre");
    let avatar = $(this).data("avatar");

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary mr-2",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "¿Estás seguro?",
        text: "No podrás recuperar a " + nombre,
        imageUrl: "" + avatar + "",
        imageWidth: 100,
        imageHeight: 100,
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          // Envía la solicitud para borrar el proveedor
          $.post(
            "../Controllers/ProveedorController.php",
            { id, funcion: "borrar" },
            (response) => {
              if (response == "borrado") {
                swalWithBootstrapButtons.fire(
                  "¡Borrado!",
                  "El proveedor " + nombre + " fue borrado.",
                  "success"
                );
                // Recarga la lista de proveedores
                obtener_proveedores();
                buscar_prov();
              } else {
                swalWithBootstrapButtons.fire(
                  "¡No se pudo borrar!",
                  "El proveedor " +
                    nombre +
                    " no fue borrado porque está siendo usado en un registro. Puede estar registrado en alguna factura, orden de compra, etc.",
                  "error"
                );
              }
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelado",
            "Tu proveedor " + nombre + " está a salvo :)",
            "error"
          );
        }
      });
  });
  $(document).on("click", ".editar-buscador", (e) => {
    const id = $(this).data("id");
    const nombre = $(this).data("nombre");
    const direccion = $(this).data("direccion");
    const razonsocial = $(this).data("razonsocial");
    const cuit = $(this).data("cuit");
    const condicionIva = $(this).data("condicioniva");
    const cbu = $(this).data("cbu");
    const cvu = $(this).data("cvu");

    $("#id_edit_prov").val(id);
    $("#nombre").val(nombre);
    $("#direccion").val(direccion);
    $("#razonsocial").val(razonsocial);
    $("#cuit").val(cuit);
    $("#condicion_iva").val(condicionIva);
    $("#cbu").val(cbu);
    $("#cvu").val(cvu);
    edit = true;
    const buttonClose = document.getElementById("close-prov");
    buttonClose.addEventListener("click", (e) => {
      e.preventDefault();
      $("#form-crear").trigger("reset");
    });
  });
  $(document).on("click", ".borrar-buscador", (e) => {
    let funcion = "borrar";
    const id = $(this).data("id");
    const nombre = $(this).data("nombre");
    const avatar = $(this).data("avatar");

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
        text: "No vas a ver mas este proveedor " + nombre + "!",
        imageUrl: "" + avatar + "",
        imageWidth: 100,
        imageHeight: 100,
        showCancelButton: true,
        confirmButtonText: "Si, Borralo!",
        cancelButtonText: "No, Cancela!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          $.post(
            "../Controllers/ProveedorController.php",
            { id, funcion },
            (response) => {
              if (response == "borrado") {
                swalWithBootstrapButtons.fire(
                  "Borrado!",
                  "El proveedor " + nombre + " fue borrado.",
                  "success"
                );

                obtener_proveedores();
                buscar_prov();
              } else {
                swalWithBootstrapButtons.fire(
                  "No se pudo borrar!",
                  "El proveedor " +
                    nombre +
                    " no fue borrado porque esta siendo usado en un lote.",
                  "error"
                );
              }
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelado",
            "Tu proveedor " + nombre + " esta a salvo :)",
            "error"
          );
        }
      });
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
