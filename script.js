// Pour charger un fichier JSON
fetch("donnees.json") 
    .then((response) => {
        return response.json(); // renvoie les données JSON ()
    })
    .then((listeExtinction) => {
        console.log(listeExtinction);
        const espece_par_annee = {}; // Un objet pour stocker le nombre d'espèce par année  

        listeExtinction.forEach((item) => {
            let year = item.date;
            let statut = item.statut;

           // Récupérer les valeurs des boutons radio
            let radio = document.getElementsByName('stade');
            let stat;
            //Parcours les options
            for (let i = 0; i < radio.length; i++) {
                //si un bouotn radio est coché
                if (radio[i].checked) {
                    //prendre la valeur de ce bouton radio
                    stat = radio[i].value;
                }
            }
            //si dans le json, le statut est égal a la valeur du bouton radio coché, alors on l'ajoute au espece_par_annee (si on coche VU par exefmple, ca prend que les VU)
            if (statut==stat) {
                //Si il y a une espèce VU dans l'année year...
                if (espece_par_annee[year]) {
                    //...alors on augmente de 1 le nombre d'espèce de cette année
                    espece_par_annee[year]++;
                }
                else {
                    espece_par_annee[year] = 1;
                }
            }
            //Si on coche la case "tout" (la valeur est vide)
            if (stat == "") {
                //on prend toutes les espèce de toutes les années (pas seulement VU par exemple)
                if (espece_par_annee[year]) {
                    espece_par_annee[year]++;
                } 
                else {
                    //Initialisation => égal à 1 parce qu'il y a forcément une espèce dans l'annee (sinon il n'y aurait pas l'année)
                    espece_par_annee[year] = 1;
                }
            }
        
        });
        
        console.log(espece_par_annee); // Affiche le nombre d'espèces par année

        //Converti espece_par_annee (objet) en tableau     
        let tab_espece_annee = Object.keys(espece_par_annee).sort().map(annee=>({annee, valeur:espece_par_annee[annee]}))

        console.log(tab_espece_annee)

        //Créé les barres avec notre tableau d'espèces
        barres(tab_espece_annee);
        
        //fonction de création des barres
        function barres(tab) {
            let largeur_barre = 390 / tab.length;
            console.log(largeur_barre);

            d3.select("#graph")
                .selectAll("g")
                .data(tab)
                .join("g")
                .attr("class", "histobarre")
                .attr("transform", (d, i) => `translate(${largeur_barre * i + 10} ,0)`) //l'emplacement horizontalement dépend de la largeur des barres et de l'emplacement dans le tableau (donc i)

                //on créé un groupe avant les rectangles, parce que dans un groupe il y aura deux barres

            d3.selectAll(".histobarre")
                .append("rect")
                .attr("fill", "#00aeff")
                .attr("width", largeur_barre-10)
                .attr("height", (d,i) => d.valeur) //objet = d / numéro positionnnement = i
                .attr("transform", `scale(1, -1)`) //met les barres au dessus de la ligne des abscisses 
                
               

            d3.selectAll(".histobarre") //sur toutes les barres
                .on("mouseenter", function(e, d){ //au survol de la souris + mettre d en paramètre pour les barres verticales, d = données associaées à this
                    d3.selectAll(".histobarre")
                        .style("opacity", 0.5) //toutes les barres deviennent transparentent
                    d3.select(this) //l'élément concerné par l'élément
                        .style("opacity", 1) //devient opaque

                    
                    let ratio = 400 / (d.annee + d.valeur) //produit en croix pour que les deux barres se touchent
                    d3.select("#barre_bleue")
                        .transition() // mettre avant les attributs
                        .attr("width", d.annee * ratio)
                })
                .on("mouseleave", function(e){ //quand on ne survol plus par la souris
                    d3.selectAll(".histobarre")
                        .style("opacity", 1) //toutes les barres redeviennent opaquent

                })
                //Apparition du deuxieme graphique
                .on("mouseenter", function(e){ //quand on ne survol plus par la souris
                    
                    const especes_select = {}; // Un objet pour stocker le nombre d'espèces qu'une famille, pour le graphique 2
                    
                    listeExtinction.forEach((item) => {
                       
                        let year = item.date;
                        let statut = item.statut;
                        let famille = item.groupe;

                        // Récupérer les valeurs des boutons radio
                        let radio = document.getElementsByName('stade');
                        let stat;
                        //Parcours les options
                        for (let i = 0; i < radio.length; i++) {
                            //si un bouotn radio est coché
                            if (radio[i].checked) {
                                //prendre la valeur de ce bouton radio
                                stat = radio[i].value;
                            }
                        }

                        //barre select prend l'annee et le nombre d'espèces qui correspondent à la barre sur laquelle on clic
                        let barre_select = this.__data__;
                        console.log(barre_select);
                        let annee_select = barre_select.annee;

                            if (statut==stat && year == annee_select) {
                                //Si il y a une espèce VU dans la famille espece...
                                if (especes_select[famille]) {
                                    //...alors on augmente de 1 le nombre d'espèce de cette famille, cette annee²
                                    especes_select[famille]++;
                                }
                                else {
                                    especes_select[famille] = 1;
                                }
                                
                                
                            }
                            //Si on coche la case "tout" (la valeur est vide)
                            if (stat == "" && year == annee_select) {
                                //on prend toutes les espèce de toutes les années (pas seulement VU par exemple)
                                if (especes_select[famille]) {
                                    especes_select[famille]++;
                                } 
                                else {
                                    //Initialisation => égal à 1 parce qu'il y a forcément une espèce dans l'annee (sinon il n'y aurait pas l'année)
                                    especes_select[famille] = 1;
                                }
                            }
                            

                    })
                    
                    console.log(especes_select);

                    //Adaptation du code du site officiel de d3 :
                    // Dimensions du graphique camambert
                    const width = 800, //Attention à la taille : si trop petit, les titres n'apparaissent pas
                        height = 450,
                        margin = 40;

                    const radius = Math.min(width, height) / 2 - margin

                    // Création d'un svg dans la div camambert
                    const svg = d3.select("#camambert")
                    .append("svg")
                        .attr("width", width)
                        .attr("height", height)
                    .append("g")
                        .attr("transform", `translate(${width/2},${height/2})`);



                    // Création d'une échelle de couleurs du graphique
                    const color = d3.scaleOrdinal()
                    .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
                    .range(d3.schemeDark2); //Couleurs à utiliser

                    // Calcul des positions des familles
                    const pie = d3.pie()
                    .sort(null) // on ne les trie pas
                    .value(d => d[1]) // Valeur à utiliser pour le calcul de l'angle
                    const data_ready = pie(Object.entries(especes_select)) // Transforme les données especes_select pour qu'elles soient utilisablent dans le graphique

                    //Création de la forme générale du graphique
                    const arc = d3.arc()
                    .innerRadius(radius * 0.5)// Taille du trou au centre du cercle
                    .outerRadius(radius * 0.8)

                    // Création d'un espace pour les légendes
                    const outerArc = d3.arc()
                    .innerRadius(radius * 0.9)
                    .outerRadius(radius * 0.9)

                    // Création des différentes parties du cercle : chaque famille d'espèce est un "path"
                    svg
                    .selectAll('allSlices')
                    .data(data_ready) 
                    .join('path') // Créé une partie par famille
                    .attr('d', arc) // Défini la forme de chaque partie 
                    .attr('fill', d => color(d.data[1])) //Rempli les formes avec une couleur
                    .attr("stroke", "white")
                    .style("stroke-width", "2px")
                    .style("opacity", 0.7)

                    // Création des lignes qui relient les parties du cercle et leur légende
                    svg
                    .selectAll('allPolylines')
                    .data(data_ready)
                    .join('polyline') //Créé un élément "plusieurs lignes" par partie
                        .attr("stroke", "black") 
                        .style("fill", "none") // aucune couleur interieure (sans cette ligne, polyline forme un triangle et non des lignes)
                        .attr("stroke-width", 1)
                        .attr('points', function(d) { //Définition du début et de la fin de la ligne
                            const posA = arc.centroid(d) //Début de la ligne
                            const posB = outerArc.centroid(d) //Fin de la ligne
                            const posC = outerArc.centroid(d); //Coude de la ligne
                            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 //Calcul d'angle pour savoir où la ligne horizontale doit être positionnée
                            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // Positionnement sur la gauche (-1) ou sur la droite (1)
                            return [posA, posB, posC]
                        })

                    // Ajout les légendes à coté des lignes
                    svg
                    .selectAll('allLabels')
                    .data(data_ready)
                    .join('text')
                        .text(d => d.data[0]) // Créé un élément texte par famille
                        .attr("class", "legende_cercle") //Ajout d'une classe pour modifier leur CSS
                        .attr('transform', function(d) { //Positionnement des légendes
                            const pos = outerArc.centroid(d);
                            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                            return `translate(${pos})`;
                        })
                        .style('text-anchor', function(d) { // Alignement des légendes par rapport aux lignes
                            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                            return (midangle < Math.PI ? 'start' : 'end')
                        })
                })
                .on("mouseleave", function(e){ //ATTENTION MARCHE PAS
                    //Fais disparaitre le graphe circulaire quand on survol rien
                    d3.select("#camabert")
                        .transition()
                        .attr("width", 0)
                });
                
        };

        
    })

    