$(document).ready(function () {
  Loader("Cargando Productos");
  $(".select2").select2();
  verificar_sesion();
  var funcion = "";
  var edit = false;
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
  $(document).on("click", "#sidebarToggle, #sidebarToggleTop", function (e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $(".sidebar .collapse").collapse("hide");
    }
  });
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
          rellenar_Proveedores();
          rellenar_lotes();
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

  function rellenar_lotes() {
    funcion = "rellenar_lotes";
    $.post(
      "../Controllers/ProveedorController.php",
      { funcion },
      (response) => {
        const lotes = JSON.parse(response);
        let template = "";
        lotes.forEach((lote) => {
          template += `
                    <option value="${lote.id}">${lote.nombre}</option>
                `;
        });
        $("#lote-prov").html(template);
      }
    );
  }
  function rellenar_Proveedores() {
    funcion = "rellenar_proveedores";
    $.post(
      "../Controllers/ProveedorController.php",
      { funcion },
      (response) => {
        const proveedores = JSON.parse(response);
        let template = "";
        proveedores.forEach((proveedor) => {
          template += `
                    <option value="${proveedor.id}">${proveedor.nombre}</option>
                `;
        });
        $("#proveedor").html(template);
      }
    );
  }
  $("#form-crear-producto").submit((e) => {
    let id = $("#id_edit_prod").val();
    let nombre = $("#nombre_producto").val();
    let descripcion = $("#descripcion").val();
    let codigo = $("#codigo").val();
    let precio = $("#precio").val();
    let tipo = $("#tipo").val();
    let proveedor = $("#proveedor").val();
    let presentacion = $("#presentacion").val();
    if (edit == true) {
      funcion = "editar";
    } else {
      funcion = "crear";
    }
    $.post(
      "../Controllers/ProductoController.php",
      {
        funcion,
        id,
        nombre,
        descripcion,
        codigo,
        precio,
        tipo,
        proveedor,
        presentacion,
      },
      (response) => {
        console.log(response);
        if (response == "add") {
          $("#add").hide("slow");
          $("#add").show(1000);
          $("#add").hide(2000);
          $("#form-crear-producto").trigger("reset");
          $("#tipo").val("").trigger("change");
          $("#proveedor").val("").trigger("change");
          $("#presentacion").val("").trigger("change");
          buscar_productos();
        }
        if (response == "edit") {
          $("#edit_prod").hide("slow");
          $("#edit_prod").show(1000);
          $("#edit_prod").hide(2000);
          $("#form-crear-producto").trigger("reset");
          $("#tipo").val("").trigger("change");
          $("#proveedor").val("").trigger("change");
          $("#presentacion").val("").trigger("change");
          buscar_productos();
        }
        if (response == "noadd") {
          $("#noadd").hide("slow");
          $("#noadd").show(1000);
          $("#noadd").hide(2000);
          $("#form-crear-producto").trigger("reset");
        }
        edit = false;
      }
    );
    e.preventDefault();
  });
  function buscar_productos(consulta) {
    funcion = "buscar";
    $.post(
      "../Controllers/ProductoController.php",
      { consulta, funcion },
      (response) => {
        const productos = JSON.parse(response);
        let template = "";
        productos.forEach((producto) => {
          template += `
                <div prodId="${producto.id}" prodNombre="${producto.nombre}"prodPrecio="${producto.precio}"prodDescripcion="${producto.descripcion}"prodCodigo="${producto.codigo}"prodProveedor="${producto.proveedor_id}"prodPresentacion="${producto.presentacion_id}"prodTipo="${producto.tipo_id}"prodAvatar="${producto.avatar}" class="cambiar-avat col-12 col-sm-6 col-md-4 d-flex align-items-stretch">
                    <div class="card bg-light">
                        <div class="card-header text-muted border-bottom-0">
                            <i class="fas fa-lg fa-cubes mr-1"></i>${producto.stock}
                        </div>
                        <div class="card-body pt-0 m-2">
                            <div class="row">
                                <div class="col-7">
                                    <h2 class="lead"><b>${producto.nombre}</b></h2>
                                    <h4 class="lead"><b>$${producto.precio}</b></h4>
                                    <ul class="ml-4 mb-0 fa-ul text-muted">
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-truck"></i></i></span>Proveedor: ${producto.proveedor}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-circle-info"></i></span>Detalle: ${producto.descripcion}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-code"></i></span>Codigo: ${producto.codigo}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-box"></i></span>Tipo: ${producto.tipo}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-hands-holding"></i></span>Presentacion: ${producto.presentacion}</li>
                                    </ul>
                                </div>
                                <div class="col-5 text-center">
                                    <img src="${producto.avatar}" alt="" class="img-fluid redounded">
                                </div>
                            </div>
                        </div>
                            <div class="card-footer text-center">
                                    <button class="avatar btn btn-sm btn-info" type="button" data-toggle="modal" data-target="#cambiarlogo"><i class="fas fa-image"></i></button>
                                    <button class="editar btn btn-sm btn-success" type="button" data-toggle="modal" data-target="#crear-producto"><i class="fas fa-pencil-alt"></i></button>
                                    <button class="borrar btn btn-sm btn-danger"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
        });
        $("#productos").html(template);
      }
    );
  }
  $(document).on("keyup", "#buscar-producto", function () {
    let valor = $(this).val();
    if (valor != "") {
      buscar_productos(valor);
    } else {
      buscar_productos();
    }
  });
  $(document).on("click", ".avatar", (e) => {
    funcion = "cambiar_avatar";
    const elemento =
      $(this)[0].activeElement.parentElement.parentElement.parentElement;
    const id = $(elemento).attr("prodId");
    const nombre = $(elemento).attr("prodNombre");
    const avatar = $(elemento).attr("prodAvatar");
    $("#logoactual").attr("src", avatar);
    $("#nombre_img").html(nombre);
    $("#funcion").val(funcion);
    $("#id_logo_prod").val(id);
    $("#avatar").val(avatar);
  });

  $("#form-logo-prod").submit((e) => {
    let formData = new FormData($("#form-logo-prod")[0]);
    $.ajax({
      url: "../Controllers/ProductoController.php",
      type: "POST",
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
    }).done(function (response) {
      const json = JSON.parse(response);
      if (json.alert == "edit") {
        $("#logoactual").attr("src", json.ruta);
        $("#edit").hide("slow");
        $("#edit").show(1000);
        $("#edit").hide(5000);
        $("#form-logo-prod").trigger("reset");
        buscar_productos();
      } else {
        $("#noedit").hide("slow");
        $("#noedit").show(1000);
        $("#noedit").hide(2000);
        $("#form-logo-prod").trigger("reset");
      }
    });
    e.preventDefault();
  });

  $(document).on("click", ".borrar", (e) => {
    funcion = "borrar";
    const elemento =
      $(this)[0].activeElement.parentElement.parentElement.parentElement;
    const id = $(elemento).attr("prodId");
    const nombre = $(elemento).attr("prodNombre");

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
        text: "No vas a ver mas este articulo [" + nombre + "]!",
        imageWidth: 100,
        imageHeight: 100,
        showCancelButton: true,
        confirmButtonText: "Si, Borralo porfa!",
        cancelButtonText: "No, Cancela!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          $.post(
            "../Controllers/ProductoController.php",
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
                buscar_productos();
              } else {
                swalWithBootstrapButtons.fire(
                  "No se pudo borrar!",
                  "El articulo [" + nombre + "] no fue borrado.",
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
    const elemento =
      $(this)[0].activeElement.parentElement.parentElement.parentElement;
    const id = $(elemento).attr("prodId");
    const nombre = $(elemento).attr("prodNombre");
    const codigo = $(elemento).attr("prodCodigo");
    const descripcion = $(elemento).attr("prodDescripcion");
    const precio = $(elemento).attr("prodPrecio");
    const tipo = $(elemento).attr("prodTipo");
    const proveedor = $(elemento).attr("prodProveedor");
    const presentacion = $(elemento).attr("prodPresentacion");

    $("#id_edit_prod").val(id);
    $("#nombre_producto").val(nombre);
    $("#codigo").val(codigo);
    $("#descripcion").val(descripcion);
    $("#precio").val(precio);
    $("#tipo").val(tipo).trigger("change");
    $("#proveedor").val(proveedor).trigger("change");
    $("#presentacion").val(presentacion).trigger("change");
    edit = true;
  });
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
