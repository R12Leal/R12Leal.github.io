<?php
// Check for empty fields
if(empty($_POST['name'])  		||
   empty($_POST['email']) 		||
// empty($_POST['phone']) 		||
   empty($_POST['message'])	||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
	  echo "No arguments Provided!";
	  return false;
   }
	
$name = $_POST['name'];
$email_address = $_POST['email'];
// phone = $_POST['phone'];
$message = $_POST['message'];
	
// Create the email and send the message
$to = 'leal.ramses@gmail.com'; 
$email_subject = "¡R12Leal - Formulario Website: mensaje de $name!";
$email_body = "R12Leal tienes un mensaje enviado desde tu website.\n\n"."Estos son los detalles:\n\nNombre: $name\n\nE-mail: $email_address\n\nMensaje:\n$message";
$headers = "From: noreply@yourdomain.com\n"; 
$headers .= "Reply-To: $email_address";	
mail($to,$email_subject,$email_body,$headers);
return true;

// $email_body = "\n\nPhone: $phone"

?>