<?php include './includes/header.html'; ?>
<main>
  <div class="container bg-light p-3 rounded mt-5">
    <div class="text-center">
      <h2>Bienvenue</h2>
    </div>
    <form>
      <div class="mb-3">
        <label for="mail" class="form-label">Email*</label>
        <input id="mail" type="email" class="form-control" aria-describedby="emailHelp">
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Mot de passe*</label>
        <input id="password" type="password" class="form-control">
      </div>
      <button id="login" type="submit" class="btn btn-primary">Connexion</button>
    </form>
  </div>
</main>
<?php include './includes/footer.html'; ?>