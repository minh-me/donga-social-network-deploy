import * as yup from 'yup'
import { transValidations } from '../../lang/en'
import config from './config.validation'
const register = {
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().required().email(),
  password: yup
    .string()
    .matches(config.regexPassword, transValidations.password_incorrect)
    .required(),
}

const activate = {
  activation_token: yup.string().required(),
}

const login = {
  email: yup.string().required(),
  password: yup
    .string()
    .matches(config.regexPassword, transValidations.password_incorrect)
    .required(),
}

const forgotPassword = {
  email: yup.string().email().required(),
}

const resetPassword = {
  password: yup
    .string()
    .matches(config.regexPassword, transValidations.password_incorrect)
    .required(),
  passwordConfirm: yup.string().oneOf([yup.ref('password')]),
}

const singout = {
  refreshToken: yup.string().required(),
}

export default {
  register,
  activate,
  login,
  forgotPassword,
  resetPassword,
  singout,
}
