<?php
include './includes/header.php';
include './includes/toast.html';
?>
<main>
  <section id="login-section" style="display: none">
    <div class="container bg-body-secondary p-3 rounded mt-5">
      <div class="text-center">
        <h2>Bienvenue</h2>
      </div>
      <form>
        <div class="mb-3">
          <label for="mail" class="form-label">Email*</label>
          <input id="mail" type="email" class="form-control" aria-describedby="emailHelp" />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mot de passe*</label>
          <input id="password" type="password" class="form-control" />
        </div>
        <div id="login" class="btn btn-primary">Connexion</div>
      </form>
    </div>
  </section>
  <section id="dashboard-section" style="display: none"></section>
</main>
<?php include './includes/footer.html'; ?>