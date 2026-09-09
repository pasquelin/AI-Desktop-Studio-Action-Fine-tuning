# Administration locale

L’interface d’administration utilise le même serveur local que le suivi, à l’adresse `http://127.0.0.1:4328/`. Le serveur compile ses ressources au démarrage ; aucune seconde commande de serveur web n’est nécessaire. `npm run vm:observe` ouvre le service sans lancer de test. `npm run start` conserve le lancement existant des essais et de l’observateur.

Le menu sépare quatre usages : **Live**, **Scénarios**, **Rapports** et **Vue d’ensemble**. Les primitives sont celles de DaisyUI, avec la palette sombre et le logo d’AI Desktop Studio. `npm run admin:build` vérifie la compilation locale, également incluse dans la validation générale.

## Scénarios

La liste contient les fiches de conception et les parcours structurés, identifiés séparément. Une fiche n’est pas un test exécuté. Les filtres portent sur le texte, le type, la langue et l’état.

- Une fiche de conception peut être corrigée dans sa source Markdown. Les variantes générées devront être régénérées avant utilisation.
- Un parcours peut être créé, modifié et activé pour les prochains essais. Les formulaires présentent la demande, les prérequis, les actions, leurs paramètres et leurs contrôles. Le JSON avancé expose le même contrat.
- Les traductions des demandes des parcours se modifient langue par langue et restent des brouillons à relire. Les dictionnaires de modèles de phrases partagés par les fiches de conception ne sont pas éditables ici.
- L’activation n’approuve pas l’entraînement et ne garantit pas que les prérequis soient satisfaits.

L’enregistrement valide les contrats existants et refuse d’écraser une version modifiée ailleurs depuis son ouverture. Aucun commit, push, entraînement ou lancement de VM n’est déclenché par l’enregistrement. Les rapports passés ne sont jamais réécrits.

## Rapports

Chaque tentative de construction possède son rapport : état de la VM, résultat métier, étapes réussies ou bloquées, erreurs, actions et paramètres enregistrés, versions et journaux. Les étapes en échec disposent d’un lien vers l’étape correspondante du scénario actuel, avec retour au rapport. Une différence entre la source actuelle et la version exécutée est signalée. Une étape supprimée est indiquée au lieu de sélectionner arbitrairement une autre étape.

Les captures restent limitées à la dernière session conformément au réglage de conservation. Les anciens rapports sont conservés et signalent l’indisponibilité de leurs captures. Un rapport JSON peut être téléchargé depuis son détail.

Les anciens rapports ne comportent pas toujours de timings, de résultat d’appel en échec ou de valeur observée pour chaque assertion. L’interface affiche ce qui a été enregistré et n’invente pas ces informations. Le texte d’un scénario expose son intention et ses contrôles, pas un raisonnement interne du modèle. Le diagnostic de la cause d’un échec demeure nécessaire : application, environnement, scénario ou modèle.

## Vue d’ensemble

Les compteurs distinguent fiches, parcours, parcours prêts à essayer et activation. La couverture linguistique utilise les parcours structurés comme dénominateur ; un texte présent n’est pas une traduction certifiée. Les compteurs renvoient vers les listes filtrées. Aucun taux d’apprentissage ni approbation d’entraînement n’est déduit d’un simple nombre de fichiers.
