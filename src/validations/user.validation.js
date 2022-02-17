import * as yup from 'yup'
import { transValidations } from '../../lang/en'
import config from './config.validation'
const createUser = {
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().required().email(),
  role: yup.mixed().oneOf(['user', 'admin']),
  password: yup
    .string()
    .matches(config.regexPassword, transValidations.password_incorrect)
    .required(),
}

const getUsers = {
  firstName: yup.string(),
  lastName: yup.string(),
  email: yup.string().email(),
  search: yup.string(),
  role: yup.mixed().oneOf(['user', 'admin']),
  skip: yup.number(),
  page: yup.number().integer(),
  limit: yup.number().integer(),
  sortBy: yup.string(),
  select: yup.string(),
}

const getUser = {
  userId: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
    .required(),
}

const updateUser = {
  userId: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
    .required(),
  firstName: yup.string(),
  lastName: yup.string(),
  password: yup.string(),
  email: yup.string().email(),
  checkbox_selection: yup
    .string()
    .when(['firstName', 'lastName', 'email', 'password'], {
      is: (firstName, lastName, email, password) =>
        !firstName && !lastName && !email && !password,
      then: yup.string().required(),
    }),
}

const deleteUser = {
  userId: yup
    .string()
    .matches(config.regexObjectId, transValidations.objectId_type_incorrect)
    .required(),
}

const updateMe = {
  firstName: yup.string(),
  lastName: yup.string(),
  email: yup.string().email(),
  checkbox_selection: yup.string().when(['firstName', 'lastName', 'email'], {
    is: (firstName, lastName, email) => !firstName && !lastName && !email,
    then: yup.string().required(),
  }),
}

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
}
