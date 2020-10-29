const pageOptions = {
  page: parseInt(req.query.page, 10) || 0,
  limit: parseInt(req.query.limit, 10) || 10,
};

sexyModel
  .find()
  .skip(pageOptions.page * pageOptions.limit)
  .limit(pageOptions.limit)
  .exec(function (err, doc) {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.status(200).json(doc);
  });
