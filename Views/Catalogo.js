$(document).ready(function () {
  Loader("Cargando Datos");
  verificar_sesion();
  toastr.options = {
    preventDuplicates: true,
  };
  let edit = false;
  let datatable;

  // LAYOUTS
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
                            <li class="nav-item">
                                <a href="../Views/Productos.php" class="nav-link">
                                <i class="nav-icon fas fa-cart-flatbed-suitcase"></i>
                                <p>
                                    Productos
                                    <span class="badge badge-info right"></span>
                                </p>
                                </a>
                            </li>

                        </ul>
                    </nav>
                `;
    $("#menu_lateral").html(template);
  }
  //

  // VERIFICACION
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
        let repuesta = JSON.parse(response);
        if (repuesta.length !== 0) {
          llenar_menu_superior(repuesta);
          llenar_menu_lateral(repuesta);
          $("#gestion_usuario").show();
          $("#gestion_catalogo").show();
          $("#gestion_ventas").show();
          $("#gestion_lotes").show();
          $("#gestion_pedidos").show();
          $("#content_admin").show();
          obtener_resumen();
          rellenar_vehiculo();
          rellenar_archivos();
          obtener_vehiculos();
          tiposVehiculos();
          iconoVehiculoConsumo();
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
  // VEHICULOS
  async function obtener_vehiculos() {
    let funcion = "obtener_vehiculo";
    let data = await fetch("../Controllers/vehiculosController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });
    if (data.ok) {
      let response = await data.text();
      try {
        let vehiculo = JSON.parse(response);
        vehiculo = vehiculo.map((item) => {
          item.vtv = formatearFecha(item.vtv);
          item.vencimiento_cedula = formatearFecha(item.vencimiento_cedula);
          item.logistica = formatearFecha(item.logistica);
          item.matafuego = formatearFecha(item.matafuego);
          item.senasa = formatearFecha(item.senasa);
          item.seguro = formatearFecha(item.seguro);
          item.poliza = formatearFecha(item.poliza);
          return item;
        });
        datatable = $("#datos_vehiculos").DataTable({
          data: vehiculo,
          aaSorting: [],
          searching: true,
          scrollX: false,
          autoWidth: true,
          paging: true,
          bInfo: false,
          columns: [
            {
              render: function (data, type, datos, meta) {
                let cedula =
                  datos.cedula !== "null" &&
                  datos.cedula !== null &&
                  datos.cedula !== ""
                    ? `<li class="h8 text-sm"><span class="fa-li"><i class="far fa-id-card"></i></span><b>N° Cedula:</b> ${datos.cedula}</li>`
                    : "";
                let motor =
                  datos.motor !== "null" &&
                  datos.motor !== null &&
                  datos.motor !== ""
                    ? `<li class="h8 text-sm"><span class="fa-li"><i class="fas fa-car"></i></span><b>Motor:</b> ${datos.motor}</li>`
                    : "";
                let vto_cedula =
                  datos.vencimiento_cedula !== "" &&
                  datos.vencimiento_cedula !== null
                    ? `<li class="h8 text-sm"><span class="fa-li"><i class="fas fa-calendar-day"></i></span><b>VTO. Cedula:</b> ${datos.vencimiento_cedula}</li>`
                    : "";
                let vtv =
                  datos.vtv !== "" && datos.vtv !== null
                    ? `<li class="h8 text-sm"><span class="fa-li"><i class="fas fa-wrench"></i></span><b>VTO. VTV.:</b> ${datos.vtv}</li>`
                    : "";
                let logistica =
                  datos.logistica !== "" && datos.logistica !== null
                    ? `<li class="h8 text-sm"><span class="fa-li"><i class="fas fa-calendar-alt"></i></span><b>R.U.T.A:</b> ${datos.logistica}</li>`
                    : "";
                let senasa =
                  datos.senasa !== "" && datos.senasa !== null
                    ? `<li class="h8 text-sm"><span class="fa-li"><i class="far fa-calendar"></i></span><b>VTO Senasa:</b> ${datos.senasa}</li>`
                    : "";

                let matafuego =
                  datos.matafuego !== "" && datos.matafuego !== null
                    ? `<li class="h8 text-sm"><span class="fa-li"><i class="fas fa-fire-extinguisher" style="color: red;"></i></span><b>VTO matafuego:</b> ${datos.matafuego}</li>`
                    : "";
                let seguro =
                  datos.seguro !== "" && datos.seguro !== null
                    ? `<li class="h8 text-sm"><span class="fa-li"><i class="fas fa-calendar"></i></span><b>Pago Seguro:</b> ${datos.seguro}</li>`
                    : "";
                let poliza =
                  datos.poliza !== "" && datos.poliza !== null
                    ? `<li class="h8 text-sm"><span class="fa-li"><i class="far fa-calendar-times"></i></span><b>VTO Poliza:</b> ${datos.poliza}</li>`
                    : "";
                let num_poliza =
                  datos.num_poliza !== "null" &&
                  datos.num_poliza !== null &&
                  datos.num_poliza !== ""
                    ? `<li class="h8 text-sm"><span class="fa-li"><i class="fas fa-key"></i></span><b>N° Poliza:</b> ${datos.num_poliza}</li>`
                    : "";
                return `
                                        <div class="card-catalogo">
                                            <div class="card bg-light">
                                                <div class="card-header border-bottom-0 d-flex justify-content-between">
                                                    <div class="mr-auto">
                                                        <h4>
                                                            <span class="h8">
                                                                <i class="fas fa-lg fa-barcode" style="color: black; vertical-align: middle;"></i>
                                                                <b class="text-lg">${datos.codigo}</b>
                                                            </span>
                                                        </h4>
                                                    </div>
                                                    <div class="ml-auto">
                                                        <h4><b>${datos.vehiculo}</b></h4>
                                                    </div>
                                                </div>
                                                <div class="card-body pt-0 m-2">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <img src="${datos?.avatar}" class="img-fluid redounded" valid="${datos.id}"  id="abrir-ver-vehiculo">
                                                        </div>
                                                        <div class="col-md-6">
                                                            <ul class="ml-4 mb-0 fa-ul text-muted">
                                                                ${vtv}
                                                                ${motor}
                                                                ${cedula}
                                                                ${vto_cedula}
                                                                ${logistica}
                                                                ${senasa}
                                                                ${matafuego}
                                                                ${seguro}
                                                                ${num_poliza}
                                                                ${poliza}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="card-footer text-center">
                                                    <button 
                                                        id="${datos.id}" 
                                                        valcodigo="${datos.codigo}"
                                                        valnombre="${datos.vehiculo}" 
                                                        valvtv="${datos.vtv}"
                                                        valmotor="${datos.motor}"
                                                        valcedula="${datos.cedula}"
                                                        valvencimiento_cedula="${datos.vencimiento_cedula}"
                                                        vallogistica="${datos.logistica}"
                                                        valsenasa="${datos.senasa}"
                                                        valseguro="${datos.seguro}"
                                                        valnum_poliza="${datos.num_poliza}"
                                                        valpoliza="${datos.poliza}"
                                                        valmatafuego="${datos.matafuego}"
                                                        class="editar btn btn-sm bg-success" type="button" data-toggle="modal" data-target="#crear-producto">
                                                        <i class="fas fa-pencil-alt" style="color: white;"></i>
                                                    </button>
                                                    <button id="${datos.id}" 
                                                            nombre="${datos.vehiculo}" class="borrar btn btn-sm bg-danger">
                                                        <i class="fas fa-trash-alt text-center" style="color: white;"></i>
                                                    </button>
                                                    <button id="${datos.id}" 
                                                            nombre="${datos.vehiculo}" 
                                                            avatar="${datos.avatar}" class="avatar btn btn-sm btn-info" type="button" data-toggle="modal" data-target="#cambiarlogo">
                                                        <i class="fas fa-image" style="color: white;"></i>
                                                    </button>
                                                    <button id="${datos.id}" 
                                                            nombre="${datos.vehiculo}" 
                                                            codigo="${datos.codigo}" class="adjuntar-archivo-pdf btn btn-sm btn-dark" type="button" data-toggle="modal" data-target="#adjuntar-archivos-pdf">
                                                        <i class="fas fa-cloud-upload-alt" style="color: white;"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    `;
              },
            },
          ],
          language: espanol,
          initComplete: function () {
            // Modificar el placeholder del buscador
            let searchInput = $("#datos_vehiculos_filter input");
            searchInput.addClass("form-control"); // Agrega estilos de Bootstrap (opcional)
          },
          destroy: true,
        });
        datatable.on("click", "#abrir-ver-vehiculo", (e) => {
          abrirModalVehiculos();
          e.preventDefault();
        });
      } catch {
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
        text: "hubo conflicto de codigo, pongase en contacto con el administrador",
      });
    }
  }
  // DOCUMENTACION CREAR VEHICULO
  $("#form-crear-producto").submit((e) => {
    e.preventDefault();

    let isValid = true;

    $("#form-crear-producto input[type='text']").each(function () {
      if ($(this).val().length > 35) {
        toastr.error(
          "El campo '" +
            $(this).attr("placeholder") +
            "' no puede tener más de 35 caracteres.",
          "Error"
        );

        isValid = false;
        return false;
      }
    });

    $("#form-crear-producto input[type='date']").each(function () {
      let fechaIngresada = new Date($(this).val());
      let fechaActual = new Date();
      let fechaLimite = new Date(
        fechaActual.getFullYear() - 5,
        fechaActual.getMonth(),
        fechaActual.getDate()
      );

      if (fechaIngresada < fechaLimite) {
        toastr.error(
          "La fecha en el campo '" +
            $(this).attr("placeholder") +
            "' no puede ser más de 5 años antes del año actual.",
          "Error"
        );
        isValid = false;
        return false;
      }
    });

    if (isValid) {
      let id = $("#id_edit_prod").val();
      let codigo = $("#codigo_vehiculo").val();
      let vehiculo = $("#vehiculo").val();
      let vencimiento_vtv = $("#vencimiento_vtv").val() || null;
      let cedula = $("#cedula").val();
      let motor = $("#motor").val();
      let vencimiento_cedula = $("#vencimiento_cedula").val() || null;
      let vencimiento_logistica = $("#vencimiento_logistica").val() || null;
      let vencimiento_matafuego = $("#matafuego").val() || null;
      let vencimiento_seguro = $("#vencimiento_seguro").val() || null;
      let vencimiento_senasa = $("#vencimiento_senasa").val() || null;
      let poliza = $("#poliza").val();
      let vencimiento_poliza = $("#vencimiento_poliza").val() || null;
      if (edit == true) {
        funcion = "editar";
      } else {
        funcion = "crear";
      }
      $.post(
        "../Controllers/vehiculosController.php",
        {
          funcion,
          id,
          codigo,
          vehiculo,
          vencimiento_vtv,
          cedula,
          motor,
          vencimiento_cedula,
          vencimiento_logistica,
          vencimiento_senasa,
          vencimiento_matafuego,
          vencimiento_seguro,
          poliza,
          vencimiento_poliza,
        },
        (response) => {
          if (response == "add") {
            toastr.success("Vehiculo Agregado con exito", "Exito!");
            $("#form-crear-producto").trigger("reset");
            obtener_vehiculos();
            obtener_resumen();
          }
          if (response == "edit") {
            toastr.success("Vehiculo editado", "Exito!");
            obtener_resumen();
            obtener_vehiculos();
          }

          if (response == "noadd") {
            toastr.error("El vehiculo ya existe!", "Error!");
            $("#form-crear-producto").trigger("reset");
          }

          edit = false;
        }
      );
    }
  });
  $(document).on("click", ".avatar", (e) => {
    let funcion = "cambiar_avatar";
    const elemento = $(this)[0].activeElement;
    const id = $(elemento).attr("id");
    const nombre = $(elemento).attr("nombre");
    const avatar = $(elemento).attr("avatar");
    $("#logoactual").attr("src", avatar);
    $("#nombre_img").html(nombre);
    $("#funcion").val(funcion);
    $("#id_logo_prod").val(id);
    $("#avatar").val(avatar);
  });
  $("#form-logo-prod").submit((e) => {
    let formData = new FormData($("#form-logo-prod")[0]);
    $.ajax({
      url: "../Controllers/vehiculosController.php",
      type: "POST",
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
    }).done(function (response) {
      const json = JSON.parse(response);
      if (json.alert == "edit") {
        toastr.success("Imagen Agregada", "Exito!");
        $("#form-logo-prod").trigger("reset");
        obtener_vehiculos();
      } else {
        toastr.error("La imagen no cumple con los requisitos", "Error!");
        $("#form-logo-prod").trigger("reset");
      }
    });
    e.preventDefault();
  });
  $(document).on("click", ".borrar", (e) => {
    let funcion = "borrar";
    const elemento = $(this)[0].activeElement;
    const id = $(elemento).attr("id");
    const nombre = $(elemento).attr("nombre");

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
        text: "No vas a ver mas los datos de " + nombre + "!",
        imageWidth: 100,
        imageHeight: 100,
        showCancelButton: true,
        confirmButtonText: "Si, Borrar",
        cancelButtonText: "No, Cancelar",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          $.post(
            "../Controllers/vehiculosController.php",
            { id, funcion },
            (response) => {
              console.log(response);
              edit = false;
              if (response == "borrado") {
                swalWithBootstrapButtons.fire(
                  "Borrado!",
                  "El articulo " + nombre + " fue borrado.",
                  "success"
                );
                obtener_vehiculos();
                obtener_resumen();
              } else {
                swalWithBootstrapButtons.fire(
                  "No se pudo borrar!",
                  "El articulo " + nombre + " no fue borrado.",
                  "error"
                );
              }
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelado",
            "Tu articulo esta a salvo :)",
            "error"
          );
        }
      });
  });
  $(document).on("click", ".editar", (e) => {
    e.preventDefault();
    let elemento = $(e.target);
    let id = elemento.attr("id");
    let codigo = elemento.attr("valcodigo");
    let vehiculo = elemento.attr("valnombre");
    let vto_vtv = elemento.attr("valvtv") || "";
    let motor = elemento.attr("valmotor");
    let cedula = elemento.attr("valcedula");
    let vto_cedula = elemento.attr("valvencimiento_cedula") || "";
    let logistica = elemento.attr("vallogistica") || "";
    let seguro = elemento.attr("valseguro") || "";
    let senasa = elemento.attr("valsenasa") || "";
    let num_poliza = elemento.attr("valnum_poliza");
    let poliza = elemento.attr("valpoliza") || "";
    let matafuego = elemento.attr("valmatafuego") || "";

    vto_cedula = formatDateToInput(vto_cedula);
    vto_vtv = formatDateToInput(vto_vtv);
    logistica = formatDateToInput(logistica);
    seguro = formatDateToInput(seguro);
    senasa = formatDateToInput(senasa);
    poliza = formatDateToInput(poliza);
    matafuego = formatDateToInput(matafuego);

    $("#id_edit_prod").val(id);
    $("#codigo_vehiculo").val(codigo);
    $("#vehiculo").val(vehiculo);
    $("#vencimiento_vtv").val(vto_vtv);
    $("#motor").val(motor);
    $("#cedula").val(cedula);
    $("#vencimiento_cedula").val(vto_cedula);
    $("#vencimiento_logistica").val(logistica);
    $("#vencimiento_senasa").val(senasa);
    $("#matafuego").val(matafuego);
    $("#vencimiento_seguro").val(seguro);
    $("#poliza").val(num_poliza);
    $("#vencimiento_poliza").val(poliza);

    edit = true;
  });
  const buttonClose = document.getElementById("close");
  buttonClose.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "../Views/catalogo.php";
  });
  //

  // MODAL VEHICULOS
  function abrirModalVehiculos(data) {
    let modal = $("#vista_vehiculo");

    $("#content_admin").on("click", "td", function (e) {
      e.preventDefault();
      data = datatable.row(this).data();
      let vehiculoId = data.id;
      obtenerArchivosVehiculo(vehiculoId);
      let patente = data.codigo;
      let vehiculo = data.vehiculo;
      let motor = data.motor;
      let cedula = data.cedula;
      let avatar = data.avatar;
      $("#patente").html(patente);
      $("#dato_vehiculo").html(vehiculo);
      $("#numero_motor").html(motor);
      $("#numero_cedula").html(cedula);
      $("#avatar_vehiculo").html(
        `<img src="${avatar}" class="img-fluid img-xl rounded">`
      );
    });

    modal.modal("show");
  }
  async function obtenerArchivosVehiculo(vehiculoId) {
    let funcion = "obtener_archivos_vehiculo";
    let data = new FormData();
    data.append("funcion", funcion);
    data.append("vehiculo_id", vehiculoId);

    try {
      const response = await fetch("../Controllers/ArchivosController.php", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const archivos = await response.json();

        const selectTipoArchivo = document.getElementById(
          "tipo_archivos-select"
        );
        selectTipoArchivo.innerHTML = "";

        const tiposDeArchivoUnicos = [
          ...new Set(archivos.map((archivo) => archivo.tipo_archivo_nombre)),
        ];

        if (tiposDeArchivoUnicos.length > 0) {
          tiposDeArchivoUnicos.forEach((tipoArchivo) => {
            const option = document.createElement("option");
            option.value = tipoArchivo;
            option.textContent = tipoArchivo;
            selectTipoArchivo.appendChild(option);
          });

          mostrarArchivosFiltrados(archivos, tiposDeArchivoUnicos[0]);
          selectTipoArchivo.style.display = "block";
        } else {
          selectTipoArchivo.style.display = "none";
          const archivosList = document.getElementById("archivos-list");
          archivosList.innerHTML = `<p>No hay archivos adjuntos</p><br><p>Cerrá esta <b>Pestaña Emergente</b> y volve a abrir para ver reflejado los cambios</p>.`;
        }

        selectTipoArchivo.addEventListener("change", (e) => {
          const selectedTipoArchivo = selectTipoArchivo.value;
          const archivosFiltrados = archivos.filter(
            (archivo) => archivo.tipo_archivo_nombre === selectedTipoArchivo
          );

          let archivosTemplate = "";

          archivosFiltrados.forEach((archivo) => {
            archivosTemplate += `
                                  <li class="archivo-item mb-1 mr-1">
                                      <span class="nombre-archivo">${archivo.nombre}</span>
                                      <button data-id="${archivo.id}" data-ruta="${archivo.ruta}" class="btn btn-success float-end descargar"><i class="fas fa-print" style="color: white;"></i></button>
                                      <button data-id="${archivo.id}" data-ruta="${archivo.ruta}" class="btn btn-danger float-end borrar-archivo" data-tipo="${archivo.tipo_archivo_nombre}"><i class="fas fa-trash" style="color: white;"></i></button></li>
                                  <hr>
                              `;
          });
          e.preventDefault();

          const archivosList = document.getElementById("archivos-list");
          archivosList.innerHTML = archivosTemplate;

          const botonesBorrar = document.querySelectorAll(".borrar-archivo");
          botonesBorrar.forEach((boton) => {
            boton.addEventListener("click", (e) => {
              e.preventDefault();
              let id = boton.getAttribute("data-id");
              let ruta = boton.getAttribute("data-ruta");
              let tipo = boton.getAttribute("data-tipo");
              borrarArchivo(id, ruta, tipo);
            });
          });
        });

        const botonesDescargar = document.querySelectorAll(".descargar");
        botonesDescargar.forEach((boton) => {
          boton.addEventListener("click", (e) => {
            e.preventDefault();
            let id = boton.getAttribute("data-id");
            let ruta = boton.getAttribute("data-ruta");
            descargarPDF(id, ruta);
          });
        });
      } else {
        console.error("Error al obtener archivos.");
      }
    } catch (error) {
      console.error("Error en la solicitud fetch:", error);
    }
  }
  function mostrarArchivosFiltrados(archivos, selectedTipoArchivo) {
    const archivosFiltrados = archivos.filter(
      (archivo) => archivo.tipo_archivo_nombre === selectedTipoArchivo
    );

    let archivosTemplate = "";

    archivosFiltrados.forEach((archivo) => {
      archivosTemplate += `
                      <li class="archivo-item mb-1 mr-1">
                          <span class="nombre-archivo">${archivo.nombre}</span>
                          <button data-id="${archivo.id}" data-ruta="${archivo.ruta}" class="btn btn-success float-end descargar"><i class="fas fa-print" style="color: white;"></i></button>
                          <button data-id="${archivo.id}" data-ruta="${archivo.ruta}" class="btn btn-danger float-end borrar-archivo"><i class="fas fa-trash" style="color: white;"></i></button>
                      </li>
                      <hr>
                  `;
    });

    const archivosList = document.getElementById("archivos-list");
    archivosList.innerHTML = archivosTemplate;

    const botonesBorrar = document.querySelectorAll(".borrar-archivo");
    botonesBorrar.forEach((boton) => {
      boton.addEventListener("click", (e) => {
        e.preventDefault();
        let id = boton.getAttribute("data-id");
        let ruta = boton.getAttribute("data-ruta");
        borrarArchivo(id, ruta);
      });
    });

    const botonesDescargar = document.querySelectorAll(".descargar");
    botonesDescargar.forEach((boton) => {
      boton.addEventListener("click", (e) => {
        e.preventDefault();
        let id = boton.getAttribute("data-id");
        let ruta = boton.getAttribute("data-ruta");
        descargarPDF(id, ruta);
      });
    });
  }
  function descargarPDF(id, ruta) {
    window.open("../archiv/" + ruta, "_blank");
  }
  async function borrarArchivo(id, ruta) {
    let funcion = "borrar_archivo";
    let data = new FormData();
    data.append("funcion", funcion);
    data.append("id", id);
    data.append("ruta", ruta);
    // Muestra una alerta de confirmación
    const resultado = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el archivo permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      try {
        const response = await fetch("../Controllers/ArchivosController.php", {
          method: "POST",
          body: data,
        });

        if (response.ok) {
          Swal.fire(
            "Archivo eliminado",
            "El archivo se ha eliminado con éxito.",
            "success"
          );

          obtenerArchivosVehiculo();
        } else {
          console.error("Error al intentar borrar el archivo.");
          Swal.fire("Error", "No se pudo eliminar el archivo.", "error");
        }
      } catch (error) {
        console.error("Error en la solicitud fetch:", error);
        Swal.fire(
          "Error",
          "Ocurrió un error en la solicitud de eliminación.",
          "error"
        );
      }
    }
  }
  //
  // FORMATEAR FECHAS
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
  function formatDateToInput(fecha) {
    const partesFecha = fecha.split("-");
    if (partesFecha.length !== 3) {
      return "";
    }

    const dia = partesFecha[0]; // Obtener el día y asegurarse de que tenga dos dígitos
    const mes = partesFecha[1]; // Obtener el mes y asegurarse de que tenga dos dígitos
    const anio = partesFecha[2]; // Obtener el año

    // Formar la fecha en el formato "yyyy-MM-dd"
    return `${anio}-${mes}-${dia}`;
  }
  //
  // RESUMEN
  async function obtener_resumen() {
    let funcion = "obtener_resumen";
    let data = await fetch("../Controllers/vehiculosController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });
    if (data.ok) {
      let response = await data.text();
      try {
        let resumen = JSON.parse(response);

        let vehiculosAVencer = filtrarVehiculosAVencer(resumen);

        $("#obtener_resumen").DataTable({
          data: vehiculosAVencer,
          aaSorting: [],
          scrollX: false,
          autoWidth: false,
          paging: false,
          bInfo: false,
          columns: [
            { data: "num" },
            { data: "dato" },
            { data: "vehiculo" },
            {
              data: "vencimientos",
              render: function (data, type) {
                if (type !== "display") return data;

                const vencimientosDetallados = Object.entries(data)
                  .filter(([_, value]) => value && !isNaN(value.dias))
                  .map(([key, value]) => {
                    let dias = value.dias;
                    let diaContador = Math.abs(dias) + 1;
                    if (dias < 0 && diaContador < 90) {
                      return `<b class="badge bg-danger">${key}</b> Vencido hace: ${diaContador} día(s)`;
                    } else if (dias > 0 && dias < 15) {
                      return `<b class="badge bg-warning">${key}</b> Vence en ${diaContador} día(s)`;
                    }
                    return null;
                  })
                  .filter(Boolean) // Eliminar elementos nulos
                  .join("<br>");

                return `
                  <div class="vencimientos-columna d-flex flex-column overflow-auto">
                    ${vencimientosDetallados || "Sin vencimientos próximos"}
                  </div>`;
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
  }

  function filtrarVehiculosAVencer(datos) {
    return datos.filter((dato) =>
      Object.entries(dato.vencimientos).some(([key, value]) => {
        let dias = value.dias;
        return !isNaN(dias) && dias > 0 && dias <= 15;
      })
    );
  }
  //

  // ARCHIVOS
  function rellenar_archivos() {
    let funcion = "rellenar_archivos";
    $.post("../Controllers/ArchivosController.php", { funcion }, (response) => {
      let archivos = JSON.parse(response);
      let template = "";

      $("#tipo_archivos").empty();

      archivos.forEach((archivo) => {
        template += `
                        <option value="${archivo.id}">${archivo.nombre}</option>
                    `;
      });
      $("#tipo_archivos").html(template);
    });
  }
  $("#archivo").change(function () {
    let archivos = this.files;
    let archivosLista = $("#archivos-lista");

    for (let i = 0; i < archivos.length; i++) {
      let archivo = archivos[i];

      if (archivo.type === "application/pdf") {
        let archivoItem = $(
          '<li class="archivo-list-item"><div class="archivo-details"><div class="archivo-name">' +
            archivo.name +
            '</div><i class="fas fa-check badge badge-success rounded"></i></div><button class="btn btn-sm btn-danger eliminar-archivo"><i class="fas fa-trash-alt"></i></button></li>'
        );

        archivosLista.append(archivoItem);
      } else {
        toastr.error(
          'El archivo "' +
            archivo.name +
            '" no es un PDF válido. Solo se permiten archivos PDF.',
          "Error"
        );
      }
    }
  });
  $("#archivos-lista").on("click", ".eliminar-archivo", function () {
    const archivoItem = $(this).closest(".archivo-list-item");
    const archivoName = archivoItem.find(".archivo-name").text();

    const input = document.getElementById("archivo");
    for (let i = 0; i < input.files.length; i++) {
      if (input.files[i].name === archivoName) {
        input.files = new DataTransfer().files;
        break;
      }
    }
    archivoItem.remove();
  });
  $(document).on("click", ".adjuntar-archivo-pdf", function (e) {
    e.preventDefault();

    let funcion = "adjuntar_archivo_pdf";
    const id = $(this).attr("id");
    const nombre = $("#archivo").val();
    const idTipoArchivo = $("#tipo_archivos").val();

    $("#archivos-lista").empty();
    $("#form-adjuntar-archivo-pdf").trigger("reset");
    $("#funcion-pdf").val(funcion);
    $("#id-vehiculo-pdf").val(id);
    $("#id-tipo-archivo-pdf").val(idTipoArchivo);
    $("#nombre-archivo-pdf").val(nombre);
  });
  $("#form-adjuntar-archivo-pdf").submit((e) => {
    let formData = new FormData($("#form-adjuntar-archivo-pdf")[0]);
    $.ajax({
      url: "../Controllers/ArchivosController.php",
      type: "POST",
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
    }).done(function (response) {
      const json = JSON.parse(response);
      if (json.alert == "edit") {
        toastr.success("Archivo PDF adjuntado con éxito!", "Éxito");
        $("#form-adjuntar-archivo-pdf").trigger("reset");
        $("#archivo").trigger("reset");
        $("#archivos-lista").empty();
        obtener_vehiculos();
      } else if (json.alert == "exist") {
        toastr.error(
          "No se pudo registrar el archivo, verifique si selecciono alguno",
          "Error"
        );
        $("#form-adjuntar-archivo-pdf").trigger("reset");
        $("#archivo").trigger("reset");
        $("#archivos-lista").empty();
      } else if (json.alert == "novalid") {
        toastr.error(
          "El archivo no es un PDF válido o supera el límite de tamaño permitido",
          "Error"
        );
        $("#form-adjuntar-archivo-pdf").trigger("reset");
        $("#archivo").trigger("reset");
        $("#archivos-lista").empty();
      } else if (json.alert == "noedit") {
        toastr.error(
          "Ya existe un archivo con el mismo nombre y vehículo.",
          "Error"
        );
        $("#form-adjuntar-archivo-pdf").trigger("reset");
        $("#archivo").trigger("reset");
        $("#archivos-lista").empty();
      } else {
        toastr.error(
          "El archivo no cumple con los requisitos de tamaño. No se pudo subir el archivo",
          "Error"
        );
        $("#form-adjuntar-archivo-pdf").trigger("reset");
        $("#archivo").trigger("reset");
        $("#archivos-lista").empty();
      }
    });

    e.preventDefault();
  });
  $("#tipo_archivos").on("change", function () {
    const idTipoArchivo = $(this).val();
    $("#id-tipo-archivo-pdf").val(idTipoArchivo);
  });

  $("#crear_tipos_archivo").on("click", function () {
    // Obtener el valor del input de viandas
    let tipo_archivo = $("#tipos_archivo").val();

    let funcion = "creador_tipos_archivos";

    $.ajax({
      type: "POST",
      url: "../Controllers/ArchivosController.php",
      data: {
        funcion: funcion,
        tipo_archivo: tipo_archivo,
      },
      success: function (response) {
        toastr.success("Valores actualizados con exito!", "Éxito");
        rellenar_archivos();
      },
      error: function (xhr, status, error) {
        // Manejar errores de la solicitud AJAX
        toastr.error(
          "Los valores no se pudieron enviar correctamente, verificar error: " +
            error,
          "Error"
        );
      },
    });
  });

  // FIN ARCHIVOS

  //EVENTOS
  $("#otros-datos-toggle").change(function () {
    const otrosDatosContainer = $("#otros-datos");
    const icon = $(".toggle-container .icon");
    otrosDatosContainer.slideToggle(300);

    // Cambia el ícono ">" a "v" según el estado de la casilla de verificación
    icon.text(this.checked ? "v" : ">");

    // Cambia el texto del label según el estado de la casilla de verificación
    const labelText = this.checked ? "Ocultar datos" : "Mostrar datos";
    $(".toggle-container label").text(labelText);
  });
  $("#motor-toggle").change(function () {
    if (this.checked) {
      // Si el checkbox está marcado, muestra el campo "N° Motor"
      $("#motor-input-group").show();
    } else {
      // Si el checkbox no está marcado, oculta el campo "N° Motor"
      $("#motor-input-group").hide();
    }
  });
  $("#cedula-toggle").change(function () {
    if (this.checked) {
      // Si el checkbox está marcado, muestra el campo "N° Motor"
      $("#cedula-input-group").show();
    } else {
      // Si el checkbox no está marcado, oculta el campo "N° Motor"
      $("#cedula-input-group").hide();
    }
  });
  $("#vtv-toggle").change(function () {
    if (this.checked) {
      // Si el checkbox está marcado, muestra el campo "N° vtv"
      $("#vtv-input-group").show();
    } else {
      // Si el checkbox no está marcado, oculta el campo "N° vtv"
      $("#vtv-input-group").hide();
    }
  });
  $("#logistica-toggle").change(function () {
    if (this.checked) {
      // Si el checkbox está marcado, muestra el campo "N° ruta"
      $("#ruta-input-group").show();
    } else {
      // Si el checkbox no está marcado, oculta el campo "N° ruta"
      $("#ruta-input-group").hide();
    }
  });
  $("#senasa-toggle").change(function () {
    if (this.checked) {
      // Si el checkbox está marcado, muestra el campo "N° senasa"
      $("#senasa-input-group").show();
    } else {
      // Si el checkbox no está marcado, oculta el campo "N° senasa"
      $("#senasa-input-group").hide();
    }
  });
  //

  // CONSUMO DE COMBUSTIBLE
  $(document).on("click", "#tipo_vehiculos button", function (e) {
    e.preventDefault();
    // Remover la clase activa de todos los botones
    $("#tipo_vehiculos button").removeClass("active");
    // Agregar la clase activa al botón clicado
    $(this).addClass("active");
    // Obtener el ID del vehículo y establecerlo en el campo oculto
    let id = $(this).data("id");
    $("#id_tipo_vehiculo").val(id);
  });
  $("#form-asignar-tipo").submit((e) => {
    e.preventDefault();
    let idTipoVehiculo = $("#id_tipo_vehiculo").val();
    let vehiculo = $("#vehiculo_asignar").val();

    console.log(idTipoVehiculo);

    let funcion = "asignar_tipo_vehiculo";

    $.post(
      "../Controllers/vehiculosController.php",
      { funcion, idTipoVehiculo, vehiculo },
      (response) => {
        if (response == "addTypeVehicle") {
          toastr.success("Asignado con éxito el tipo de vehiculo!", "Éxito");
          tiposVehiculos();
          rellenar_vehiculo();
          $("#vehiculo_asignar").trigger("reset");
        } else if (response == "error_updateTypeVehicle") {
          toastr.error(
            "No se pudo asignar el tipo de vehiculo, verifique si ya se encuentra seleccionado el vehiculo",
            "Error"
          );
          tiposVehiculos();
          rellenar_vehiculo();
          $("#vehiculo_asignar").trigger("reset");
        }
      }
    );
  });
  $("#form-precio-combustible").submit((e) => {
    e.preventDefault();
    let precio_combustible = $("#precio_combustible").val();

    let funcion = "asignar_precio_combustible";

    $.post(
      "../Controllers/vehiculosController.php",
      { funcion, precio_combustible },
      (response) => {
        if (response == "success") {
          toastr.success("Asignado con éxito el precio de vehiculo!", "Éxito");
          $("#precio_combustible").trigger("reset");
        } else {
          console.log(response);
          toastr.error(
            "No se pudo asignar el precio del combustible, verifique si ya se encuentra seleccionado el vehiculo, recuerde enviar decimales ej: 990.09",
            "Error"
          );
          $("#precio_combustible").trigger("reset");
        }
      }
    );
  });
  function rellenar_vehiculo() {
    let funcion = "rellenar_vehiculos";
    $.post(
      "../Controllers/vehiculosController.php",
      { funcion },
      (response) => {
        let vehiculos = JSON.parse(response);
        let template = "";

        $("#vehiculo_asignar").empty();

        vehiculos.forEach((vehiculo) => {
          template += `<option value="${vehiculo.id}" data-vehiculo="${vehiculo.vehiculo}">Vehiculo: ${vehiculo.vehiculo} [<span class="text-blue">Patente: ${vehiculo.codigo}</span>]</option>`;
        });

        $("#vehiculo_asignar").html(template);
      }
    );
  }
  async function tiposVehiculos() {
    let funcion = "tipo_vehiculos";
    let data = await fetch("../Controllers/vehiculosController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });
    if (data.ok) {
      let response = await data.json();
      try {
        let tipoVehiculosHTML = "";

        response.forEach((tipo) => {
          let imgUrl = `../Util/img/vehiculos/${tipo.nombre}.jpeg`;

          // Agrega la clase 'active' si el tipo de vehículo está asignado
          let activeClass = tipo.asignado ? "active" : "";

          tipoVehiculosHTML += `
                        <div class="text-center m-1">
                            <button class="btn btn-outline-primary ${activeClass}" data-id="${tipo.id_tipo}">
                                <img src="${imgUrl}" alt="${tipo.nombre}" style="width: 40px; height: 40px; border-radius: 40px;">
                                <p>${tipo.nombre}</p>
                            </button>
                        </div>
                        `;
        });

        $("#tipo_vehiculos").html(tipoVehiculosHTML);
        // Aplicar la clase activa al botón seleccionado, si hay uno
        let selectedButton = $("#tipo_vehiculos button.active");
        if (selectedButton.length > 0) {
          let id = selectedButton.data("id");
          console.log(id);
          $("#id_tipo_vehiculo").val(id);
        }
      } catch (error) {
        console.error(error);
        console.log(error);
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
        text: "Hubo un conflicto de código: " + data.status,
      });
    }
  }
  async function iconoVehiculoConsumo() {
    let funcion = "tipos_vehiculos";
    let data = await fetch("../Controllers/vehiculosController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (data.ok) {
      let response = await data.text();
      try {
        let consumo = JSON.parse(response);
        let grupos = {};

        consumo.forEach((tv) => {
          let orden = tv.orden; // Usar la columna 'orden' en lugar de extraer un número del nombre
          if (!grupos[orden]) {
            grupos[orden] = [];
          }
          grupos[orden].push(tv);
        });

        // Ordenar las claves del objeto de grupos (es decir, los valores de la columna 'orden')
        let keysOrdenadas = Object.keys(grupos).sort((a, b) => a - b);
        let template = "";

        // Iterar sobre las claves ordenadas y construir el HTML
        keysOrdenadas.forEach((orden) => {
          template += `<div class="row">`;
          grupos[orden].forEach((tv) => {
            template += `
                                <div class="col-md-2 text-center">
                                    <button class="btn btn-transparent btn-ver-vehiculo" type="button" data-vehiculo-id="${tv.id}">
                                        <img src='../Util/img/vehiculos/${tv.nombre}.jpeg' alt="" style="width: 50px; height:50px;">
                                    </button>
                                </div>
                            `;
          });
          template += `</div>`;
        });

        $("#obtener_consumo").html(template);
      } catch (error) {
        console.error(error);
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

  $(document).on("click", ".btn-ver-vehiculo", function (e) {
    e.preventDefault();
    let vehiculoId = $(this).data("vehiculo-id");
    let url = `../Views/consumo.php?id=${vehiculoId}`;
    window.location.href = url;
  });
  //
  // LOADER
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
  // FIN LOADER
});
let espanol = {
  processing: "Procesando...",
  lengthMenu: "Mostrar _MENU_ registros",
  zeroRecords: "No se encontraron resultados",
  emptyTable: "Ningún dato disponible en esta tabla",
  infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
  infoFiltered: "(filtrado de un total de _MAX_ registros)",
  search: "",
  searchPlaceholder: "Buscar...",
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
