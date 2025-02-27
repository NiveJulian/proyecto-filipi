<?php
session_start();
include_once './layouts/header.php';
?>
<style>
  /* Ocultar las secciones inicialmente */
  #content_admin_table,
  #content_admin_calc {
    display: none;
  }

  .avatar-vehiculo {
    width: 100%;
    object-fit: contain;
  }

  #vehiculo_info {
    border: 2px solid #e0e0e0;
    border-radius: 10%;
  }

  .content-wrapper {
    height: 100vh;
    overflow-y: scroll;
  }

  .content-wrapper::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .content-wrapper::-webkit-scrollbar-thumb {
    background-color: rgba(53, 53, 53, 0.3);
    border-radius: 10px;
  }

  .content-wrapper:hover::-webkit-scrollbar-thumb {
    background-color: rgba(53, 53, 53, 0.3);
  }
</style>

<div class="modal fade" id="seleccionar_vehiculo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">¿Qué vehículo quieres ver?</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form id="formSeleccionarVehiculo">
          <div class="form-group">
            <select class="form-control select2" name="vehiculo" id="vehiculo"></select>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
        <button type="button" id="vehiculo_seleccionado" class="btn btn-primary">Guardar</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="crear_consumo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
      <div class="card card-secondary">
        <div class="card-header">
          <h3 class="card-title">Resumen</h3>
          <button data-dismiss="modal" aria-label="close" class="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="card-body">

          <h5><b>Registro de consumo</b></h5>
          <form id="form-control-combustible">

            <div class="row">
              <div class="col-lg-6 border-right">

                <hr>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="fecha_asignada">Fecha:</label>
                      <input type="date" id="fecha_asignada" name="fecha_asignada" class="form-control">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="horas_trabajo">Horas de trabajo:</label>
                      <input type="time" id="horas_trabajo" name="horas_trabajo" class="form-control">
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="horas">Horometro</label>
                  <input class="form-control" type="number" name="horas" id="horas" placeholder="Ingresar horometro del vehiculo"></input>
                </div>
                <div class="form-group">
                  <label for="lugar_trabajo">Lugar de trabajo</label>
                  <input class="form-control" type="text" name="lugar_trabajo" id="lugar_trabajo" placeholder="Ingresar lugar de trabajo"></input>
                </div>
                <div class="form-group">
                  <label for="cantidad_combustible">Cantidad de combustible: <span class="badge badge-info">Litros</span></label>
                  <input type="number" id="cantidad_combustible" name="cantidad_combustible" class="form-control" placeholder="Ingresar cantidad de combustible">
                </div>
              </div>
              <div class="col-lg-6">
                <hr>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="aceite_motor">Aceite Motor:
                        <input type="text" id="aceite_motor" name="aceite_motor" class="form-control" placeholder="Ingresar aceite de motor">
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="aceite_hidraulico">Aceite hidraulico:
                        <input type="text" id="aceite_hidraulico" name="aceite_hidraulico" class="form-control" placeholder="Ingresar aceite de hidraulico">
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="aceite_transmision">Aceite transmision:
                        <input type="text" id="aceite_transmision" name="aceite_transmision" class="form-control" placeholder="Ingresar aceite de transmision">
                    </div>
                  </div>

                </div>
                <div class="form-group" id="mantenimiento-group">
                  <label for="mantenimiento">Mantenimiento</label>
                  <div id="mantenimiento-container">
                    <div class="input-group mb-2">
                      <input type="text" class="form-control mr-1" name="mantenimiento[]" placeholder="Ingresar mantenimiento">
                      <div class="input-group-append">
                        <button class="btn btn-primary ml-1 agregar-mantenimiento" type="button">Agregar mas</button>
                      </div>
                    </div>
                  </div>
                </div>
                <input type="hidden" id="id_consumo_edit" name="id_consumo_edit" class="form-control">

                <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>

              </div>
            </div>

          </form>
        </div>
      </div>
      <div class="card-footer" id="card_footer">
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="crear_mantenimiento" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-md" role="document">
    <div class="modal-content">
      <div class="card card-secondary">
        <div class="card-header">
          <h2 class="card-title">Mantenimiento Preventivo y Correctivo</h2>
          <button data-dismiss="modal" aria-label="close" class="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="card-body">
          <h5><b>Registro de consumo</b></h5>
          <form id="formMantenimiento">
            <div class="form-group mb-3">
              <label for="tipo" class="form-label">Tipo de mantenimiento</label>
              <select id="tipo" name="tipo" class="form-control" required>
                <option value="preventivo">Preventivo</option>
                <option value="correctivo">Correctivo</option>
              </select>
            </div>
            <div class="form-group mb-3">
              <label for="descripcion" class="form-label">Descripción</label>
              <textarea id="descripcion" name="descripcion" class="form-control" required></textarea>
            </div>
            <div class="form-group mb-3">
              <label for="fecha" class="form-label">Fecha</label>
              <input type="date" id="fecha" name="fecha" class="form-control" required>
            </div>
            <div class="form-group mb-3">
              <label for="costo" class="form-label">Costo</label>
              <input type="number" id="costo" name="costo" class="form-control" step="0.01" required>
            </div>
            <div class="form-group mb-3">
              <label for="taller" class="form-label">Taller Asignado</label>
              <input type="text" id="taller" name="taller" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="estado">Estado del mantenimiento</label>
              <select id="estado" name="estado" class="form-control" required>
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Registrar Mantenimiento</button>
          </form>

        </div>
      </div>
      <div class="card-footer" id="card_footer">
      </div>
    </div>
  </div>
</div>


<title>Panel de Control</title>

<div class="content-wrapper">
  <section class="content-header">
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-sm-6">
          <h1>Panel Consumo</h1>
        </div>
        <div class="col-sm-6">
          <ol class="breadcrumb float-sm-right">
            <li class="breadcrumb-item"><a href="../Views/dashboard.php">Inicio</a></li>
            <li class="breadcrumb-item active">Panel Vehiculos</li>
          </ol>
        </div>
      </div>
    </div>
  </section>
  <section class="content" id="content_admin_table">
    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Seguimiento de consumo
            <button href="#" class="btn btn-primary ml-auto" type="button" data-toggle="modal" data-target="#crear_consumo">Registrar consumo</button>
          </h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-2 d-flex justify-content-center align-content-center text-center" id="vehiculo_info">
            </div>
            <div class="col-md-10">
              <div class="row mb-3">
                <div class="col-md-3">
                  <label for="filtro_fecha">Filtrar por:</label>
                  <select id="filtro_fecha" class="form-control">
                    <option value="dia">Día</option>
                    <option value="semana">Semana</option>
                    <option value="mes">Mes</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="fecha_seleccionada">Seleccionar fecha:</label>
                  <input type="date" id="fecha_seleccionada" class="form-control">
                </div>
                <div class="col-md-3 d-flex align-items-end justify-content-between">
                  <button id="aplicar_filtro" class="btn btn-sm btn-primary">Aplicar Filtro</button>
                  <button id="borrar_filtro" class="btn btn-sm btn-secondary">borrar Filtro</button>
                </div>
              </div>
              <div class="table-responsive">
                <table id="consumo_vehiculos" class="table table-bordered table-striped w-100">
                  <thead class="table-light">
                    <tr>
                      <th class="text-center">#</th>
                      <th>Fecha</th>
                      <th class="text-center">Horometro</th>
                      <th class="text-center">Trabajo</th>
                      <th class="text-center">Horas</th>
                      <th class="text-center">Lts Comb</th>
                      <th class="text-center">Lts Motor</th>
                      <th class="text-center">Lts hidrau</th>
                      <th class="text-center">Lts Trans</th>
                      <th class="text-center">Mantenimiento</th>
                      <th class="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          Observe y obtenga el rendimiento y consumo de cada vehiculo
        </div>
      </div>
    </div>
  </section>
  <section class="content" id="content_admin_calc">
    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Histórico</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="text-center card h-100">
                <div class="card-body">
                  <h3>Consumo histórico</h3>
                  <div class="form-group">
                    <label for="historial_horas">Horas de trabajo:</label>
                    <span id="historial_horas"></span>
                  </div>
                  <div class="form-group">
                    <label for="hist_litros_comb">Litro de combustible:</label>
                    <span id="hist_litros_comb"></span>
                  </div>
                  <div class="card-footer">
                    <span id="total_historico">
                      0
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="text-center card h-100">
                <div class="card-body">
                  <h3>Service</h3>
                  <form>
                    <div class="form-group">
                      <label for="ultimo_service">Último Service:</label>
                      <span class="form-control" id="ultimo_service"></span>
                    </div>
                    <div class="form-group">
                      <label for="proximo_service">Proximo Service:</label>
                      <span class="form-control" id="prox_service"></span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">

        </div>
      </div>
    </div>
  </section>
  <section class="content" id="content_admin_table">
    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Historial de Mantenimientos
            <button href="#" class="btn btn-primary ml-auto" type="button" data-toggle="modal" data-target="#crear_mantenimiento">Registrar mantenimiento</button>
          </h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-12 w-100">
              <div class="row mb-3">
                <div class="col-md-3">
                  <label for="filtro_fecha_mantenimiento">Filtrar por:</label>
                  <select id="filtro_fecha_mantenimiento" class="form-control">
                    <option value="dia">Día</option>
                    <option value="semana">Semana</option>
                    <option value="mes">Mes</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="fecha_seleccionada_mantenimiento">Seleccionar fecha:</label>
                  <input type="date" id="fecha_seleccionada_mantenimiento" class="form-control">
                </div>
                <div class="col-md-3 d-flex align-items-end justify-content-between">
                  <button id="aplicar_filtro_mantenimiento" class="btn btn-sm btn-primary">Aplicar Filtro</button>
                  <button id="borrar_filtro_mantenimiento" class="btn btn-sm btn-secondary">borrar Filtro</button>
                </div>
              </div>
              <div class="table-responsive">
                <table id="listaMantenimientos" class="table table-bordered table-striped w-100">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tipo</th>
                      <th>Descripción</th>
                      <th>Fecha</th>
                      <th>Taller</th>
                      <th>Estado</th>
                      <th>Costo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Los datos se cargarán con jQuery -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          Observe y obtenga el registro de mantenimiento de cada vehiculo
        </div>
      </div>
    </div>
  </section>

</div>
<?php
include_once "./layouts/footer.php";
?>
<script type="module" src="./Consumo.js"></script>