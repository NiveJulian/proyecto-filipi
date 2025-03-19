$(document).ready(function () {
  verificar_sesion();
  toastr.options = {
    preventDuplicates: true,
  };
  $("#form-login").submit((e) => {
    e.preventDefault();
    let dni = $("#dni").val();
    let pass = $("#pass").val();
    if (dni.length >= 15 || pass.length >= 20) {
      toastr.error("Error al ingresar", "Error");
      return;
    }
    login(dni, pass);
  });
  async function login(dni, pass) {
    let funcion = "login";

    let data = await fetch("./Controllers/UsuariosController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion + "&&dni=" + dni + "&&pass=" + pass,
    });
    if (data.ok) {
      let response = await data.text();
      try {
        let respuesta = JSON.parse(response);
        if (respuesta.mensaje == "success") {
          toastr.success("Ingreso exitoso, redirigiendo...", "Exito");
          verificar_sesion();
        } else if (respuesta.mensaje == "error") {
          toastr.error("Contraseña o DNI incorrectos.", "Error!");
          $("#form-login").trigger("reset");
        }
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
        text: "hubo conflicto de codigo: " + data.status,
      });
    }
  }
  async function verificar_sesion() {
    let funcion = "verificar_sesion";
    let data = await fetch("./Controllers/UsuariosController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });
    if (data.ok) {
      let response = await data.text();
      try {
        let respuesta = JSON.parse(response);
        if (respuesta.length != 0) {
          localStorage.setItem("token", respuesta.token);

          const companyData = {
            id: respuesta.company_id,
            name: respuesta.company_name,
            logo: respuesta.company_logo,
            address: respuesta.company_address,
            email: respuesta.company_email,
            cuit: respuesta.company_cuit,
            billing: respuesta.company_billing,
            locality: respuesta.company_locality,
          };

          // Convertir el objeto a JSON y luego a Base64
          const companyDataString = JSON.stringify(companyData);
          const companyDataBase64 = btoa(companyDataString);

          // Guardar en localStorage (o sessionStorage si prefieres)
          localStorage.setItem("companyData", companyDataBase64);
          location.href = "./Views/dashboard.php";
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "hubo error al ingresar, pongase en contacto con el administrador",
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
});
