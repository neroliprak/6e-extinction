let listeExtinction;
let tab_espece_annee;
const espece_par_annee = {};

// Pour charger un fichier JSON
fetch("./data/donnees.json")
  .then((response) => {
    return response.json(); // renvoie les données JSON ()
  })
  .then((data) => {
    listeExtinction = data;
    analyseRadio(listeExtinction); //A chaque fois qu'on clic sur un nouveau bouton radio, ça recharge analyseRadio

    document.querySelectorAll("[name=stade]").forEach((el) => {
      el.onclick = () => {
        //
        analyseRadio(listeExtinction); //A chaque fois qu'on clic sur un nouveau bouton radio, ça recharge analyseRadio
        fetch("./data/texte_stade.json")
          .then((response) => {
            return response.json(); // renvoie les données JSON ()
          })
          .then((text) => {
            textStade(text); //A chaque fois qu'on clic sur un nouveau bouton radio, ça recharge textSade
          });
      };
    });
  });

//fonction d'affichage du texte selon le radio coché
function textStade(text) {
  let stat = Array.from(document.querySelectorAll("input[type=radio]")).filter(
    (item) => item.checked
  )[0].value;

  text.forEach((item) => {
    let text_stat = item.stade;
    if (text_stat == stat) {
      let text_bon = item.explication;
      let image_bonne = item.image;
      document.getElementById("text_stade").innerHTML = text_bon;
      document.getElementById("image_stade").src = image_bonne;
    }
  });
}

//fonction d'analyse du bouton radio coché (et création de la liste des espèces par année en fonction)
function analyseRadio(listeExtinction) {
  const espece_par_annee = {}; // Un objet pour stocker le nombre d'espèces par année

  listeExtinction.forEach((item) => {
    let year = item.date;
    let statut = item.statut;

    // Récupérer les valeurs des boutons radio
    let radio = document.getElementsByName("stade");
    let stat = Array.from(
      document.querySelectorAll("input[type=radio]")
    ).filter((item) => item.checked)[0].value;
    //si dans le json, le statut est égal à la valeur du bouton radio coché, alors on l'ajoute au espece_par_annee (si on coche VU par exemple, ça ne prend que les VU)
    if (statut == stat) {
      //S'il y a une espèce VU dans l'année year...
      if (espece_par_annee[year]) {
        //...alors on augmente de 1 le nombre d'espèces de cette année
        espece_par_annee[year]++;
      } else {
        espece_par_annee[year] = 1;
      }
    }
  });

  //Converti espece_par_annee (objet) en tableau
  tab_espece_annee = Object.keys(espece_par_annee)
    .sort()
    .map((annee) => ({ annee, valeur: espece_par_annee[annee] }));

  //Créé les barres avec notre tableau d'espèces
  barres(tab_espece_annee);
}

//fonction de création des barres
function barres(tab) {
  let largeur_barre = 390 / tab.length; //Largeur des barres dépend du nombre d'années qui doivent être représentés

  //Suppression des barres déjà créées
  d3.selectAll("#graph, #graph1").selectAll("*").remove();

  //Création barres
  d3.selectAll("#graph, #graph1")
    .selectAll("a")
    .data(tab)
    .join("a")
    .attr("href", "#camembert")
    .attr("class", "histobarre")
    .attr("transform", (d, i) => `translate(${largeur_barre * i + 10} ,0)`); //l'emplacement horizontalement dépend de la largeur des barres et de l'emplacement dans le tableau (donc i)

  d3.selectAll(".histobarre")
    .append("rect")
    .attr("fill", "#20252c")
    .attr("width", largeur_barre - 10)
    .attr("height", (d, i) => d.valeur) //objet = d / numéro positionnement = i
    .attr("transform", `scale(1, -1)`); //mets les barres au-dessus de la ligne des abscisses

  // Ajoute du texte pour afficher les années sous chaque barre
  d3.selectAll(".histobarre")
    .append("text")
    .text((d) => d.annee) // Affiche l'année
    .attr("y", 15)
    .attr("text-anchor", "middle") // Centre le texte horizontalement
    .attr("x", largeur_barre / 4.5) // Centre le texte par rapport à la barre
    .style("font", "0.4rem poppins");

  d3.selectAll(".histobarre") //sur toutes les barres
    .on("mouseenter", function (e, d) {
      //au survol de la souris + mettre d'en paramètre pour les barres verticales, d = données associés à this
      d3.selectAll(".histobarre").style("opacity", 0.5); //toutes les barres deviennent transparentes

      d3.select(this) //l'élément concerné par l'élément
        .style("opacity", 1) //devient opaque
        .raise();

      //Apparition d'un rectangle avec le nombre exact d'espèces de la barre
      d3.select(this)
        .append("rect")
        .attr("class", "rectangle")
        .attr("width", 50)
        .attr("height", 15)
        .style("fill", "white")
        .attr("x", 0)
        .attr("y", (d) => -d.valeur - 10);
      //Apparition des écritures + les mettre dans le rectangle blanc
      d3.select(this)
        .append("text")
        .attr("class", "text_nb_espece")
        .text((d) => d.valeur + " espèces")
        .attr("x", 7)
        .style("fill", "black")
        .attr("y", (d) => -d.valeur)
        .attr("font-size", "9")
        .style("font", "0.4rem poppins");
    })
    .on("mouseleave", function (e) {
      //quand on ne survole plus par la souris
      d3.selectAll(".histobarre").style("opacity", 1); //toutes les barres redeviennent opaquent

      //Suppression des textes du nombre d'espèces
      d3.selectAll(".text_nb_espece").remove();
      d3.selectAll(".rectangle").remove();
    })
    //Apparition du deuxième graphique
    .on("click", function (e) {
      //quand on click sur une barre

      // Récupérer les valeurs des boutons radio
      let stat = document.querySelector('input[name="stade"]:checked').value;
      //barre select prend l'année et le nombre d'espèces qui correspondent à la barre sur laquelle on clic
      let annee_select = this.__data__.annee;

      const especes_select = {}; // Un objet pour stocker le nombre d'espèces qu'une famille, pour le graphique 2

      listeExtinction.forEach((item) => {
        let year = item.date;
        let statut = item.statut;
        let famille = item.groupe;

        if (statut == stat && year == annee_select) {
          //S'il y a une espèce VU dans la famille espèce...
          if (especes_select[famille]) {
            //...alors on augmente de 1 le nombre d'espèces de cette famille, cette annee²
            especes_select[famille]++;
          } else {
            especes_select[famille] = 1;
          }
        }
        // Absence de case "tout"
        // //Si on coche la case "tout" (la valeur est vide)
        // if (stat == "" && year == annee_select) {
        //   //on prend toutes les espèce de toutes les années (pas seulement VU par exemple)
        //   if (especes_select[famille]) {
        //     especes_select[famille]++;
        //   } else {
        //     //Initialisation => égal à 1 parce qu'il y a forcément une espèce dans l'annee (sinon il n'y aurait pas l'année)
        //     especes_select[famille] = 1;
        //   }
        // }
      });

      //fonction de création des camemberts
      camembert(stat, annee_select, especes_select);
    });
}

function camembert(stat, year, especes_select) {
  //Suppression des graphiques camemberts déjà créés
  d3.select("#camembert").selectAll("*").remove();

  //Donne la version texte des abréviations
  let statut_selectionne;
  if (stat == "EX") {
    statut_selectionne = "éteintes";
  }
  if (stat == "CR") {
    statut_selectionne = "en danger critique";
  }
  if (stat == "EN") {
    statut_selectionne = "en danger";
  }
  if (stat == "VU") {
    statut_selectionne = "vulnérables";
  }
  if (stat == "NT") {
    statut_selectionne = "quasi menacées";
  }
  //Création du titre du graphique
  d3.select("#camembert")
    .append("h3")
    .text("Familles des espèces " + statut_selectionne + " en " + year);

  //Adaptation du code déposé publiquement sur GitHub de Laxmikanta Nayak (https://gist.github.com/laxmikanta415/dc33fe11344bf5568918ba690743e06f):
  // Dimensions du graphique camembert

  let width = 1500,
    height = 600,
    margin = 0;



  const radius = Math.min(width, height) / 2 - margin; //taille du rond

  // Création d'un svg dans la div camembert

  const svg = d3
    .select("#camembert")
    .append("svg")
    .attr("class", "camembert_svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // Création d'une échelle de couleurs du graphique
  const color = d3.scaleOrdinal([
    "#FFD057",
    "#FF9457",
    "#FF5757",
    "#FF57B2",
    "#BF57FF",
    "#5A57FF",
    "#32CEFF",
    "#FFEE57",
  ]); //Couleurs à utiliser

  // Calcul des positions des familles
  const pie = d3
    .pie()
    .sort(null) // on ne les trie pas
    .value((d) => d[1]); // Valeur à utiliser pour le calcul de l'angle
  const data_ready = pie(Object.entries(especes_select)); // Transforme les données especes_select pour qu'elles soient utilisablent dans le graphique => créé objet avec le nombre d'espèces d'une même famille

  //Création de la forme générale du graphique
  const arc = d3
    .arc()
    .innerRadius(radius * 0.5) // Taille du trou au centre du cercle
    .outerRadius(radius * 0.8);

  // Création d'un espace pour les légendes
  const outerArc = d3
    .arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  // Création des différentes parties du cercle : chaque famille d'espèce est un "path"
  svg
    .selectAll("allSlices")
    .data(data_ready)
    .join("path") // Créé une partie par famille
    .attr("d", arc) // Définit la forme de chaque partie
    .attr("class", "path")
    .attr("fill", (d) => color(d.data[0])) //Rempli les formes avec une couleur
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

    .on("mouseenter", function (e, d) {
      d3.selectAll(".path").style("opacity", 0.25);
      d3.select(this).style("opacity", 1);
      d3.selectAll(".legende_cercle").style("opacity", 0.25);
      d3.selectAll(`.legende_cercle_${d.index}`)
        .style("opacity", 1)
        .attr("font-weight", 700);
    })

    .on("mouseleave", function (e, d) {
      d3.selectAll(`.legende_cercle_${d.index}`).style("opacity", 1);
      d3.selectAll(".path").style("opacity", 1);
      d3.selectAll(".legende_cercle")
        .style("opacity", 1)
        .attr("font-weight", 300);
    });

  d3.select(this).on("mouseleave", function (e, d) {
    d3.selectAll(".path").style("opacity", 1);
  });

  // Création des lignes qui relient les parties du cercle et leur légende
  svg
    .selectAll("allPolylines")
    .data(data_ready)
    .join("polyline") //Créé un élément "plusieurs lignes" par partie
    .attr("stroke", "black")
    .style("fill", "none") // aucune couleur intérieure (sans cette ligne, polyline forme un triangle et non des lignes)
    .attr("stroke-width", 1)
    .attr("points", function (d) {
      //Définition du début et de la fin de la ligne
      const posA = arc.centroid(d); //Début de la ligne
      const posB = outerArc.centroid(d); //Fin de la ligne

      const posC = outerArc.centroid(d); //Coude de la ligne
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; //Calcul d'angle pour savoir où la ligne horizontale doit être positionnée
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // Positionnement sur la gauche (-1) ou sur la droite (1)
      return [posA, posB, posC];
    });

  // Ajout les légendes à coté des lignes
  svg
    .selectAll("allLabels")
    .data(data_ready)
    .join("text")
    .text((d) => `${d.data[0]} (${d.data[1]})`) // Affiche texte pour chaque famille & sa valeur
    .attr("class", (d) => `legende_cercle legende_cercle_${d.index}`) //Ajout des deux class pour viser légende cercle
    .attr("transform", function (d) {
      //Positionnement des légendes
      const pos = outerArc.centroid(d);
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      pos[0] = radius * 1 * (midangle < Math.PI ? 1 : -1); // Positionnement horizontal
      return `translate(${pos})`;
    })

    .style("text-anchor", function (d) {
      // Alignement des légendes par rapport aux lignes
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      return midangle < Math.PI ? "start" : "end";
    });
}
