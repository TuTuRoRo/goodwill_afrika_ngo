# Goodwill Afrika — site web

Page d'accueil construite à partir de la maquette Stitch (`../goodwill_afrika_accueil`) et du design system `../pan_african_impact/DESIGN.md`.

## Lancer en local

```sh
./serve.sh            # http://localhost:8000
PORT=3000 ./serve.sh  # autre port
```

## Structure

- `index.html` — page d'accueil (Tailwind via CDN, configuré avec les tokens du design system)
- `assets/css/site.css` — styles complémentaires (toast, modale, défilement)
- `assets/js/main.js` — menu mobile, sélection de don, filtres publications/agenda, fiches ODD, formulaires
- `assets/img/` — photos et logo en local

Les liens vers des pages non encore maquettées (Notre équipe, Observatoire, mentions légales…) affichent un message « bientôt disponible ».

## Déploiement

Le site est publié sur Vercel depuis la branche `main` (site statique, aucune étape de build).
Chaque `git push` sur `main` déclenche un nouveau déploiement.

Les fichiers de maquette d'origine (Stitch) se trouvent dans `design/` et ne sont pas publiés (`.vercelignore`).
