const express = require('express');
const router = express.Router();

const Miejsce = require('../model/miejsce');
const bazaDanychWalid = require('../model/bazaDanychWalid')


router.get("/", (req, res, next) => {   
    Miejsce.list()
    .then( ([miejsceList, metadata]) => {
      //wywołane w momencie poprawnego wykonania instrukcji sql i zwrócenia wyniku
      res.render('miejsce/miejsceList', {miejsceList: miejsceList});
    })
    .catch(err => {
      //błąd komunikacji z bazą danych
      console.log(err);
    });
});

router.get("/zapiszMiejsce", (req, res, next) => {
    res.render('miejsce/miejsceForm', { pageTitle: "Nowe miejsce", formAction: "add", miejsce: {} });
});

router.post("/add", (req, res, next) => {
    const newMiejsce = new Miejsce(req.body.title, req.body.szGeog, req.body.dlGeog, req.body.desc);
    // var zero =  parseInt(0, 10);
    // bazaDanychWalid.sprawdzMiejsce(newMiejsce, zero);
    // console.log("SPRAWDZENIEEEE")
    // console.log(zero);

    bazaDanychWalid.sprawdzMiejsce(newMiejsce).then(sprwadzenie =>{
      console.log("sprawdzenie");
      console.log(sprwadzenie);
      if ( sprwadzenie == true){   
        console.log("sprawdzenie");

        console.log(sprwadzenie);
   
        console.log("Rekord o podanych wartościach istnieje już w bazie danych");
        res.redirect("/miejsce");

      }else{
        console.log("sprawdzenie");

        console.log(sprwadzenie);

        console.log("DODANIE DO BD")
        Miejsce.add(newMiejsce)
        .then(() => {
          res.redirect("/miejsce");
        })
        .catch(err => {
          console.log(err);
        });
      }
    })
    
});

router.get("/listaMiejsc", (req, res, next) => {
    Miejsce.list()
    .then( ([miejsceList, metadata]) => {
      //wywołane w momencie poprawnego wykonania instrukcji sql i zwrócenia wyniku
      res.render('miejsce/miejsceProfilList', {miejsceList: miejsceList});
    })
    .catch(err => {
      //błąd komunikacji z bazą danych
      console.log(err);
    });
});

router.get("/usun", (req, res, next) => {
    Miejsce.delete(req.query.miejsce_id);
    res.redirect("/miejsce/listaMiejsc");
});

router.get("/szczegoly", (req, res, next) => {
  Miejsce.getListFromId(req.query.miejsce_id).then(
    ([miejsceList, metadata]) => {
        res.render('miejsce/szczegMiejsca', {miejsceId: req.query.miejsce_id, miejsceList: miejsceList});
    }).catch(err => {
    console.log(err);
});
  
});

router.get("/edycja", (req, res, next) => {
    Miejsce.getListFromId(req.query.miejsce_id).then(
      ([miejsceList, metadata]) => {
        res.render('miejsce/edycjaMiejsca', {miejsceId: req.query.miejsce_id, miejsceList: miejsceList});
      }).catch(err => {
      console.log(err);
  });
});

router.post("/edytujZapisz", (req, res, next) => {
    const newMiejsce =  new Miejsce(req.body.title, req.body.szGeog, req.body.dlGeog, req.body.desc, req.body.miejsceId);
    Miejsce.edit(newMiejsce);
    res.redirect("/miejsce/listaMiejsc");
});



module.exports.route = router; 