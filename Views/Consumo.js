$(document).ready(function () {
  Loader("Cargando Datos");
  verificar_sesion();
  toastr.options = {
    preventDuplicates: true,
  };
  let edit = false;
  let mantenimientoCount = 1;

  function llenar_menu_superior(usuario) {
    let template = `
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                    </li>
                </ul>
                <ul class="navbar-nav ml-auto">
                    <!-- Notifications Dropdown Menu -->
                    <!-- <li class="nav-item dropdown">
                        <a class="nav-link" id="count-vehicles" data-toggle="dropdown" href="#">
                            <i class="far fa-bell"></i>
                            <span class="badge badge-danger navbar-badge product-quantity"></span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                            <span class="dropdown-item dropdown-header">Hay <span class="product-quantity"></span> vehículo(s) por vencer pagos</span>
                            <div id="notifications" class="list-group"></div>
                        </div>
                    </li>-->
                    <li class="nav-item dropdown">
                        <a class="nav-link" data-toggle="dropdown" href="#">
                        <span>${usuario.nombre}</span>
                            <img src="../Util/img/avatar1.svg" class="img-profile rounded-circle" width="30" height="30">
                        </a>
                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                        <span class="dropdown-item dropdown-header">Menu</span>
                                <div class="dropdown-divider"></div>
                                <a href="../Views/profileUser.php" class="dropdown-item text-start bg-ligth">
                                        <i class="fas fa-user mr-2"></i>
                                        Mi perfil
                                </a>
                                <div class="dropdown-divider"></div>
                                <a href="../Controllers/Logout.php" class="dropdown-item text-start bg-danger">
                                    <i class="fas fa-power-off mr-2"></i>
                                    Cerrar Sesión
                                </a>
                            <div class="dropdown-divider"></div>
                    </div>
                    </li>
                </ul>
                `;
    $("#menu_superior").html(template);
  }
  function llenar_menu_lateral(usuario) {
    let template = `
                <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div class="image">
                        <img src="../Util/img/avatar1.svg" class="img-profile rounded-circle" width="30" height="30">
                        </div>
                        <div class="info">
                            <a href="../Views/catalogo.php" class="d-block">${usuario.nombre}</a>
                        </div>
                </div>
            <!-- Sidebar Menu -->
                    <nav class="mt-2 sticky-top">
                        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <a href="../Views/dashboard.php" class="nav-link active">
                              <i class="nav-icon fas fa-tachometer-alt"></i>
                              <p>
                                Dashboard
                                <span class="badge badge-info right"></span>
    
                              </p>
                            </a>
                        
                            <li class="nav-header">Usuario</li>
                            <li class="nav-item" id="gestion_usuario">
                                <a href="../Views/Gestion_usuario.php" class="nav-link">
                                <i class="nav-icon fas fa-tags fa-lg"></i>
                                <p>
                                    Gestión Usuario
                                    <span class="badge badge-info right"></span>
                                </p>
                                </a>
                            </li>
    
                            <li class="nav-header">Datos</li>
    
                            <li class="nav-item">
                                <a href="../Views/catalogo.php" class="nav-link">
                                <i class="nav-icon fas fa-tractor"></i>
                                <p>
                                    Vehículos
                                    <span class="badge badge-info right"></span>
                                </p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="../Views/Personal.php" class="nav-link">
                                <i class="nav-icon fas fa-user-tie"></i>
                                <p>
                                    Personal
                                    <span class="badge badge-info right">Nuevo</span>
                                </p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="../Views/atributo.php" class="nav-link">
                                <i class="nav-icon fas fa-building"></i>
                                <p>
                                    Clientes y Proveedores
                                    <span class="badge badge-info right"></span>
                                </p>
                                </a>
                            </li>
                            <li class="nav-item">
                              <a href="../Views/facturacion.php" class="nav-link">
                              <i class="nav-icon fas fa-file-invoice-dollar"></i>
                              <p>
                                  Facturación
                                  <span class="badge badge-info right"></span>
                              </p>
                              </a>
                          </li>
                            <li class="nav-item">
                                <a href="../Views/controlSalida.php" class="nav-link">
                                <i class="nav-icon fas fa-parking"></i>
                                <p>
                                    Patio
                                    <span class="badge badge-info right"></span>
                                </p>
                                </a>
                            </li>

                            <li class="nav-header">Inventario</li>
                             <li class="nav-item">
                                <a href="../Views/Lotes.php" class="nav-link">
                                <i class="nav-icon fas fa-warehouse"></i>
                                <p>
                                    Almacenes
                                    <span class="badge badge-info right"></span>
                                </p>
                                </a>
                            </li>

                        </ul>
                    </nav>
                `;
    $("#menu_lateral").html(template);
  }
  // FIN LAYOUTS

  // VERIFICACIONES
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

    // Validar campos vacíos
    let horas = $("#horas").val();
    let horas_trabajo = $("#horas_trabajo").val();
    let lugar_trabajo = $("#lugar_trabajo").val();
    let aceite_motor = $("#aceite_motor").val();
    let aceite_hidraulico = $("#aceite_hidraulico").val();
    let aceite_transmision = $("#aceite_transmision").val();
    let cantidadCombustible = $("#cantidad_combustible").val();
    let fechaRegistro = $("#fecha_asignada").val();

    if (!horas || !lugar_trabajo || !cantidadCombustible || !fechaRegistro) {
      toastr.error(
        "Todos los campos obligatorios deben estar completos.",
        "Error"
      );
      return;
    }

    // Validar que las horas y cantidad de combustible sean números positivos
    if (
      isNaN(horas) ||
      horas < 0 ||
      isNaN(cantidadCombustible) ||
      cantidadCombustible < 0
    ) {
      toastr.error(
        "Las horas y la cantidad de combustible deben ser números positivos.",
        "Error"
      );
      return;
    }

    // Validar que la fecha de registro no sea mayor a la fecha actual
    let fechaActual = new Date();
    let fechaIngresada = new Date(fechaRegistro);
    if (fechaIngresada > fechaActual) {
      toastr.error(
        "La fecha de registro no puede ser mayor a la fecha actual.",
        "Error"
      );
      return;
    }

    let urlActual = window.location.href;
    let indiceId = urlActual.indexOf("?id=");
    if (indiceId !== -1) {
      let idVehiculo = urlActual.substring(indiceId + 4);
      if (horas_trabajo) {
        horas_trabajo = parseInt(horas_trabajo) * 10000;
      }
      let idConsumo = $("#id_consumo_edit").val();
      const mantenimiento = $('input[name="mantenimiento[]"]')
        .map(function () {
          return $(this).val();
        })
        .get();

      let funcion = edit ? "editar_consumo" : "registrar_consumo";

      $.post(
        "../Controllers/vehiculosController.php",
        {
          funcion,
          idVehiculo,
          idConsumo,
          horas,
          horas_trabajo,
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
              "Se registró con éxito el consumo del vehículo",
              "Éxito"
            );
            $("#form-control-combustible").trigger("reset");
          } else if (response == "edit") {
            toastr.success(
              "Se editó con éxito los datos de consumo del vehículo",
              "Éxito"
            );
            obtener_tabla_combustible();
            $("#form-control-combustible").trigger("reset");
          } else {
            toastr.error(
              "No se ha podido registrar con éxito el consumo del vehículo",
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
    e.preventDefault();

    // Validar fechas
    let fechaDesde = $("#fecha_desde_aceites").val();
    let fechaHasta = $("#fecha_hasta_aceites").val();

    if (!fechaDesde || !fechaHasta) {
      toastr.error("Debes seleccionar un rango de fechas.", "Error");
      return;
    }

    let fechaActual = new Date();
    let fechaInicio = new Date(fechaDesde);
    fechaHasta = new Date(fechaHasta);
    let fechaLimite = new Date(
      fechaActual.getFullYear() - 5,
      fechaActual.getMonth(),
      fechaActual.getDate()
    );

    if (fechaInicio < fechaLimite || fechaHasta < fechaLimite) {
      toastr.error(
        "Las fechas no pueden ser mayores a la fecha limite.",
        "Error"
      );
      return;
    }

    if (fechaInicio > fechaHasta) {
      toastr.error(
        "La fecha de inicio no puede ser mayor que la fecha de fin.",
        "Error"
      );
      return;
    }

    let idVehiculo = obtenerIdVehiculo();
    let datos = {
      funcion: "calcularConsumoDeAceite",
      id: idVehiculo,
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
    };

    $.ajax({
      url: "../Controllers/vehiculosController.php",
      method: "POST",
      data: datos,
      dataType: "json",
      success: function (response) {
        $("#total_aceites").empty();
        if (
          response.total_aceite_motor !== null ||
          response.total_aceite_hidraulico !== null ||
          response.total_aceite_transmision !== null
        ) {
          let detallesAceites = `
              <li><b>Aceite de Motor</b>:<br> ${response.total_aceite_motor} litros</li>
              <li><b>Aceite Hidráulico</b>: <br>${response.total_aceite_hidraulico} litros</li>
              <li><b>Aceite de Transmisión</b>: <br> ${response.total_aceite_transmision} litros</li>
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
      error: function () {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema con la solicitud, por favor intenta nuevamente.",
        });
      },
    });
  });

  $("#consumo_fecha").on("click", function (e) {
    e.preventDefault();

    // Validar fechas
    let fechaDesde = $("#fecha_desde").val();
    let fechaHasta = $("#fecha_hasta").val();

    if (!fechaDesde || !fechaHasta) {
      toastr.error("Debes seleccionar un rango de fechas.", "Error");
      return;
    }

    let fechaActual = new Date();
    let fechaInicio = new Date(fechaDesde);
    fechaHasta = new Date(fechaHasta);
    let fechaLimite = new Date(
      fechaActual.getFullYear() - 5,
      fechaActual.getMonth(),
      fechaActual.getDate()
    );

    if (fechaInicio < fechaLimite || fechaHasta < fechaLimite) {
      toastr.error(
        "Las fechas no pueden ser mayores a la fecha limite.",
        "Error"
      );
      return;
    }

    if (fechaInicio > fechaHasta) {
      toastr.error(
        "La fecha de inicio no puede ser mayor que la fecha de fin.",
        "Error"
      );
      return;
    }

    let idVehiculo = obtenerIdVehiculo();
    let datos = {
      funcion: "calcularConsumoPorFecha",
      id: idVehiculo,
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
    };

    $.ajax({
      url: "../Controllers/vehiculosController.php",
      method: "POST",
      data: datos,
      dataType: "json",
      success: function (response) {
        if (response.total_consumo !== 0 || response.total_horas !== 0) {
          let consumoPorHora = response.total_consumo / response.total_horas;
          $("#total_calc_fecha").text(consumoPorHora.toFixed(2));
        } else {
          toastr.error(
            "El rango de fecha no existe. No se pudo obtener los datos necesarios para calcular el consumo por fecha",
            "Error"
          );
          $("#fecha_desde").trigger("reset");
          $("#fecha_hasta").trigger("reset");
        }
      },
      error: function () {
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
      let data = await fetch("../Controllers/vehiculosController.php", {
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
      let response = await fetch("../Controllers/vehiculosController.php", {
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
      let data = await fetch("../Controllers/vehiculosController.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "funcion=" + funcion + "&id=" + id,
      });
      if (data.ok) {
        let response = await data.text();
        try {
          let vehiculo = JSON.parse(response);
          let template = "";
          template += `<img src='../Util/img/vehiculos/${vehiculo.tipo_nombre}.jpeg' style="width: 50px; heigth: 50px;"/> `;

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
      let data = await fetch("../Controllers/vehiculosController.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "funcion=" + funcion + "&id=" + id,
      });
      if (data.ok) {
        let response = await data.text();

        try {
          let resumen = JSON.parse(response);
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
              { data: "horas_trabajo" },
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
            "../Controllers/vehiculosController.php",
            { idConsumo, funcion },
            (response) => {
              if (response.includes("anulado")) {
                swalWithBootstrapButtons.fire(
                  "Borrado!",
                  "El consumo N°" +
                    idConsumo +
                    " fue anulado. Se encotrará inactivo en la base de datos, comuniquese con su desarrollador para revertir la situacion",
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
