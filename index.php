<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">

<head>
	<title>LOGIN | JL</title>
	<meta charset="utf-8">
	<meta content="width=device-width, initial-scale=1.0" name="viewport">
	<link rel="stylesheet" type="text/css" href="./Util/css/style.css">
	<link rel="stylesheet" type="text/css" href="./Util/css/all.min.css">
	<link rel="stylesheet" href="./Util/css/adminlte.min.css">
	<link rel="stylesheet" type="text/css" href="./Util/css/sweetalert2.min.css">
	<link rel="stylesheet" type="text/css" href="./Util/css/toastr.min.css">
</head>
<style>
	body {
		width: 100%;
		height: calc(100%);
		position: fixed;
		top: 0;
		left: 0;
		/*background: #007bff;*/
	}

	main#main {
		width: 100%;
		height: calc(100%);
		display: flex;
		align-items: center;
		justify-content: center;
		background-size: cover;
	}
</style>

<body>
	<main id="main">
		<div class="align-self-center w-100">
			<div id="login-center" align="center">
				<div class="card-login">
					<div class="card-body">
						<!-- Formulario -->
						<form id="form-login" class="login-form">
							<!-- Titulo -->
							<div class="card_header">
								<svg height="50" width="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path d="M0 0h24v24H0z" fill="none"></path>
									<path d="M4 15h2v5h12V4H6v5H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zm6-4V8l5 4-5 4v-3H2v-2h8z" fill="currentColor"></path>
								</svg>
								<h1 class="form_heading">Ingresar</h1>
							</div>

							<div class="form-group">
								<label for="dni" class="control-label">DNI</label>
								<input type="text" id="dni" name="dni" class="form-control input">
							</div>

							<div class="form-group">
								<label for="pass" class="control-label">Contraseña</label>
								<input type="password" id="pass" name="pass" class="form-control input">
								<a href="vista/recuperar.php"></a>
								<a href="">Created JN</a>
							</div>

							<br>
							<!-- <a href="">Create Warpiece</a> -->
							<input type="submit" class="btn btn-success" value="Iniciar Sesion">
						</form>

					</div>
				</div>
			</div>
		</div>
	</main>
</body>
<!-- jquery -->
<script src="./Util/js/jquery.min.js"></script>
<!-- js -->
<script src="./Util/js/sweetalert2.min.js"></script>
<script src="./Util/js/toastr.min.js"></script>
<script src="./index.js"></script>

</html>