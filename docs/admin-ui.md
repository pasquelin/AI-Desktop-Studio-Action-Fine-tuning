# Interface React

L’interface est disponible sur `http://127.0.0.1:4328/`. Elle utilise les routes existantes de l’observateur : aucune nouvelle commande, aucun deuxième serveur, aucun changement de protocole VM. La vue « Live » est l’accueil à `/`, sans ancre. Le logo et le menu Live y reviennent sans rechargement ; l’ancien fragment `#live` est normalisé vers la racine. Le brouillon Scénarios reste monté pendant la navigation. Toutes les vues utilisent la même racine et des fragments (`/#scenarios`, `/#reports`, `/#overview`). Les anciens liens `/admin/` sont redirigés vers la racine en conservant leur fragment ; les ressources internes restent sous `/admin/`.

## Responsabilités

- `src/admin/main.tsx` : montage React et import de la feuille de style.
- `src/admin/app.tsx` : navigation par fragment, compatible avec les liens existants vers les scénarios et rapports.
- `src/admin/components/layout.tsx` : `Header`, `MainContainer`, `Columns`, `LeftColumn`, `RightColumn`, titres et empilement. Le menu principal est une composition `navbar` / `menu` daisyUI.
- `src/admin/components/primitives.tsx` : seules enveloppes des boutons, champs, listes de choix, onglets, badges, messages, détails et modale daisyUI. Ajouter une variante ici plutôt que refaire un contrôle dans une vue.
- `src/admin/components/captures.tsx` : liste et agrandissement des captures, communs au suivi et aux rapports.
- `src/admin/views/` : suivi, scénarios, éditeur, étapes, rapports et compteurs. Importer les types métier existants ; ne pas recopier les services.
- `src/admin/hooks/` : lectures annulables à la navigation, collecte des journaux et captures, suspension du suivi de fin pendant trente secondes.
- `src/admin/api.ts` : transport HTTP, pagination et libellés communs.

Les fichiers `*-repository.ts`, `scenario-api.ts`, `scenario-activation.ts` et `current-sources.ts` restent responsables des règles métier et des sources disque. Le formulaire conserve les révisions pour les mutations. Son garde de JSON vérifie seulement la possibilité d’affichage ; il ne remplace pas la validation métier côté serveur et ne donne aucune approbation d’entraînement.

## Feuille de style

`theme.css` reprend les valeurs actuelles de `aidesktopstudio-dark` dans `AI Desktop Studio/src/renderer/src/index-foundation.css`, inspectées le 9 septembre 2026. Les polices et tailles de texte proviennent du même fichier ; les jauges confort (28 px, cases 16 px) proviennent de `index-components.css`, le minimum typographique de `index-extras.css`.

La copie est volontairement limitée aux jetons utilisés et au bloc officiel du thème daisyUI. Elle ne dépend pas d’un chemin personnel à la compilation. Pour synchroniser Studio, comparer ces trois sources et reporter leurs jetons dans cette seule feuille. Aucun sélecteur de contrôle, couleur ponctuelle, dessin SVG en composant ou style inline ne doit être ajouté aux vues. Tailwind sert à l’agencement ; daisyUI fournit les primitives visuelles.

## Vérification

`npm run validate` contrôle le typage JSX, les tests métier et UI, le build Vite/Tailwind/daisyUI et les contrôles habituels du dépôt. Les tests UI fonctionnent sous jsdom avec des réponses HTTP synthétiques : ils ne lancent ni VM, ni modèle, ni entraînement. La vérification navigateur utilise les rapports existants sans enregistrer de scénario de test dans les sources réelles.

## Intégration d’accueil en attente

La route GET `/` sert désormais `dist/admin/index.html`, après autorisation explicite du changement d’accueil. Les ressources restent sous `/admin/` ; API, journaux, captures et port sont conservés.

## Édition des données structurées

`components/json-editor.tsx` utilise CodeMirror 6 via `@uiw/react-codemirror` pour les paramètres, vérifications et scénario complet : coloration JSON, fermeture des accolades, indentation, historique d’annulation et diagnostics de syntaxe. Le bouton daisyUI « Indenter » formate le JSON valide ; Tab quitte l’éditeur pour préserver la navigation clavier. Le thème CodeMirror reprend les tokens Studio via l’API de thème de la bibliothèque.

Les buffers restent des chaînes dans le brouillon React, y compris lorsqu’ils sont invalides. `json-validation.ts` valide avant envoi avec le même schéma que le serveur, extrait sans changement de règles vers `src/scenarios/declarative-schema.ts`. Les validateurs sont précompilés par `tools/build-admin-validators.ts` : aucun `eval` ni compilation dynamique dans le navigateur, la CSP reste inchangée. Le fichier `json-validators.js` est généré et ne doit pas être édité manuellement. Les règles sémantiques, références et conflits de révision restent vérifiés côté serveur. Aucun enregistrement automatique.

Les drapeaux et noms de langues sont centralisés dans `components/language.tsx`, sans changement des codes de langue. Les badges utilisent la classe native daisyUI `badge` et sa jauge standard ; le token de taille des petites cases à cocher est isolé pour ne plus réduire leur hauteur et leur padding natifs.

Références : [CodeMirror](https://codemirror.net/docs/ref/), [composant React](https://github.com/uiwjs/react-codemirror).
