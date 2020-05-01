const { Schema, models, model } = require('mongoose');

const UserSchema = new Schema({
  name: { type: String },
  picture: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  lastLogin: { type: Date, default: null },
  loginCount: { type: Number, default: 0 },
  roles: [{ type: String }],
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = models.UserSchema || model('User', UserSchema);
