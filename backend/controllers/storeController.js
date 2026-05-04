const User = require("../models/User");

const STORE_EMAIL = "greenhaven@rawda.com";

exports.getStore = async (req, res) => {
  try {
    let store = await User.findOne({ email: STORE_EMAIL });

    if (!store) {
      store = await User.create({
        name: "Green Haven Plant Store",
        email: STORE_EMAIL,
        password: "123456",
        role: "store",
        phone: "",
        location: "",
        about: ""
      });
    }

    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const store = await User.findOne({ email: STORE_EMAIL });

    store.name = req.body.name;
    store.phone = req.body.phone;
    store.location = req.body.location;
    store.about = req.body.about;

    await store.save();

    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};