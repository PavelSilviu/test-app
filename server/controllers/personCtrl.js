module.exports = db => {
    return {
      create: (req, res) => {
        db.models.Person.create(req.body).then(createdPerson => {
          const createdPersonId = createdPerson.id;
          res.send({ success: true, createdPersonId });
        }).catch(() => res.status(401));
      },
  
      update: (req, res) => {
        db.models.Person.update(req.body, { where: { id: req.body.id } }).then(() => {
          res.send({ success: true })
        }).catch(() => res.status(401));
      },
  
      findAll: (req, res) => {
        db.query(`SELECT id, "Person"."firstName", "Person"."lastName", cnp, age FROM "Person" ORDER BY id`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp);
        }).catch(() => res.status(401));
      },
  
      find: (req, res) => {
        const id = req.params.id;
        db.query(`SELECT *
        FROM "Person" WHERE id=:id`, { replacements: {id}, type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp[0]);
        }).catch(() => res.status(401));
      },
  
      destroy: (req, res) => {
        db.query(`DELETE FROM "Person" WHERE id = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
          res.send({ success: true });
        }).catch(() => res.status(401));
      }
    };
  };
  