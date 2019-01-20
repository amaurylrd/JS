<?php
	include("../../config/config.php");
	if (isset($_GET['input_name']))
		$lock = false;
	include($controllers.'meta_content.php');
	include($views.'header.php');
	include($views.'viewport.php');
	include($views.'footer.php');
?>