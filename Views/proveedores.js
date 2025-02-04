$(document).ready(function () {
  Loader("Cargando Datos");
  verificar_sesion();
  toastr.options = {
    preventDuplicates: true,
  };
  let edit = false;
  let telefonosCount = 1;

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
          $("#gestion_pedidos").show();
          $(".nav-header").show();
          $("#cat-carrito").show();
          $("#content_admin").show();
          obtener_proveedores();
          buscar_prov();
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
  $("#form-crear").submit((e) => {
    const telefonos = $('input[name="telefonos[]"]')
      .map(function () {
        return $(this).val();
      })
      .get();
    let id = $("#id_edit_prov").val();
    let razonsocial = $("#razonsocial").val();
    let nombre = $("#nombre").val();
    let direccion = $("#direccion").val();
    let cuit = $("#cuit").val();
    let condicion_iva = $("#condicion_iva").val();
    let cbu = $("#cbu").val();
    let cvu = $("#cvu").val();
    let funcion;
    if (edit == true) {
      funcion = "editar";
    } else {
      funcion = "crear";
    }
    $.post(
      "../Controllers/ProveedorController.php",
      {
        id,
        nombre,
        direccion,
        cuit,
        razonsocial,
        condicion_iva,
        cbu,
        cvu,
        telefonos,
        funcion,
      },
      (response) => {
        if (response == "add") {
          toastr.success("Proveedor Agregado con exito", "Exito!");
          $("#form-crear").trigger("reset");
          obtener_proveedores();
          buscar_prov();
        }
        if (response == "edit") {
          toastr.success("Proveedor Editado con exito", "Exito!");
          $("#form-crear").trigger("reset");
          obtener_proveedores();
          buscar_prov();
        }
        if (response == "noadd") {
          toastr.error("No se ha podido agregar proveedor", "Exito!");
          $("#form-crear").trigger("reset");
        }
        edit = false;
      }
    );
    e.preventDefault();
  });
  async function obtener_proveedores() {
    let funcion = "obtener_proveedores";
    let request = await fetch("../Controllers/ProveedorController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });
    if (request.ok) {
      let response = await request.text();
      try {
        let proveedores = JSON.parse(response);
        let template = "";
        proveedores.forEach((proveedor) => {
          // Generar una lista de teléfonos
          const telefonosList = proveedor.telefonos
            .map((telefono) => {
              return `<li class="small"><span class="fa-li"><i class="fab fa-whatsapp"></i></span>${telefono}</li>`;
            })
            .join("");

          template += `
                        <div provId="${proveedor.id}" 
                            provNombre="${proveedor.nombre}" 
                            provDireccion="${proveedor.direccion}" 
                            provRazonSocial="${proveedor.razon_social}" 
                            provCuit="${proveedor.cuit}" 
                            provCondicionIva="${proveedor.condicion_iva}" 
                            provAvatar="${proveedor.avatar}" 
                            provCbu="${proveedor.cbu}" 
                            provCvu="${
                              proveedor.cvu
                            }" class="col-12 col-sm-8 col-md-4">
                            <div class="card bg-light d-flex flex-fill">
                                <div class="card-header text-muted border-bottom-0">
                                    <h1 class="badge badge-success">Proveedor</h1>
                                </div>
                                <div class="card-body pt-0">
                                    <div class="row">
                                        <div class="col-9">
                                        <h2 class="lead"><b>${
                                          proveedor.nombre
                                        }</b></h2>
                                        <ul class="ml-4 mb-0 fa-ul text-muted">
                                            <li class="small"><span class="fa-li"><i class="fas fa-lg fa-building"></i></span><span class="badge badge-info"> Direccion:</span> ${
                                              proveedor.direccion
                                            }</li>
                                            <li class="small"><span class="fa-li"><i class="fas fa-landmark"></i></span><span class="badge badge-info"> Razon Social:</span> ${
                                              proveedor.razon_social
                                            }</li>
                                            <li class="small"><span class="fa-li"><i class="fas fa-id-card"></i></span><span class="badge badge-info"> C.U.I.T:</span> ${
                                              proveedor.cuit
                                            }</li>
                                            ${
                                              proveedor.cbu
                                                ? `<li class="small"><span class="fa-li"><i class="fas fa-university"></i></span><span class="badge badge-info"> CBU:</span> ${proveedor.cbu}</li>`
                                                : ""
                                            }
                                            ${
                                              proveedor.cvu
                                                ? `<li class="small"><span class="fa-li"><i class="fas fa-university"></i></span><span class="badge badge-info"> CVU:</span> ${proveedor.cvu}</li>`
                                                : ""
                                            }
                                        </ul>
                                        <ul class="ml-4 mb-0 fa-ul text-muted">
                                            <li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span><span class="badge badge-info"> Teléfonos:</span> 
                                                <ul>${telefonosList}</ul>
                                            </li>
                                        </ul>
                                        </div>
                                        <div class="col-3 text-center">
                                        <img src="${
                                          proveedor.avatar
                                        }" alt="user-avatar" class="img-circle img-fluid img-md">
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <div class="text-right">
                                        <button type="button" data-toggle="modal" data-target="#crearproveedor" class="editar-proveedor btn btn-sm btn-success">
                                            <i class="fas fa-pencil-alt" style="color: white;"></i>
                                        </button>
                                        <button class="borrar-proveedor btn btn-sm btn-danger">
                                            <i class="fas fa-trash-alt" style="color: white;"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
        });
        $("#all_proveedores").html(template);
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
  async function buscar_prov(consulta) {
    let funcion = "buscar";
    let formData = new FormData();
    formData.append("funcion", funcion);

    if (consulta !== "") {
      formData.append("consulta", consulta);
    }

    let request = await fetch("../Controllers/ProveedorController.php", {
      method: "POST",
      body: formData,
    });

    if (request.ok) {
      let response = await request.text();
      try {
        let proveedores = JSON.parse(response);
        let template = "";

        proveedores.forEach((proveedor) => {
          const telefonosList = proveedor.telefonos
            .map((telefono) => {
              return `<li class="small"><span class="fa-li"><i class="fab fa-whatsapp"></i></span>${telefono}</li>`;
            })
            .join("");
          template += `
                        <div provId="${proveedor.id}" 
                            provNombre="${proveedor.nombre}" 
                            provDireccion="${proveedor.direccion}" 
                            provRazonSocial="${proveedor.razon_social}" 
                            provCuit="${proveedor.cuit}" 
                            provCondicionIva="${proveedor.condicion_iva}" 
                            provAvatar="${
                              proveedor.avatar
                            }" class="d-flex justify-content-center align-items-center col-12 col-sm-2 col-md-12">
                            
                            <div class="card bg-light d-flex flex-fill">
                                <div class="card-header text-muted border-bottom-0">
                                    <h1 class="badge badge-success">Proveedor</h1>
                                </div>
                                <div class="card-body pt-0">
                                    <div class="row">
                                        <div class="col-7">
                                        <h2 class="lead"><b>${
                                          proveedor.nombre
                                        }</b></h2>
                                        <ul class="ml-4 mb-0 fa-ul text-muted">
                                            <li class="small"><span class="fa-li"><i class="fas fa-lg fa-building"></i></span> Direccion: ${
                                              proveedor.direccion
                                            }</li>
                                            <li class="small"><span class="fa-li"><i class="fas fa-lg fa-at"></i></span> Razon Social: ${
                                              proveedor.razon_social
                                            }</li>
                                            ${
                                              proveedor.cbu
                                                ? `<li class="small"><span class="fa-li"><i class="fas fa-university"></i></span><span class="badge badge-info"> CBU:</span> ${proveedor.cbu}</li>`
                                                : ""
                                            }
                                            ${
                                              proveedor.cvu
                                                ? `<li class="small"><span class="fa-li"><i class="fas fa-university"></i></span><span class="badge badge-info"> CVU:</span> ${proveedor.cvu}</li>`
                                                : ""
                                            }
                                            <li class="small"><span class="fa-li">
                                                <i class="fas fa-lg fa-phone"></i></span><span class="badge badge-info">Teléfonos:</span> 
                                                <ul>${telefonosList}</ul>
                                            </li>
                                        </ul>
                                            
                                        </div>
                                        <div class="col-5 text-center">
                                        <img src="${
                                          proveedor.avatar
                                        }" alt="user-avatar" class="img-circle img-fluid img-lg">
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <div class="text-right">
                                        <button type="button" data-toggle="modal" data-target="#crearproveedor" class="editar-buscador btn btn-sm btn-success">
                                            <i class="fas fa-pencil-alt"></i>
                                        </button>
                                        <button class="borrar-buscador btn btn-sm btn-danger">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
        });
        const cardBody = document.getElementById("cardBody");
        const proveedoresContainer = document.getElementById("proveedores");

        // Cambiar la altura del elemento card-body
        cardBody.style.height = "auto";
        proveedoresContainer.innerHTML = template;
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

  $("#telefonos-container").on("click", ".agregar-telefono", function (e) {
    e.preventDefault();
    telefonosCount++;
    const newTelefonoField = `
            <div class="input-group mb-2">
                <input type="text" class="form-control" name="telefonos[]" placeholder="Ingresar teléfono">
                <div class="input-group-append">
                    <button class="btn btn-danger eliminar-telefono" type="button">Eliminar</button>
                </div>
            </div>
        `;

    $("#telefonos-container").append(newTelefonoField);
  });

  $("#telefonos-container").on("click", ".eliminar-telefono", function () {
    if (telefonosCount > 1) {
      telefonosCount--;
      $(this).closest(".input-group").remove();
    }
  });
  $("#cbu-toggle").change(function () {
    if (this.checked) {
      // Si el checkbox está marcado, muestra el campo "N° Motor"
      $("#cbu-input-group").show();
    } else {
      // Si el checkbox no está marcado, oculta el campo "N° cbu"
      $("#cbu-input-group").hide();
    }
  });
  $("#cvu-toggle").change(function () {
    if (this.checked) {
      // Si el checkbox está marcado, muestra el campo "N° Motor"
      $("#cvu-input-group").show();
    } else {
      // Si el checkbox no está marcado, oculta el campo "N° Motor"
      $("#cvu-input-group").hide();
    }
  });
  $(document).on("keyup", "#buscar-proveedor", function () {
    let valor = $(this).val();
    if (valor != "") {
      buscar_prov(valor);
    } else {
      buscar_prov();
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
      url: "../Controllers/ProveedorController.php",
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
  $(document).on("click", ".editar-proveedor", (e) => {
    const elemento =
      $(this)[0].activeElement.parentElement.parentElement.parentElement
        .parentElement;
    const id = $(elemento).attr("provId");
    const nombre = $(elemento).attr("provNombre");
    const direccion = $(elemento).attr("provDireccion");
    const razonsocial = $(elemento).attr("provRazonSocial");
    const cuit = $(elemento).attr("provCuit");
    const CondicionIva = $(elemento).attr("provCondicionIva");
    const cbu = $(elemento).attr("provCbu");
    const cvu = $(elemento).attr("provCvu");

    $("#id_edit_prov").val(id);
    $("#nombre").val(nombre);
    $("#direccion").val(direccion);
    $("#razonsocial").val(razonsocial);
    $("#cuit").val(cuit);
    $("#condicion_iva").val(CondicionIva);
    $("#cbu").val(cbu);
    $("#cvu").val(cvu);
    edit = true;
    const buttonClose = document.getElementById("close-prov");
    buttonClose.addEventListener("click", (e) => {
      e.preventDefault();
      $("#form-crear").trigger("reset");
    });
  });
  $(document).on("click", ".borrar-proveedor", (e) => {
    funcion = "borrar";
    const elemento =
      $(this)[0].activeElement.parentElement.parentElement.parentElement
        .parentElement;
    const id = $(elemento).attr("provId");
    const nombre = $(elemento).attr("provNombre");
    const avatar = $(elemento).attr("provAvatar");

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
        text: "No vas a ver mas este proveedor " + nombre + "!",
        imageUrl: "" + avatar + "",
        imageWidth: 100,
        imageHeight: 100,
        showCancelButton: true,
        confirmButtonText: "Si, Borralo!",
        cancelButtonText: "No, Cancela!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          $.post(
            "../Controllers/ProveedorController.php",
            { id, funcion },
            (response) => {
              if (response == "borrado") {
                swalWithBootstrapButtons.fire(
                  "Borrado!",
                  "El proveedor " + nombre + " fue borrado.",
                  "success"
                );

                obtener_proveedores();
                buscar_prov();
              } else {
                swalWithBootstrapButtons.fire(
                  "No se pudo borrar!",
                  "El proveedor " +
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
            "Tu proveedor " + nombre + " esta a salvo :)",
            "error"
          );
        }
      });
  });
  $(document).on("click", ".editar-buscador", (e) => {
    const elemento =
      $(this)[0].activeElement.parentElement.parentElement.parentElement
        .parentElement;
    const id = $(elemento).attr("provId");
    const nombre = $(elemento).attr("provNombre");
    const direccion = $(elemento).attr("provDireccion");
    const razonsocial = $(elemento).attr("provRazonSocial");
    const cuit = $(elemento).attr("provCuit");
    const CondicionIva = $(elemento).attr("provCondicionIva");
    const cbu = $(elemento).attr("provCbu");
    const cvu = $(elemento).attr("provCvu");

    $("#id_edit_prov").val(id);
    $("#nombre").val(nombre);
    $("#direccion").val(direccion);
    $("#razonsocial").val(razonsocial);
    $("#cuit").val(cuit);
    $("#condicion_iva").val(CondicionIva);
    $("#cbu").val(cbu);
    $("#cvu").val(cvu);
    edit = true;
    const buttonClose = document.getElementById("close-prov");
    buttonClose.addEventListener("click", (e) => {
      e.preventDefault();
      $("#form-crear").trigger("reset");
    });
  });
  $(document).on("click", ".borrar-buscador", (e) => {
    funcion = "borrar";
    const elemento =
      $(this)[0].activeElement.parentElement.parentElement.parentElement
        .parentElement;
    const id = $(elemento).attr("provId");
    const nombre = $(elemento).attr("provNombre");
    const avatar = $(elemento).attr("provAvatar");

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
        text: "No vas a ver mas este proveedor " + nombre + "!",
        imageUrl: "" + avatar + "",
        imageWidth: 100,
        imageHeight: 100,
        showCancelButton: true,
        confirmButtonText: "Si, Borralo!",
        cancelButtonText: "No, Cancela!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          $.post(
            "../Controllers/ProveedorController.php",
            { id, funcion },
            (response) => {
              if (response == "borrado") {
                swalWithBootstrapButtons.fire(
                  "Borrado!",
                  "El proveedor " + nombre + " fue borrado.",
                  "success"
                );

                obtener_proveedores();
                buscar_prov();
              } else {
                swalWithBootstrapButtons.fire(
                  "No se pudo borrar!",
                  "El proveedor " +
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
            "Tu proveedor " + nombre + " esta a salvo :)",
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
