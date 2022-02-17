import catchAsync from '../utils/catchAsync'
import { uploadService, userService } from '../services'
import { tranSuccess } from '../../lang/en'

/**
 * Upload avatar
 * @POST api/uploadAvatar
 * @access private
 */
const uploadAvatar = catchAsync(async (req, res) => {
  const url = await uploadService.uploadAvatar(req.file.path)
  await userService.updateUserById(req.user.id, { profilePic: url })
  return res.status(200).json({ message: tranSuccess.upload_success, url })
})

/**
 * Upload avatar
 * @POST api/uploadAvatar
 * @access private
 */
const uploadCoverPhoto = catchAsync(async (req, res) => {
  const url = await uploadService.uploadCoverPhoto(req.file.path)
  await userService.updateUserById(req.user.id, { coverPhoto: url })
  return res.status(200).json({ message: tranSuccess.upload_success, url })
})

export default { uploadAvatar, uploadCoverPhoto }
