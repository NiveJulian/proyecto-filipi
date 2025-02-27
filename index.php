<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">

<head>
	<title>LOGIN | NEXUS</title>
	<meta charset="utf-8">
	<meta content="width=device-width, initial-scale=1.0" name="viewport">
	<link rel="apple-touch-icon" sizes="180x180" href="./Assets/favicon/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="./Assets/favicon/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="./Assets/favicon/favicon-16x16.png">
	<link rel="manifest" href="./Assets/favicon/site.webmanifest">
	<link rel="stylesheet" type="text/css" href="./Util/css/all.min.css">
	<link rel="stylesheet" type="text/css" href="./Util/css/style.css">
	<link rel="stylesheet" href="./Util/css/adminlte.min.css">
	<link rel="stylesheet" type="text/css" href="./Util/css/sweetalert2.min.css">
	<link rel="stylesheet" type="text/css" href="./Util/css/toastr.min.css">
	<link rel="stylesheet" type="text/css" href="./Util/css/custom.css">

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

	.image-logo {
		width: 100%;
		height: 150px;
		object-fit: contain;
		margin-top: -35px;
		margin-bottom: -15px;
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
	<main id="main" class="main">
		<div class="align-self-center w-100">
			<div id="login-center" align="center">
				<div class="card-login">
					<div class="card-body bg-primary rounded">

						<form id="form-login" class="login-form">

							<div class="card_header">
								<img src="./Util/img/logo.svg" alt="logo nexus" class="image-logo">
							</div>

							<div class="form-group">
								<label for="dni" class="control-label">Usuario</label>
								<input type="text" id="dni" name="dni" class="form-control input">
							</div>

							<div class="form-group">
								<label for="pass" class="control-label">Contraseña</label>
								<input type="password" id="pass" name="pass" class="form-control input">
							</div>

							<br>

							<input type="submit" class="btn btn-secondary w-100" value="Iniciar Sesion">
						</form>

					</div>
				</div>
			</div>
		</div>
	</main>
</body>

<script src="./Util/js/jquery.min.js"></script>

<script src="./Util/js/sweetalert2.min.js"></script>
<script src="./Util/js/toastr.min.js"></script>
<script src="./index.js"></script>

</html>