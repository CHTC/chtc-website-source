<?php

if(isset($_POST["captcha"])) {

  // Use Google reCAPTCHA to slow down spam
  $recaptcha_response = $_POST["captcha"];
  unset($_POST["captcha"]);
  
  $recaptcha_secret_key_path = "/etc/keys/chtc-captcha.key";
  $afs_recaptcha_secret_key_path = "/p/condor/chtc-web/google-captcha/secret.key";
  $recaptcha_secret_key = "";
  if(file_exists($recaptcha_secret_key_path)) {
    $recaptcha_secret_key = trim(file_get_contents($recaptcha_secret_key_path));
  }
  if(! $recaptcha_secret_key) {  // doesn't exist or can't load - try it from AFS
    $recaptcha_secret_key = trim(file_get_contents($afs_recaptcha_secret_key_path));
  }
  $recaptcha_url = "https://www.google.com/recaptcha/api/siteverify";

  $recaptcha_post_data = array(
    "secret" => $recaptcha_secret_key,
    "response" => $recaptcha_response,
  );

  $curl = curl_init($recaptcha_url);
  curl_setopt($curl, CURLOPT_POST, true); // send POST
  curl_setopt($curl, CURLOPT_POSTFIELDS, $recaptcha_post_data);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true); // return JSON
  $json_response = curl_exec($curl);
  curl_close($curl);

  $recaptcha_data = json_decode(trim($json_response), True);
  $recaptcha_success = $recaptcha_data["success"];

  foreach ($_POST as $key=>$value) {
    //printf("[$key] => $value\n");
    $messg = $messg . "[$key] => $value\n";
    if($key == "NetID") {
      $email = ($value . "@wisc.edu");
      //printf("set email to $email\n");
    }
    if($key == "FullName" && $value) {
      $fullname = $value;
      //printf("set fullname to $fullname\n");
    }
    if($key == "PrimaryEmail" && $value) {
      $email = $value;
      //printf("set email to $email\n");
    }
  }

  $safe_email = escapeshellarg($email);

  if($recaptcha_success === True) { // User passed captcha
    //$fd = popen("mail -s 'CHTC Engagement Request' chtc@cs.wisc.edu -- -f$safe_email", "w");
    //$fd = popen("mail -s 'CHTC Engagement Request' chtc@cs.wisc.edu", "w");
    $fd = popen("mailx -s 'CHTC Engagement Request' -r $safe_email chtc@cs.wisc.edu", "w");
    fputs($fd, $messg);
    $e = pclose($fd);

    //printf("$e: email was sent from $safe_email!\n");

    // Send them to the the thanks page
    header( "Content-Type: text/html\n" );
    header( "Location: https://chtc.cs.wisc.edu/thanks\n\n" );

  } else { // User failed captcha
    // Send them back to the form page
    header( "Content-Type: text/html\n" );
    header( "Location: https://chtc.cs.wisc.edu/form\n\n" );

  }

} else { // Some bot didn't even set the captcha field
  // Send them back to the form page, I guess?
  header( "Content-Type: text/html\n" );
  header( "Location: https://chtc.cs.wisc.edu/form\n\n" );

}

?>

