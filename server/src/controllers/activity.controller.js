import { Activity } from "../models/activity.model.js";

export const retrieveActivity = async (req , res) => {
    try {
        const { organizationId } = req.params;
        const activities = await Activity.find({ organizationId })
        .sort({ createdAt: -1 })
        .limit(5)

        return res.status(200).json({
            success: true,
            data: activities
        })
    } catch (error) {   
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Couldnt fetch"
        })
    }
}