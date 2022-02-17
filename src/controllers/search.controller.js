import createError from 'http-errors'
import pick from '../utils/pick'
import catchAsync from '../utils/catchAsync'
import { postService, userService } from '../services'
import { tranSuccess } from '../../lang/en'
import User from '../models/user.model'

/**
 * Get search page
 * @GET search/
 * @access private
 */
const getSearchPage = (req, res) => {
  res.render('search', {
    pageTitle: 'Search',
    selectedTab: 'users',
    errors: req.flash('errors'),
    success: req.flash('success'),
    userLoggedIn: req.user,
    userLoggedInJs: JSON.stringify(req.user),
    selectedPage: 'search',
  })
}

/**
 * Get search users
 * @GET search/users
 * @access private
 */
const getSearch = (req, res) => {
  res.render('search', {
    pageTitle: 'Search',
    selectedTab: req.params.selectedTab,
    selectedPage: 'search',
    userLoggedIn: req.user,
    userLoggedInJs: JSON.stringify(req.user),
    errors: req.flash('errors'),
    success: req.flash('success'),
  })
}

export default {
  getSearch,
  getSearchPage,
}
