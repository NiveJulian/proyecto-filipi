$(document).ready(function () {
  Loader("Cargando Datos");
  verificar_sesion();
  toastr.options = {
    preventDuplicates: true,
  };
  let edit = false;
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
        let repuesta = JSON.parse(response);
        if (repuesta.length !== 0) {
          llenar_menu_superior(repuesta);
          llenar_menu_lateral(repuesta);
          $("#gestion_usuario").show();
          $("#gestion_catalogo").show();
          $("#gestion_ventas").show();
          $("#gestion_lotes").show();
          $("#gestion_pedidos").show()
          $("#content_admin").show();
          obtener_cliente();
          buscar_cliente();
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
  // PROVEEDOR

  async function obtener_cliente() {
    let funcion = "obtener_clientes";
    let request = await fetch("../Controllers/ClienteController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });

    if (request.ok) {
      let response = await request.text();
      try {
        let clientes = JSON.parse(response);
        let template = "";
        clientes.forEach((cliente) => {
          template += `
                            <div cliId="${cliente.id}" 
                                cliNombre="${cliente.nombre}" 
                                cliTelefono="${cliente.telefono}" 
                                cliDireccion="${cliente.direccion}" 
                                cliRazonSocial="${cliente.razon_social}" 
                                cliCuit="${cliente.cuit}" 
                                cliCondicionIva="${cliente.condicion_iva}" 
                                cliAvatar="${cliente.avatar}" class="col-12 col-sm-6 col-md-4 m-1">
                                <div class="card bg-light d-flex flex-fill">
                                    <div class="card-header text-muted border-bottom-0">
                                        <h1 class="badge badge-success">Cliente</h1>
                                    </div>
                                    <div class="card-body pt-0">
                                        <div class="row">
                                            <div class="col-7">
                                            <h2 class="lead"><b>${cliente.nombre}</b></h2>
                                            <ul class="ml-4 mb-0 fa-ul text-muted">
                                                <li class="small"><span class="fa-li"><i class="fas fa-lg fa-building"></i></span> Direccion: ${cliente.direccion}</li>
                                                <li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span> Telefono #: ${cliente.telefono}</li>
                                                <li class="small"><span class="fa-li"><i class="fas fa-lg fa-at"></i></span> Razon Social: ${cliente.razon_social}</li>
                                                
                                                <li class="small"><span class="fa-li"><i class="fas fa-id-card"></i></span><span class="badge badge-info"> C.U.I.T:</span> ${cliente.cuit}</li>
                                            </ul>
                                            </div>
                                            <div class="col-5 text-center">
                                            <img src="${cliente.avatar}" alt="user-avatar" class="img-circle img-fluid">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer">
                                        <div class="text-right">
                                            <button type="button" data-toggle="modal" data-target="#crearcliente" class="editar btn btn-sm btn-success">
                                                <i class="fas fa-pencil-alt"></i>
                                            </button>
                                            <button class="borrar btn btn-sm btn-danger">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
        });
        $("#all_clientes").html(template);
      } catch (error) {
        console.log(error);
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un conflicto en el sistema, póngase en contacto con el administrador",
        });
      }
    } else {
      console.log(request);
      Swal.fire({
        icon: "error",
        title: request.statusText,
        text: "Hubo un conflicto de código: " + request.status,
      });
    }
  }
  $("#form-crear-cliente").submit((e) => {
    let razonsocial = $("#razon_social_cliente").val();
    let nombre = $("#nombre_cliente").val();
    let direccion = $("#direccion_cliente").val();
    let telefono = $("#telefono_cliente").val();
    let cuit = $("#cuit_cliente").val();
    let condicion_iva = $("#condicion_iva_cliente").val();
    let funcion;
    if (edit == true) {
      funcion = "editar";
    } else {
      funcion = "crear";
    }
    $.post(
      "../Controllers/ClienteController.php",
      {
        nombre,
        direccion,
        telefono,
        cuit,
        razonsocial,
        condicion_iva,
        funcion,
      },
      (response) => {
        if (response == "add") {
          toastr.success("Cliente Agregado con exito", "Exito!");
          $("#form-crear-cliente").trigger("reset");
          obtener_cliente();
          buscar_cliente();
        }
        if (response == "edit") {
          toastr.success("Cliente Editado con exito", "Exito!");
          $("#form-crear-cliente").trigger("reset");
          obtener_cliente();
          buscar_cliente();
        }
        if (response == "noadd") {
          toastr.error("Cliente no ha sido agregado", "Error!");
          $("#form-crear-cliente").trigger("reset");
        }
        edit = false;
      }
    );
    e.preventDefault();
  });
  async function buscar_cliente(consulta) {
    let funcion = "buscar";
    let request = await fetch("../Controllers/ClienteController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion + "&consulta=" + consulta,
    });

    if (request.ok) {
      let response = await request.text();
      try {
        let clientes = JSON.parse(response);
        let template = "";
        clientes.forEach((cliente) => {
          template += `
                            <div provId="${cliente.id}" 
                                provNombre="${cliente.nombre}" 
                                provTelefono="${cliente.telefono}" 
                                provDireccion="${cliente.direccion}" 
                                provRazonSocial="${cliente.razon_social}" 
                                provCuit="${cliente.cuit}" 
                                provCondicionIva="${cliente.condicion_iva}" 
                                provAvatar="${cliente.avatar}" class="col-12 col-sm-6 col-md-4 m-1">
                                <div class="card bg-light d-flex flex-fill">
                                    <div class="card-header text-muted border-bottom-0">
                                        <h1 class="badge badge-success">Cliente</h1>
                                    </div>
                                    <div class="card-body pt-0">
                                        <div class="row">
                                            <div class="col-7">
                                            <h2 class="lead"><b>${cliente.nombre}</b></h2>
                                            <ul class="ml-4 mb-0 fa-ul text-muted">
                                                <li class="small"><span class="fa-li"><i class="fas fa-lg fa-building"></i></span> Direccion: ${cliente.direccion}</li>
                                                <li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span> Telefono #: ${cliente.telefono}</li>
                                                <li class="small"><span class="fa-li"><i class="fas fa-lg fa-at"></i></span> Razon Social: ${cliente.razon_social}</li>
                                                
                                                <li class="small"><span class="fa-li"><i class="fas fa-id-card"></i></span><span class="badge badge-info"> C.U.I.T:</span> ${cliente.cuit}</li>
                                            </ul>
                                            </div>
                                            <div class="col-5 text-center">
                                            <img src="${cliente.avatar}" alt="user-avatar" class="img-circle img-fluid">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer">
                                        <div class="text-right">
                                            <button type="button" data-toggle="modal" data-target="#crearcliente" class="editar-buscar btn btn-sm btn-success">
                                                <i class="fas fa-pencil-alt"></i>
                                            </button>
                                            <button class="borrar-buscar btn btn-sm btn-danger">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
        });
        $("#clientes").html(template);
      } catch (error) {
        console.log(error);
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un conflicto en el sistema, póngase en contacto con el administrador",
        });
      }
    } else {
      console.log(request);
      Swal.fire({
        icon: "error",
        title: request.statusText,
        text: "Hubo un conflicto de código: " + request.status,
      });
    }
  }

  $(document).on("keyup", "#buscar-clientes", function () {
    let valor = $(this).val();
    if (valor != "") {
      buscar_cliente(valor);
    } else {
      buscar_cliente();
    }
  });
  $(document).on("click", ".avatar", (e) => {
    funcion = "cambiar_logo";
    const elemento =
      $(this)[0].activeElement.parentElement.parentElement.parentElement
        .parentElement;
    const id = $(elemento).attr("provId");
    const nombre = $(elemento).attr("provNombre");
    const avatar = $(elemento).attr("provAvatar");
    $("#logoactual").attr("src", avatar);
    $("#nombre_img").html(nombre);
    $("#id_logo_prov").val(id);
    $("#funcion").val(funcion);
    $("#avatar").val(avatar);
  });
  $("#form-logo").submit((e) => {
    let formData = new FormData($("#form-logo")[0]);
    $.ajax({
      url: "../Controllers/ClienteController.php",
      type: "POST",
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
    }).done(function (response) {
      const json = JSON.parse(response);
      if (json.alert == "edit") {
        $("#logoactual").attr("src", json.ruta);
        $("#edit-prov").hide("slow");
        $("#edit-prov").show(1000);
        $("#edit-prov").hide(5000);
        $("#form-logo").trigger("reset");
        buscar_prov();
      } else {
        $("#noedit-prov").hide("slow");
        $("#noedit-prov").show(1000);
        $("#noedit-prov").hide(2000);
        $("#form-logo").trigger("reset");
        buscar_prov();
      }
    });
    e.preventDefault();
  });
  $(document).on("click", ".editar", (e) => {
    const elemento =
      $(this)[0].activeElement.parentElement.parentElement.parentElement
        .parentElement;
    const id = $(elemento).attr("cliId");
    const nombre = $(elemento).attr("cliNombre");
    const telefono = $(elemento).attr("cliTelefono");
    const direccion = $(elemento).attr("cliDireccion");
    const razonsocial = $(elemento).attr("cliRazonSocial");
    const cuit = $(elemento).attr("cliCuit");
    const CondicionIva = $(elemento).attr("cliCondicionIva");
    $("#id_edit_cliente").val(id);
    $("#nombre_cliente").val(nombre);
    $("#telefono_cliente").val(telefono);
    $("#direccion_cliente").val(direccion);
    $("#razon_social_cliente").val(razonsocial);
    $("#cuit_cliente").val(cuit);
    $("#condicion_iva_cliente").val(CondicionIva);
    edit = true;
    const buttonClose = document.getElementById("close");
    buttonClose.addEventListener("click", (e) => {
      e.preventDefault();
      $("#form-crear-cliente").trigger("reset");
    });
  });
  $(document).on("click", ".borrar", (e) => {
    funcion = "borrar";
    const elemento =
      $(this)[0].activeElement.parentElement.parentElement.parentElement
        .parentElement;
    const id = $(elemento).attr("cliId");
    const nombre = $(elemento).attr("cliNombre");
    const avatar = $(elemento).attr("cliAvatar");

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
        text: "No vas a ver mas este el cliente " + nombre + "!",
        imageUrl: "" + avatar + "",
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
            "../Controllers/ClienteController.php",
            { id, funcion },
            (response) => {
              edit == false;
              if (response == "borrado") {
                swalWithBootstrapButtons.fire(
                  "Borrado!",
                  "El cliente " + nombre + " fue borrado.",
                  "success"
                );
                obtener_cliente();
                buscar_cliente();
              } else {
                swalWithBootstrapButtons.fire(
                  "No se pudo borrar!",
                  "El cliente " +
                    nombre +
                    " no fue borrado porque esta siendo usado en un lote.",
                  "error"
                );
              }
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelado",
            "Tu cliente " + nombre + " esta a salvo :)",
            "error"
          );
        }
      });
  });
  $(document).on("click", ".editar-buscar", (e) => {
    const elemento =
      $(this)[0].activeElement.parentElement.parentElement.parentElement
        .parentElement;
    const id = $(elemento).attr("cliId");
    const nombre = $(elemento).attr("cliNombre");
    const telefono = $(elemento).attr("cliTelefono");
    const direccion = $(elemento).attr("cliDireccion");
    const razonsocial = $(elemento).attr("cliRazonSocial");
    const cuit = $(elemento).attr("cliCuit");
    const CondicionIva = $(elemento).attr("cliCondicionIva");
    $("#id_edit_cliente").val(id);
    $("#nombre_cliente").val(nombre);
    $("#telefono_cliente").val(telefono);
    $("#direccion_cliente").val(direccion);
    $("#razon_social_cliente").val(razonsocial);
    $("#cuit_cliente").val(cuit);
    $("#condicion_iva_cliente").val(CondicionIva);
    edit = true;
    const buttonClose = document.getElementById("close");
    buttonClose.addEventListener("click", (e) => {
      e.preventDefault();
      $("#form-crear-cliente").trigger("reset");
    });
  });
  $(document).on("click", ".borrar-buscar", (e) => {
    funcion = "borrar";
    const elemento =
      $(this)[0].activeElement.parentElement.parentElement.parentElement
        .parentElement;
    const id = $(elemento).attr("cliId");
    const nombre = $(elemento).attr("cliNombre");
    const avatar = $(elemento).attr("cliAvatar");

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
        text: "No vas a ver mas este el cliente " + nombre + "!",
        imageUrl: "" + avatar + "",
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
            "../Controllers/ClienteController.php",
            { id, funcion },
            (response) => {
              edit == false;
              if (response == "borrado") {
                swalWithBootstrapButtons.fire(
                  "Borrado!",
                  "El cliente " + nombre + " fue borrado.",
                  "success"
                );
                obtener_cliente();
                buscar_cliente();
              } else {
                swalWithBootstrapButtons.fire(
                  "No se pudo borrar!",
                  "El cliente " +
                    nombre +
                    " no fue borrado porque esta siendo usado en un lote.",
                  "error"
                );
              }
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelado",
            "Tu cliente " + nombre + " esta a salvo :)",
            "error"
          );
        }
      });
  });

  //

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
