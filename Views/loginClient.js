$(document).ready(function () {
  //   verificar_sesion();
  toastr.options = {
    preventDuplicates: true,
  };

  $("#form-login").submit((e) => {
    e.preventDefault();
    let cuit = $("#dni").val();

    if (cuit.length < 11) {
      toastr.error("CUIT inválido", "Error");
      return;
    }

    $.post(
      "../Controllers/ClienteController.php",
      { funcion: "obtener_cliente_id", cuit },
      function (response) {
        let data = JSON.parse(response);
        if (data.alert === "isvalid") {
          // Cambia el input a Código OTP
          $(".form-group").html(`
                <label for="codigo" class="control-label">Código</label>
                <input type="text" id="codigo" name="codigo" class="form-control input">
            `);
          $("#btn-iniciar-sesion").hide();
          $("#btn-validar-codigo").show();

          // Enviar el código OTP
          $.post(
            "../Controllers/ClienteController.php",
            {
              funcion: "enviar_codigo",
              cuit,
            },
            function (response) {
              let result = JSON.parse(response);
              if (result.success) {
                toastr.success(result.success, "Exito");
              } else {
                toastr.error(result.error, "Error");
              }
            }
          );

          $("#btn-validar-codigo").click(() => {
            let codigo = $("#codigo").val();
            $.post(
              "../Controllers/UsuariosController.php",
              { funcion: "validar_codigo", cuit, codigo },
              function (response) {
                let result = JSON.parse(response);
                if (result.success) {
                  toastr.success(result.success, "Exito");
                  location.href = `../Views/seguimientoEnvios.php?token=${result.cliente_id}`; // Redirigir si es exitoso
                } else {
                  toastr.error("Código incorrecto", "Error");
                }
              }
            );
          });
        } else {
          toastr.error("CUIT no registrado", "Error");
        }
      }
    );
  });

  // Evento para validar código OTP

  //   async function verificar_sesion() {
  //     let funcion = "verificar_sesion";
  //     let data = await fetch("../Controllers/UsuariosController.php", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //       body: "funcion=" + funcion,
  //     });

  //     if (data.ok) {
  //       let response = await data.text();
  //       try {
  //         let respuesta = JSON.parse(response);
  //         if (respuesta.length != 0) {
  //           location.href = "../Views/dashboard.php";
  //         }
  //       } catch (error) {
  //         console.error(error);
  //         Swal.fire({
  //           icon: "error",
  //           title: "Error",
  //           text: "Hubo un problema con el sistema, contacte al administrador.",
  //         });
  //       }
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: data.statusText,
  //         text: "Hubo un problema de código: " + data.status,
  //       });
  //     }
  //   }
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
