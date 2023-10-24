// Pour charger un fichier JSON
fetch("donnees.json") 
    .then((response) => {
        return response.json(); // renvoie les données JSON ()
    })
    .then((listeExtinction) => {
        console.log(listeExtinction);
        const espece_par_annee = {}; // Un objet pour stocker le nombre d'espèce par année  
        
        const especes_select = {}; // Un objet pour stocker le nombre d'espèces qu'une famille, pour le graphique 2

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

                    //faire disparaitre les barres quand on survol rien
                    d3.select("#barre_bleue")
                        .transition()
                        .attr("width", 0)
                })
                //Apparition du deuxieme graphique
                .on("mouseleave", function(e){ //quand on ne survol plus par la souris
                    
                    listeExtinction.forEach((item) => {
                        let year = item.date;
                        let statut = item.statut;
                        let espece = item.groupe;

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
                            console.log(annee_select);

                            if( especes_select[year] == annee_select){
                                console.log("je suis dedans");
                                //Recréer un tableau sur cette annee
                                if (statut==sta) {
                                    //Si il y a une espèce VU dans l'année year...
                                    if (especes_select[espece]) {
                                        //...alors on augmente de 1 le nombre d'espèce de cette année
                                        especes_select[espece]++;
                                    }
                                    else {
                                        especes_select[espece] = 1;
                                    }
                                }
                                //Si on coche la case "tout" (la valeur est vide)
                                if (stat == "") {
                                    //on prend toutes les espèce de toutes les années (pas seulement VU par exemple)
                                    if (especes_select[espece]) {
                                        especes_select[espece]++;
                                    } 
                                    else {
                                        //Initialisation => égal à 1 parce qu'il y a forcément une espèce dans l'annee (sinon il n'y aurait pas l'année)
                                        especes_select[espece] = 1;
                                    }
                                }
                            }
                            
                            
                        
                    })
                    console.log(especes_select);

                    //Adaptation du code du site officiel de d3 :
                    // Dimensions du graphique
                    const width = 450,
                    height = 450,
                    margin = 40;

                    const radius = Math.min(width, height) / 2 - margin

                    // Le graphe est placé dans la div
                    const svg = d3.select("#camambert")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", `translate(${width / 2},${height / 2})`);

                    // // FAUSSES VALEURS POUR TESTER
                    // const data = {a: 9, b: 20, c:30, d:8, e:12}

                    // Choix des couleurs
                    const color = d3.scaleOrdinal()
                    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

                    // Définition des différentes parts du graphique
                    const pie = d3.pie()
                    .value(d=>d[1])

                    const data_ready = pie(Object.entries(barre_select))

                    // Construction du graphique par part (1 part = 1 path)
                    svg
                    .selectAll('whatever')
                    .data(data_ready)
                    .join('path')
                    .attr('d', d3.arc()
                    //Taille totale
                    .innerRadius(100)
                    .outerRadius(radius)
                    )
                    .attr('fill', d => color(d.barre_select[0]))
                    .attr("stroke", "black")
                    .style("stroke-width", "2px")
                    .style("opacity", 0.7)
                    
                });
                
        };

        
    })

    