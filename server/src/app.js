import express from 'express'
import 'dotenv/config'
import organizationRoutes from './routes/organization.route.js'
import departmentRoutes from './routes/department.route.js'
import authRoutes from './routes/user.route.js'
import revenueRoutes from './routes/revenue.route.js'
import expenseRoutes from './routes/expense.route.js'
import featureRoutes from './routes/feature.route.js'
import metricdefinionRoutes from './routes/metricdefinition.route.js'
import metricdataRoutes from './routes/metricdata.route.js'
import getfeatureRoute from './routes/getfeatures.route.js'
import activityRoutes from './routes/activity.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors';
 
const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/organization' , organizationRoutes)
app.use('/api/departments' , departmentRoutes)
app.use('/api/auth' , authRoutes)
app.use('/api/revenue' , revenueRoutes)
app.use('/api/expense' , expenseRoutes)
app.use('/api/features' , featureRoutes)
app.use('/api/metricdefiniton' , metricdefinionRoutes)
app.use('/api/metricsdatainput' , metricdataRoutes)
app.use('/api/getcompletefeature' , getfeatureRoute)
app.use('/api/activity' , activityRoutes)


export default app;