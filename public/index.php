<?php include './../src/Pages/includes/header.html'; ?>
<main>
  <div class="container bg-light p-3 rounded mt-5">
    <div class="text-center"><h2>Bienvenue</h2></div>
    <form>
      <div class="mb-3">
        <label for="mail" class="form-label">Email*</label>
        <input type="email" class="form-control" id="mail" aria-describedby="emailHelp">
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Mot de passe*</label>
        <input type="password" class="form-control" id="password">
      </div>
      <button type="submit" class="btn btn-primary">Connexion</button>
    </form>
  </div>
</main>
<?php include './../src/Pages/includes/footer.html'; ?>