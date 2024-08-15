import express from 'express';
import { publicRouter } from './route/public-api';
import passport from "passport"
import { errorMiddleware } from './middleware/error-middleware';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(publicRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});