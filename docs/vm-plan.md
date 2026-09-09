# Plan des scripts VM

Conception : [environnement](vm-environment.md). Travail sur develop, sans scénario, commit ou téléchargement de poids.

1. Tester le cycle de vie avec un adaptateur Tart/SSH simulé : succès, erreur de build, refus de suppression sans propriété, concurrence.
2. Ajouter le moteur de cycle de vie : manifeste local privé, verrou exclusif, clone nommé par identifiant unique, arrêt systématique et suppression après succès seulement.
3. Ajouter la CLI : préparation depuis une image locale, construction depuis une référence préparée, nettoyage explicite d’une copie possédée. Ne jamais lancer de commande métier sur l’hôte.
4. Ajouter les programmes invités : contrôle de machine virtuelle, installation des outils ; récupération de develop et build figé sur sa révision. Authentification privée explicitement séparée.
5. Vérifier les tests, le format, le typage et la syntaxe shell. La recette réelle attend la fin du téléchargement et l’accès SSH invité.
