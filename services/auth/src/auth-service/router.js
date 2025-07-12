import express from "express";
const router = express.Router();

router.route("/api/auth/signup").post((req, res) => {
  res.status(200).send("signup success!");
});

router.route("/api/auth/signin").post((req, res) => {
  res.status(200).send("signup success!");
});

export default router;
