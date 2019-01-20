	<body>
		<header>
			<nav class="navbar navbar-expand-lg navbar-light bg-light">
				<span class="navbar-brand">Classificateur</span>
				
				<div class="collapse navbar-collapse">
					<div class="navbar-nav mr-auto"></div>
					<form action="<?php echo $controllers ?>controller.php" method="GET" class="form-inline my-2 my-lg-0" onsubmit="return form_validation(this);">
						<div class="mr-sm-2">
							<input name="input_name" class="form-control" type="search" placeholder="une mati&egrave;re (ex: MAT)" onblur="form_blur(this)" onfocus="form_helper(this)" onkeyup="form_helper(this)" autocomplete="off">
							<ul class="proposal"></ul> 
    					</div>
						<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Chercher</button>
					</form>
				</div>
			</nav>
		</header>