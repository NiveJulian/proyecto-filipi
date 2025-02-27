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

  async function verificar_sesion() {
    let funcion = "verificar_sesion_temp";
    let data = await fetch("../Controllers/UsuariosController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });
    if (data.ok) {
      let response = await data.text();
      try {
        let respuesta = JSON.parse(response);
        let permisos = "";
        if (respuesta.length !== 0) {
          llenar_menu_superior(respuesta);
          llenar_menu_lateral(respuesta, permisos);
          $(".brand-link").attr("href", "");
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

  function obtenerIdCliente() {
    let urlActual = window.location.href;
    let indiceId = urlActual.indexOf("?token=");
    if (indiceId !== -1) {
      return urlActual.substring(indiceId + 7);
    }
    return null;
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

  function obtenerEnvios() {
    let cliente_id = obtenerIdCliente();
    let funcion = "obtener_envios_cliente";
    $.post(
      "../Controllers/EnviosController.php",
      { funcion, cliente_id },
      (response) => {
        let envios = JSON.parse(response);
        let template = "";
        let lastDate = "";
        let lastClient = "";
        let countDate = 0;
        let countClient = 0;

        envios.forEach((envio) => {
          if (envio.fecha !== lastDate) {
            if (lastDate !== "") template += `</div></div>`;
            template += `
            <div class="time-label mt-4">
                <span class="bg-dark text-white p-2 rounded">${envio.fecha}</span>
                <button class="btn btn-sm btn-toggle btn-primary ms-2" data-toggle="collapse" data-target="#date-${countDate}" aria-expanded="true">
                    -
                </button>
            </div>
            <div id="date-${countDate}" class="collapse show">`;
            lastDate = envio.fecha;
            lastClient = "";
            countDate++;
          }

          if (envio.cliente_nombre !== lastClient) {
            if (lastClient !== "") template += `</div>`;
            template += `
            <div class="cliente-label mt-3">
                <span class="bg-primary text-white p-2 rounded">${envio.cliente_nombre}</span>
                <button class="btn btn-sm btn-toggle btn-warning ms-2" data-toggle="collapse" data-target="#cliente-${countClient}" aria-expanded="true">
                    -
                </button>
            </div>
            <div id="cliente-${countClient}" class="collapse show">`;
            lastClient = envio.cliente_nombre;
            countClient++;
          }

          let badgeClass = "bg-info";
          if (envio.estado === "Demorado") badgeClass = "bg-warning";
          if (envio.estado === "Cancelado") badgeClass = "bg-danger";
          if (envio.estado === "Entregado") badgeClass = "bg-success";
          if (envio.estado === "Pendiente de carga")
            badgeClass = "bg-light text-dark";

          template += `
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
            </div>
          </div>`;

          // Cerrar últimas etiquetas
        });

        template += `</div></div>`;
        $("#seguimiento_viajes").html(template);

        // Cargar documentos de cada envío
        envios.forEach((envio) => {
          obtenerDocumentos(envio.id);
        });

        // Manejar botones de toggle
        $(".btn-toggle").on("click", function () {
          let $button = $(this);
          let isExpanded = $button.attr("aria-expanded") === "true";
          $button.text(isExpanded ? "+" : "-");
        });

        // Eventos para subir documentación
        $(".btn-subir-doc").on("click", function () {
          let envioId = $(this).attr("data-id");
          $("#modal-subir-doc").modal("show");
          $("#envio-id-doc").val(envioId);
        });

        // Eventos para cambiar estado
        $(".btn-cambiar-estado").on("click", function () {
          let envioId = $(this).attr("data-id");
          $("#modal-cambiar-estado").modal("show");
          $("#envio-id-estado").val(envioId);
        });
      }
    );
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
});
