![Logo](./frontend/src/assets/icon.svg)
![my-service](./frontend/src/assets/text.svg)
# Documentation my-service
- [Documentation my-service](#documentation-my-service)
  - [Introduction](#introduction)
  - [Frontend](#frontend)
    - [Technologies](#technologies)
    - [Get started](#get-started)
    - [Déploiement](#déploiement)
    - [Architecture](#architecture)
      - [Structure du dossier](#structure-du-dossier)
    - [API Client](#api-client)
    - [Components](#components)
    - [Vuex](#vuex)
  - [Backend](#backend)
    - [Technologies](#technologies-1)
    - [Get started](#get-started-1)
    - [Déploiement](#déploiement-1)
    - [Architecture](#architecture-1)
    - [Base de données](#base-de-données)
      - [Exemple de document](#exemple-de-document)
    - [Structure du dossier](#structure-du-dossier-1)
    - [Reference API](#reference-api)
      - [Notation et notes](#notation-et-notes)
      - [Authentification](#authentification)
      - [User](#user)
      - [Service](#service)
      - [Payment](#payment)
      - [Tags](#tags)

## Introduction

L'application a été réalisée à l'aide d'un serveur backend et un frontend. Nous détaillons ci-dessous le frontend et le backend

Les deux utilisent TypeScript. TypeScript est plaçé au dessus de JavaScript et fournit un typage statique facultatif, des classes et des interfaces. L'un des grands avantages est de permettre aux IDE d'aider dans la détection d'erreurs courantes tels que la détection de `null` .

Le frontend et le backend sont disponible sur [Github](https://github.com/av1m/my-service/) (le répository est privé)

## Frontend

### Technologies

Les technologies utilisés pour le frontend :

* **[TypeScript](https://www.typescriptlang.org/)** pour le typage statique
* **[VueJS](https://vuejs.org/)** pour un framework versatile et léger
* **[Vuex](https://vuex.vuejs.org/)** pour avoir de la gestion d'état et des états réactifs
* **[Vuetify](https://vuetifyjs.com/)** pour l'UI
* **[Vue router](https://router.vuejs.org/)** pour gérer au mieux les routes de l'application
* **[Axios](https://axios-http.com/)** pour requeter le serveur backend
* **[Babel](https://babeljs.io/)** pour transcompiler le JavaScript
* **[Webpack](https://webpack.js.org/)** pour regrouper les images, styles, assets, scripts, etc...
* **[Sass](https://sass-lang.com/)** : pour utiliser du style plus avancé (scss)

### Get started

Nous supposons que le projet à déjà était cloné

Placer vous dans le dossier frontend et lancer la commande permettant d'installer les dépendances

```bash
cd frontend
npm ci
```

Le dossier `node-modules` apparait.

Nous pouvons maintenant lancer le serveur d'écoute

```bash
npm run serve
```

Un serveur web est maintenant à l'écoute (sur le port `8080`)

> 💡 Il faut lancer le serveur express pour pouvoir utiliser l'application _(voir la partie backend)_

### Déploiement

Pour déployer en production le frontend, il suffit de lancer la commande `npm run build`

Cela va créer le dossier `dist/`

Il faut ainsi héberger ce dossier. Un hébergeur statique fonctionne parfaitement.

Des solutions tels que [Github Pages](https://pages.github.com/), [Netlify](https://netlify.com/), [Vercel](https://vercel.com/), [Firebase](https://firebase.google.com/), [Heroku](https://heroku.com/), etc... répondent amplement au besoin.

Dans notre cas, à chaque push effectué sur Github, nous pouvons décider d’exécuter l'action définie dans le fichier `.github/workflows/vue.yaml` à l'aide des [Github Actions](https://docs.github.com/en/actions).
Cette Github Action redéfinie l'adresse de production de l'API (backend), build l'application et l'envoie sur une branche `gh-pages` du dépôt Github.
Le code étant sur la branche `gh-pages` , Github Pages est utiliser pour déployer le site.
Le front est alors accessible à l'URL du projet [Github](https://github.com/av1m/my-service/) ([https://av1m.github.io/my-service/](https://av1m.github.io/my-service/)).

De plus, un script `frontend/deploy.sh` existe également afin de lancer un déploiement manuel.

### Architecture

Nous sommes partis d'une architecture recommandée par VueJS.
Puis, nous l'avons améliorer afin de l'adapter à notre besoin.

Aujourd'hui, l'application est fragmentée (dans des dossiers, components, modules ...) afin d'apporter un maximum de maintenabilité.

Nous avons choisi de donner des noms intuitifs, courts et simples pour éviter toute zone d'ombre.

#### Structure du dossier

```bash
📦 frontend
 ┣ 📂 node_modules # Dossier de dépendances
 ┣ 📜 .gitignore # spécifie les fichiers que Git doit ignorer
 ┣ 📜 babel.config.js # Configuration pour Babel
 ┣ 📜 .eslintrc.js # Configuration pour Eslint
 ┣ 📜 tsconfig.json # Configuration pour TypeScript
 ┣ 📜 vue.config.js # Configuration pour Vue
 ┣ 📜 package.json # Indique les dépendances et les propriétés du projet
 ┣ 📂 public # Fichiers statiques du site internet (assets) : non traités par webpack
 ┃ ┗ 📑 index.html, favicon.ico, img/, robots.txt, etc..
 ┣ 📂 src # Repertoire du site internet
 ┃ ┣ 📜 main.ts # Racine du projet (construit l'application Vue)
 ┃ ┣ 📜 App.vue # Composant principal de l'application
 ┃ ┣ 📜 registerServiceWorker.ts # Enregistrement du service worker
 ┃ ┣ 📜 shims-tsx.d.ts # Indique comment traiter les .tsx en activant jsx
 ┃ ┣ 📜 shims-vue.d.ts # Permet à l'IDE de comprendre les fichiers .vue
 ┃ ┣ 📜 shims-vuetify.d.ts # Declare le module vuetify
 ┃ ┣ 📂 api # Appel API au backend
 ┃ ┃ ┣ 📜 index.ts # Configuration globale d'Axios (middleware, interceptor, etc...)
 ┃ ┃ ┣ 📑 [a-z]+(.ts) # Fichier qui gère l'API pour une entité
 ┃ ┃ ┗ 📜 users.ts # Exemple du regex: user.ts gère la partie API pour l'utilisateur
 ┃ ┣ 📂 assets # Ressources
 ┃ ┃ ┗ ...
 ┃ ┣ 📂 components # Tous les composants de l'application
 ┃ ┃ ┣ 📑 [A-Z]{1}+[a-z]+(.vue) # Fichier qui gère un component
 ┃ ┃ ┗ 📜 Search.vue # Exemple du regex: Search.vue gère le composant de recherche
 ┃ ┣ 📂 plugins # Plugins que l'application utilise
 ┃ ┃ ┣ 📜 utils.ts # Fonctions utiles dans l'application en général
 ┃ ┃ ┗ 📜 vuetify.ts # Création et configuration de vuetify
 ┃ ┣ 📂 router # Gère le routage
 ┃ ┃ ┗ 📜 index.ts # Indique l'ensemble des routes
 ┃ ┣ 📂 store # Dossier des fichiers Vuex pour la gestion d'état (state management)
 ┃ ┃ ┣ 📜 index.ts # Création de Vuex et appel tous les modules vuex
 ┃ ┃ ┣ 📜 types.ts # Indique les types (TypeScript) que Vuex gère
 ┃ ┃ ┣ 📂 modules # Tous les modules vuex utilisés
 ┃ ┃ ┃ ┣ 📜 alert.ts # Gère les messages (erreur, succes, info, etc...)
 ┃ ┃ ┃ ┣ 📜 service.ts # Gère l'entité service
 ┃ ┃ ┃ ┣ 📜 user.ts # Gère l'entité user
 ┃ ┃ ┗ ┗ 📜 utils.ts # Module d'utilités
 ┃ ┃ 📂 views # Il s'agit de components mais non pensé pour être réutilisable (pages)
 ┃ ┃ ┣ [A-Z]{1}+[a-z]+(.vue) # Represente une page de l'application
 ┗ ┗ ┗ 📜 Login.vue # Exemple du rege: Login.vue represente la page de connexion
```

### API Client

Nous créons un client [Axios](https://github.com/axios/axios#request-config) qui se connecte au backend.

Ce client s'occupe de l'envoi et de la réception de toutes les requêtes.
Il est responsable de :

* L'URL du serveur backend (API)
* Les endpoints (`service`, `user`, `account`, etc...)
* Le timeout d'une requête
* L'ajout du token JWT automatiquement dans chaque requête
* Les messages d'erreurs à l'UI dans le cas de 4XX et 5XX, etc..

Dans le cas ou l'utilisateur est déconnecté (i.e. une requête retournée avec une erreur 401), une redirection est faite vers la page de connexion

### Components

Les composants ont été pensé afin d'être un maximum réutilisable dans l'ensemble de l'application.

Le but est de réaliser de petits components afin de croître la ré-utilisabilité et la maintenabilité du code.

Par exemple, le component [ `FloatButton` ](https://github.com/av1m/my-service/blob/master/frontend/src/components/FloatButton.vue) est disponible dans plusieurs endroits de l'application. Pour ajouter ce bouton dans n'importe quelle page, il suffit d'ajouter une ligne.

### Vuex

[Vuex](https://vuex.vuejs.org/) permet de gérer le state management.

Le but est d'extraire toute la logique (au maximum) dans des stores (modules).

Ainsi, nous components n'ont pas besoin de réaliser les appels API et la logique de l'application. C'est les modules vuex qui s'occupent de cette partie à travers les [ `state` ](https://vuex.vuejs.org/guide/state.html) , [ `mutations` ](https://vuex.vuejs.org/guide/mutations.html) , [ `actions` ](https://vuex.vuejs.org/guide/actions.html) et [ `getters` ](https://vuex.vuejs.org/guide/getters.html)

De plus, nous utilisons également des [modules nommés](https://vuex.vuejs.org/guide/modules.html#namespacing). Cela améliore la compréhension générale de l'application et le debug.

## Backend

### Technologies

Les technologies utilisés pour le backend :

* **[TypeScript](https://www.typescriptlang.org/)** pour le typage statique
* **[Express](https://expressjs.com/)** (helmet, cors, multer, etc..) : pour la création du webservice
* **[MongoDB](https://www.mongodb.com/)** (et [Mongoose](https://mongoosejs.com/)) : pour la base de données
* **[JWT](https://jwt.io/)** pour sécuriser l'API
* **[Bcrypt](https://en.wikipedia.org/wiki/Bcrypt)** pour hacher les mots de passe des utilisateurs (basé sutr Blowfish)
* **[Nodemon](https://nodemon.io/)** pour recharger automatiquement l'application pendant le développement
* **[Prettier](https://prettier.io/)** pour formatter le code et avoir un code unique chez tous les contributeurs (permet de ne pas avoir uniquement des modifications d'indentations ou de saut de lignes etc...)
* **[Mocha](https://mochajs.org/)** et **[chai](https://www.chaijs.com/)** pour effectuer des tests
* **[GTS (Google TypeScipt)](https://github.com/google/gts)** est le guide de style TypeScript de Google

### Get started

Nous supposons que le projet à déjà était cloné

Placer vous dans le dossier backend et lancer la commande permettant d'installer les dépendances

```jsx
cd backend
npm ci
```

Le dossier `node-modules` apparaît.

Nous devons ajouter le fichier de configuration `.env` .
Pour ce faire, on remplace l'exemple et on modifie les identifiants

```bash
mv .env.example .env
vim .env # on peut utiliser nano ou tout autre éditeur de texte
```

Nous pouvons maintenant lancer le serveur API

```bash
npm run nodemon
```

Un serveur de web services est maintenant à l'écoute (sur le port `3000` par défaut)

### Déploiement

Pour déployer le backend, on peut utiliser la commande `npm run compile`

Cela va créer un dossier `build/`

Puis il suffit d'utiliser [ `pm2` ](https://pm2.keymetrics.io/) (ou tout autre gestionnaire de processus de production)

Dans notre cas, nous avons utilisé [Heroku](https://www.heroku.com/nodejs). Ainsi, pour déployer l'application il suffit de créer un projet sur Heroku et de connecter l'application au dépôt Heroku

```bash
cd backend/
heroku git:remote -a my-service-ts
```

Puis, de réaliser un commit est de l'envoyer sur Heroku

```bash
cd .. # On se place au root (le repertoire parent de backend/)
git subtree push --prefix backend heroku main # On envoie le code à Heroku
```

Heroku déploie l'application et la sert à l'URL suivante : [https://my-service-ts.herokuapp.com/](https://my-service-ts.herokuapp.com/)

### Architecture

L'architecture a été réalisé de manière à découper un maximum le code.

Nous pouvons retrouver une partie pour

* La configuration de l'application

* Les middlewares permetteat de définir si une requête est correcte

  Par exemple, si l'utilisateur est bien authentifié ? a t(il bien les droits ? Son jeton est correct ?

  De plus, nous pouvons également vérifier si les paramètres que l'utilisateur envoie son correct.

* L'ensemble des routes (qui est redécoupé au sein de cette partie)

  Les routes sont définis initialement à la création de l'application, dans le fichier [ `index.ts` ](https://github.com/av1m/my-service/blob/master/backend/src/index.ts).

  Ainsi, on redirige la gestion de l'API au module [ `routes` ](https://github.com/av1m/my-service/tree/master/backend/src/routes)

  Ainsi, ce module définit l'ensemble des endpoints de premier niveau dans le fichier [ `routes/index.ts` ](https://github.com/av1m/my-service/blob/master/backend/src/routes/index.ts) en redirigeant chaque endpoint dans un fichier séparé.

  Ceci permet alors une meilleure compréhension

* Les modèles que va utiliser l'application et qui seront utilisés par mongoose afin d'instancier la base de données

* Les contrôleurs détiennent toute la logique. Les control

### Base de données

Nous utilisons une base [mongodb](https://docs.mongodb.com/manual/installation/) (plus précisément [ `MongoB Atlas` ](https://www.mongodb.com/cloud/atlas)) qui est une base de données basée sur des documents.

Côté node, nous utilisons [ `mongoose` ](https://mongoosejs.com/docs/) pour interagir avec la base de données.

Les informations sur la base de données sont stockées dans le fichier `.env`

Les modèles (schéma de base de données) sont stockés dans le répertoire [ `backend/src/model/` ](https://github.com/av1m/my-service/tree/master/backend/src/model)

Ainsi, à chaque fois que nous démarrons le serveur, les "migrations" (irréels car nous sommes en MongoDB) sont réalisés. Donc, aucun script ou commande SQL est nécessaire pour configurer la base de données. Il faut seulement la ligne suivante dans le fichier `.env`

```bash
DB_CREDENTIALS=user:password@host/ # Il faut remplacer user password et host
```

#### Exemple de document

Voici un exemple de document enregistré sur MongoDB.

Il présente un utilisateur avec l'ensemble de ses données de base (photo, email, password crypté, nom, prénom, etc..) ainsi que ses services et les paiements attachés à cet utilisateur.

Cet utilisateur à deux services (`GitHub Graduation 2021` et `Python retweet`) et à réalisé trois paiements pour les services `609873a36156b186655b04bd` , `609563dc3d8bd80018cd3a7c` , `609e024c08ae9396b3f94c42`

On remarque que son mot de passe est haché.
Il est ainsi littéralement impossible de le récupérer, par définition de la fonction de hachage [bcrypt](https://en.wikipedia.org/wiki/Bcrypt)

```json
{
  "_id": { // Id de l'utilisateur
    "$oid": "60956185cc4a41f8be35fa2e"
  },
  "profile": "60956185cc4a41f8be35fa2e", // photo de l'utilisateur
  "email": "johndoe@avim.eu",
  "password": "$2a$08$FUpILLi4omqO3QgGDD5JMe3fWJsTmSqyHFVN7/YWvYl4tjxfQ0B1S",
  "firstname": "John",
  "lastname": "Doe",
  "services": [ // Tous les services de l'utilisateur
    {
      "_id": { // Id du service
        "$oid": "60a61f6b1843d788e63fdb15"
      },
      "name": "GitHub Graduation 2021", // Nom du service
      "photo": "https://user-images.githubusercontent.com/6633808/117580730-3ed6e180-b0ae-11eb-86c9-2bd01c7aa8b6.png",
      "description": "Hi Octograds!\n\nYou all have made our week with your messages,.....",
      "tags": ["education", "github"], // Tags associé au service
      "price": { // Prix du service
        "$numberInt": "20"
      }
    },
    {
      "_id": { // Id du service
        "$oid": "60a68f78016e0f994f1e56a1"
      },
      "name": "Python retweet", // Nom du service
      "photo": "60a68f78016e0f994f1e56a1", // Photo du service
      "description": "Establishes an API connection to Twitter using Tweepy and retweet tweets based on criteria",
      "tags": ["python", "twitter", "github", "api"],
      "price": { // Prix du service
        "$numberInt": "26"
      }
    }
  ],
  "created_at": { // Date de création de l'utilisateur
    "$date": {
      "$numberLong": "1620402565354"
    }
  },
  "updated_at": { // Date de mise à jour de l'utilisateur
    "$date": {
      "$numberLong": "1621818557751"
    }
  },
  "__v": { // Nombre de modifications
    "$numberInt": "9"
  },
  "payments": [ // Tous les services auxquels l'utilisateur a souscrit
    "609873a36156b186655b04bd",
    "609563dc3d8bd80018cd3a7c",
    "609e024c08ae9396b3f94c42"
  ]
}
```

### Structure du dossier

```bash
📦 backend
 ┣ 📂 node_modules # Dossier de dépendances
 ┣ 📜 .gitignore # spécifie les fichiers que Git doit ignorer
 ┣ 📜 .env # spécifie les identifications du projet
 ┣ 📜 .env.example # Template pour le fichier .env (il n'est pas dans le .gitignore)
 ┣ 📜 .eslintignore.json # Fichiers que Eslint doit ignorer
 ┣ 📜 .eslintrc.js # Configuration pour Eslint
 ┣ 📜 .prettierignore # Fichiers que Prettier doit ignorer
 ┣ 📜 .prettierrc.js # Configuration pour Eslint
 ┣ 📜 tsconfig.json # Configuration pour TypeScript
 ┣ 📜 package.json # Indique les dépendances et les propriétés du projet
 ┣ 📜 my-service-api.postman_collection.json # Reference de l'API
 ┣ 📂 uploads # Fichiers ou sont hébergés les images pour les services et les users
 ┃ ┗ 📑 [a-zA-Z0-9] # Fichier représentant l'id du service ou de l'user
 ┣ 📂 test # Fichiers permettant de tester l'application
 ┃ ┗ 📑 [a-zA-Z0-9]+(.test.ts) # Fichier représentant l'id du service ou de l'user
 ┣ 📂 src # Repertoire de l'API
 ┃ ┣ 📜 index.ts # Racine du projet (construit l'application express)
 ┃ ┣ 📂 config # Appel API au backend
 ┃ ┃ ┗ 📜 config.ts # Configuration de mongoose et JWT
 ┃ ┣ 📂 controllers # Logique de l'API
 ┃ ┃ ┣ 📑 [a-z]+(.ts) # Fichier qui gère un component
 ┃ ┃ ┗ 📜 user.ts # Exemple du regex: user.ts gère la logique pour l'entité user
 ┃ ┣ 📂 middlewares # Controllers pour les requêtes
 ┃ ┃ ┣ 📑 [a-zA-Z]+(.ts) # Vérifie la requête et appel next() ou renvoie une erreur
 ┃ ┃ ┗ 📜 checkJwt.ts # Vérifie le token JWT de l'utilisateur
 ┃ ┣ <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #f96e6e; ">DELETE</span> Schema MongoDB (mongoose)
 ┃ ┃ ┣ 📑 [a-z]+(.ts) # Entité
 ┃ ┃ ┗ 📜 user.ts # Exemple du regex: user.ts défini le schéma d'un utilisateur
 ┃ ┣ 📂 routes # Dossier qui gère le routage de l'application express
 ┃ ┃ ┣ 📜 index.ts # Création du router express et redirige vers un fichier d'entité
 ┃ ┃ ┣ 📑 [a-z]+(.ts) # Tout le routage pour une entité donnée
 ┗ ┗ ┗ 📜 user.ts # Exemple du regex: user.ts défini les routes HTTP pour l'entité user
```

### Reference API

Pour avoir l'ensemble de la référence accessible depuis [Postman](https://www.postman.com/), vous pouvez importer le fichier [`backend/my-service-api.postman_collection.json`](https://github.com/av1m/my-service/blob/master/backend/my-service-api.postman_collection.json) sur [Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/).

Nous indiquons ici un résumé de l'API.

#### Notation et notes

* `{{baseUrl}}` définit l'adresse du serveur API (backend).
  En développement elle est par exemple égale à `127.0.0.1:3000` , et en production à `my-service-ts.herokuapp.com`

* `/:id` indique que l'utilisateur doit entré un ID dans l'URL.
  Par exemple `/user/:id` on peut donner `/user/77466`

* Les services et utilisateurs disposent d'une image de présentation/profile.
  Cette image peut être upload sur le serveur à l'aide de `multer` si on utilise la méthode `POST` permettant d'upload.
  Cependant, il est également possible d'ajouter l'URL d'une image. Dans ce cas, l'image n'est pas upload sur le serveur. Il faut utiliser les méthodes `PATCH` et indiquer la clé associé (`profile` pour `user` et `photo` pour `service`)

* 🔓 indique que l'endpoint ne nécessite pas d'authentification

  🔒 indique que l'endpoint nécessite une d'authentification

#### Authentification

L'accès à certaines ressources nécessite une authentification de l'utilisateur.

Nous utilisons une [Bearer authentification](https://swagger.io/docs/specification/authentication/bearer-authentication/) à l'aide de [JWT](https://jwt.io/) (Json Web Token) pour gérer l'accès à un utilisateur. Pour rappel, lors de la connexion, le serveur backend envoie un token JWT à l'utilisateur qui lui permet de s'authentifier pour les futures requêtes.

Nous avons [configuré](https://github.com/av1m/my-service/blob/master/backend/src/middlewares/checkJwt.ts) la validité du jeton JWT à un jour (24 heures)

Ainsi, pour s'authentifier, l'utilisateur doit ajouter une `authorization` dans les headers afin d'indiquer son Bearer (JWT) :

```bash
Authorization: Bearer <token>
# Exemple
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6
```

Un [middleware](https://github.com/av1m/my-service/blob/master/backend/src/middlewares/checkJwt.ts) vérifie que le Token est présent et est bien correcte.

⚠️ Dans la suite de cette documentation, nous utiliserons ce symbole 🔓 afin de spécifier que l'endpoint ne nécessite pas de token et 🔒 afin d'indiquer qu'un token doit être fourni

* 🔓 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #49cc90; ">POST</span> : `{{baseUrl}}/account/login`

  Connecte l'utilisateur et lui renvoie un jeton JWT qu'il devra mettre dans les futures requêtes.

  L'encodage du body doit être `application/json` et avoir les clés suivantes: `login` , `password`

* 🔒 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #49cc90; ">POST</span> : `{{baseUrl}}/account/register`
  Créer un compte.
  L'encodage du body doit être `application/json` et avoir les clés suivantes: `email`, `password`, `firstname`, `lastname`, `profile`

* 🔒 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #49cc90; ">POST</span> : `{{baseUrl}}/account/change-password`

  Changer le mot de passe de son compte (le mot de passe est encrypté à l'aide de bcrypt)

  L'encodage du body doit être `application/json` et avoir les clés suivantes: `oldPassword`, `newPassword`

#### User

> 💡 La route `{{baseUrl}}/user/me` redirige directement vers l'id de l'utilisateur associé au token JWT, c'est à dire vers cette route : `{{baseUrl}}/user/:id`.
>
> Par exemple, si l'utilisateur a l'id `66477` , l'appel à `GET {{baseUrl}}/user/me` redirigera vers `GET {{baseUrl}}/user/66477` en gardant la méthode de l'appel (GET, POST, PATCH, etc...)

* 🔒 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #61affe; ">GET</span> : `{{baseUrl}}/user/:id`

  Récupérer un utilisateur par un id

* 🔒 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #61affe; ">GET</span> : `{{baseUrl}}/user/`

  Récupérer tous les utilisateurs de la base de données

* 🔒 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #49cc90; ">POST</span> : `{{baseUrl}}/user/upload/:id`

  Ajouter une photo par l'id de l'utilisateur.
  _Il doit s'agir de l'utilisateur associé au token_
  L'encodage du body doit être `multipart/form-data` et la clé de la photo doit être `image`

* 🔓 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #49cc90; ">POST</span> : `{{baseUrl}}/user/search`
  Rechercher un utilisateur ou un service
  L'encodage du body doit être `application/json` et avoir la clé : `query`

* 🔒 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #50e3e3; ">PATCH</span> : `{{baseUrl}}/user/:id`

  Modifier un utilisateur par un id.
  _Il doit s'agir de l'utilisateur associé au token_

  L'encodage du body doit être `application/json` et avoir une/des clés suivantes: `email` , `profile` , `firstname` , `lastname`

* 🔒 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #f96e6e; ">DELETE</span> : `{{baseUrl}}/user/:id`

  Supprimer un utilisateur par l'ID.
  _Il doit s'agir de l'utilisateur associé au token_

#### Service

* 🔒 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #61affe; ">GET</span> : `{{baseUrl}}/service/:id?returnUserId=false`

  Récupérer un service par l'ID.
  Il est possible d'indiquer le paramètre `returnUserId` dans la requête (défaut = `false`).
  S'il est à `true` , le JSON contiendras l'id de l'utilisateur (e.g. `_id: "44667"`)

* 🔒 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #61affe; ">GET</span> : `{{baseUrl}}/service/random/:count/`

  Récupérer un nombre `count` de service de manières aléatoires dans la base de données (`count` doit être un entier positif).

* 🔒 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #49cc90; ">POST</span> : `{{baseUrl}}/service/`
  Créer un service
  L'encodage du body doit être `application/json` et avoir les clés : `name` , `description` , `photo` , `tags` (tableau), `price` (entier)

* 🔒 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #49cc90; ">POST</span> : `{{baseUrl}}/service/upload/:id`
  Ajouter une photo au service par l'ID.
  _Le service doit appartenir à l'utilisateur associé au token._
  L'encodage du body doit être `multipart/form-data` et la clé de la photo doit être `image`

* 🔒 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #50e3e3; ">PATCH</span> : `{{baseUrl}}/service/:id`

  Modifier un service par un id.
  _Le service doit appartenir à l'utilisateur associé au token._
  L'encodage du body doit être `application/json` et avoir une/des clés suivantes: `name` , `description` , `photo` , `tags` (tableau), `price` (entier)

* 🔒 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #f96e6e; ">DELETE</span> : `{{baseUrl}}/service/:id`

  Supprimer un service par l'ID. 
  _Le service doit appartenir à l'utilisateur associé au token._

#### Payment

* 🔒 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #61affe; ">GET</span> : `{{baseUrl}}/user/payment`

  Récupérer les payments de l'utilisateur associé au token

* 🔒 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #49cc90; ">POST</span> : `{{baseUrl}}/user/payment`
  Ajouter un payement à l'utilisateur associé au token.
  L'encodage du body doit être `application/json` et avoir la clé : `id` (référence à un service d'un autre utilisateur)

#### Tags

* 🔒 <span style="border-radius: 3px; color: #fff; padding: 5px 7px; background: #61affe; ">GET</span> : `{{baseUrl}}/tags`

  Récupérer tous les tags disponibles dans la base de données
