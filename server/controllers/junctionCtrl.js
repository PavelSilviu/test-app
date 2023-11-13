module.exports = db => {
    return {
      create: async (req, res) => {
        const personId = req.params.personId;
        const { carIds } = req.body;

        try{
            carIds.forEach(carId => {
                db.models.Junction.create({ id_person: personId, id_car: carId });
            });
            res.send({ succes: true });
        } catch (error){
            console.log('eroare la crearea masinii pentru persoana');
            res.status(401);
            return;
        }
      },
  
      update: (req, res) => {
        const personId = req.params.personId;
        const { carIds } = req.body;

        try{
            db.models.Junction.destroy({where: { id_person: personId }});
            carIds.forEach(carId => {
                db.models.Junction.create({ id_person: personId, id_car: carId });
            });
            res.send({ succes: true });
        } catch (error){
            console.log('eroare la crearea masinii pentru persoana');
            res.status(401);
            return;
        }
      },
  
      find: async (req, res) => {
        const personId = req.params.personId;
        db.query(`SELECT id, brand, model, year, capacity, tax FROM "Car" c JOIN "Junction" j ON c.id = j.id_car WHERE j.id_person = :personId`, { replacements: {personId}, type: db.QueryTypes.SELECT }).then(resp => {
            console.log(resp,"respppp");
            res.send(resp);
        }).catch(() => res.status(401));
      },

      destroyPerson: (req, res) => {
        const personId = req.params.personId;
        try {
            db.models.Junction.destroy({where: { id_person: personId }});
            res.send({ success: true });
        } catch (error) {
            console.error('eroare la ștergerea din Junction:');
            res.status(401);
        }
      },

      destroyCar: (req, res) => {
        const carId = req.params.carId;
        try {
            db.models.Junction.destroy({where: { id_car: carId }});
            res.send({ success: true });
        } catch (error) {
            console.error('eroare la ștergerea din Junction:');
            res.status(401);
        }
      }
    };
  };
  