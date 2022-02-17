const config = {
  regexObjectId: /^[0-9a-fA-F]{24}$/,
  regexPassword: /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/,
  avatarSize: 1024 * 1024, // 1M
  avatarTypes: ['image/jpg', 'image/jpeg', 'image/png'],
}

export default config
