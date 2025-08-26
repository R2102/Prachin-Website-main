<?php
require("PHPMailer/PHPMailerAutoload.php");

// Configuration
$generalInquiryEmail = 'voscartin@gmail.com'; // Email for general inquiries
$productInquiryEmail = 'graphics.voscart@gmail.com'; // Email for product inquiries
$recipientName = 'Prachin Pharmachem';
$smtpUsername = 'voscartin@gmail.com'; // SMTP username
$smtpPassword = 'yhft jnbb wptq ksnq'; // SMTP password

// Initialize response array
$response = array();

// Get form type from POST data
if (isset($_POST['form_type']) && $_POST['form_type'] === 'product_inquiry') {
    // Handle Product Inquiry Form
    $senderName = isset($_POST['name']) ? $_POST['name'] : '';
    $senderCompany = isset($_POST['company']) ? $_POST['company'] : '';
    $senderJobTitle = isset($_POST['job_title']) ? $_POST['job_title'] : '';
    $senderEmail = isset($_POST['email']) ? $_POST['email'] : '';
    $senderPhone = isset($_POST['phone']) ? $_POST['phone'] : '';
    $selectedProducts = isset($_POST['products']) ? $_POST['products'] : '';
    $senderMessage = isset($_POST['message']) ? $_POST['message'] : '';
    $senderSubject = 'New Product Inquiry from ' . $senderName;

    $messageBody = "<html><body>";
    $messageBody .= "<h2>Product Inquiry Details</h2>";
    $messageBody .= "<table>";
    $messageBody .= "<tr><td><strong>Name:</strong></td><td>$senderName</td></tr>";
    $messageBody .= "<tr><td><strong>Company:</strong></td><td>$senderCompany</td></tr>";
    $messageBody .= "<tr><td><strong>Job Title:</strong></td><td>$senderJobTitle</td></tr>";
    $messageBody .= "<tr><td><strong>Email:</strong></td><td>$senderEmail</td></tr>";
    $messageBody .= "<tr><td><strong>Phone:</strong></td><td>$senderPhone</td></tr>";
    $messageBody .= "<tr><td><strong>Products:</strong></td><td>$selectedProducts</td></tr>";
    $messageBody .= "<tr><td><strong>Message:</strong></td><td>$senderMessage</td></tr>";
    $messageBody .= "</table></body></html>";
} else {
    // Handle General Inquiry Form
    $senderName = isset($_POST['contact-name']) ? $_POST['contact-name'] : '';
    $senderEmail = isset($_POST['contact-email']) ? $_POST['contact-email'] : '';
    $senderPhone = isset($_POST['contact-phone']) ? $_POST['contact-phone'] : '';
    $senderMessage = isset($_POST['contact-message']) ? $_POST['contact-message'] : '';
    $senderSubject = 'New General Inquiry from ' . $senderName;

    $messageBody = "<html><body>";
    $messageBody .= "<h2>General Inquiry Details</h2>";
    $messageBody .= "<table>";
    $messageBody .= "<tr><td><strong>Name:</strong></td><td>$senderName</td></tr>";
    $messageBody .= "<tr><td><strong>Email:</strong></td><td>$senderEmail</td></tr>";
    $messageBody .= "<tr><td><strong>Phone:</strong></td><td>$senderPhone</td></tr>";
    $messageBody .= "<tr><td><strong>Message:</strong></td><td>$senderMessage</td></tr>";
    $messageBody .= "</table></body></html>";
}

try {
    $mail = new PHPMailer(true); // Enable exceptions
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUsername;
    $mail->Password = $smtpPassword;
    $mail->SMTPSecure = 'tls';
    $mail->Port = 465;
    $mail->SMTPDebug = 2; // Enable verbose debug output
    $mail->Debugoutput = 'error_log'; // Log to error_log

    // Email settings
    $mail->setFrom($smtpUsername, $recipientName);
    
    // Set recipient based on form type
    if (isset($_POST['form_type']) && $_POST['form_type'] === 'product_inquiry') {
        $mail->addAddress($productInquiryEmail, $recipientName . ' - Product Inquiries');
    } else {
        $mail->addAddress($generalInquiryEmail, $recipientName . ' - General Inquiries');
    }
    $mail->addReplyTo($senderEmail, $senderName);
    
    $mail->isHTML(true);
    $mail->Subject = $senderSubject;
    $mail->Body = $messageBody;

    if($mail->send()) {
        $response['status'] = 'success';
        $response['message'] = 'Thank you for your inquiry. We will contact you shortly.';
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo;
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = 'Message could not be sent. Mailer Error: ' . $e->getMessage();
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>