import SQ from "sequelize";
import { sequelize } from "../../db/database.js";

const DataTypes = SQ.DataTypes;

export const User = sequelize.define(
  "user",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export async function createUser(email, password, name) {
  return User.create({ email, password, name });
}

export async function getUserByEmail(email) {
  return User.findOne({
    where: { email },
  });
}

export async function findById(id) {
  return User.findByPk(id);
}
