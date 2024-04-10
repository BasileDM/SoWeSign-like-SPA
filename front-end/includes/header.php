<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Simplon SoWeSign</title>
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous" />
  <script src="./assets/js/app.js" type="module" defer></script>
</head>

<body data-bs-theme="dark">
  <header>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <div>
          <img src="./assets/imgs/logo32x32.png" alt="" />
          <a class="navbar-brand" href="./home">SIMPLON</a>
        </div>
        <?php if (isset($_SESSION['user_mail'])) { ?>
          <a id="nav-logout" class="nav-link active" aria-current="page" href="./login">Déconnexion</a>
        <?php } else { ?>
          <a id="nav-login" class="nav-link active" aria-current="page" href="./login">Coooonnexion</a>
        <?php } ?>
      </div>
    </nav>
  </header>