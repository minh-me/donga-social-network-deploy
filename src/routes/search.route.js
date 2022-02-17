import { Router } from 'express'
import { requireLoggedIn } from '../middlewares/auth'
import { searchController } from '../controllers'
const router = new Router()

router.get('/:selectedTab', requireLoggedIn, searchController.getSearch)

router.get('/', requireLoggedIn, searchController.getSearchPage)
export default router
