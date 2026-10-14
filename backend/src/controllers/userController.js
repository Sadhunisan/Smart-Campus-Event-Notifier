const User = require('../models/User');
const Registration = require('../models/Registration');

const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  res.json(user);
};

const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select('-password');

  res.json(updatedUser);
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  await Registration.deleteMany({ student: req.params.id });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted successfully.' });
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
