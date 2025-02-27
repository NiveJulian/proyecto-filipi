<?php
session_start();
session_destroy();
header('Location: ../Views/loginClient.php');
