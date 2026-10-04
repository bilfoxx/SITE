// Panier commun à toutes les pages du site.
// Chaque page a son propre composant, donc le panier vit dans localStorage
// pour survivre aux changements de page (et au retour arrière du navigateur).
// Ligne : { nom, prix, qte, img }.
(function () {
  var CLE = "cb-panier";

  function lire() {
    try {
      var l = JSON.parse(localStorage.getItem(CLE) || "[]");
      return Array.isArray(l) ? l.filter(function (x) { return x && x.nom && x.qte > 0; }) : [];
    } catch (e) { return []; }
  }

  function ecrire(lignes) {
    try { localStorage.setItem(CLE, JSON.stringify(lignes)); } catch (e) {}
  }

  function ajouter(nom, prix, img) {
    var lignes = lire();
    var existe = lignes.some(function (l) { return l.nom === nom; });
    lignes = existe
      ? lignes.map(function (l) { return l.nom === nom ? { nom: l.nom, prix: l.prix, qte: l.qte + 1, img: l.img } : l; })
      : lignes.concat({ nom: nom, prix: prix, qte: 1, img: img || "" });
    ecrire(lignes);
    return lignes;
  }

  function retirer(nom) {
    var lignes = lire().filter(function (l) { return l.nom !== nom; });
    ecrire(lignes);
    return lignes;
  }

  function euros(n) { return n.toFixed(2).replace(".", ",") + " €"; }

  // Valeurs prêtes pour le tiroir panier des templates.
  function vue(lignes) {
    return {
      lignes: lignes.map(function (l) {
        return { nom: l.nom, fond: l.img ? 'url("' + l.img + '")' : "none", sousTitre: l.qte + " × " + euros(l.prix), total: euros(l.qte * l.prix) };
      }),
      nbPanier: lignes.reduce(function (t, l) { return t + l.qte; }, 0),
      totalPanier: euros(lignes.reduce(function (t, l) { return t + l.qte * l.prix; }, 0)),
      panierVide: lignes.length === 0,
      panierRempli: lignes.length > 0
    };
  }

  window.CBPanier = { lire: lire, ecrire: ecrire, ajouter: ajouter, retirer: retirer, vue: vue, euros: euros };
})();
