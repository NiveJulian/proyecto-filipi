import {
  llenar_menu_superior,
  llenar_menu_lateral,
} from "./layouts/layouts.js";
import { allowedOrigins } from "../Util/config/allowed-options.js";

$(document).ready(function () {
  Loader("Cargando Datos");
  verificar_sesion();
  toastr.options = {
    preventDuplicates: true,
  };
  let currentStep = 0;
  let csrFilePath = ""; // Almacenar la ruta del CSR generado

  // Abrir modal
  $("#open-modal").on("click", function () {
    $("#integration-modal").modal("show");
    showStep(currentStep);
  });

  // Navegación entre pasos
  $(document).on("click", ".next-step", function () {
    if (validateStep(currentStep)) {
      currentStep++;
      showStep(currentStep);
    }
  });

  $(document).on("click", ".prev-step", function () {
    currentStep--;
    showStep(currentStep);
  });

  // Generar certificados
  $("#generate-certificates").on("click", async function () {
    const companyName = $("#company-name").val();
    const password = $("#password").val();
    const taxId = $("#tax-id").val();

    const formData = new FormData();
    formData.append("taxId", taxId);
    formData.append("username", taxId);
    formData.append("password", password);
    formData.append("alias", companyName);
    formData.append("companyName", companyName);

    try {
      const response = await fetch(
        `${allowedOrigins}/afip/generate-certificate`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.csrFilePath) {
        csrFilePath = response.csrFilePath; // Guardar la ruta del CSR
        $("#download-csr-link").attr("href", csrFilePath); // Actualizar el enlace de descarga
        currentStep++;
        showStep(currentStep);
      } else {
        alert("Error al generar los certificados");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al generar los certificados");
    }
  });

  // Subir certificado .crt
  $("#upload-crt-btn").on("click", function () {
    $("#upload-crt").click(); // Simular clic en el input de archivo
  });

  $("#upload-crt").on("change", async function (e) {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".crt")) {
      const formData = new FormData();
      formData.append("crtFile", file);

      try {
        const response = await $.ajax({
          url: "/afip/upload-certificate",
          method: "POST",
          data: formData,
          processData: false,
          contentType: false,
        });

        if (response.success) {
          alert("Certificado .crt subido correctamente.");
          currentStep++;
          showStep(currentStep);
        } else {
          alert("Error al subir el certificado .crt");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al subir el certificado .crt");
      }
    } else {
      alert("Por favor, selecciona un archivo .crt válido.");
    }
  });

  // Finalizar proceso
  $("#finish-process").on("click", function () {
    $("#integration-modal").modal("hide");
    alert("Proceso de integración completado");
  });

  // Mostrar el paso actual
  function showStep(stepIndex) {
    $(".step").hide(); // Oculta todos los pasos
    $(".step").eq(stepIndex).show(); // Muestra el paso actual
  }

  // Validar el paso actual
  function validateStep(stepIndex) {
    if (stepIndex === 0) {
      return $("#company-name").val().trim() !== "";
    } else if (stepIndex === 1) {
      return $("#tax-id").val().trim() !== "";
    }
    return true;
  }

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

  $("#registro_recibido").on("click", function () {
    window.location.href = "facturacion-recibido.php";
  });

  $("#registro_emitido").on("click", function () {
    window.location.href = "facturacion-emitido.php";
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
