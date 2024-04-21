## SoWeSign SIMPLON SPA app

### Objectif et consignes du projet

L'objectif est de développer une application permettant aux formateurs de gérer les promotions, élèves et cours. Les apprenants peuvent signer pour marquer leur présence à un cours, et les formateur peuvent générer un code lorsqu'ils valident leur présence.

Le projet doit respecter les consignes suivantes :
1. Respecter le design pattern MVC.
2. Conserver les informations en base de données.
3. Ajouter un apprenant doit envoyer un mail qui lui permet de valider son compte.
4. Le MCD doit être cohérent et permettre des évolutions.
5. Les champs sont nettoyés et protégés contre les injections SQL.

### Config.php

Pour que le projet fonctionne, il faut renommer le fichier config-example.php en config.php qui se trouve dans le dossier "back-end" et remplacer les informations placeholder par les votres.

```php
<?php
    define('DB_INITIALIZED', FALSE); // Doit être à FALSE lors de la première initialisation
    define('JWT_SECRET', 'your-secret-key'); // Remplacer par une clé secrète de votre choix
    define('DB_HOST', 'localhost'); // Remplacer 'localhost' par l'adresse de votre base de données
    define('DB_NAME', 'your-db-name'); // Remplacer par votre nom de base de données
    define('DB_USER', 'your-db-user'); // Remplacer par votre nom utilisateur
    define('DB_PASS', 'your-db-password'); // Remplacer par le mot de passe d'accès  à la DB
    define('PREFIXE', 'your-prefix'); // Remplacer par cotre préfixe des tables
    define('HOME_URL', '/'); // Remplacer par votre URL en back end
    define('FRONT_URL', 'http://your-frontend-url/'); // Remplacer par votre URL en front end
```

### Config.js

Pour que le projet fonctionne, il faut renommer le fichier config-example.js en config.js qui se trouve dans le dossier "front-end/assets/js" et remplacer les informations placeholder par les votres.

```javascript
export const HOME_URL = ''; // Remplacer par votre URL front-end
export const API_URL = 'http://your-backend-url/'; // Remplacer par votre URL back-end
```

### Migration

À la première initialisation du projet, le fichier SWSDatabase.sql est chargé.
Ce fichier se trouve dans le dossier back-end/src/Migration. 
Pour modifier la structure ou le contenu de la base de données, il faut éditer ce fichier. 

### Utilisateurs par défault

La base de données est initialisée avec des utilisateurs par défaut dont un avec les droits formateur :
1. Mail : formateur@simplon.fr
2. Password : simplon

Tous les utilisateurs apprenants ont pour mot de passe 'simplon' également.

### Fichiers utiles

1. Le fichier MCD avec son schéma se trouvent dans le dossier Ressources. 

### Versions

Ce projet a été créé avec :
1. PHP 8.3.2
2. MySQL 5.7

