const transValidations = {
  password_incorrect:
    'Password must contain at least 1 letter and 1 number, and at least 6 or more characters',
  email_incorrect: 'Please fill a valid email address',
  objectId_type_incorrect: 'Please fill a valid mongoose object id',
}

const transErrors = {
  account_in_use: `Email already in use!`,
  account_undefined: `Account does not exist!`,
  account_removed: `This account has been removed from the system, if you believe this is a misunderstanding, please contact our support.`,
  account_not_active: `Registered email but not active account, please check your email or contact our support.`,

  email_undefined: 'This email is not registered in our system.',
  login_failed: `Incorrect email or password'`,
  token_undefined: `You have verified the account before.`,
  user_current_password_failed: 'Incorrect old password.',

  upload_issue: 'Issue with uploading this image.',
  upload_not_supported: 'This file is not supported.',
  upload_limit_size: 'This file is too large (Max: 2MB ).',

  server_error: `There is an error on the server side, please contact our department to report this error. Thank you!`,
}

const tranSuccess = {
  user_registered: 'Welcome! Please check your email.',
  account_actived: 'Your account has been activated, you can now sign in.',
  login_success: 'Signning success.',
  logout_success: 'Signout success.',
  avatar_update: `Uploaded avatar successfully`,
  user_info_update: `Successfully updated personal information`,
  user_password_update: 'Password successfully entered',
  sendmail_reset_password_success:
    'Re-send the password, please check your email.',
  upload_success: 'Upload successfully.',
  deleted_success: (name = '') => `Deleted ${name} successfully.`,
  updated_success: (name = '') => `Updated ${name} successfully.`,
  created_success: (name = '') => `Created ${name} successfully.`,
}

const transEmail = {
  template: (title, description, url, text) => `
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
        rel="stylesheet"
      />
      <title>Account Activation</title>
      <style>
        body {
          background-color: #333333;
          height: 100vh;
          font-family: "Roboto", sans-serif;
          color: #fff;
          position: relative;
          text-align: center;
        }
        .container {
          max-width: 700px;
          width: 100%;
          height: 100%;
          margin: 0 auto;
        }
        .wrapper {
          padding: 0 15px;
        }
        .card {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
        }
        span {
          color: #ffc107;
        }
        button {
          padding: 1em 6em;
          border-radius: 5px;
          border: 0;
          background-color: hsl(45, 100%, 51%);
          transition: all 0.3s ease-in;
          cursor: pointer;
        }
        button:hover {
          background-color: hsl(45, 70%, 51%);
          transition: all 0.3s ease-in;
        }
        .spacing {
          margin-top: 2rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="wrapper">
          <div class="card">
            <h1>${title}</h1>
            <p>${description}</p>
            <a href=${url}><button>${text}</button></a>
            <p class="spacing">
              If the button above does not work, please navigate to the link
              provided below 👇🏻
            </p>
            <div>${url}</div>
          </div>
          <div class="spacing">If you believe this email is mistaken, ignore it. Best regards!</div>
        </div>
      </div>
    </body>
  </html>`,
  send_failed: `Sorry, there was an error in sending mail`,
}

export { transValidations, transErrors, tranSuccess, transEmail }
