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
          obtener_cliente();
          buscar_cliente();
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

  async function obtener_cliente() {
    let funcion = "obtener_clientes";
    let request = await fetch("../Controllers/ClienteController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (request.ok) {
      let response = await request.text();
      try {
        let clientes = JSON.parse(response);
        let template = "";
        clientes.forEach((cliente) => {
          template += `
                            <div  class="col-12 col-sm-6 col-md-4 m-1">
                                <div class="card bg-light d-flex flex-fill">
                                    <div class="card-header text-muted border-bottom-0">
                                        <h1 class="badge badge-success">Cliente</h1>
                                    </div>
                                    <div class="card-body pt-0">
                                        <div class="row">
                                            <div class="col-7">
                                            <h2 class="lead"><b>${cliente.nombre}</b></h2>
                                            <ul class="ml-4 mb-0 fa-ul text-muted">
                                                <li class="small"><span class="fa-li"><i class="fas fa-lg fa-building"></i></span> Direccion: ${cliente.direccion}</li>
                                                <li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span> Telefono #: ${cliente.telefono}</li>
                                                <li class="small"><span class="fa-li"><i class="fas fa-lg fa-at"></i></span> Razon Social: ${cliente.razon_social}</li>
                                                
                                                <li class="small"><span class="fa-li"><i class="fas fa-id-card"></i></span><span class="badge badge-info"> C.U.I.T:</span> ${cliente.cuit}</li>
                                            </ul>
                                            </div>
                                            <div class="col-5 text-center">
                                            <img src="${cliente.avatar}" alt="user-avatar" class="img-circle img-fluid">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer">
                                        <div class="text-right">
                                            <button data-id="${cliente.id}" 
                                                    data-nombre="${cliente.nombre}" 
                                                    data-telefono="${cliente.telefono}" 
                                                    data-direccion="${cliente.direccion}" 
                                                    data-email="${cliente.email}" 
                                                    data-razonSocial="${cliente.razon_social}" 
                                                    data-cuit="${cliente.cuit}" 
                                                    data-condicionIva="${cliente.condicion_iva}" 
                                                    data-avatar="${cliente.avatar}"  type="button" data-toggle="modal" data-target="#crearcliente" class="editar btn btn-sm btn-success">
                                                <i class="fas fa-pencil-alt"></i>
                                            </button>
                                            <button data-id="${cliente.id}" 
                                                    data-nombre="${cliente.nombre}" 
                                                    data-telefono="${cliente.telefono}" 
                                                    data-direccion="${cliente.direccion}" 
                                                    data-razonSocial="${cliente.razon_social}" 
                                                    data-cuit="${cliente.cuit}" 
                                                    data-condicionIva="${cliente.condicion_iva}" 
                                                    data-avatar="${cliente.avatar}" class="borrar btn btn-sm btn-danger">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
        });
        $("#all_clientes").html(template);
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
        title: request.statusText,
        text: "Hubo un conflicto en el sistema, póngase en contacto con el administrador",
      });
    }
  }
  $("#form-crear-cliente").submit((e) => {
    e.preventDefault();
    let funcion = "";
    let id = $("#id_edit_cliente").val();
    let razonsocial = $("#razon_social_cliente").val();
    let nombre = $("#nombre_cliente").val();
    let direccion = $("#direccion_cliente").val();
    let email = $("#email_cliente").val();
    let telefono = $("#telefono_cliente").val();
    let cuit = $("#cuit_cliente").val();
    let condicion_iva = $("#condicion_iva_cliente").val();
    if (edit == true) {
      funcion = "editar";
    } else {
      funcion = "crear";
    }
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
        console.log(response);
        if (response == "add") {
          toastr.success("Cliente Agregado con exito", "Exito!");
          $("#form-crear-cliente").trigger("reset");
          obtener_cliente();
          buscar_cliente();
        }
        if (response == "edit") {
          toastr.success("Cliente Editado con exito", "Exito!");
          $("#form-crear-cliente").trigger("reset");
          obtener_cliente();
          buscar_cliente();
        }
        if (response == "noadd") {
          toastr.error("Cliente no ha sido agregado", "Error!");
          $("#form-crear-cliente").trigger("reset");
        }
        edit = false;
      }
    );
    e.preventDefault();
  });
  async function buscar_cliente(consulta) {
    let funcion = "buscar";
    let request = await fetch("../Controllers/ClienteController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion + "&consulta=" + consulta,
    });

    if (request.ok) {
      let response = await request.text();
      try {
        let clientes = JSON.parse(response);
        let template = "";
        clientes.forEach((cliente) => {
          template += `
                            <div class="col-12 col-sm-6 col-md-4 m-1">
                                <div class="card bg-light d-flex flex-fill">
                                    <div class="card-header text-muted border-bottom-0">
                                        <h1 class="badge badge-success">Cliente</h1>
                                    </div>
                                    <div class="card-body pt-0">
                                        <div class="row">
                                            <div class="col-7">
                                            <h2 class="lead"><b>${cliente.nombre}</b></h2>
                                            <ul class="ml-4 mb-0 fa-ul text-muted">
                                                <li class="small"><span class="fa-li"><i class="fas fa-lg fa-building"></i></span> Direccion: ${cliente.direccion}</li>
                                                <li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span> Telefono #: ${cliente.telefono}</li>
                                                <li class="small"><span class="fa-li"><i class="fas fa-lg fa-at"></i></span> Razon Social: ${cliente.razon_social}</li>
                                                
                                                <li class="small"><span class="fa-li"><i class="fas fa-id-card"></i></span><span class="badge badge-info"> C.U.I.T:</span> ${cliente.cuit}</li>
                                            </ul>
                                            </div>
                                            <div class="col-5 text-center">
                                            <img src="${cliente.avatar}" alt="user-avatar" class="img-circle img-fluid">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer">
                                        <div class="text-right">
                                            <button data-id="${cliente.id}" 
                                                    data-nombre="${cliente.nombre}" 
                                                    data-telefono="${cliente.telefono}" 
                                                    data-direccion="${cliente.direccion}" 
                                                    data-email="${cliente.email}" 
                                                    data-razonSocial="${cliente.razon_social}" 
                                                    data-cuit="${cliente.cuit}" 
                                                    data-condicionIva="${cliente.condicion_iva}" 
                                                    data-avatar="${cliente.avatar}"  type="button" data-toggle="modal" data-target="#crearcliente" class="editar-buscar btn btn-sm btn-success">
                                                <i class="fas fa-pencil-alt"></i>
                                            </button>
                                            <button data-id="${cliente.id}" 
                                                    data-nombre="${cliente.nombre}" 
                                                    data-telefono="${cliente.telefono}" 
                                                    data-direccion="${cliente.direccion}" 
                                                    data-razonSocial="${cliente.razon_social}" 
                                                    data-cuit="${cliente.cuit}" 
                                                    data-condicionIva="${cliente.condicion_iva}" 
                                                    data-avatar="${cliente.avatar}"  class="borrar-buscar btn btn-sm btn-danger">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
        });
        $("#clientes").html(template);
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
        title: request.statusText,
        text: "Hubo un conflicto de código: " + request.status,
      });
    }
  }
  $(document).on("keyup", "#buscar-clientes", function () {
    let valor = $(this).val();
    if (valor != "") {
      buscar_cliente(valor);
    } else {
      buscar_cliente();
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
      url: "../Controllers/ClienteController.php",
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
  $(document).on("click", ".editar", function (e) {
    const id = $(this).data("id");
    const nombre = $(this).data("nombre");
    const telefono = $(this).data("telefono");
    const direccion = $(this).data("direccion");
    const email = $(this).data("email");
    const razonsocial = $(this).data("razonSocial");
    const cuit = $(this).data("cuit");
    const CondicionIva = $(this).data("condicionIva");

    $("#id_edit_cliente").val(id);
    $("#nombre_cliente").val(nombre);
    $("#telefono_cliente").val(telefono);
    $("#direccion_cliente").val(direccion);
    $("#email_cliente").val(email);
    $("#razon_social_cliente").val(razonsocial);
    $("#cuit_cliente").val(cuit);
    $("#condicion_iva_cliente").val(CondicionIva);
    edit = true;
    const buttonClose = document.getElementById("close");
    buttonClose.addEventListener("click", (e) => {
      e.preventDefault();
      $("#form-crear-cliente").trigger("reset");
    });
  });
  $(document).on("click", ".borrar", function (e) {
    let funcion = "borrar";
    const id = $(this).data("id");
    const nombre = $(this).data("nombre");
    const avatar = $(this).data("avatar");

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
        text: "No vas a ver mas este el cliente " + nombre + "!",
        imageUrl: "" + avatar + "",
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
            "../Controllers/ClienteController.php",
            { id, funcion },
            (response) => {
              edit == false;
              if (response == "borrado") {
                swalWithBootstrapButtons.fire(
                  "Borrado!",
                  "El cliente " + nombre + " fue borrado.",
                  "success"
                );
                obtener_cliente();
                buscar_cliente();
              } else {
                swalWithBootstrapButtons.fire(
                  "No se pudo borrar!",
                  "El cliente " +
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
            "Tu cliente " + nombre + " esta a salvo :)",
            "error"
          );
        }
      });
  });
  $(document).on("click", ".editar-buscar", (e) => {
    const id = $(this).data("id");
    const nombre = $(this).data("nombre");
    const telefono = $(this).data("telefono");
    const direccion = $(this).data("direccion");
    const email = $(this).data("email");
    const razonsocial = $(this).data("razonSocial");
    const cuit = $(this).data("cuit");
    const CondicionIva = $(this).data("condicionIva");

    $("#id_edit_cliente").val(id);
    $("#nombre_cliente").val(nombre);
    $("#telefono_cliente").val(telefono);
    $("#direccion_cliente").val(direccion);
    $("#email_cliente").val(email);
    $("#razon_social_cliente").val(razonsocial);
    $("#cuit_cliente").val(cuit);
    $("#condicion_iva_cliente").val(CondicionIva);
    edit = true;
    const buttonClose = document.getElementById("close");
    buttonClose.addEventListener("click", (e) => {
      e.preventDefault();
      $("#form-crear-cliente").trigger("reset");
    });
  });
  $(document).on("click", ".borrar-buscar", (e) => {
    let funcion = "borrar";
    const id = $(this).data("id");
    const nombre = $(this).data("nombre");
    const avatar = $(this).data("avatar");

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
        text: "No vas a ver mas este el cliente " + nombre + "!",
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
          $.post(
            "../Controllers/ClienteController.php",
            { id, funcion },
            (response) => {
              edit == false;
              if (response == "borrado") {
                swalWithBootstrapButtons.fire(
                  "Borrado!",
                  "El cliente " + nombre + " fue borrado.",
                  "success"
                );
                obtener_cliente();
                buscar_cliente();
              } else {
                swalWithBootstrapButtons.fire(
                  "No se pudo borrar!",
                  "El cliente " +
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
            "Tu cliente " + nombre + " esta a salvo :)",
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
