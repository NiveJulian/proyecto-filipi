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
        console.log(respuesta);
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
                usuario.company_logo
                  ? `../Util/img/${usuario.company_logo}`
                  : "../Util/img/avatar1.svg"
              }" class="profile-user-img img-fluid img-circle p-4">
          </div>
          <div class="text-center m-1">
              <button 
              class="btn btn-primary btn-sm cambiar-avatar" 
              type="button" 
              data-id="${usuario.company_id}" 
              data-toggle="modal" 
              data-target="#cambiophoto">
                Cambiar perfil
              </button>
          </div>
          <input id="id_usuario" type="hidden">
          <h3 id="nombre_us" class="profile-username text-center text-success">
          CUIT: ${usuario.company_cuit}
          </h3>
      </div>
      `;
      $("#empresa-profile").html(template);
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
        <strong class="text-secondary">
            <i class="fa-solid fa-envelope mr-1"></i>Email
        </strong>
        <p id="email_us" class="text-muted">${
          usuario.company_email ? usuario.company_email : ""
        }</p>

        <strong class="text-secondary">
            <i class="fa-solid fa-location-dot mr-1"></i>Localidad
        </strong>
        <p id="locality_us" class="text-muted">${
          usuario.company_locality ? usuario.company_locality : ""
        }</p>

        <strong class="text-secondary">
            <i class="fa-solid fa-address-card mr-1"></i>Direccion
        </strong>
        <p id="address_us" class="text-muted">${
          usuario.company_address ? usuario.company_address : ""
        }</p>

        <button class="editar-usuario btn btn-block btn-danger" 
            data-id-user="${usuario.company_id}"
            data-company-name="${usuario.company_name}"
            data-company-email="${usuario.company_email}"
            data-company-locality="${usuario.company_locality}"
            data-company-address="${usuario.company_address}"
            data-company-cuit="${usuario.company_cuit}"
        >
            Editar
        </button>
        `;
      $("#info-empresa-profile").html(template);
    } else {
      Swal.fire({
        icon: "error",
        title: data.statusText,
        text: "Hubo un conflicto de código. Contacte con el administrador",
      });
    }
  }
  $(document).on("click", ".editar-usuario", function (e) {
    e.preventDefault();

    // Obtener los valores usando .data()
    let id_usuario = $(this).data("id-user");
    let company_name = $(this).data("company-name");
    let company_email = $(this).data("company-email");
    let company_locality = $(this).data("company-locality");
    let company_address = $(this).data("company-address");
    let company_cuit = $(this).data("company-cuit");

    // Llenar el formulario de edición
    $("#id_empresa").val(id_usuario);
    $("#razon-social").val(company_name);
    $("#cuit").val(company_cuit.length == 0 ? "" : company_cuit);
    $("#direccion").val(company_address);
    $("#localidad").val(company_locality);
    $("#correo").val(company_email.length == 0 ? "" : company_email);
    edit = true;

    toastr.success("Edición habilitada", "Éxito!");
  });
  $(document).on("click", ".cambiar-pass", function () {
    let id_usuario = $(this).data("id");
    $("#id_user_pass").val(id_usuario);
  });
  $(document).on("click", ".cambiar-avatar", function () {
    let id_usuario = $(this).data("id");
    $("#id_user_profile").val(id_usuario);
  });
  $("#form-empresa-profile").submit((e) => {
    e.preventDefault();
    if (edit === true) {
      let id_usuario = $("#id_empresa").val();
      let name = $("#razon-social").val();
      let cuit = $("#cuit").val();
      let address = $("#direccion").val();
      let email = $("#correo").val();
      let locality = $("#localidad").val();
      let funcion = "editar_compania";

      $.post(
        "../Controllers/UsuariosController.php",
        {
          id_usuario,
          funcion,
          name,
          cuit,
          address,
          email,
          locality,
        },
        (response) => {
          if (response == "editado") {
            toastr.success("Datos editados exitosamente", "Éxito!");
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
            $("#form-empresa-profile").trigger("reset"); // Corregido el ID del formulario
          } else {
            toastr.error("No se pudieron actualizar los datos", "Error");
            $("#form-empresa-profile").trigger("reset"); // Corregido el ID del formulario
          }
          edit = false;
        }
      );
    } else {
      toastr.error(
        "Edición deshabilitada, habilítela haciendo clic en Editar más abajo",
        "Error"
      );
      $("#form-empresa-profile").trigger("reset"); // Corregido el ID del formulario
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
