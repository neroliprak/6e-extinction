// Pour charger un fichier JSON
fetch("donnees.json")
    .then((response) => {
        return response.json(); // renvoie les données JSON
    })
    .then((listeExtinction) => {
        console.log(listeExtinction);
        let data = listeExtinction;
        const yearToCount = {}; // Un objet pour stocker le comptage par année
        
        listeExtinction.forEach((item) => {
            const year = item.date;
            const statut = item.statut;
            console.log(statut);
            let stat = "EX";
            if (statut==stat) {
                if (yearToCount[year]) {
                    yearToCount[year]++;
                } else {
                    yearToCount[year] = 1;
                }
            }
            
        });

        console.log(yearToCount); // Affiche le nombre d'espèces par année


        let largeur_barre = 390 / yearToCount.length;
        console.log(largeur_barre);

        d3.select("#graph")
            .selectAll("g")
            .data(yearToCount)
            .join("g")
            .attr("class", "histobarre")
            .attr("transform", (d, i) => `translate(${largeur_barre * i} ,0)`) //l'emplacement horizontalement dépend de la largeur des barres et de l'emplacement dans le tableau (donc i)

            //on créé un groupe avant les rectangles, parce que dans un groupe il y aura deux barres

        d3.selectAll(".histobarre")
            .append("rect")
            .attr("fill", "#00aeff")
            .attr("width", largeur_barre)
            .attr("height", (d,i) => d.A ) //objet = d / numéro positionnnement = i

            d3.selectAll(".histobarre") //sur toutes les barres
                .on("mouseenter", function(e, d){ //au survol de la souris + mettre d en paramètre pour les barres verticales, d = données associaées à this
                    d3.selectAll(".histobarre")
                        .style("opacity", 0.5) //toutes les barres deviennent transparentent
                    d3.select(this) //l'élément concerné par l'élément
                        .style("opacity", 1) //devient opaque

                    
                    let ratio = 400 / (d.A + d.B) //produit en croix pour que les deux barres se touchent
                    d3.select("#barre_bleue")
                        .transition() // mettre avant les attributs
                        .attr("width", d.A * ratio)
                })
                .on("mouseleave", function(e){ //quand on ne survol plus par la souris
                    d3.selectAll(".histobarre")
                        .style("opacity", 1) //toutes les barres redeviennent opaquent


                    //faire disparaitre les barres quand on survol rien
                    d3.select("#barre_bleue")
                        .transition()
                        .attr("width", 0)
                })


    })
