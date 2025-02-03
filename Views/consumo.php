<?php
session_start();
include_once './layouts/header.php';
?>

<div class="modal fade" id="crear_consumo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
      <div class="card card-success">
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
                      <input type="number" id="horas_trabajo" name="horas_trabajo" class="form-control">
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
                        <button class="btn btn-success ml-1 agregar-mantenimiento" type="button">Agregar mas</button>
                      </div>
                    </div>
                  </div>
                </div>
                <input type="hidden" id="id_consumo_edit" name="id_consumo_edit" class="form-control">

                <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>

              </div>
          </form>

        </div>
        </form>
      </div>
      <div class="card-footer" id="card_footer">
      </div>
    </div>
  </div>
</div>
</div>
<title>Panel de Control</title>

<div class="content-wrapper" style="min-height: 2838.44px;">
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
  <section class="content" id="content_admin">
    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Seguimiento de consumo
            <button href="#" class="btn btn-primary ml-auto" type="button" data-toggle="modal" data-target="#crear_consumo">Registrar consumo</button>
          </h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-2 text-center" id="vehiculo_info">
            </div>
            <div class="col-md-10">
              <table id="consumo_vehiculos" class="table table-hover table-responsive text-center">
                <thead class="table-success">
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
                    <th class="text-center">Mant</th>
                    <th class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="card-footer">
          Observe y obtenga el rendimiento y consumo de cada vehiculo
        </div>
      </div>
    </div>
  </section>
  <section class="content" id="content_admin">
    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Histórico</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <div class="text-center card">
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
              <div class="text-center card">
                <div class="card-body">
                  <h3>Calculador de consumos por fecha</h3>
                  <form>
                    <div class="form-group">
                      <label for="fecha_desde">Fecha Desde:</label>
                      <input type="date" id="fecha_desde" name="fecha_desde" class="form-control">
                    </div>
                    <div class="form-group">
                      <label for="fecha_hasta">Fecha Hasta:</label>
                      <input type="date" id="fecha_hasta" name="fecha_hasta" class="form-control">
                    </div>
                    <div class="form-group">
                      <label for="total_calc_fecha">Total:</label>
                      <span class="form-control" id="total_calc_fecha"></span>
                    </div>
                    <button type="submit" id="consumo_fecha" class="btn btn-success align-middle m-1">Calcular</button>
                  </form>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="text-center card">
                <div class="card-body">
                  <h3>Calc Aceites por fecha</h3>
                  <form>
                    <div class="form-group">
                      <label for="fecha_desde_aceites">Fecha Desde:</label>
                      <input type="date" id="fecha_desde_aceites" name="fecha_desde_aceites" class="form-control">
                    </div>
                    <div class="form-group">
                      <label for="fecha_hasta_aceites">Fecha Hasta:</label>
                      <input type="date" id="fecha_hasta_aceites" name="fecha_hasta_aceites" class="form-control">
                    </div>
                    <div class="form-group">
                      <ul class="form-control d-flex" id="total_aceites" style="height: 100px;">
                        <!-- Los detalles de aceites se añadirán aquí -->
                      </ul>
                    </div>
                    <button type="submit" id="consumo_aceite" class="btn btn-success align-middle m-1">
                      Calcular
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="text-center card">
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

</div>
<?php
include_once "./layouts/footer.php";
?>
<script src="./Consumo.js"></script>