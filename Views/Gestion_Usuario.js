import {
  llenar_menu_superior,
  llenar_menu_lateral,
} from "./layouts/layouts.js";

$(document).ready(function () {
  verificar_sesion();
  toastr.options = {
    preventDuplicates: true,
  };
  $('[data-toggle="tooltip"]').tooltip();

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
          buscar_datos();
          rellenar_roles();
        } else {
          location.href = "../";
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

  function buscar_datos(consulta) {
    let funcion = "buscar_usuarios_adm";
    $.post(
      "../Controllers/UsuariosController.php",
      { consulta, funcion },
      (response) => {
        const usuarios = JSON.parse(response);
        let template = "";
        usuarios.forEach((usuario) => {
          template += `
                <div usuarioId="${usuario.id}" class="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column">
                    <div class="card bg-light d-flex flex-fill">
                        <div class="card-header text-muted border-bottom-0">`;
          if (usuario.tipo_usuario == 3) {
            template += `<h1 class="badge badge-danger">${usuario.tipo}</h1>`;
          }
          if (usuario.tipo_usuario == 2) {
            template += `<h1 class="badge badge-warning">${usuario.tipo}</h1>`;
          }
          if (usuario.tipo_usuario == 1) {
            template += `<h1 class="badge badge-info">${usuario.tipo}</h1>`;
          }
          let telefono = "";
          if (usuario.telefono == null || usuario.telefono == "") {
            telefono = `<b class="badge badge-secondary">Sin telefono registrado</b>`;
          } else {
            telefono = usuario.telefono;
          }
          template += `
                      </div>
                      <div class="card-body pt-0">
                          <div class="row">
                              <div class="col-7">
                                  <h2 class="lead"><b>${usuario.nombre}</b></h2>
                                      <p class="text-muted text-sm"><b>Rol: </b> ${
                                        usuario.tipo
                                      } </p>
                              <ul class="ml-4 mb-0 fa-ul">
                                  <li class="small m-1"><span class="fa-li"><i class="fas fa-lg fa-id-card"></i></span>  ${
                                    usuario.dni ? usuario.dni : ""
                                  }</li>
                                  <li class="small m-1"><span class="fa-li"><i class="fas fa-lg fa-at"></i></span> Correo: ${
                                    usuario.correo ? usuario.correo : ""
                                  }</li>
                                  <li class="small m-1"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span> Phone #: ${
                                    telefono ? telefono : ""
                                  }</li>
                              </ul>
                              </div>
                                  <div class="col-5 text-center">
                                  <img src="${
                                    usuario.avatar
                                  }" alt="user-avatar" class="img-circle img-fluid">
                              </div>
                          </div>
                      </div>
                      <div class="card-footer">`;
          if (usuario.tipo_usuario == 1) {
            if (usuario.tipo_usuario !== 1) {
              template += `<button class="borrar-usuario btn btn-danger" type="button" data-toggle="modal" data-target="#confirmar">Eliminar</button>`;
            }
          } else {
            if (usuario.tipo_usuario !== 1) {
              template += `<button class="borrar-usuario btn btn-danger" type="button" data-toggle="modal" data-target="#confirmar">Eliminar</button>`;
            }
          }
          template += `</div>
                    </div>
                </div>`;
        });
        $("#usuarios").html(template);
      }
    );
  }

  function rellenar_roles() {
    let funcion = "rellenar_roles";
    $.post("../Controllers/UsuariosController.php", { funcion }, (response) => {
      let roles = JSON.parse(response);
      let template = "";

      $("#asignar_rol").empty();

      roles.forEach((rol) => {
        template += `
                        <option value="${rol.id}">${rol.nombre}</option>
                    `;
      });
      $("#asignar_rol").html(template);
    });
  }

  $(document).on("keyup", "#buscar", function () {
    let valor = $(this).val();
    if (valor != "") {
      buscar_datos(valor);
    } else {
      buscar_datos();
    }
  });

  $("#form-crear").submit((e) => {
    e.preventDefault();

    let id = $("#id_edit_prod").val();
    let nombre = $("#nombre").val().trim();
    let apellido = $("#apellido").val().trim();
    let correo = $("#correo").val().trim();
    let telefono = $("#telefono").val().trim();
    let dni = $("#dni").val().trim();
    let pass = $("#pass").val().trim();
    let tipo = $("#asignar_rol").val().trim();
    let funcion = "crear_usuario";

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let soloNumeros = /^[0-9]+$/;

    if (
      nombre === "" ||
      apellido === "" ||
      correo === "" ||
      telefono === "" ||
      dni === "" ||
      pass === ""
    ) {
      toastr.warning("Todos los campos son obligatorios", "Atención!");
      return;
    }

    if (!emailRegex.test(correo)) {
      toastr.error("Ingrese un correo válido", "Error!");
      return;
    }

    if (nombre.length >= 30) {
      toastr.error("El nombre debe contener menos de 30 dígitos", "Error!");
      return;
    }

    if (apellido.length >= 30) {
      toastr.error("El apellido debe contener menos de 30 dígitos", "Error!");
      return;
    }

    if (!soloNumeros.test(telefono) || telefono.length < 8) {
      toastr.error(
        "El teléfono debe contener al menos 8 dígitos y solo números",
        "Error!"
      );
      return;
    }

    if (!soloNumeros.test(dni) || dni.length < 7 || dni.length > 10) {
      toastr.error("El DNI debe contener entre 7 y 10 dígitos", "Error!");
      return;
    }

    if (pass.length < 6) {
      toastr.error("La contraseña debe tener al menos 6 caracteres", "Error!");
      return;
    }

    $.post(
      "../Controllers/UsuariosController.php",
      { funcion, id, nombre, apellido, correo, telefono, dni, pass, tipo },
      (response) => {
        if (response == "add") {
          buscar_datos();
          toastr.success(
            "Usuario " +
              nombre +
              " con DNI #" +
              dni +
              " agregado correctamente",
            "Éxito!"
          );
          $("#form-crear").trigger("reset");
        } else {
          toastr.error(
            "El usuario no se pudo añadir o ya fue agregado",
            "Error!"
          );
        }
      }
    );
  });

  $("#form-crear-rol").on("submit", function (e) {
    e.preventDefault();

    let nombreRol = $("#rol_name").val();
    let modulos = [];

    $("input[name='modulos[]']:checked").each(function () {
      modulos.push($(this).val());
    });

    if (!nombreRol || modulos.length === 0) {
      toastr.info(
        "Por favor, ingresa un nombre de rol y selecciona al menos un módulo.",
        "Info"
      );
      return;
    }

    let datos = {
      funcion: "crear_rol",
      nombre_rol: nombreRol,
      modulos: modulos,
    };

    $.ajax({
      url: "../Controllers/UsuariosController.php",
      type: "POST",
      data: datos,
      success: function (response) {
        let respuesta = JSON.parse(response);

        if (respuesta.status === "success") {
          toastr.success("Rol creado correctamente.", "Exito");
          $("#form-crear-rol")[0].reset();
          $("#crear-rol").modal("hide");
        } else {
          toastr.error("Error al crear el rol: " + respuesta.message, "Error");
        }
      },
      error: function (xhr, status, error) {
        alert("Ocurrió un error al enviar los datos: " + error);
      },
    });
  });

  $(document).on("click", ".borrar-usuario", (e) => {
    const elemento =
      $(this)[0].activeElement.parentElement.parentElement.parentElement;
    const id = $(elemento).attr("usuarioId");
    let funcion = "borrar_usuario";

    $("#id_user").val(id);
    $("#funcion").val(funcion);
    e.preventDefault();
  });

  $("#form-confirmar").submit((e) => {
    let pass = $("#oldpass").val();
    let id_usuario = $("#id_user").val();
    let funcion = $("#funcion").val();
    $.post(
      "../Controllers/UsuariosController.php",
      { pass, id_usuario, funcion },
      (response) => {
        if (response == "borrado") {
          toastr.success("Usuario fue borrado", "Exito!");
          $("#form-confirmar").trigger("reset");
        } else {
          toastr.error("Contraseña incorrecta", "Error!");
          $("#form-confirmar").trigger("reset");
        }
        e.preventDefault();
      }
    );
  });

  $("#crearusuario").on("shown.bs.modal", function () {
    rellenar_roles();
  });
});
