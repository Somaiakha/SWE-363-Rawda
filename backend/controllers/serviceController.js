const Service = require("../models/Service");

exports.getServices = async (req, res) => {
  const data = await Service.find();
  res.json(data);
};

exports.createService = async (req, res) => {
  const service = await Service.create(req.body);
  res.json(service);
};

exports.updateService = async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(service);
};

exports.deleteService = async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};