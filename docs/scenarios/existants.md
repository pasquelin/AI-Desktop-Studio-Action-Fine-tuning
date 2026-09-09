# Demandes déjà présentes dans Studio

481 demandes extraites du fichier de batterie à la révision `6299591dcfeff889fa40e2a7cfc1d98fe4231ab4`. Les cases et résultats historiques ne sont pas interprétés comme une preuve de réussite actuelle. Le banc n’a pas été lancé pour cette analyse.

| Rang | Demande existante | Actions déclarées | Source |
|---|---|---|---|
| 1.1 |  Quel projet est actuellement ouvert et quels documents sont ouverts ?  | studio.state, documents.list | [ligne 286](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:286>) |
| 1.2 |  Liste-moi les fichiers présents dans mon projet, classés par type.  | files.list, files.search | [ligne 287](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:287>) |
| 1.3 |  Combien ai-je d'images, de vidéos, de fichiers audio, de modèles 3D et de skyboxes ?  | assets.counts | [ligne 288](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:288>) |
| 1.4 |  Quel document est actuellement actif ?  | studio.state | [ligne 289](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:289>) |
| 1.5 |  Quels sont les éléments présents dans la scène 3D actuellement ouverte ?  | scene.state | [ligne 290](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:290>) |
| 1.6 |  Quelles caméras et quelles lumières sont présentes dans ma scène ?  | scene.state | [ligne 291](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:291>) |
| 1.7 |  Donne-moi les propriétés de la caméra de la scène.  | scene.state | [ligne 292](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:292>) |
| 1.8 |  Quelle est la durée actuelle de ma timeline ?  | sequence.state | [ligne 293](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:293>) |
| 1.9 |  Quels éléments sont actuellement sélectionnés ?  | studio.state | [ligne 294](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:294>) |
| 2.1 |  Ouvre mon image du bateau.  | file.open | [ligne 298](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:298>) |
| 2.2 |  Ouvre ma première vidéo.  | file.open | [ligne 299](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:299>) |
| 2.3 |  Ouvre mon premier fichier audio.  | file.open | [ligne 300](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:300>) |
| 2.4 |  Ouvre ma scène 3D.  | file.open | [ligne 301](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:301>) |
| 2.5 |  Ouvre la texture utilisée par mon premier modèle 3D.  | file.open, asset.extractTextures | [ligne 302](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:302>) |
| 2.6 |  Ouvre ma première skybox.  | file.open | [ligne 303](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:303>) |
| 2.7 |  Reviens sur la scène 3D.  | document.activate | [ligne 304](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:304>) |
| 3.1 |  Trouve-moi l'image qui représente un bateau.  | files.search | [ligne 308](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:308>) |
| 3.2 |  Trouve-moi tous les modèles 3D de personnages.  | assets.searchProjectCatalogue | [ligne 309](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:309>) |
| 3.3 |  Trouve-moi les fichiers qui pourraient être utilisés comme environnement.  | assets.searchProjectCatalogue | [ligne 310](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:310>) |
| 3.4 |  Trouve-moi toutes les textures associées à mon modèle 3D actuel.  | asset.extractTextures | [ligne 311](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:311>) |
| 3.5 |  Trouve-moi tous les fichiers audio utilisables dans un montage vidéo.  | assets.searchProjectCatalogue | [ligne 312](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:312>) |
| 3.6 |  Trouve-moi les assets générés par IA qui concernent une voiture.  | assets.searchProjectCatalogue | [ligne 313](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:313>) |
| 4.1 |  Crée un dossier Tests Assistant dans mon projet.  | folder.new | [ligne 317](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:317>) |
| 4.2 |  Dans Tests Assistant, crée un sous-dossier Images.  | folder.new | [ligne 318](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:318>) |
| 4.3 |  Duplique l'image du bateau dans ce dossier.  | files.duplicate | [ligne 319](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:319>) |
| 4.4 |  Renomme cette copie bateau-test.png.  | file.rename | [ligne 320](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:320>) |
| 4.5 |  Déplace bateau-test.png dans le sous-dossier Images.  | files.move | [ligne 321](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:321>) |
| 4.6 |  Vérifie que le fichier existe bien à son nouvel emplacement.  | file.facts | [ligne 322](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:322>) |
| 4.7 |  Supprime bateau-test.png.  | files.trash | [ligne 323](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:323>) |
| 4.8 |  Supprime les dossiers de test que nous venons de créer.  | files.trash | [ligne 324](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:324>) |
| 5.1 |  Crée une nouvelle scène 3D vide appelée Test MCP.  | workspace.open | [ligne 328](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:328>) |
| 5.2 |  Crée un nouveau montage vidéo appelé Test Video.  | workspace.open | [ligne 329](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:329>) |
| 5.3 |  Crée un nouveau montage audio appelé Test Audio.  | workspace.open | [ligne 330](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:330>) |
| 5.4 |  Ferme Test Audio sans supprimer le fichier.  | document.close | [ligne 331](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:331>) |
| 5.5 |  Rouvre Test MCP.  | document.activate | [ligne 332](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:332>) |
| 6.1 |  Ajoute un cube au centre de la scène.  | node.add | [ligne 338](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:338>) |
| 6.2 |  Renomme le cube Cube Test.  | node.rename | [ligne 339](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:339>) |
| 6.3 |  Place Cube Test à X 2, Y 1, Z -3.  | node.transform | [ligne 340](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:340>) |
| 6.4 |  Double sa taille.  | node.transform | [ligne 341](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:341>) |
| 6.5 |  Fais-le pivoter de 45 degrés sur l'axe Y.  | node.transform | [ligne 342](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:342>) |
| 6.6 |  Ajoute une sphère à droite du cube.  | node.add | [ligne 343](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:343>) |
| 6.7 |  Place la sphère exactement 2 mètres à droite du cube.  | node.transform | [ligne 344](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:344>) |
| 6.8 |  Duplique la sphère et place la copie à gauche du cube.  | node.add | [ligne 345](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:345>) |
| 6.9 |  Renomme les deux sphères Sphere Droite et Sphere Gauche.  | node.rename | [ligne 346](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:346>) |
| 6.10 |  Perce une fenêtre dans le mur avec le cube.  | node.combineIntoSolid | [ligne 347](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:347>) |
| 6.11 |  Fusionne le mur et le cube en une seule forme.  | node.combineIntoSolid | [ligne 348](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:348>) |
| 6.12 |  Ne garde que la partie où le mur et le cube se chevauchent.  | node.combineIntoSolid | [ligne 349](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:349>) |
| 6.13 |  Sépare ce solide et rends-moi les formes d'origine.  | node.combineIntoSolid, node.separate | [ligne 350](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:350>) |
| 6.14 |  Marque le cube comme outil, puis fusionne-le avec le mur.  | node.markAsCuttingTool, node.combineIntoSolid | [ligne 351](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:351>) |
| 6.15 |  Retire au cube sa marque d'outil.  | node.markAsCuttingTool | [ligne 352](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:352>) |
| 6.16 |  Ce pli est parti à l'envers, refais-le dans l'autre sens.  | node.swapSolidMatterAndTool | [ligne 353](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:353>) |
| 7.1 |  Déplace Cube Test d'un mètre vers le haut.  | node.transform | [ligne 357](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:357>) |
| 7.2 |  Déplace Sphere Droite de 50 cm vers la droite.  | node.transform | [ligne 358](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:358>) |
| 7.3 |  Fais tourner Cube Test de 20 degrés supplémentaires sur Y.  | node.transform | [ligne 359](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:359>) |
| 7.4 |  Réduis Sphere Gauche de moitié.  | node.transform | [ligne 360](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:360>) |
| 7.5 |  Place Sphere Gauche exactement au-dessus de Cube Test.  | node.transform | [ligne 361](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:361>) |
| 8.1 |  Ajoute une lumière directionnelle à la scène.  | node.add | [ligne 367](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:367>) |
| 8.2 |  Renomme-la Soleil Test.  | node.rename | [ligne 368](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:368>) |
| 8.3 |  Augmente son intensité de 25 %.  | node.setLightSettings | [ligne 369](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:369>) |
| 8.4 |  Ajoute une lumière ponctuelle au-dessus du cube.  | node.add | [ligne 370](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:370>) |
| 8.5 |  Réduis son intensité de moitié.  | node.setLightSettings | [ligne 371](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:371>) |
| 8.6 |  Désactive Soleil Test.  | node.setVisible | [ligne 372](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:372>) |
| 8.7 |  Réactive Soleil Test.  | node.setVisible | [ligne 373](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:373>) |
| 9.1 |  Ajoute une nouvelle caméra appelée Camera Test.  | node.add | [ligne 377](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:377>) |
| 9.2 |  Place Camera Test face au cube.  | node.transform | [ligne 378](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:378>) |
| 9.3 |  Oriente Camera Test pour qu'elle regarde Cube Test.  | camera.addShot, camera.aimShotAt | [ligne 379](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:379>) |
| 9.4 |  Éloigne Camera Test de 2 mètres sans changer la cible qu'elle regarde.  | node.transform, camera.aimShotAt | [ligne 380](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:380>) |
| 9.5 |  Fais de Camera Test la caméra active.  | node.setCameraLens | [ligne 381](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:381>) |
| 9.6 |  Donne-moi maintenant sa position et sa rotation.  | scene.state | [ligne 382](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:382>) |
| 10.1 |  Active la grille de la scène.  | settings.write | [ligne 386](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:386>) |
| 10.2 |  Change l'environnement pour utiliser ma première skybox.  | world.setSceneLighting | [ligne 387](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:387>) |
| 10.3 |  Réduis l'intensité de l'environnement à 0,7.  | world.setSceneLighting | [ligne 388](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:388>) |
| 10.4 |  Active les ombres.  | node.setShadowCastAndReceive, settings.write | [ligne 389](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:389>) |
| 10.5 |  Mets la qualité des ombres au niveau le plus élevé disponible.  | settings.write | [ligne 390](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:390>) |
| 10.6 |  Change l'arrière-plan sans changer l'éclairage de la scène.  | world.setBackground | [ligne 391](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:391>) |
| 10.7 |  Éclaire ma scène avec mon ciel Ciel Test.  | world.setSceneLighting | [ligne 392](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:392>) |
| 10.8 |  Passe la navigation 3D en schéma Blender.  | Pas de lien direct dans coverage.ts | [ligne 393](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:393>) |
| 10.9 |  Cadre le cube et garde-le dans la vue même s'il bouge.  | command.runStudioCommand | [ligne 394](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:394>) |
| 11.1 |  Ajoute mon premier modèle 3D dans Test MCP.  | node.addModel | [ligne 398](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:398>) |
| 11.2 |  Place-le au centre de la scène.  | node.transform | [ligne 399](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:399>) |
| 11.3 |  Adapte automatiquement sa taille pour qu'il soit visible correctement.  | node.transform | [ligne 400](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:400>) |
| 11.4 |  Place Camera Test pour cadrer entièrement ce modèle.  | Pas de lien direct dans coverage.ts | [ligne 401](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:401>) |
| 11.5 |  Ajoute une deuxième instance du même modèle à sa droite.  | node.addModel | [ligne 402](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:402>) |
| 12.1 |  Sélectionne le modèle 3D que nous venons d'ajouter et donne-moi ses matériaux.  | scene.state | [ligne 406](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:406>) |
| 12.2 |  Change la couleur de base de son premier matériau en rouge.  | node.setMeshMaterial | [ligne 407](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:407>) |
| 12.3 |  Mets sa rugosité à 0,25.  | node.setMeshMaterial | [ligne 408](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:408>) |
| 12.4 |  Mets son métal à 0,8.  | node.setMeshMaterial | [ligne 409](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:409>) |
| 12.5 |  Assigne une texture de mon projet à sa couleur de base.  | node.setMeshMaterial | [ligne 410](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:410>) |
| 12.6 |  Ajoute une normal map si une texture compatible existe dans le projet.  | node.setMeshMaterial | [ligne 411](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:411>) |
| 12.7 |  Remets le matériau dans son état précédent.  | node.setMeshMaterial | [ligne 412](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:412>) |
| 12.8 |  Habille ce modèle importé avec la matière nommée Pierre.  | model.setMaterialDocument | [ligne 413](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:413>) |
| 12.9 |  Mets la matière Pierre sur son deuxième emplacement de matière.  | model.setMaterialDocument | [ligne 414](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:414>) |
| 12.10 |  Recouvre plutôt ce modèle de l'image de planches de chêne, sans matière.  | model.setBaseColorImage | [ligne 415](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:415>) |
| 12.11 |  Finalement retire-lui son habillage : qu'il reprenne celui de son propre fichier.  | model.setMaterialDocument | [ligne 416](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:416>) |
| 13.1 |  Mets la durée de la scène à 10 secondes.  | animation.setBandLengthAndRate | [ligne 420](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:420>) |
| 13.2 |  Anime Cube Test pour qu'il parte de sa position actuelle à 0 seconde et arrive 5 mètres plus haut à 5 secondes.  | key.writePoseKeys | [ligne 421](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:421>) |
| 13.3 |  À 10 secondes, fais-le revenir à sa position initiale.  | key.writePoseKeys | [ligne 422](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:422>) |
| 13.4 |  Ajoute une rotation complète du cube entre 0 et 10 secondes.  | key.writePoseKeys | [ligne 423](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:423>) |
| 13.5 |  Fais commencer l'animation de Sphere Droite à 2 secondes.  | animation.addBlock | [ligne 424](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:424>) |
| 13.6 |  Supprime uniquement l'animation de rotation du cube sans supprimer son animation de position.  | animation.removeBlock, channel.remove | [ligne 425](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:425>) |
| 14.1 |  Anime Camera Test pour qu'elle se rapproche progressivement du cube entre 0 et 5 secondes.  | key.writePoseKeys | [ligne 429](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:429>) |
| 14.2 |  Pendant son déplacement, garde la caméra orientée vers Cube Test.  | camera.aimShotAt | [ligne 430](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:430>) |
| 14.3 |  Entre 5 et 10 secondes, fais tourner la caméra autour du cube.  | key.writePoseKeys | [ligne 431](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:431>) |
| 14.4 |  Vérifie qu'à aucun moment la caméra ne perd Cube Test de vue.  | scene.state | [ligne 432](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:432>) |
| 15.1 |  Ajoute ma première vidéo sur la piste V1 au début de la timeline.  | clip.add | [ligne 438](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:438>) |
| 15.2 |  Ajoute une deuxième vidéo juste après la première.  | clip.add | [ligne 439](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:439>) |
| 15.3 |  Coupe les deux premières secondes du premier clip.  | clip.trim | [ligne 440](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:440>) |
| 15.4 |  Déplace le deuxième clip pour qu'il commence immédiatement après le premier.  | clip.move | [ligne 441](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:441>) |
| 15.5 |  Ajoute mon image du bateau pendant 3 secondes après les vidéos.  | clip.add | [ligne 442](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:442>) |
| 15.6 |  Mets l'image du bateau à l'échelle pour remplir le cadre sans la déformer.  | clip.speed | [ligne 443](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:443>) |
| 16.1 |  Ajoute mon premier fichier audio sur A1 au début du montage.  | clip.add, track.add | [ligne 447](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:447>) |
| 16.2 |  Réduis son volume à 50 %.  | clip.gain | [ligne 448](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:448>) |
| 16.3 |  Fais un fondu d'entrée d'une seconde.  | clip.fade | [ligne 449](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:449>) |
| 16.4 |  Fais un fondu de sortie de deux secondes.  | clip.fade | [ligne 450](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:450>) |
| 16.5 |  Coupe l'audio exactement à la durée du montage vidéo.  | clip.trim | [ligne 451](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:451>) |
| 17.1 |  Ajoute mes deux fichiers audio sur deux pistes différentes.  | clip.add, track.add | [ligne 457](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:457>) |
| 17.2 |  Fais commencer le deuxième à 3 secondes.  | clip.move | [ligne 458](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:458>) |
| 17.3 |  Mets le premier à 70 % de volume.  | clip.gain | [ligne 459](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:459>) |
| 17.4 |  Mets le deuxième à 40 %.  | clip.gain | [ligne 460](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:460>) |
| 17.5 |  Fais un fondu entre les deux morceaux.  | clip.fade | [ligne 461](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:461>) |
| 18.1 |  Duplique cette image avant de la modifier.  | files.duplicate | [ligne 467](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:467>) |
| 18.2 |  Renomme la copie bateau-edition-test.  | file.rename | [ligne 468](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:468>) |
| 18.3 |  Réduis son opacité à 70 %.  | layer.setOpacityBlendAndVisibility | [ligne 469](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:469>) |
| 18.4 |  Déplace-la de 100 pixels vers la droite.  | layer.transform | [ligne 470](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:470>) |
| 18.5 |  Augmente sa taille de 20 %.  | layer.transform | [ligne 471](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:471>) |
| 18.6 |  Fais-la pivoter de 15 degrés.  | layer.transform | [ligne 472](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:472>) |
| 18.7 |  Remets uniquement la rotation à zéro.  | layer.transform | [ligne 473](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:473>) |
| 19.1 |  Ajoute une deuxième image comme nouveau calque au-dessus du bateau.  | layer.add | [ligne 477](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:477>) |
| 19.2 |  Renomme ce calque Overlay Test.  | layer.rename | [ligne 478](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:478>) |
| 19.3 |  Mets Overlay Test à 50 % d'opacité.  | layer.setOpacityBlendAndVisibility | [ligne 479](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:479>) |
| 19.4 |  Passe Overlay Test derrière le bateau.  | layer.reorderInStack | [ligne 480](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:480>) |
| 19.5 |  Masque Overlay Test.  | layer.setOpacityBlendAndVisibility | [ligne 481](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:481>) |
| 19.6 |  Réaffiche Overlay Test.  | layer.setOpacityBlendAndVisibility | [ligne 482](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:482>) |
| 19.7 |  Supprime uniquement Overlay Test.  | layer.remove | [ligne 483](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:483>) |
| 20.1 |  Génère une image photoréaliste d'une voiture rouge dans une rue de Paris.  | models.search, models.select, generator.prepare, generator.submit, job.waitForCloudGeneration | [ligne 487](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:487>) |
| 20.2 |  Enregistre le résultat dans Images.  | asset.update | [ligne 488](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:488>) |
| 20.3 |  Génère une deuxième variante à partir de cette image.  | generator.submit | [ligne 489](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:489>) |
| 20.4 |  Utilise l'image générée comme référence et transforme la voiture rouge en voiture bleue.  | generator.submit | [ligne 490](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:490>) |
| 20.5 |  Conserve les deux versions dans le projet.  | assets.searchProjectCatalogue | [ligne 491](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:491>) |
| 21.1 |  Utilise l'image du bateau de mon projet comme référence et génère une variante de nuit.  | generator.submit | [ligne 495](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:495>) |
| 21.2 |  Utilise cette nouvelle image comme référence pour créer une version sous une tempête.  | generator.submit | [ligne 496](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:496>) |
| 21.3 |  Génère une texture inspirée des couleurs du bateau actuellement ouvert.  | generator.submit | [ligne 497](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:497>) |
| 21.4 |  Génère un environnement cohérent avec l'image du bateau.  | generator.submit | [ligne 498](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:498>) |
| 22.1 |  Génère un modèle 3D d'un coffre en bois.  | generator.prepare, generator.submit | [ligne 502](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:502>) |
| 22.2 |  Ajoute le résultat dans mon projet.  | Pas de lien direct dans coverage.ts | [ligne 503](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:503>) |
| 22.3 |  Ouvre le modèle généré.  | file.open | [ligne 504](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:504>) |
| 22.4 |  Ajoute-le à Test MCP.  | node.addModel | [ligne 505](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:505>) |
| 22.5 |  Place-le devant Cube Test.  | node.transform | [ligne 506](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:506>) |
| 22.6 |  Adapte sa taille pour qu'il fasse environ un mètre de large.  | node.transform | [ligne 507](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:507>) |
| 23.1 |  Prends l'image du bateau, ajoute-la au montage vidéo Test Video pendant 5 secondes et ajoute un de mes fichiers audio en fond sonore.  | clip.add | [ligne 511](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:511>) |
| 23.2 |  Utilise ma skybox actuelle comme environnement de Test MCP puis place mon modèle 3D principal dans la scène.  | node.addModel, world.setSceneLighting | [ligne 512](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:512>) |
| 23.3 |  Trouve une texture compatible avec le modèle actuellement sélectionné et applique-la sans modifier les autres matériaux.  | node.setMeshMaterial | [ligne 513](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:513>) |
| 24.1 |  Mets le bateau dans ma vidéo.  | clip.add | [ligne 519](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:519>) |
| 24.2 |  Mets la voiture dans la scène.  | node.addModel | [ligne 520](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:520>) |
| 24.3 |  Fais le cube un peu plus gros.  | node.transform | [ligne 521](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:521>) |
| 24.4 |  Éclaire mieux mon modèle.  | node.setLightSettings | [ligne 522](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:522>) |
| 24.5 |  Cadre correctement le personnage.  | camera.aimShotAt | [ligne 523](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:523>) |
| 24.6 |  Fais durer ça deux secondes de plus.  | clip.trim | [ligne 524](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:524>) |
| 24.7 |  Mets le son moins fort.  | clip.gain | [ligne 525](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:525>) |
| 24.8 |  Fais regarder la caméra vers le personnage.  | camera.aimShotAt | [ligne 526](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:526>) |
| 24.9 |  Utilise cette image comme texture.  | node.setMeshMaterial | [ligne 527](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:527>) |
| 24.10 |  Fais une variante de ça.  | generator.submit | [ligne 528](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:528>) |
| 25.1 |  Ajoute un cube.  | node.add | [ligne 537](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:537>) |
| 25.2 |  Mets-le à droite.  | node.transform | [ligne 538](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:538>) |
| 25.3 |  Duplique-le.  | node.add | [ligne 539](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:539>) |
| 25.4 |  Mets la copie à gauche.  | node.transform | [ligne 540](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:540>) |
| 25.5 |  Agrandis-la.  | node.transform | [ligne 541](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:541>) |
| 25.6 |  Fais-les tourner de 45 degrés.  | node.transform | [ligne 542](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:542>) |
| 25.7 |  Supprime le premier.  | node.remove | [ligne 543](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:543>) |
| 25.8 |  Centre celui qui reste.  | node.transform | [ligne 544](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:544>) |
| 26.1 |  Quelle est la position de Cube Test ?  | scene.state | [ligne 550](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:550>) |
| 26.2 |  Ajoute 2 à sa valeur Y.  | node.transform | [ligne 551](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:551>) |
| 26.3 |  Quelle est maintenant sa position ?  | scene.state | [ligne 552](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:552>) |
| 26.4 |  Quelle est l'intensité de Soleil Test ?  | node.setLightSettings | [ligne 556](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:556>) |
| 26.5 |  Multiplie-la par deux.  | node.setLightSettings | [ligne 557](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:557>) |
| 26.6 |  Vérifie la nouvelle valeur.  | Pas de lien direct dans coverage.ts | [ligne 558](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:558>) |
| 27.1 |  Si Test MCP contient déjà une caméra appelée Camera Test, ne la recrée pas ; sinon crée-la.  | scene.state | [ligne 564](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:564>) |
| 27.2 |  Si le cube existe, mets-le à Y = 0 ; sinon crée un cube à Y = 0.  | Pas de lien direct dans coverage.ts | [ligne 565](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:565>) |
| 27.3 |  Si une skybox est déjà utilisée, donne-moi son nom avant de la remplacer par ma deuxième skybox.  | world.setSceneLighting | [ligne 566](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:566>) |
| 27.4 |  Ajoute une lumière seulement s'il n'y a actuellement aucune lumière directionnelle.  | scene.state | [ligne 567](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:567>) |
| 28.1 |  Sélectionne tous les objets 3D sauf les caméras et les lumières.  | node.select | [ligne 571](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:571>) |
| 28.2 |  Déplace tous ces objets d'un mètre vers le haut.  | node.transform | [ligne 572](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:572>) |
| 28.3 |  Réduis tous les fichiers audio du montage à 60 % de volume.  | clip.gain | [ligne 573](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:573>) |
| 28.4 |  Masque tous les calques image sauf celui du bateau.  | layer.add, layer.setOpacityBlendAndVisibility | [ligne 574](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:574>) |
| 28.5 |  Donne-moi la liste des éléments que tu viens de modifier.  | Pas de lien direct dans coverage.ts | [ligne 575](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:575>) |
| 29.1 |  Déplace Cube Test à X = 50.  | node.transform | [ligne 579](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:579>) |
| 29.2 |  Annule ma dernière modification.  | files.undoFileOperation | [ligne 580](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:580>) |
| 29.3 |  Vérifie que Cube Test est revenu à sa position précédente.  | files.undoFileOperation | [ligne 581](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:581>) |
| 29.4 |  Supprime Sphere Droite.  | node.remove | [ligne 582](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:582>) |
| 29.5 |  Annule la suppression.  | files.undoFileOperation, node.remove | [ligne 583](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:583>) |
| 29.6 |  Vérifie que Sphere Droite existe de nouveau.  | files.undoFileOperation | [ligne 584](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:584>) |
| 30.1 |  Supprime le bateau.  | Pas de lien direct dans coverage.ts | [ligne 588](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:588>) |
| 30.2 |  Supprime tout.  | Pas de lien direct dans coverage.ts | [ligne 589](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:589>) |
| 30.3 |  Remplace toutes mes textures.  | Pas de lien direct dans coverage.ts | [ligne 590](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:590>) |
| 30.4 |  Mets le fichier Images/fais moi un bateau.png à la corbeille.  | files.trash | [ligne 591](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:591>) |
| 31.1 |  Crée une scène 3D vide appelée Demo Assistant, ajoute mon modèle 3D principal au centre, ajoute une caméra qui le cadre entièrement, utilise ma première skybox comme environnement, ajoute une lumière directionnelle, règle la durée à 10 secondes et fais faire un tour complet au modèle pendant ces 10 secondes.  | node.add, node.addModel, world.setSceneLighting | [ligne 597](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:597>) |
| 32.1 |  Crée un montage vidéo de test avec mon image du bateau pendant 5 secondes, ajoute ensuite ma première vidéo, ajoute un fond sonore depuis mes fichiers audio, règle le son à 40 %, ajoute un fondu au début et assure-toi que le montage se termine exactement à la fin du dernier clip vidéo.  | clip.add, track.add | [ligne 603](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:603>) |
| 33.1 |  Utilise mon image du bateau comme référence pour générer une version de nuit, ajoute le résultat dans mon projet, crée un nouveau montage vidéo, affiche l'image originale pendant 3 secondes puis la version de nuit pendant 3 secondes et ajoute un de mes fichiers audio en fond.  | clip.add | [ligne 609](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:609>) |
| 34.1 |  Analyse la scène 3D actuelle et dis-moi ce qui pourrait poser problème avant de modifier quoi que ce soit.  | Pas de lien direct dans coverage.ts | [ligne 613](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:613>) |
| 34.2 |  Corrige automatiquement les problèmes simples que tu peux résoudre sans changer l'intention de la scène.  | Pas de lien direct dans coverage.ts | [ligne 614](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:614>) |
| 34.3 |  Dis-moi précisément ce que tu as changé.  | Pas de lien direct dans coverage.ts | [ligne 615](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:615>) |
| 35.1 |  Vérifie que toutes les actions que je t'ai demandé d'effectuer sur Test MCP ont réellement été appliquées.  | Pas de lien direct dans coverage.ts | [ligne 619](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:619>) |
| 35.2 |  Compare l'état actuel de la scène avec ce que je t'ai demandé.  | Pas de lien direct dans coverage.ts | [ligne 620](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:620>) |
| 35.3 |  Liste uniquement les actions qui n'ont pas produit le résultat attendu.  | Pas de lien direct dans coverage.ts | [ligne 621](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:621>) |
| 36.1 |  Je veux une petite scène avec mon personnage principal au centre, un éclairage de studio, une caméra qui le cadre entièrement et un environnement adapté. Fais la scène toi-même en utilisant ce qui existe déjà dans mon projet. Ajoute ensuite une animation de caméra de 5 secondes qui se rapproche doucement du personnage tout en continuant à le regarder. Ne génère aucun nouvel asset si ce n'est pas nécessaire.  | Pas de lien direct dans coverage.ts | [ligne 627](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:627>) |
| 36.2 |  Transforme maintenant cette scène en un montage vidéo de 10 secondes, ajoute une musique de mon projet adaptée et prépare le montage pour l'export.  | Pas de lien direct dans coverage.ts | [ligne 631](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:631>) |
| 36.3 |  Vérifie tout ce que tu viens de faire et indique-moi les éventuelles erreurs ou incohérences restantes.  | Pas de lien direct dans coverage.ts | [ligne 635](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:635>) |
| 37.1 |  Quelle image sert de ciel en ce moment, et à quelle intensité ?  | skybox.state | [ligne 642](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:642>) |
| 37.2 |  Utilise ma première skybox comme image de ce ciel.  | skybox.setSourceImage | [ligne 643](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:643>) |
| 37.3 |  Monte l'intensité du soleil à 3.  | skybox.setSun | [ligne 644](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:644>) |
| 37.4 |  Réduis l'intensité de l'environnement du ciel à 0,4.  | skybox.setPreviewLighting | [ligne 645](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:645>) |
| 37.5 |  Augmente le contraste et la saturation de ce ciel.  | skybox.adjustImage | [ligne 646](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:646>) |
| 37.6 |  Remets les réglages colorimétriques du ciel à zéro.  | skybox.resetAdjustments | [ligne 647](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:647>) |
| 37.7 |  Affiche les sondes de lumière de ce ciel.  | skybox.setViewportOptions | [ligne 648](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:648>) |
| 38.1 |  De quoi est faite cette matière et quelles images porte-t-elle ?  | material.state | [ligne 654](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:654>) |
| 38.2 |  Mets sa couleur de base en bleu.  | material.setSurfaceSettings | [ligne 655](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:655>) |
| 38.3 |  Assigne ma texture de planches à son canal de couleur de base.  | material.setChannelImage | [ligne 656](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:656>) |
| 38.4 |  Ajoute la normal map correspondante sur son canal de relief.  | material.setChannelImage | [ligne 657](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:657>) |
| 38.5 |  Fais tourner l'aperçu de la matière et monte l'intensité de son environnement.  | material.setPreviewDisplay | [ligne 658](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:658>) |
| 38.6 |  Éclaire cet aperçu avec mon ciel Ciel Test.  | material.setPreviewEnvironment | [ligne 659](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:659>) |
| 39.1 |  Quelle est la taille de ce document et combien de calques porte-t-il ?  | canvas.state | [ligne 665](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:665>) |
| 39.2 |  Passe ce document en 1080 sur 1080.  | canvas.resize | [ligne 666](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:666>) |
| 39.3 |  Sélectionne le calque Bateau.  | layer.select | [ligne 667](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:667>) |
| 39.4 |  Duplique le calque Bateau.  | layer.duplicate | [ligne 668](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:668>) |
| 39.5 |  Verrouille le calque Bateau pour ne plus y toucher.  | layer.lock | [ligne 669](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:669>) |
| 39.6 |  Ajoute un calque de texte qui dit Bonjour.  | layer.editTextLayer | [ligne 670](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:670>) |
| 39.7 |  Prépare ce document pour une impression en niveaux de gris à 300 ppp et 16 bits.  | canvas.setDocumentProperties | [ligne 671](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:671>) |
| 40.1 |  Place la tête de lecture à 3 secondes.  | sequence.seek | [ligne 677](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:677>) |
| 40.2 |  Coupe le premier plan en deux à 3 secondes.  | clip.split | [ligne 678](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:678>) |
| 40.3 |  Supprime le deuxième plan du montage.  | clip.remove | [ligne 679](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:679>) |
| 40.4 |  Sélectionne le premier plan.  | clip.select | [ligne 680](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:680>) |
| 40.5 |  Renomme la piste audio Ambiance.  | track.rename | [ligne 681](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:681>) |
| 40.6 |  Coupe le son de la piste audio.  | track.setMuteSoloLockHeight | [ligne 682](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:682>) |
| 40.7 |  Supprime la piste audio et tout ce qu'elle porte.  | track.remove | [ligne 683](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:683>) |
| 41.1 |  Ouvre le document Scène 1 qui est dans mon dossier documents.  | document.open | [ligne 687](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:687>) |
| 41.2 |  Renomme ce document Scène Finale.  | document.rename | [ligne 688](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:688>) |
| 41.3 |  Enregistre le document ouvert.  | document.save | [ligne 689](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:689>) |
| 41.4 |  Ferme Scène Finale et supprime son fichier du projet.  | document.deleteFromDisk | [ligne 690](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:690>) |
| 41.5 |  Exporte la scène ouverte dans mon dossier documents.  | document.export | [ligne 691](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:691>) |
| 41.6 |  Crée un nouveau projet appelé Démo Assistant.  | project.create | [ligne 692](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:692>) |
| 41.7 |  Rouvre mon projet Démo.  | project.open | [ligne 693](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:693>) |
| 41.8 |  Renomme mon projet Démo Assistant.  | project.rename | [ligne 694](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:694>) |
| 41.9 |  Ferme le projet ouvert.  | project.close | [ligne 695](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:695>) |
| 41.10 |  Crée un nouveau projet.  | project.create | [ligne 696](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:696>) |
| 41.11 |  Ouvre un projet récent.  | projects.list, project.open | [ligne 697](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:697>) |
| 41.12 |  Retire le projet Voilier de mes projets récents.  | project.forget | [ligne 698](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:698>) |
| 41.13 |  Mets le projet Voilier à la corbeille.  | project.trash | [ligne 699](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:699>) |
| 42.1 |  Copie l'image du bateau dans mon dossier Materials sans la déplacer.  | files.copy | [ligne 703](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:703>) |
| 42.2 |  Montre-moi l'historique de mes dernières opérations sur les fichiers.  | files.canUndoRedo | [ligne 704](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:704>) |
| 42.3 |  Qu'est-ce que j'ai ouvert récemment dans ce projet ?  | activity.recent | [ligne 705](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:705>) |
| 42.4 |  Refais l'opération que je viens d'annuler.  | files.redoFileOperation | [ligne 706](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:706>) |
| 42.5 |  Montre-moi l'image du bateau dans le Finder.  | file.reveal | [ligne 707](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:707>) |
| 42.6 |  Ouvre la fiche d'informations de l'image du bateau.  | fileInfo.openWindow | [ligne 708](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:708>) |
| 43.1 |  Donne-moi les informations que tu as sur l'image du bateau.  | asset.get | [ligne 712](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:712>) |
| 43.2 |  Supprime de ma bibliothèque l'image que tu viens de générer.  | assets.removeFromLibrary | [ligne 713](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:713>) |
| 43.3 |  Y a-t-il des assets de ma bibliothèque dont le fichier a disparu ?  | assets.listMissing | [ligne 714](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:714>) |
| 43.4 |  Décris-moi ce que représente l'image du bateau et range-la avec des mots-clés.  | assets.captionImages | [ligne 715](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:715>) |
| 43.5 |  Montre-moi le fichier de l'image du bateau sur mon disque.  | asset.reveal | [ligne 716](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:716>) |
| 43.6 |  Suis-je connecté à mon compte Scenario ?  | auth.state | [ligne 717](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:717>) |
| 43.7 |  Combien de crédits me reste-t-il ce mois-ci ?  | usage.report | [ligne 718](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:718>) |
| 43.8 |  Quels comptes ai-je enregistrés ?  | accounts.list | [ligne 719](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:719>) |
| 43.9 |  Bascule sur mon deuxième compte.  | accounts.activate | [ligne 720](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:720>) |
| 43.10 |  Renomme ce compte Studio Perso.  | accounts.rename | [ligne 721](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:721>) |
| 43.11 |  Quels modèles IA locaux sont installés et lequel peut servir l’assistant ?  | ai.localState | [ligne 722](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:722>) |
| 43.12 |  Vérifie si le moteur local de mouvement est prêt et ce qui lui manque.  | ai.manageLocalRuntime | [ligne 723](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:723>) |
| 44.1 |  Où en sont mes générations ?  | jobs.list | [ligne 729](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:729>) |
| 44.2 |  Donne-moi le résultat de ma dernière génération.  | job.readCloudGeneration | [ligne 730](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:730>) |
| 44.3 |  Annule la génération en cours.  | job.cancelCloudGeneration | [ligne 731](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:731>) |
| 44.4 |  Arrête la tâche d'indexation qui tourne.  | task.cancelLocalTask | [ligne 732](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:732>) |
| 44.5 |  Quels réglages accepte le modèle image que j'ai armé ?  | models.readGenerationModelFields | [ligne 733](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:733>) |
| 44.6 |  Combien me coûterait cette génération avant que je la lance ?  | cost.estimate | [ligne 734](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:734>) |
| 45.1 |  Ouvre les préférences par le menu, comme si je cliquais dessus.  | command.runStudioCommand | [ligne 738](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:738>) |
| 45.2 |  De quoi es-tu capable au sujet des calques ?  | actions.find | [ligne 739](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:739>) |
| 45.3 |  Ferme la fenêtre de discussion.  | chat.close | [ligne 740](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:740>) |
| 45.4 |  Prends le calque Bateau comme cible de mes prochaines demandes.  | target.select | [ligne 741](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:741>) |
| 45.5 |  Propose-moi trois prompts pour générer un port au coucher du soleil.  | prompt.suggest | [ligne 742](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:742>) |
| 45.6 |  Traduis ce prompt en anglais avant de le lancer : un bateau en bois sur une mer calme.  | prompt.translate | [ligne 743](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:743>) |
| 45.7 |  Décris-moi le style de mon image du bateau, en une phrase réutilisable comme prompt.  | prompt.describeStyle | [ligne 744](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:744>) |
| 45.8 |  Demande-moi dans quel espace travailler, en me proposant Image, Vidéo ou Audio.  | Pas de lien direct dans coverage.ts | [ligne 745](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:745>) |
| 46.1 |  Change le cube en cylindre.  | node.setPrimitiveParameters | [ligne 751](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:751>) |
| 46.2 |  Ajoute un panneau plat qui porte l'image du bateau et qui fait toujours face à la caméra.  | node.setSpriteSettings | [ligne 752](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:752>) |
| 46.3 |  Ajoute un texte 3D qui dit Studio au-dessus du cube.  | node.setTextSettings | [ligne 753](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:753>) |
| 46.4 |  Trace un chemin fermé qui part du cube et va vers la droite.  | node.setPathShape | [ligne 754](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:754>) |
| 46.5 |  Ajoute un point à ce chemin, deux mètres plus loin.  | path.addPoint | [ligne 755](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:755>) |
| 46.6 |  Déplace le deuxième point du chemin d'un mètre vers le haut.  | path.movePoint | [ligne 756](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:756>) |
| 46.7 |  Supprime le dernier point du chemin.  | path.removePoint | [ligne 757](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:757>) |
| 46.8 |  Range la sphère sous le cube, pour qu'elle le suive quand je le déplace.  | node.reparent | [ligne 758](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:758>) |
| 46.9 |  Mets la sphère tout en haut de la liste de la scène.  | node.reparent | [ligne 759](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:759>) |
| 47.1 |  Crée un rail de caméra qui part de la gauche et arrive à droite du cube.  | camera.createAndBindPath | [ligne 765](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:765>) |
| 47.2 |  Fais suivre ce rail à Camera Test.  | camera.bindPathToShot, camera.createAndBindPath | [ligne 766](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:766>) |
| 47.3 |  Mets Camera Test en premier dans la liste des caméras.  | camera.reorder | [ligne 767](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:767>) |
| 47.4 |  Passe la vue en vue de dessus.  | view.direction | [ligne 768](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:768>) |
| 47.5 |  Affiche la scène en fil de fer.  | view.setDisplayMode | [ligne 769](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:769>) |
| 47.6 |  Prends une capture de la vue actuelle et range-la dans mes images.  | scene.capture | [ligne 770](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:770>) |
| 48.1 |  Applique un préréglage d'éclairage de studio à la scène.  | world.applyPreset | [ligne 774](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:774>) |
| 48.2 |  Ajoute un brouillard léger.  | world.setFog | [ligne 775](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:775>) |
| 48.3 |  Ajoute un sol sous mes objets.  | world.setGroundPlane | [ligne 776](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:776>) |
| 48.4 |  Passe le rendu en qualité maximale.  | world.setToneMapping | [ligne 777](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:777>) |
| 48.5 |  Ajoute une couche de semis d’arbres à cette scène.  | world.setLayers | [ligne 778](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:778>) |
| 49.1 |  Quelles animations porte cette scène ?  | animations.list | [ligne 784](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:784>) |
| 49.2 |  Découpe cette animation en un bloc de 0 à 5 secondes.  | animation.setBlockSettings | [ligne 785](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:785>) |
| 49.3 |  Active la pose automatique de clés pendant que je travaille.  | animation.autoKey | [ligne 786](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:786>) |
| 49.4 |  Efface la clé posée à 5 secondes.  | key.removeSubjectKeys | [ligne 787](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:787>) |
| 49.5 |  Efface toutes les clés de Cube Test.  | key.writeKeysOnOpenChannels | [ligne 788](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:788>) |
| 49.6 |  Décale toutes les clés de Cube Test de 2 secondes vers la droite.  | key.move | [ligne 789](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:789>) |
| 49.7 |  Boucle le canal de rotation de Cube Test.  | channel.setMuteSoloLock | [ligne 790](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:790>) |
| 50.1 |  Ce personnage a-t-il déjà un squelette ?  | rig.state | [ligne 796](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:796>) |
| 50.2 |  Pose un squelette adapté à sa taille.  | rig.fit | [ligne 797](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:797>) |
| 50.3 |  Ajoute les mains à ce squelette.  | rig.configureHands | [ligne 798](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:798>) |
| 50.4 |  Ajoute un os supplémentaire au bout de son bras droit.  | bone.add | [ligne 799](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:799>) |
| 50.5 |  Renomme cet os Main Droite.  | bone.rename | [ligne 800](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:800>) |
| 50.6 |  Dis que cet os est la main droite du personnage.  | bone.setRole | [ligne 801](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:801>) |
| 50.7 |  Supprime l'os que je viens d'ajouter.  | bone.remove | [ligne 802](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:802>) |
| 50.8 |  Ajoute une contrainte IK sur sa jambe gauche.  | ik.add | [ligne 803](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:803>) |
| 50.9 |  Retire cette contrainte IK.  | ik.remove | [ligne 804](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:804>) |
| 50.10 |  Enlève complètement le squelette de ce personnage.  | rig.clear | [ligne 805](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:805>) |
| 50.11 |  Pose un point d'attache sur sa main droite, appelé Main Droite.  | socket.add | [ligne 806](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:806>) |
| 50.12 |  Accroche le cube à Main Droite.  | node.attach | [ligne 807](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:807>) |
| 50.13 |  Retire le point d'attache Main Droite.  | socket.remove | [ligne 808](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:808>) |
| 51.1 |  Regroupe mes deux calques dans un groupe appelé Fond.  | layer.group | [ligne 814](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:814>) |
| 51.2 |  Dégroupe le groupe Fond.  | layer.ungroup | [ligne 815](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:815>) |
| 51.3 |  Fusionne le calque du dessus avec celui d'en dessous.  | layer.mergeDown | [ligne 816](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:816>) |
| 51.4 |  Ajoute un rectangle rouge en bas de l'image.  | layer.editShapeLayer | [ligne 817](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:817>) |
| 51.5 |  Ajoute un calque de réglage qui monte le contraste.  | layer.setAdjustmentAmount | [ligne 818](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:818>) |
| 51.6 |  Ajoute un masque au calque Bateau.  | layer.setMaskOptions | [ligne 819](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:819>) |
| 51.7 |  Recadre l'image sur un carré centré.  | canvas.crop | [ligne 820](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:820>) |
| 51.8 |  Fais pivoter le document de 90 degrés vers la droite.  | canvas.flipOrRotate | [ligne 821](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:821>) |
| 51.9 |  Pose un repère vertical au milieu de l'image.  | guide.add | [ligne 822](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:822>) |
| 51.10 |  Déplace ce repère au tiers de la largeur.  | guide.move | [ligne 823](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:823>) |
| 51.11 |  Supprime ce repère.  | guide.remove | [ligne 824](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:824>) |
| 52.1 |  Détache le son de ma première vidéo pour pouvoir le déplacer seul.  | clip.unlink | [ligne 828](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:828>) |
| 52.2 |  Fais passer la piste audio au-dessus de la piste vidéo.  | track.reorderTracks | [ligne 829](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:829>) |
| 53.1 |  Quels styles ai-je enregistrés ?  | styles.list | [ligne 833](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:833>) |
| 53.2 |  Enregistre le style de mon image du bateau sous le nom Marine.  | style.save | [ligne 834](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:834>) |
| 53.3 |  Renomme ce style Marine Nuit.  | style.rename | [ligne 835](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:835>) |
| 53.4 |  Supprime le style Marine Nuit.  | style.remove | [ligne 836](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:836>) |
| 54.1 |  Montre-moi ce que contient ma bibliothèque en ligne.  | cloud.browseAccountLibrary | [ligne 840](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:840>) |
| 54.2 |  Cherche des voitures rouges dans ma bibliothèque en ligne.  | cloud.browseAccountLibrary, cloud.explorePublicFeed | [ligne 841](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:841>) |
| 54.3 |  Trouve-moi en ligne des images qui ressemblent à mon bateau.  | cloud.findSimilarPublished | [ligne 842](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:842>) |
| 54.4 |  Dis-moi ce que téléchargerait une synchronisation, avant de la lancer.  | cloud.previewSync | [ligne 843](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:843>) |
| 54.5 |  Télécharge dans mon projet les images en ligne qui manquent ici.  | cloud.pull | [ligne 844](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:844>) |
| 54.6 |  Envoie l'image du bateau dans ma bibliothèque en ligne.  | cloud.push | [ligne 845](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:845>) |
| 55.1 |  Dans quel état est ma fenêtre en ce moment ?  | window.state | [ligne 849](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:849>) |
| 55.2 |  Passe en plein écran.  | window.fullScreen | [ligne 850](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:850>) |
| 55.3 |  Ouvre les préférences.  | settings.open | [ligne 851](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:851>) |
| 55.4 |  Quels panneaux puis-je ouvrir ?  | panels.list | [ligne 852](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:852>) |
| 55.5 |  Ouvre le panneau des calques.  | panel.open | [ligne 853](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:853>) |
| 55.6 |  Ferme le panneau des calques.  | panel.close | [ligne 854](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:854>) |
| 55.7 |  Ouvre un miroir de la vue sur mon second écran.  | mirror.openVideoReturnWindow | [ligne 855](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:855>) |
| 55.8 |  Ouvre le manuel au chapitre du montage vidéo.  | help.openStudioWindow | [ligne 856](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:856>) |
| 55.9 |  Quels sont mes favoris ?  | favorites.listPinnedRecipes | [ligne 857](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:857>) |
| 55.10 |  Mets l'image du bateau en favori.  | favorite.pinAssetRecipe | [ligne 858](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:858>) |
| 55.11 |  Retire l'image du bateau de mes favoris.  | favorite.unpinAssetRecipe | [ligne 859](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:859>) |
| 55.12 |  Ouvre le journal du studio dans sa fenêtre.  | help.openStudioWindow | [ligne 860](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:860>) |
| 56.1 |  Une mise à jour est-elle disponible ?  | updates.state | [ligne 864](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:864>) |
| 56.2 |  Installe la mise à jour et redémarre.  | updates.install | [ligne 865](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:865>) |
| 56.3 |  La dictée est-elle prête à être utilisée ?  | dictation.state | [ligne 866](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:866>) |
| 56.4 |  Lance la dictée.  | dictation.start | [ligne 867](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:867>) |
| 56.5 |  Arrête la dictée.  | dictation.stop | [ligne 868](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:868>) |
| 56.6 |  Mon ordinateur peut-il encoder de la vidéo en accéléré matériel ?  | media.capabilities | [ligne 869](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:869>) |
| 56.7 |  Ajoute à mon projet la vidéo que je viens de déposer sur la fenêtre.  | media.indexFileInPlace | [ligne 870](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:870>) |
| 56.8 |  Quelles polices puis-je utiliser pour un texte ?  | fonts.list | [ligne 871](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:871>) |
| 57.1 |  Quels sont mes réglages 3D actuels ?  | settings.read | [ligne 875](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:875>) |
| 57.2 |  Remets les réglages d'affichage à leurs valeurs par défaut.  | settings.triggerAction | [ligne 876](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:876>) |
| 57.3 |  Qu'as-tu retenu de ce projet jusqu'ici ?  | context.readProjectCards | [ligne 877](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:877>) |
| 57.4 |  Retiens que ce projet vise un rendu photoréaliste marine.  | context.writeProjectCard | [ligne 878](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:878>) |
| 57.5 |  Oublie ce que tu avais retenu sur le style de ce projet.  | context.deleteProjectCard | [ligne 879](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:879>) |
| 58.1 |  Où en est mon projet côté versions ?  | git.status | [ligne 885](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:885>) |
| 58.2 |  Montre-moi mes dernières versions enregistrées.  | git.log | [ligne 886](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:886>) |
| 58.3 |  Quels fichiers a changé ma dernière version ?  | git.listCommitFiles | [ligne 887](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:887>) |
| 58.4 |  Montre-moi ce qui a changé dans l'image du bateau depuis la dernière version.  | git.diff | [ligne 888](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:888>) |
| 58.5 |  Quelles branches ai-je dans ce projet ?  | git.branches | [ligne 889](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:889>) |
| 58.6 |  Quelles mises de côté ai-je en attente ?  | git.stashes | [ligne 890](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:890>) |
| 58.7 |  Mets ce projet sous suivi de versions.  | git.init | [ligne 891](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:891>) |
| 58.8 |  Prépare l'image du bateau pour la prochaine version.  | git.stage | [ligne 892](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:892>) |
| 58.9 |  Retire l'image du bateau de ce qui est préparé.  | git.unstage | [ligne 893](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:893>) |
| 58.10 |  Annule mes modifications sur l'image du bateau et reviens à la dernière version.  | git.restore | [ligne 894](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:894>) |
| 58.11 |  Enregistre une version appelée Premier jet.  | git.commit | [ligne 895](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:895>) |
| 58.12 |  Crée une branche appelée essai-couleurs.  | git.createBranch | [ligne 896](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:896>) |
| 58.13 |  Bascule sur la branche essai-couleurs.  | git.checkout | [ligne 897](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:897>) |
| 58.14 |  Mets mon travail en cours de côté.  | git.stash | [ligne 898](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:898>) |
| 58.15 |  Reprends le travail que j'avais mis de côté.  | git.stashPop | [ligne 899](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:899>) |
| 58.16 |  Jette la mise de côté que je n'utiliserai pas.  | git.stashDrop | [ligne 900](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:900>) |
| 58.17 |  Pose une étiquette v1 sur la version actuelle.  | git.tag | [ligne 901](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:901>) |
| 58.18 |  J'ai un conflit sur l'image du bateau : garde ma version.  | git.resolve | [ligne 902](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:902>) |
| 58.19 |  Abandonne la fusion en cours.  | git.abortMerge | [ligne 903](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:903>) |
| 58.20 |  Quels dépôts distants sont configurés ?  | git.remotes | [ligne 904](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:904>) |
| 58.21 |  Ajoute mon dépôt distant origin, sur https://example.com/demo.git.  | git.addRemote | [ligne 905](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:905>) |
| 58.22 |  Récupère ce qui a changé sur le dépôt distant.  | git.fetch | [ligne 906](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:906>) |
| 58.23 |  Récupère et applique les changements du dépôt distant.  | git.pull | [ligne 907](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:907>) |
| 58.24 |  Envoie mes versions sur le dépôt distant.  | git.push | [ligne 908](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:908>) |
| 59.1 |  Quels effets de post-traitement porte cette scène ?  | post.state | [ligne 914](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:914>) |
| 59.2 |  Ajoute un halo lumineux au post-traitement de la scène.  | post.add | [ligne 915](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:915>) |
| 59.3 |  Monte la force du halo lumineux à 1,5.  | post.set | [ligne 916](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:916>) |
| 59.4 |  Désactive le halo lumineux sans le retirer.  | post.setEffectEnabled | [ligne 917](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:917>) |
| 59.5 |  Retire le halo lumineux de la composition.  | post.remove | [ligne 918](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:918>) |
| 59.6 |  Applique le préréglage cinéma au post-traitement de la scène.  | post.applyPreset | [ligne 919](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:919>) |
| 59.7 |  Coupe tout le post-traitement de la scène pour comparer.  | post.setWholeStackEnabled | [ligne 920](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:920>) |
| 59.8 |  Fais passer le vignettage avant le halo lumineux.  | post.add, post.move | [ligne 921](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:921>) |
| 59.9 |  Donne à Camera 01 son propre post-traitement, indépendant de la scène.  | post.setCameraStackMode | [ligne 922](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:922>) |
| 59.10 |  Rends Camera 01 sans aucun post-traitement.  | post.setCameraStackMode | [ligne 923](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:923>) |
| 59.11 |  Remets Camera 01 sur le post-traitement de la scène.  | post.setCameraStackMode | [ligne 924](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:924>) |
| 59.12 |  Applique le préréglage horreur au post-traitement de Camera 01 seule.  | post.applyPreset | [ligne 925](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:925>) |
| 59.13 |  Duplique le halo lumineux pour en avoir un second.  | post.duplicate | [ligne 926](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:926>) |
| 59.14 |  Remets le halo lumineux à ses réglages par défaut.  | post.reset | [ligne 927](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:927>) |
| 59.15 |  Pose une clé sur la force du halo lumineux, à 2.  | post.addKeyframe | [ligne 928](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:928>) |
| 59.16 |  Retire la clé posée sur la force du halo lumineux.  | post.removeKeyframe | [ligne 929](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:929>) |
| 59.17 |  Quels préréglages de post-traitement puis-je appliquer ?  | post.applyPreset, post.listPresets | [ligne 930](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:930>) |
| 59.18 |  Enregistre cette composition sous le nom Aube grise.  | post.savePreset | [ligne 931](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:931>) |
| 59.19 |  Renomme le préréglage Nuit froide en Nuit polaire.  | post.renamePreset | [ligne 932](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:932>) |
| 59.20 |  Supprime le préréglage Nuit froide de cette machine.  | post.deleteSavedPreset | [ligne 933](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:933>) |
| 60.1 |  Donne de la santé à Cube Test.  | component.attach | [ligne 937](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:937>) |
| 60.2 |  Monte la santé maximum de Cube Test à 250.  | component.setProperties | [ligne 938](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:938>) |
| 60.3 |  Fais aller Cube Test de gauche à droite.  | component.setProperties | [ligne 939](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:939>) |
| 60.4 |  Retire la santé de Cube Test.  | component.detach | [ligne 940](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:940>) |
| 61.1 |  Lance la partie.  | play.start | [ligne 944](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:944>) |
| 61.2 |  Où en est la partie ?  | runtime.report | [ligne 945](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:945>) |
| 61.3 |  Mets la partie en pause.  | play.pause | [ligne 946](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:946>) |
| 61.4 |  Avance de dix pas.  | play.step | [ligne 947](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:947>) |
| 61.5 |  Reprends la partie.  | play.resume | [ligne 948](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:948>) |
| 61.6 |  Y a-t-il des erreurs dans la partie ?  | runtime.errors | [ligne 949](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:949>) |
| 61.7 |  Arrête la partie.  | play.stop | [ligne 950](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:950>) |
| 61.8 |  Quels scripts ce projet contient-il ?  | script.list | [ligne 951](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:951>) |
| 61.9 |  Montre-moi le script Walk.ts.  | script.read | [ligne 952](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:952>) |
| 61.10 |  Écris un script Patrol.ts qui fait avancer l’objet.  | script.write | [ligne 953](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:953>) |
| 61.11 |  Décris-moi Cube Test.  | studio.describe | [ligne 954](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:954>) |
| 61.12 |  Qu’est-ce que je peux régler sur un composant Santé ?  | studio.docs | [ligne 955](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:955>) |
| 61.13 |  Donne de la santé à Cube Test et monte son maximum à 250, en une seule fois.  | studio.batch | [ligne 956](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:956>) |
| 62.1 |  Fais s’ouvrir la porte à deux secondes de cinématique.  | timeline.addSceneCue | [ligne 960](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:960>) |
| 62.2 |  Mets un fondu d’une seconde à trois secondes.  | timeline.addSceneCue | [ligne 961](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:961>) |
| 62.3 |  Retire le fondu que tu viens de poser.  | timeline.removeSceneCue | [ligne 962](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:962>) |
| 62.4 |  Cette timeline est une intro : ne me propose que ce qu’il faut.  | timeline.setPanelRows | [ligne 963](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:963>) |
| 63.1 |  Fais-moi un jeu à la troisième personne.  | game.applyTemplate | [ligne 967](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:967>) |
| 63.2 |  Fais-moi un jeu vu de dessus.  | game.applyTemplate | [ligne 968](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:968>) |
| 63.3 |  Appelle cette scène un prefab nommé Caisse.  | prefab.define | [ligne 969](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:969>) |
| 63.4 |  Pose le prefab Scène 1 dans cette scène.  | prefab.instantiate | [ligne 970](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:970>) |
| 63.5 |  Pose le prefab Scène 1 à trois mètres sur la droite.  | prefab.instantiate | [ligne 971](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:971>) |
| 64.1 |  Envoie la partie dans la scène Scène 1.  | play.loadScene | [ligne 975](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:975>) |
| 64.2 |  À deux secondes, fais un fondu d’une seconde vers Scène 1.  | timeline.addSceneCue | [ligne 976](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:976>) |
| 65.1 |  Exporte le jeu.  | game.export | [ligne 980](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:980>) |
| 66.1 |  Fais écrire par un modèle un script qui fait tourner l'objet.  | generator.prepare, generator.submit | [ligne 988](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:988>) |
| 66.2 |  Demande au modèle de réécrire ce script pour qu'il aille deux fois plus vite.  | generator.prepare, generator.submit, file.open | [ligne 989](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:989>) |
| 66.3 |  Avant de dépenser quoi que ce soit, dis-moi ce qui est armé dans le générateur.  | generator.prepare, generator.readArmedGeneration | [ligne 990](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:990>) |
| 66.4 |  Fais écrire un nouveau script de saut, sans toucher à celui qui est ouvert.  | generator.prepare, generator.submit | [ligne 991](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:991>) |
| 67.1 |  Retiens que les caméras suivent le rail, jamais la cible.  | memory.write | [ligne 1003](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1003>) |
| 67.2 |  Qu'est-ce que tu sais des caméras de ce projet ?  | memory.recall | [ligne 1004](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1004>) |
| 67.3 |  Donne-moi le détail de ce que tu sais sur les caméras.  | memory.read | [ligne 1005](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1005>) |
| 67.4 |  Oublie ce que tu as retenu sur les caméras.  | memory.forget | [ligne 1006](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1006>) |
| 67.5 |  Relie ce que tu sais des caméras à ce que tu sais du script.  | memory.write, memory.link | [ligne 1007](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1007>) |
| 68.1 |  Passe ce document en pixel art, avec une grille de 32 sur 32.  | canvas.setPixelArt | [ligne 1019](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1019>) |
| 68.2 |  Le mode pixel art est-il actif, et quelle est la taille de la grille ?  | canvas.state | [ligne 1020](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1020>) |
| 68.3 |  Pose un pixel rouge en 3, 4.  | canvas.drawPixels | [ligne 1021](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1021>) |
| 68.4 |  Trace une ligne noire du coin haut gauche au coin bas droit.  | canvas.drawPixels | [ligne 1022](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1022>) |
| 68.5 |  Dessine un carré bleu plein de 8 sur 8 au centre de la grille.  | canvas.drawPixels | [ligne 1023](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1023>) |
| 68.6 |  Remplis tout le calque en blanc.  | canvas.drawPixels | [ligne 1024](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1024>) |
| 68.7 |  Efface le pixel en 3, 4.  | canvas.drawPixels | [ligne 1025](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1025>) |
| 68.8 |  Génère un sprite de personnage.  | generator.submit | [ligne 1026](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1026>) |
| 68.9 |  Enlève la grille de pixel art de ce document.  | canvas.setPixelArt | [ligne 1027](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1027>) |
| 69.1 |  Analyse les possibilités d’optimisation de cette scène sans la modifier.  | optimization.analyze | [ligne 1031](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1031>) |
| 69.2 |  Optimise les objets sélectionnés sans aucune perte visuelle.  | optimization.selection | [ligne 1032](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1032>) |
| 69.3 |  Prépare toute cette scène pour le jeu avec les optimisations sûres.  | optimization.world | [ligne 1033](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1033>) |
| 69.4 |  Trouve ce qui provoque le plus de draw calls et donne-moi le rapport.  | optimization.report | [ligne 1034](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1034>) |
| 69.5 |  Vide le cache d’optimisation de cette scène.  | optimization.clearCache | [ligne 1035](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1035>) |
| 69.6 |  Optimise tout sauf Cube Test.  | optimization.exclude | [ligne 1036](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1036>) |
| 69.7 |  Force les deux sphères à utiliser des instances.  | optimization.setMode | [ligne 1037](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1037>) |
| 70.1 |  Ajoute une note pour la prochaine génération : rends l'arrière-plan nocturne.  | img.pin | [ligne 1044](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1044>) |
| 70.2 |  Sur le calque Bateau, note pour la génération : garde exactement cette coque.  | img.pin | [ligne 1045](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1045>) |
| 70.3 |  Remplace la note de génération par : éclaire seulement l'arrière-plan.  | img.pin | [ligne 1046](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1046>) |
| 70.4 |  Retire la note de génération en attente.  | img.pin | [ligne 1047](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1047>) |
| 71.1 |  Que contient l'onglet modèle ?  | scene.state | [ligne 1053](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1053>) |
| 71.2 |  Passe le modèle en filaire.  | view.setDisplayMode | [ligne 1054](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1054>) |
| 71.3 |  Masque le squelette du modèle.  | command.runStudioCommand | [ligne 1055](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1055>) |
| 71.4 |  Capture la vue du modèle.  | scene.capture | [ligne 1056](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1056>) |
| 71.5 |  Ajoute un cube à côté du modèle.  | node.add | [ligne 1057](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1057>) |
| 72.1 |  Liste les cartes de contrôles du projet, avec les commandes clavier et manette.  | inputMaps.list | [ligne 1065](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1065>) |
| 72.2 |  Lis la carte de contrôles Controls/character.input.json.  | inputMap.read | [ligne 1066](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1066>) |
| 72.3 |  Écris cette carte de contrôles dans Controls/character.input.json.  | inputMap.write | [ligne 1067](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1067>) |
| 72.4 |  Liste les graphes d’animation du projet.  | animationGraphs.list | [ligne 1068](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1068>) |
| 72.5 |  Lis le graphe d’animation Animation/character.anim.json.  | animationGraph.read | [ligne 1069](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1069>) |
| 72.6 |  Écris ce graphe d’animation dans Animation/character.anim.json.  | animationGraph.write | [ligne 1070](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1070>) |
| 72.7 |  Vérifie comment le mouvement bundled idle s’adapte au personnage sélectionné.  | animation.retargetStatus | [ligne 1071](</Users/pasquelin/Applications/AI Desktop Studio/scripts/banc/BATTERIE.md:1071>) |
