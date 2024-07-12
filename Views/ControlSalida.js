$(document).ready(function () {
  Loader("Cargando Datos");
  verificar_sesion();
  toastr.options = {
    preventDuplicates: true,
  };

  // LAYOUTS
  function llenar_menu_superior(usuario) {
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
    $("#menu_superior").html(template);
  }
  function llenar_menu_lateral(usuario) {
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
    $("#menu_lateral").html(template);
  }
  //

  // VERIFICACION
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
          rellenar_vehiculo();
          rellenar_personal();
          obtenerControlSalida();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Usuario no puede ingresar",
          });
          location.href = "/filippi/index.php";
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

  function obtenerControlSalida() {
    let funcion = "obtener_todos_control_salida";
    $.post(
      "../Controllers/ControlSalidaController.php",
      { funcion },
      (response) => {
        let controlesSalida = JSON.parse(response);
        let template = "";
        let lastDate = "";
        let count = 0;

        controlesSalida.forEach((control) => {
          if (control.fecha !== lastDate) {
            if (lastDate !== "") {
              template += `</div>`; // Cierra el último contenedor de fecha
            }
            template += `
                            <div class="time-label">
                                <span class="bg-danger text-white p-2 rounded">${control.fecha}</span>
                                <button class="btn btn-sm btn-toggle btn-primary" data-bs-toggle="collapse" data-bs-target="#date-${count}" aria-expanded="false" aria-controls="date-${count}">
                                    +
                                </button>
                            </div>
                            <div id="date-${count}" class="collapse">`;
            lastDate = control.fecha;
            count++;
          }

          template += `
                    <i class="fas fa-truck bg-blue me-3"></i>
                        <div class="timeline-item border p-3 mb-3">
                            <div class="d-flex align-items-center">
                                <div class="timeline-item-content flex-grow-1">
                                    <span class="time"><i class="fas fa-clock"></i> ${control.hora}</span>
                                    <h3 class="timeline-header"><a href="#">${control.empresa}</a></h3>
                                    <div class="timeline-body">
                                        Vehículo: ${control.vehiculo_codigo} - ${control.vehiculo_nombre}<br>
                                        Cantidad: ${control.cantidad}<br>
                                        Motivo: ${control.motivo}<br>
                                        Observación: ${control.observacion}<br>
                                        Chofer: ${control.chofer_nombre}
                                    </div>
                                    <div class="timeline-footer">
                                        <button class="btn btn-primary btn-sm btn-generar-remito" 
                                                data-fecha="${control.fecha}" 
                                                data-id="${control.id}" 
                                                data-numero-remito="${control.id}" 
                                                data-chofer="${control.chofer_nombre}" 
                                                data-empresa="${control.empresa}"
                                                data-patente="${control.vehiculo_codigo}" 
                                                type="button" data-toggle="modal" data-target="#remito-salida">Generar remito</button>
                                        <button class="btn btn-danger btn-sm btn-delete" data-id="${control.id}">Borrar</button>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        });

        template += `</div>`; // Cierra el último contenedor de fecha
        $("#timeline").html(template);

        // Añadir evento para cambiar el texto del botón
        $(".btn-toggle").on("click", function () {
          let $button = $(this);
          let target = $button.attr("data-bs-target");
          $(target).on("shown.bs.collapse", function () {
            $button.text("-");
          });
          $(target).on("hidden.bs.collapse", function () {
            $button.text("+");
          });
        });

        // Agregar evento para el botón de borrar
        $(".btn-delete").on("click", function () {
          let id = $(this).attr("data-id");
          if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
            // Aquí puedes llamar a una función para eliminar el registro usando AJAX
            eliminarControlSalida(id);
          }
        });

        // Agregar evento para el botón de generar remito
        $(".btn-generar-remito").on("click", function () {
          let id = $(this).attr("data-id");
          let fecha = $(this).attr("data-fecha");
          let empresa = $(this).attr("data-empresa");
          let chofer = $(this).attr("data-chofer");
          let patente = $(this).attr("data-patente");
          let numeRemito = $(this).attr("data-numero-remito");
          let numeroRemito = numeRemito.toString().padStart(7, "0");
          let templateRemito = `
                <div class="header">
                    <img src="../Util/img/Filippi.jpeg" alt="Logo">
                    <p><strong>Razón Soc JL srl</strong></p>
                    <p>CUIT: 30-71598338-5</p>
                    <p>Correo: gestionjlsrl@gmail.com</p>
                    <p>Localidad: Paso de los Libres Ctes</p>
                    <p>REMITO N°: <span id="num-remito">${numeroRemito}</span></p>
                    <p>Fecha: ${fecha}</p> <!-- Mostrar la fecha -->
                </div>`;

          $("#header-remito").html(templateRemito);
          $("#remito-empresa").html(empresa);
          $("#remito-chofer").html(chofer);
          $("#remito-patente").html(patente);

          // Aquí puedes hacer lo que necesites con el número de remito
          // Por ejemplo, puedes usar AJAX para obtener más detalles sobre el remito según su ID
        });
      }
    );
  }

  $("#cliente").on("input", function () {
    $("#remito-cliente").text($(this).val());
  });
  $("#cuit").on("input", function () {
    $("#remito-cuit").text($(this).val());
  });
  $("#correo").on("input", function () {
    $("#remito-correo").text($(this).val());
  });

  // Actualizar la fecha del remito
  function actualizarFechaRemito() {
    let today = new Date();
    let fecha =
      today.getDate() +
      "/" +
      (today.getMonth() + 1) +
      "/" +
      today.getFullYear();
    $("#remito-fecha").text(fecha);
  }

  $("#form-remito").on("submit", (e) => {
    e.preventDefault();

    let remitoData = {
      remitoNumero: $("#num-remito").text(),
      cliente: $("#remito-cliente").text(),
      cuit: $("#remito-cuit").text(),
      correo: $("#remito-correo").text(),
      fecha: $("#remito-fecha").text(),
      detalles: [],
      transportista: {
        empresa: $("#remito-empresa").text(),
        chofer: $("#remito-chofer").text(),
        patente: $("#remito-patente").text(),
      },
      funcion: "imprimir-remito",
    };

    $("#remito-tbody tr").each(function () {
      let row = $(this);
      let detalle = {
        cantidad: row.find("td").eq(0).text(),
        descripcion: row.find("td").eq(1).text(),
        valor: row.find("td").eq(2).text(),
      };
      remitoData.detalles.push(detalle);
    });

    $.ajax({
      url: "../Controllers/ControlSalidaController.php",
      type: "POST",
      data: remitoData, // Pasar los datos directamente como un parámetro
      success: function (response) {

        let responseObject = JSON.parse(response)
        // Manejar la respuesta del servidor (e.g., mostrar un mensaje, abrir el PDF generado, etc.)
        Loader("Creando PDF...");
        // Puedes redirigir al usuario para descargar el PDF o abrirlo en una nueva pestaña
        window.open(responseObject.pdfUrl, "_blank");
        CloseLoader()
      },
      error: function (xhr, status, error) {
        // Manejar errores
        alert("Ocurrió un error al enviar el remito: " + error);
      },
    });
  });

  // Agregar detalles al remito
  $("#agregar-detalle").on("click", function () {
    let cantidad = $("#cantidad-detail").val();
    let detalle = $("#detalle").val();
    let valor = $("#valor").val();

    if (cantidad && detalle && valor) {
      let row = `<tr>
            <td>${cantidad}</td>
            <td>${detalle}</td>
            <td>${valor}</td>
        </tr>`;
      $("#remito-tbody").append(row);

      // Limpiar campos después de agregar
      $("#cantidad").val("");
      $("#detalle").val("");
      $("#valor").val("");
    } else {
      alert("Por favor, complete todos los campos antes de agregar.");
    }
  });

  // Mostrar remito en tiempo real al abrir el modal
  $("#remito-salida").on("show.bs.modal", function (event) {
    let button = $(event.relatedTarget); // Botón que activó el modal
    let numeroRemito = button.data("numero-remito");
    $("#num-remito").text(numeroRemito);
    actualizarFechaRemito();
  });

  function eliminarControlSalida(id) {
    // Aquí puedes hacer una solicitud AJAX para eliminar el registro
    $.post(
      "../Controllers/ControlSalidaController.php",
      { funcion: "eliminar_control_salida", id: id },
      (response) => {
        console.log(response);
        if (response === "success") {
          // Eliminación exitosa
          toastr.success(
            "El registro se ha eliminado correctamente.",
            "Exito!"
          );
          obtenerControlSalida();
        } else {
          toastr.error("Error al eliminar el registro.!", "Error!");
        }
      }
    );
  }

  // CREAR

  $("#form-crear-control").submit((e) => {
    // let id = $('#id_edit_prod').val();
    e.preventDefault();
    let fecha = $("#fecha").val();
    let hora = $("#hora").val();
    let vehiculo = $("#vehiculo").val() || null;
    let cantidad = $("#cantidad").val();
    let motivo = $("#motivo").val();
    let observacion = $("#observacion").val() || null;
    let empresa = $("#empresa").val() || null;
    let chofer = $("#chofer").val() || null;
    // if(edit==true){
    //     funcion="editar";
    // }
    // else{
    let funcion = "crear";
    // }
    $.post(
      "../Controllers/ControlSalidaController.php",
      {
        funcion,
        fecha,
        hora,
        vehiculo,
        cantidad,
        motivo,
        observacion,
        empresa,
        chofer,
      },
      (response) => {
        console.log(response);
        if (response == "add") {
          toastr.success("Agregado con exito", "Exito!");
          $("#form-crear-control").trigger("reset");
          obtenerControlSalida();
        }
        if (response == "edit") {
          toastr.success("Vehiculo editado", "Exito!");
        }

        if (response == "noadd") {
          toastr.error("El dato ya existe!", "Error!");
          $("#form-crear-control").trigger("reset");
        }

        // edit=false
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

        $("#vehiculo").empty();

        vehiculos.forEach((vehiculo) => {
          template += `<option value="${vehiculo.id}" data-vehiculo="${vehiculo.vehiculo}">Patente: ${vehiculo.codigo}</option>`;
        });

        $("#vehiculo").html(template);
      }
    );
  }
  function rellenar_personal() {
    let funcion = "obtener_camioneros";
    $.post("../Controllers/PersonalController.php", { funcion }, (response) => {
      let personales = JSON.parse(response);
      let template = "";
      personales.forEach((personal) => {
        template += `<option value="${personal.id}">${personal.nombre}</option>`;
      });

      $("#chofer").html(template);
    });
  }

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
