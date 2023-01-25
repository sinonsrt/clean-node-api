import { Router } from "express"

const signupRoutes = (router: Router): void => {
  router.post("/signup", (req, res) => {
    res.json("SIGNUP")
  })
}

export { signupRoutes }
