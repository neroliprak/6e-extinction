let tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".rocket",
        start: "-150px center",
        end: "250px",
        scrub: true,
        markers: true,
      },
    });

const wavePath = "M1004 473C1026.67 216 610.5 8.5 0.5 0.5"

tl.to(".rocket", {
  ease: "slow",
  motionPath: {
    path: wavePath,
    align: "self",
  },
});




let tlbulle1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".bulle1",
      start: "-150px center",
      end: "bottom center",
      scrub: true,
      markers: true,
    },
  });
  
  tlbulle1.to(".bulle1", {
    x:1000,
  });


let tlbulle2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".bulle2",
      start: "-120px center",
      end: "bottom center",
      scrub: true,
      markers: true,
    },
  });
  
  tlbulle2.to(".bulle2", {
    x:-1100,
  });