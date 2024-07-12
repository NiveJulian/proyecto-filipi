$(document).ready(function () {
  Loader("Cargando Datos");
  verificar_sesion();
  toastr.options = {
    preventDuplicates: true,
  };
  let edit = false;
  let mantenimientoCount = 1;

  function llenar_menu_superior(usuario){
    let template = `
    <ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
        </li>
        <li class="nav-item d-none d-sm-inline-block">
            <a href="/filippi/Views/catalogo.php" class="nav-link">Inicio</a>
        </li>
    </ul>
    <ul class="navbar-nav ml-auto">
        <!-- Notifications Dropdown Menu -->
        <li class="nav-item dropdown">
            <a class="nav-link" id="count-vehicles" data-toggle="dropdown" href="#">
                <i class="far fa-bell"></i>
                <span class="badge badge-danger navbar-badge product-quantity"></span>
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <span class="dropdown-item dropdown-header">Hay <span class="product-quantity"></span> vehículo(s) por vencer pagos</span>
                <div id="notifications" class="list-group"></div>
                <a href="#" class="dropdown-item dropdown-footer">Cerrar Notificaciones</a>
            </div>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link" data-toggle="dropdown" href="#">
                <img src="/filippi/Util/img/avatar1.svg" class="img-profile rounded-circle" width="30" heigth="30">
                <span></span>
            </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <span class="dropdown-item dropdown-header"></span>
                
                <div class="dropdown-divider"></div>
                    <a href="/filippi/Controllers/Logout.php" class="dropdown-item text-center bg-danger">
                        <i class="fas fa-power-off mr-2"></i>Cerrar Sesion</a>
                <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item dropdown-footer"></a>
        </div>
        </li>
    </ul>
    `;
    $('#menu_superior').html(template);
}
function llenar_menu_lateral(usuario){
    let template = `
    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
            <img src="/filippi/Util/img/avatar1.svg" class="img-profile rounded-circle" width="30" heigth="30">
            </div>
            <div class="info">
                <a href="/filippi/Views/catalogo.php" class="d-block">${usuario.nombre}</a>
            </div>+
    </div>
<!-- Sidebar Menu -->
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            
                <li class="nav-header">Usuario</li>
                <li class="nav-item" id="gestion_usuario">
                    <a href="/filippi/Views/Gestion_usuario.php" class="nav-link">
                    <i class="nav-icon fas fa-tags fa-lg"></i>
                    <p>
                        Gestion Usuario
                        <span class="badge badge-info right"></span>
                    </p>
                    </a>
                </li>

                <li class="nav-header">Datos</li>

                <li class="nav-item">
                    <a href="/filippi/Views/catalogo.php" class="nav-link">
                    <i class="nav-icon fas fas fa-tractor"></i>
                    <p>
                        Vehiculos
                        <span class="badge badge-info right"></span>
                    </p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/filippi/Views/personal.php" class="nav-link">
                    <i class="nav-icon fas fa-user-tie"></i>
                    <p>
                        Personal
                        <span class="badge badge-info right">Nuevo</span>
                    </p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/filippi/Views/atributo.php" class="nav-link">
                    <i class="nav-icon fas fa-building"></i>
                    <p>
                        Clientes y Proveedores
                        <span class="badge badge-info right"></span>
                    </p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/filippi/Views/facturacion.php" class="nav-link">
                    <i class="nav-icon fas fa-file-invoice-dollar"></i>
                    <p>
                        Faturacion
                        <span class="badge badge-info right"></span>
                    </p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/filippi/Views/controlSalida.php" class="nav-link">
                    <i class="nav-icon fas fa-parking"></i>
                    <p>
                        Patio
                        <span class="badge badge-info right"></span>
                    </p>
                    </a>
                </li>
            </ul>
        </nav>
    `;
    $('#menu_lateral').html(template);
}
  // FIN LAYOUTS

  // VERIFICACIONES
  async function verificar_sesion() {
    let funcion = "verificar_sesion";
    let data = await fetch("/filippi/Controllers/UsuariosController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });
    if (data.ok) {
      let response = await data.text();
      try {
        let respuesta = JSON.parse(response);
        if (respuesta.length !== 0) {
          llenar_menu_superior();
          llenar_menu_lateral(respuesta);
          $("#gestion_usuario").show();
          $("#gestion_catalogo").show();
          $("#gestion_ventas").show();
          $("#gestion_lotes").show();
          $("#gestion_pedidos").show();
          $(".nav-header").show();
          $("#cat-carrito").show();
          $("#content_admin").show();
          obtener_vehiculos();
          obtener_tabla_combustible();
          obtener_historicos();
          seguimientoDeService();
          CloseLoader();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Usuario no puede ingresar",
          });
          location.href = "/filippi/index.php";
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
  //

  function formatearFecha(fecha) {
    if (!fecha || fecha === "0000-00-00" || isNaN(new Date(fecha).getTime())) {
      return null; // Devolver null en lugar de cadena vacía ""
    }

    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate().toString().padStart(2, "0"); // Asegura que el día tenga 2 dígitos
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, "0"); // Asegura que el mes tenga 2 dígitos
    const anio = fechaObj.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }
  function obtenerIdVehiculo() {
    let urlActual = window.location.href;
    let indiceId = urlActual.indexOf("?id=");
    if (indiceId !== -1) {
      return urlActual.substring(indiceId + 4);
    }
    return null; // Retornar null si no se encuentra el ID del vehículo en la URL
  }

  //CONSUMO
  $("#form-control-combustible").submit((e) => {
    e.preventDefault();
    let urlActual = window.location.href;
    let indiceId = urlActual.indexOf("?id=");
    if (indiceId !== -1) {
      let idVehiculo = urlActual.substring(indiceId + 4);
      let horas = $("#horas").val();
      let idConsumo = $("#id_consumo_edit").val();
      let lugar_trabajo = $("#lugar_trabajo").val();
      let aceite_motor = $("#aceite_motor").val();
      let aceite_hidraulico = $("#aceite_hidraulico").val();
      let aceite_transmision = $("#aceite_transmision").val();
      let cantidadCombustible = $("#cantidad_combustible").val();
      const mantenimiento = $('input[name="mantenimiento[]"]')
        .map(function () {
          return $(this).val();
        })
        .get();

      let fechaRegistro = $("#fecha_asignada").val();
      let funcion = ""

      if (edit == true) {
        funcion = "editar_consumo";
      }else{
        funcion = "registrar_consumo";
      }

      $.post(
        "../../Controllers/vehiculosController.php",
        {
          funcion,
          idVehiculo,
          idConsumo,
          horas,
          lugar_trabajo,
          aceite_hidraulico,
          aceite_motor,
          aceite_transmision,
          cantidadCombustible,
          mantenimiento,
          fechaRegistro,
        },
        (response) => {
          if (response == "add") {
            obtener_tabla_combustible();
            toastr.success(
              "Se registro con exito el consumo del vehiculo",
              "Éxito"
            );
            $("#form-control-combustible").trigger("reset");
          } 
          else if(response == 'edit') {
            toastr.success(
              "Se editó con exito los datos de consumo del vehiculo",
              "Éxito"
            );
            obtener_tabla_combustible()
            $("#form-control-combustible").trigger("reset");
          }else {
            toastr.error(
              "No se ha podido registrar con exito el consumo del vehiculo",
              "Error"
            );
            $("#form-control-combustible").trigger("reset");
          }
        }
      );
    }
  });
  $("#mantenimiento-container").on("click", ".agregar-mantenimiento", (e) => {
    e.preventDefault();
    mantenimientoCount++;
    const newMantenimientoField = `
          <div class="input-group mb-2">
              <input type="text" class="form-control mr-1" name="mantenimiento[]" placeholder="Ingresar mantenimiento">
              <div class="input-group-append">
                  <button class="btn btn-danger ml-1 eliminar-mantenimiento" type="button">Eliminar</button>
              </div>
          </div>
      `;

    $("#mantenimiento-container").append(newMantenimientoField);
  });
  $("#mantenimiento-container").on("click", ".eliminar-mantenimiento", (e) => {
    if (mantenimientoCount > 1) {
      mantenimientoCount--;
      $(e.target).closest(".input-group").remove();
    }
  });

  $("#consumo_aceite").on("click", function (e) {
    e.preventDefault(); // Evitar el comportamiento predeterminado de envío de formulario

    // Obtener los valores de los campos de entrada
    let fechaDesde = $("#fecha_desde_aceites").val();
    let fechaHasta = $("#fecha_hasta_aceites").val();
    let idVehiculo = obtenerIdVehiculo();

    // Configurar los datos para la solicitud AJAX
    let datos = {
      funcion: "calcularConsumoDeAceite",
      id: idVehiculo,
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
    };

    // Realizar la solicitud AJAX
    $.ajax({
      url: "../../Controllers/vehiculosController.php",
      method: "POST",
      data: datos,
      dataType: "json",
      success: function (response) {
        console.log(response);
        $("#total_aceites").empty();

        if (
          response.total_aceite_motor !== undefined &&
          response.total_aceite_hidraulico !== undefined &&
          response.total_aceite_transmision !== undefined ||
          response.total_aceite_motor !== null &&
          response.total_aceite_hidraulico !== null &&
          response.total_aceite_transmision !== null
        ) {
          // Mostrar el total de aceites en el elemento con ID 'total_aceites'
          let detallesAceites = `
                    <li><b>Aceite de Motor</b>:<br> ${response.total_aceite_motor.toFixed(
                      2
                    )} litros</li>
                    <li><b>Aceite Hidráulico</b>: <br>${response.total_aceite_hidraulico.toFixed(
                      2
                    )} litros</li>
                    <li><b>Aceite de Transmisión</b>: <br> ${response.total_aceite_transmision.toFixed(
                      2
                    )} litros</li>
                `;
          $("#total_aceites").html(detallesAceites);
        } else {
          toastr.error(
            "El rango de fecha no existe. No se pudo obtener los datos necesarios para calcular el consumo por rango de fecha",
            "Error"
          );
          $("#fecha_desde").trigger("reset");
          $("#fecha_hasta").trigger("reset");
        }
      },
      error: function (error) {
        console.error("Error en la solicitud AJAX:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema con la solicitud, por favor intenta nuevamente.",
        });
      },
    });
  });
  $("#consumo_fecha").on("click", function (e) {
    e.preventDefault(); // Evitar el comportamiento predeterminado de envío de formulario

    // Obtener los valores de los campos de entrada
    let fechaDesde = $("#fecha_desde").val();
    let fechaHasta = $("#fecha_hasta").val();
    let idVehiculo = obtenerIdVehiculo();

    // Configurar los datos para la solicitud AJAX
    let datos = {
      funcion: "calcularConsumoPorFecha",
      id: idVehiculo,
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
    };

    // Realizar la solicitud AJAX
    $.ajax({
      url: "../../Controllers/vehiculosController.php",
      method: "POST",
      data: datos,
      dataType: "json",
      success: function (response) {
        console.log(response);
        if (
          response.total_consumo !== undefined &&
          response.total_horas !== undefined ||
          response.total_consumo !== null &&
          response.total_horas !== null ||
          response.total_consumo.length >= 0 &&
          response.total_horas.length >= 0
        ) {
          // Calcular el consumo por hora
          var consumoPorHora = response.total_consumo / response.total_horas;
          console.log(consumoPorHora)
        
          $("#total_calc_fecha").text(consumoPorHora.toFixed(2));
        } else {
          toastr.error(
            "El rango de fecha no existe. No se pudo obtener los datos necesarios para calcular el consumo por hora",
            "Error"
          );
          $("#fecha_desde").trigger("reset");
          $("#fecha_hasta").trigger("reset");
        }
      },
      error: function (error) {
        console.log(error);
        console.error("Error en la solicitud AJAX:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema con la solicitud, por favor intenta nuevamente.",
        });
      },
    });
  });
  async function obtener_historicos() {
    let funcion = "obtener_historicos";
    let urlActual = window.location.href;
    let indiceId = urlActual.indexOf("?id=");
    if (indiceId !== -1) {
      let id = urlActual.substring(indiceId + 4);
      let data = await fetch("../../Controllers/vehiculosController.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "funcion=" + funcion + "&id=" + id,
      });
      data;
      if (data.ok) {
        let response = await data.text();
        try {
          let resumen = JSON.parse(response);
          template = resumen.total_litros / resumen.total_horas;
          if (!resumen.total_litros || !resumen.total_horas) {
            return 0;
          } else {
            $("#historial_horas").text(resumen.total_horas);
            $("#hist_litros_comb").text(resumen.total_litros);
            $("#total_historico").html(template);
          }
        } catch (error) {
          console.error(error);
          console.log(response);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un conflicto en el sistema, póngase en contacto con el administrador",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: data.statusText,
          text: "Hubo conflicto de código: " + data.status,
        });
      }
    } else {
      console.log("Error Govir");
    }
  }
  async function seguimientoDeService() {
    let funcion = "seguimientoDeService";
    let urlActual = window.location.href;
    let indiceId = urlActual.indexOf("?id=");

    if (indiceId !== -1) {
      let id = urlActual.substring(indiceId + 4);
      let response = await fetch("../../Controllers/vehiculosController.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `funcion=${funcion}&id=${id}`,
      });

      if (response.ok) {
        let data = await response.json();

        if (data.ultima_hora && data.prox_servis) {
          $("#ultimo_service").text(data.ultima_hora + " Hrs");
          $("#prox_service").text(data.prox_servis + " Hrs");
        } else {
          Swal.fire({
            icon: "info",
            title: "Informacion importante",
            text: "Realiza un registro para obtener los calculos correspondientes",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: response.statusText,
          text: "Hubo un conflicto de código: " + response.status,
        });
      }
    } else {
      throw new Error(
        "Hubo un error. Póngase en contacto con el administrador."
      );
    }
  }

  async function obtener_vehiculos() {
    let funcion = "obtener_comsumos";
    let urlActual = window.location.href;
    let indiceId = urlActual.indexOf("?id=");
    if (indiceId !== -1) {
      let id = urlActual.substring(indiceId + 4);
      let data = await fetch("../../Controllers/vehiculosController.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "funcion=" + funcion + "&id=" + id,
      });
      if (data.ok) {
        let response = await data.text();
        try {
          let vehiculo = JSON.parse(response);
          let template = "";
          template += `<img src='../../Util/img/vehiculos/${vehiculo.tipo_nombre}.jpeg' style="width: 50px; heigth: 50px;"/> `;

          $("#vehiculo_info").html(template);
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un conflicto en el sistema. Por favor, póngase en contacto con el administrador.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: data.statusText,
          text: "Hubo un conflicto de código: " + data.status,
        });
      }
    }
  }
  async function obtener_tabla_combustible() {
    let funcion = "obtener_calculos";
    let urlActual = window.location.href;
    let indiceId = urlActual.indexOf("?id=");
    if (indiceId !== -1) {
      let id = urlActual.substring(indiceId + 4);
      let data = await fetch("../../Controllers/vehiculosController.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "funcion=" + funcion + "&id=" + id,
      });
      if (data.ok) {
        let response = await data.text();

        try {
          let resumen = JSON.parse(response);
          // resumen = resumen.map((item) => {
          //   item.fecha = formatearFecha(item.fecha);
          //   return item;
          // });
          $("#consumo_vehiculos").DataTable({
            data: resumen,
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
              { data: "fecha" },
              { data: "horas" },
              { data: "trabajo" },
              { data: "diferencia_horas" },
              { data: "cantidad" },
              {
                data: "aceite_motor",
                render: function (data, type, row) {
                  return data === "0" ? "" : data; // Si el valor es "0", muestra una cadena vacía, de lo contrario muestra el valor
                },
              },
              {
                data: "aceite_hidraulico",
                render: function (data, type, row) {
                  return data === "0" ? "" : data; // Si el valor es "0", muestra una cadena vacía, de lo contrario muestra el valor
                },
              },
              {
                data: "aceite_transmision",
                render: function (data, type, row) {
                  return data === "0" ? "" : data; // Si el valor es 0, muestra una cadena vacía, de lo contrario muestra el valor
                },
              },
              { data: "mantenimiento" },
              {
                data: null,
                render: function (data, type, row, meta) {
                  return `
                        <button class="editar btn btn-success btn-sm" 
                                data-id="${row.id}" 
                                data-fecha="${row.fecha}" 
                                data-trabajo="${row.trabajo}" 
                                data-horas="${row.horas}" 
                                data-diferencia="${row.diferencia_horas}" 
                                data-cantidad="${row.cantidad}" 
                                data-motor="${row.aceite_motor}" 
                                data-hidraulico="${row.aceite_hidraulico}" 
                                data-transmision="${row.aceite_transmision}" 
                                data-mantenimiento="${row.mantenimiento}" 
                                ype="button"
                                type="button" data-toggle="modal" data-target="#crear_consumo">
                            <i class="fas fa-pencil" style="color: white;"></i>
                        </button>
                        <button class="anular btn btn-danger btn-sm" 
                                data-id="${row.id}" 
                                type="button">
                            <i class="fas fa-times" style="color:white;"></i>
                        </button>
                    `;
                },
              },
            ],
            language: espanol,
            destroy: true,
          });
        } catch (error) {
          console.error(error);
          console.log(response);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un conflicto en el sistema, póngase en contacto con el administrador",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: data.statusText,
          text: "Hubo conflicto de código: " + data.status,
        });
      }
    } else {
      console.log("Error");
    }
  }
  $("#consumo_vehiculos tbody").on("click", ".editar", function () {
    let id = $(this).data("id");
    let fecha = $(this).data("fecha");
    let horas = $(this).data("horas");
    let trabajo = $(this).data("trabajo");
    let cantidad = $(this).data("cantidad");
    let motor = $(this).data("motor");
    let hidraulico = $(this).data("hidraulico");
    let transmision = $(this).data("transmision");
    let mantenimiento = $(this).data("mantenimiento");

    $("#id_consumo_edit").val(id);
    $("#horas").val(horas);
    $("#lugar_trabajo").val(trabajo);
    $("#aceite_motor").val(motor);
    $("#aceite_hidraulico").val(hidraulico);
    $("#aceite_transmision").val(transmision);
    $("#cantidad_combustible").val(cantidad);
    $('input[name="mantenimiento[]"]')
      .map(function () {
        return $(this).val(mantenimiento);
      })
      .get();

    $("#fecha_asignada").val(fecha);

    edit = true;
  });
  $("#consumo_vehiculos tbody").on("click", ".anular", function () {
    // Realiza una solicitud al controlador PHP para obtener el HTML
    // Puedes usar AJAX para esto
    let idConsumo = $(this).data("id");

    let funcion = "anular_consumo";
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
        text: "No vas a ver mas los datos del registro N°" + idConsumo,
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
            "../../Controllers/vehiculosController.php",
            { idConsumo, funcion },
            (response) => {
              if (response.includes("anulado")) {
                swalWithBootstrapButtons.fire(
                  "Borrado!",
                  "El consumo N°" + idConsumo + " fue anulado. Se encotrará inactivo en la base de datos, comuniquese con su desarrollador para revertir la situacion",
                  "success"
                );
                obtener_tabla_combustible();
              } else {
                swalWithBootstrapButtons.fire(
                  "No se pudo borrar!",
                  "El consumo N°" + idConsumo + " no fue anulado.",
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
