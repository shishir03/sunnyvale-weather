
<?php

	############################################################################
	# 	
	#	Meteotemplate
	# 	http://www.meteotemplate.com
	# 	Free website template for weather enthusiasts
	# 	Author: Jachym
	#           Brno, Czech Republic
	# 	First release: 2015
	#
	############################################################################
	#
	#	Loading Spinner
	#
	# 	A script which shows a loading spinner while redirecting.
	#
	############################################################################
	#	
	#
	# 	v17.2 Nectarine 2019-06-27
	#
	############################################################################
	
	
	include("../../config.php");
	include($baseURL."css/design.php");
	include($baseURL."header.php");
	$address = urldecode($_GET["url"]);
	if(isset($_GET['text'])){
		$text = urldecode($_GET['text']);
	}
	else{
		$text = "";
	}
?>
<html>
	<head>
		<?php metaHeader()?>
		<style>
			#spinnerDiv{
				height:100%;
				width:100%;
				display: -webkit-flex; /* Safari */
				-webkit-align-items: center; /* Safari 7.0+ */
				display: flex;
				align-items: center;
				justify-content: center;
			}
			#mtImage {
				width: 250px;
				opacity: 0.8;
				-webkit-animation: mtSpinnerAnimation 1.6s infinite ease;
				animation: mtSpinnerAnimation 1.6s infinite ease;
			}

			@-webkit-keyframes mtSpinnerAnimation {
				from {-webkit-transform: rotate(0deg);}
				to   {-webkit-transform: rotate(360deg);}
			}
		</style>
	</head>
	<body onload="redirectpage()">
		<div style="font-size:2.5em;font-weight:bold;font-variant:small-caps;position:absolute;top:10%;width:100%;text-align:center">
			<?php echo $text?>
		</div>
		<div id='spinnerDiv'>
			<img src='<?php echo $pageURL.$path?>icons/logo.png' id="mtImage">
		</div>
	</body>
	<script>
		function redirectpage(){
			window.location.href = "<?php echo $address ?>";
		}
	</script>
</html>