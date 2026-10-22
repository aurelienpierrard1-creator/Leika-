# AI TRADER FACTORY — édition démo

Application web en français pour apprendre l’analyse technique et tester des règles avec un portefeuille fictif. **Le trading réel est désactivé.** L’application ne demande ni ne stocke de clé API et ne passe aucun ordre.

## Marchés et données

- Une sélection élargie de cryptomonnaies et 12 paires de forex spot Kraken, plus six contrats dérivés Kraken liés à l’or, l’argent, le cuivre, au pétrole WTI, au Brent et au gaz naturel.
- Cours spot via les points publics Kraken. Les contrats matières premières utilisent les cotations et les graphiques publics Kraken Futures; ce sont des produits dérivés, pas des achats de matières premières. La disponibilité dépend de l’accès réseau et des règles CORS appliquées par le navigateur. Si le navigateur bloque ces requêtes, ces marchés restent « indisponibles »; aucun cours n’est inventé.
- TradingView n’est pas utilisé comme flux d’entrée pour les signaux ou le backtest : ses widgets sont destinés à l’affichage, sa FAQ précise qu’il n’existe pas d’API pour exporter les données, et ses conditions interdisent notamment leur usage pour la décision algorithmique. Avant de l’inclure dans un service payant, obtenir l’autorisation/licence adaptée; ici, les calculs restent fondés sur Kraken. Voir la [FAQ données des widgets TradingView](https://www.tradingview.com/widget-docs/faq/data/) et ses [conditions d’utilisation](https://www.tradingview.com/policies/).
- Analyse détaillée de l’actif choisi en 1, 5 ou 15 minutes, 1 heure, 4 heures ou 1 jour. Les indicateurs utilisent les chandeliers clôturés de l’actif sélectionné; la liste de surveillance affiche les cours des autres marchés.
- Graphique en chandeliers sur les 72 dernières bougies clôturées de l’actif et de l’intervalle sélectionnés. ORBIT apparaît dans une scène futuriste en 3D CSS : il marche vers la console holographique, mime le clic Achat/Vente après une ouverture de position simulée et met en évidence le marché choisi. Le geste représente uniquement une opération fictive déjà enregistrée localement; ce n’est ni un ordre Kraken ni une prédiction.
- EMA 9/21, RSI 14 (lissage de Wilder) et MACD (12, 26, 9). Un signal Achat apparaît uniquement si EMA 9 > EMA 21, MACD > ligne signal et RSI entre 50 inclus et 70 exclu. Un signal Vente apparaît uniquement si EMA 9 < EMA 21, MACD < ligne signal et RSI ≤ 50. Les autres configurations restent Attente. Ces conditions strictes réduisent les entrées, sans garantir leur qualité.
- La dernière bougie en cours est écartée. Les bougies spot sont chargées depuis l’API publique Kraken; les contrats utilisent les graphiques publics Kraken Futures. Chaque appel d’historique est limité à 720 bougies.

Si le réseau ou une API échoue, l’application affiche les données comme indisponibles. Elle ne produit jamais de cours de remplacement. Un lot de cotations peut échouer sans masquer les autres lots qui ont répondu.

## Démarrer dans un nouveau dépôt GitHub Pages

1. Créez un dépôt GitHub vide.
2. Décompressez l’archive sur votre ordinateur.
3. Téléversez **le contenu** du dossier extrait à la racine du dépôt : `index.html`, `app.js`, `style.css`, `manifest.webmanifest`, `sw.js`, `icon.svg` et `README.md`.
4. Dans GitHub, ouvrez **Settings → Pages**, choisissez la branche principale et le dossier `/(root)`, puis enregistrez.
5. Ouvrez l’adresse Pages affichée par GitHub après publication. L’archive ne publie rien en ligne à votre place.

Pour l’essayer localement, décompressez le dossier puis démarrez un serveur web statique à sa racine, par exemple `python -m http.server 8000`; visitez ensuite `http://localhost:8000`. La connexion Internet est nécessaire pour les données Kraken. Ouvrir `index.html` directement peut empêcher certaines requêtes réseau et fonctions PWA.

## Portefeuille de démonstration

Le panneau portefeuille est une visualisation démo : il montre la liquidité virtuelle en USD, une conversion EUR indicative si le cours FX public est disponible et le nombre d’actifs en position simulée. Les boutons de dépôt euros et crypto sont désactivés; aucun argent, jeton ou wallet n’est accepté ou connecté par cette version.

Pour recevoir des fonds de clients en France ou conserver leurs crypto-actifs, une simple page GitHub et une adresse de portefeuille ne suffisent pas : le service doit être construit avec les prestataires et autorisations adaptés. L’AMF indique les services crypto autorisés (dont conservation et administration) dans sa [liste blanche des PSCA](https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/crypto-actifs-bitcoin-etc/investir-en-crypto-monnaies-quel-professionnel-choisir). Aucun prestataire n’est choisi ni intégré ici.

- Les réglages par défaut prévoient un capital fictif de 10 000 USD, une allocation de 20 % et un risque maximal de 1 % du capital initial par position. La taille est réduite selon l’allocation, le stop et les frais estimés; le maximum est de trois positions et une seule par marché.
- Les signaux Achat ouvrent un long fictif; les signaux Vente ouvrent un short fictif dans cette simulation seulement. Un short de démonstration réserve le montant de la position et estime les frais de sortie; il ne représente pas un emprunt, une marge ou un ordre courtier réel. L’option automatique n’ouvre qu’une position démo sur l’actif choisi, uniquement si un signal Achat ou Vente est présent et après validation du parcours pédagogique.
- Les frais sont simplifiés à 0,26 % à l’entrée et à la sortie. L’équité ouverte déduit aussi les frais de sortie estimés; le P&L réalisé déduit les frais des deux côtés. Les conversions forex, spreads, glissements, tailles de contrat, financement, marge et échéances des dérivés ne sont pas reproduits. Les résultats forex et matières premières sont donc des simulations approximatives en USD.
- Les stops et objectifs sont examinés à chaque actualisation, au minimum toutes les minutes lorsque la page est ouverte. La sortie est simulée au cours alors observé, qui peut différer du seuil lorsque le prix saute entre deux contrôles.
- Le laboratoire de backtest évalue des stratégies longues uniquement et n’entraîne pas le système de signaux actif. Il utilise jusqu’à 720 bougies publiques; quelques heures ou jours de données ne suffisent pas à établir une stratégie robuste. Le taux de réussite du test est affiché sous la forme gagnantes/opérations clôturées et en pourcentage; il complète le rendement net, ne le remplace pas, et reste peu parlant sur un petit échantillon.
- Le portefeuille, les réglages, jusqu’à 2 000 trades clôturés et leurs caractéristiques d’entrée sont conservés dans le stockage local de ce navigateur. Les données survivent au rechargement et à la fermeture du navigateur, mais ne sont pas synchronisées entre appareils et peuvent être effacées par l’utilisateur, le navigateur ou le nettoyage de ses données. À la limite, seuls les 2 000 plus récents sont gardés; exporter le CSV régulièrement pour archiver le reste. L’export comprend les prix d’entrée/sortie, les frais et le P&L net réalisé. Réinitialiser la démo efface ces données locales.
- Le bilan démo affiche le taux de réussite des trades clôturés conservés et le P&L après frais. C’est une statistique descriptive de ces résultats; elle ne garantit pas les résultats futurs et son effectif est affiché.

## Parcours de formation

Six leçons et huit questions introduisent les pertes possibles, le dimensionnement, les frais, les indicateurs, les backtests et la sécurité. Il faut lire les leçons et obtenir au moins 7/8 pour déverrouiller les **opérations simulées**. La formation est pédagogique; ce n’est ni une certification, ni une vérification d’identité, ni un contrôle d’accès fiable. Aucun paiement ou abonnement n’est intégré.

## Entraînement expérimental

Le laboratoire entraîne dans le navigateur une petite régression logistique à partir de caractéristiques de prix historiques. Il compare aussi six règles d’indicateurs à une conservation passive. Le découpage chronologique réserve 60 % à l’entraînement et au classement des règles, 20 % à la validation et les 20 % les plus récents au test. La validation et le test ne déterminent pas le classement. Une règle n’est mise en avant que si son score de stabilité d’entraînement est positif et qu’elle a réalisé au moins trois entrées.

Le modèle alimenté par les positions démo clôturées est une petite régression logistique, pas une IA générale. Il se réentraîne localement après chaque clôture, enregistre sept caractéristiques calculées au moment de l’entrée et classe le P&L net après les deux frais. Il utilise l’ordre chronologique : 80 % des exemples les plus anciens pour l’ajustement, les 20 % les plus récents pour la validation. Pour activer son filtre automatique en démo, il exige au moins 500 résultats utilisables, au moins 100 opérations acceptées dans la période récente réservée à la validation, une réussite nette d’au moins 65 % sur ces opérations, une précision équilibrée d’au moins 55 % et un rendement net moyen positif. Si un seul critère échoue, le filtre appris reste désactivé et l’automatisation démo repose seulement sur les signaux techniques. Les actions manuelles restent possibles en simulation. Les résultats changent avec les nouvelles clôtures et sont recalculés au rechargement. Ce seuil de 65 % est un critère d’observation, pas une garantie de rentabilité ou de résultat futur; des résultats historiques peuvent être surajustés, et les performances hors échantillon sont souvent moins bonnes que les backtests. Même un grand nombre de trades passés ne rend pas l’application « sûre » pour le réel.

L’automatisation ne tourne que dans une page ouverte, après validation de la formation et activation volontaire du réglage, avec une vérification périodique d’environ une minute. Elle utilise uniquement les cours Kraken qui viennent d’être reçus; une panne réseau ou un cours absent ne déclenche pas de trade. Aucun entraînement ni aucune transaction ne continue lorsque l’application est fermée. Les unités courtes ont très peu d’historique (720 bougies couvrent environ 12 heures en 1 minute, 60 heures en 5 minutes et 7,5 jours en 15 minutes). Un résultat historique n’indique pas les gains futurs; consulter et modifier répétitivement les règles en fonction du test peut le rendre inutilisable comme évaluation indépendante.

## Sécurité et limites

**Mode démo uniquement — les transactions réelles sont désactivées.** Le code ne contient aucun champ ou secret de clé API, aucun point d’accès Kraken privé, ni fonction d’envoi d’ordre. Les API publiques de marché sont en lecture seule. Ne collez jamais une clé API, un mot de passe ou une phrase de récupération dans l’application ou dans un dépôt public.

Cette application n’est pas un conseil financier et ne garantit aucun gain. Les marchés peuvent entraîner des pertes. Les données locales ne sont pas synchronisées entre appareils. Les limites et formats des chandeliers sont décrits dans la [documentation Kraken OHLC](https://docs.kraken.com/api-reference/market-data/get-ohlc-data) et l’[API publique des graphiques Kraken Futures](https://docs.kraken.com/api/docs/futures-api/charts/candles).
