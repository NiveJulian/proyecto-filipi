import {
  llenar_menu_superior,
  llenar_menu_lateral,
} from "./layouts/layouts.js";

$(document).ready(function () {
  verificar_sesion();
  toastr.options = {
    preventDuplicates: true,
  };
  let edit = false;
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
          obtener_perfil(respuesta);
          obtener_info(respuesta);
        } else {
          location.href = "../";
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al verificar sesion",
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
  async function obtener_perfil(usuario) {
    if (usuario) {
      let template = `
      <div class="card-body box-profile">
          <div class="text-center">
              <img id="avatar2" src="${
                usuario.avatar
                  ? `../Util/img/${usuario.avatar}`
                  : "../Util/img/avatar1.svg"
              }" class="profile-user-img img-fluid img-circle p-4">
          </div>
          <div class="text-center m-1">
              <button 
              class="btn btn-primary btn-sm cambiar-avatar" 
              type="button" 
              data-id="${usuario.id}" 
              data-toggle="modal" 
              data-target="#cambiophoto">
                Cambiar perfil
              </button>
          </div>
          <input id="id_usuario" type="hidden">
          <h3 id="nombre_us" class="profile-username text-center text-success">${
            usuario.nombre
          }</h3>
          <p id="apellidos_us" class="text-muted text-center">${
            usuario.apellido ? usuario.apellido : ""
          }</p>
          <ul class="list-group list-group-unbordered mb-3">
              <li class="list-group-item">
                  <b class="text-primary">Edad</b>
                  <p id="edad_us" class="float-right">0</p>
              </li>
              <li class="list-group-item">
                  <b class="text-primary">DNI</b>
                  <p id="dni_us" class="float-right">${usuario.dni}</p>
              </li>
              <li class="list-group-item">
                  <b class="text-primary">Tipo de usuario</b>
                  <span id="us_tipo" class="float-rigth badge badge-warning">${
                    usuario.tipo
                  }</span>
              </li>
              <button 
              data-id="${usuario.id}" 
              data-toggle="modal" 
              data-target="#cambiarcontra" 
              type="button" 
              class="btn btn-block btn-outline-secondary btn-sm cambiar-pass">
                Cambiar contraseña
              </button>
          </ul>
      </div>
      `;
      $("#user-profile").html(template);
    } else {
      Swal.fire({
        icon: "error",
        title: data.statusText,
        text: "Hubo un conflicto de código. Contacte con el administrador",
      });
    }
  }
  async function obtener_info(usuario) {
    if (usuario) {
      let template = `
      <strong class="text-primary">
          <i class="fas fa-phone mr-1"></i>Telefono
      </strong>
      <p id="telefono_us" class="text-muted">${
        usuario.telefono ? usuario.telefono : ""
      }</p>
      <strong class="text-primary text-center">
          <i class="fas fa-map-marker-alt"></i>Localidad
      </strong>
      <p id="localidad_us" class="text-muted">${
        usuario.localidad ? usuario.localidad : ""
      }</p>
      <strong class="text-primary text-center">
          <i class="fas fa-at"></i>Correo
      </strong>
      <p id="correo_us" class="text-muted">${
        usuario.correo ? usuario.correo : ""
      }</p>
      <strong class="text-primary text-center">
          <i class="fas fa-smile-wink"></i>Sexo
      </strong>
      <p id="sexo_us" class="text-muted">${usuario.sexo ? usuario.sexo : ""}</p>
      
      <strong class="text-primary text-center">
        <i class="fas fa-pen"></i>Informacion Adicional
      </strong>
      <p id="adicional_us" class="text-muted">${
        usuario.adicional ? usuario.adicional : ""
      }</p>

      <button class="editar-usuario btn btn-block btn-danger" 
      idUser=${usuario.id}
      telefono=${usuario.telefono}
      localidad=${usuario.localidad}
      correo=${usuario.correo}
      sexo=${usuario.sexo}
      adicional=${usuario.adicional}
      >
      Editar
      </button>
      `;
      $("#info-user-profile").html(template);
    } else {
      Swal.fire({
        icon: "error",
        title: data.statusText,
        text: "Hubo un conflicto de código. Contacte con el administrador",
      });
    }
  }
  $(document).on("click", ".editar-usuario", (e) => {
    e.preventDefault();

    const elemento = $(this)[0].activeElement;
    let id_usuario = $(elemento).attr("idUser");
    let telefono = $(elemento).attr("telefono");
    let correo = $(elemento).attr("correo");
    let localidad = $(elemento).attr("localidad");
    let sexo = $(elemento).attr("sexo");
    let adicional = $(elemento).attr("adicional");

    $("#id_edit_usuario").val(id_usuario);
    $("#telefono").val(telefono);
    $("#localidad").val(localidad.length == 0 ? "" : localidad);
    $("#correo").val(correo.length == 0 ? "" : correo);
    $("#sexo").val(sexo.length == 0 ? "" : sexo);
    $("#adicional").val(adicional.length == 0 ? "" : adicional);
    edit = true;

    toastr.success("Edicion habilitada", "Exito!");
  });
  $(document).on("click", ".cambiar-pass", function () {
    let id_usuario = $(this).data("id");
    $("#id_user_pass").val(id_usuario);
  });
  $(document).on("click", ".cambiar-avatar", function () {
    let id_usuario = $(this).data("id");
    $("#id_user_profile").val(id_usuario);
  });
  $("#form-usuario-profile").submit((e) => {
    e.preventDefault();
    if (edit === true) {
      let id_usuario = $("#id_edit_usuario").val();
      let telefono = $("#telefono").val();
      let localidad = $("#localidad").val();
      let correo = $("#correo").val();
      let sexo = $("#sexo").val();
      let adicional = $("#adicional").val();
      let funcion = "editar_usuario";
      $.post(
        "../Controllers/UsuariosController.php",
        { id_usuario, funcion, telefono, localidad, correo, sexo, adicional },
        (response) => {
          if (response == "editado") {
            toastr.success("Datos editados exitosamente", "Exito!");
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
            $("#form-usuario").trigger("reset");
          }
          if (response == "noeditado") {
            toastr.error(
              "No se pudieron actualizar exitosamente los datos",
              "Error"
            );
            $("#form-usuario").trigger("reset");
          }
          edit = false;
        }
      );
    } else {
      toastr.error(
        "Edicion Desabilitada, habilitela haciendo click en Editar mas abajo",
        "Error"
      );
      $("#form-usuario").trigger("reset");
    }
  });
  $("#form-pass").submit((e) => {
    e.preventDefault();
    let id_usuario = $("#id_user_pass").val();

    let oldpass = $("#oldpass").val();
    let newpass = $("#newpass").val();
    let funcion = "cambiar_contra";
    $.post(
      "../Controllers/UsuariosController.php",
      { id_usuario, funcion, oldpass, newpass },
      (response) => {
        if (response == "update") {
          toastr.success("Tu contraseña se actualizó correctamente.", "Exito!");
          $("#form-pass").trigger("reset");
        } else {
          toastr.error(
            "Tu contraseña no pudo actualizarse correctamente",
            "Error"
          );
          $("#form-pass").trigger("reset");
        }
      }
    );
  });
  $("#form-photo").submit((e) => {
    e.preventDefault(); // Evita recarga de página

    let formData = new FormData($("#form-photo")[0]);

    $.ajax({
      url: "../Controllers/UsuariosController.php",
      type: "POST",
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
      success: function (response) {
        try {
          const json = JSON.parse(response);
          if (json.alert === "edit") {
            toastr.success("Perfil actualizado correctamente", "Éxito!");
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
          } else {
            toastr.error(
              "No se pudo actualizar correctamente el perfil",
              "Error"
            );
          }
        } catch (e) {
          console.log({ error: e.massage });
          toastr.error("Error en el servidor", "Error");
        }

        // Limpiar formulario y actualizar datos
        $("#form-photo").trigger("reset");
        verificar_sesion();
      },
      error: function (xhr, status, error) {
        toastr.error(
          "Error en el servidor, comunicate con un administrador",
          "Error"
        );
      },
    });
  });
});
