import Feature from '../models/feature.model.js'

export const createFeature = async (req , res) => {
    try {
        const { name, key, description, config } = req.body;

        const organizationId = req.user.organizationId;

        const feature = await Feature.create({
            organizationId,
            name,
            key,
            description,
            config
        })

        res.status(200).json({
            success: true,
            message: "Feature Created SuccessFully",
            feature
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }   
}

export const getFeatures = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    const features = await Feature.find({
      organizationId,
      enabled: true
    });

    res.status(200).json({
      success: true,
      features
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};