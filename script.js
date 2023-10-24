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

                    //faire disparaitre les barres quand on survol rien
                    d3.select("#barre_bleue")
                        .transition()
                        .attr("width", 0)

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
                    const width = 450,
                        height = 450,
                        margin = 40;

                    const radius = Math.min(width, height) / 2 - margin

                    // Création dans la div camambert
                    const svg = d3.select("#camambert")
                    .append("svg")
                        .attr("width", width)
                        .attr("height", height)
                    .append("g")
                        .attr("transform", `translate(${width/2},${height/2})`);



                    // ???
                    const color = d3.scaleOrdinal()
                    .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
                    .range(d3.schemeDark2);

                    // Compute the position of each group on the pie:
                    const pie = d3.pie()
                    .sort(null) // Do not sort group by size
                    .value(d => d[1])
                    const data_ready = pie(Object.entries(especes_select))

                    // The arc generator
                    const arc = d3.arc()
                    .innerRadius(radius * 0.5)         // This is the size of the donut hole
                    .outerRadius(radius * 0.8)

                    // Another arc that won't be drawn. Just for labels positioning
                    const outerArc = d3.arc()
                    .innerRadius(radius * 0.9)
                    .outerRadius(radius * 0.9)

                    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
                    svg
                    .selectAll('allSlices')
                    .data(data_ready)
                    .join('path')
                    .attr('d', arc)
                    .attr('fill', d => color(d.data[1]))
                    .attr("stroke", "white")
                    .style("stroke-width", "2px")
                    .style("opacity", 0.7)

                    // Add the polylines between chart and labels:
                    svg
                    .selectAll('allPolylines')
                    .data(data_ready)
                    .join('polyline')
                        .attr("stroke", "black")
                        .style("fill", "none")
                        .attr("stroke-width", 1)
                        .attr('points', function(d) {
                        const posA = arc.centroid(d) // line insertion in the slice
                        const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                        const posC = outerArc.centroid(d); // Label position = almost the same as posB
                        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                        return [posA, posB, posC]
                        })

                    // Add the polylines between chart and labels:
                    svg
                    .selectAll('allLabels')
                    .data(data_ready)
                    .join('text')
                        .text(d => d.data[0])
                        .attr('transform', function(d) {
                            const pos = outerArc.centroid(d);
                            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                            return `translate(${pos})`;
                        })
                        .style('text-anchor', function(d) {
                            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                            return (midangle < Math.PI ? 'start' : 'end')
                        })
                });
                
        };

        
    })

    