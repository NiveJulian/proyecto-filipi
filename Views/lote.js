$(document).ready(function () {
  Loader("Cargando Productos");
  verificar_sesion();
  let funcion = "";
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
          llenar_menu_lateral(repuesta);
          llenar_menu_superior(repuesta);
          $("#gestion_usuario").show();
          $("#gestion_catalogo").show();
          $("#gestion_ventas").show();
          $("#gestion_lotes").show();
          $("#gestion_pedidos").show();
          await cargarAlmacenes();
          rellenar_tipo_producto();
        } else {
          location.href = "../";
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
        text: "hubo conflicto de codigo: " + data.status,
      });
    }
  }

  $("#modalAlmacen").on("show.bs.modal", async function (event) {
    var button = $(event.relatedTarget);
    var id = button.data("id");
    if (id) {
      $.ajax({
        url: "../Controllers/LoteController.php",
        type: "POST",
        data: { funcion: "obtener_almacen", id: id },
        dataType: "json",
        success: async function (response) {
          $("#idAlmacen").val(response[0].id);
          $("#nombreAlmacen").val(response[0].nombre);
          $("#ubicacionAlmacen").val(response[0].ubicacion);
          $("#tipo_producto").val(response[0].tipo_producto);
          $("#estadoAlmacen").val(response[0].estado);
          $("#modalTitulo").text("Editar Almacén");
        },
      });
    } else {
      // Crear nuevo almacén
      $("#formAlmacen")[0].reset();
      $("#modalTitulo").text("Crear Almacén");
    }
  });

  // Cargar almacenes en la tabla
  async function cargarAlmacenes() {
    $.ajax({
      url: "../Controllers/LoteController.php",
      type: "POST",
      data: { funcion: "listar_almacenes" },
      dataType: "json",
      success: function (response) {
        let tbody = $("#tablaAlmacenes tbody");
        tbody.empty();
        response.forEach(function (almacen) {
          let fila = `
                    <tr>
                        <td>${almacen.nombre}</td>
                        <td>${almacen.ubicacion}</td>
                        <td>${almacen.tipo_producto}</td>
                        <td>${almacen.estado}</td>
                        <td>
                            <button class="btn btn-sm btn-warning editar-almacen text-center" data-toggle="modal" data-target="#modalAlmacen" data-id="${almacen.id}"><i class="fas fa-pencil text-black"></i></button>
                            <button class="btn btn-sm btn-danger eliminar-almacen" data-id="${almacen.id}"><i class="fas fa-trash text-black"></i></button>
                        </td>
                    </tr>
                `;
          tbody.append(fila);
        });
      },
    });
  }

  // Guardar almacén (crear o editar)
  $("#guardarAlmacen").click(function () {
    let id = $("#idAlmacen").val();
    let nombre = $("#nombreAlmacen").val();
    let ubicacion = $("#ubicacionAlmacen").val();
    let tipoProducto = $("#tipo_producto").val();
    let estado = $("#estadoAlmacen").val();

    let funcion = id ? "editar_almacen" : "crear_almacen";

    $.ajax({
      url: "../Controllers/LoteController.php",
      type: "POST",
      data: {
        funcion: funcion,
        id: id,
        nombre: nombre,
        ubicacion: ubicacion,
        tipo_producto: tipoProducto,
        estado: estado,
      },
      success: function (response) {
        console.log(response);
        $("#modalAlmacen").modal("hide");
        cargarAlmacenes();
      },
    });
  });

  // Eliminar almacén
  $(document).on("click", ".eliminar-almacen", function () {
    var id = $(this).data("id");
    if (confirm("¿Estás seguro de eliminar este almacén?")) {
      $.ajax({
        url: "../Controllers/LoteController.php",
        type: "POST",
        data: { funcion: "eliminar_almacen", id: id },
        success: function (response) {
          cargarAlmacenes();
        },
      });
    }
  });

  function rellenar_tipo_producto() {
    let funcion = "rellenar_tipo_producto";
    $.post("../Controllers/LoteController.php", { funcion }, (response) => {
      let tipoProducto = JSON.parse(response);
      let template = "";

      $("#tipo_producto").empty();

      tipoProducto.forEach((type) => {
        template += `
                        <option value="${type.id}">${type.nombre}</option>
                    `;
      });
      $("#tipo_producto").html(template);
    });
  }

  function Loader(mensaje) {
    if (mensaje == "" || mensaje == null) {
      mensaje = "Cargando productos...";
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
