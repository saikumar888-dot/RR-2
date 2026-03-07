import MetricDefinition from '../models/metricdefinition.model.js'

export const createMetricDefinition = async (req, res) => {
  try {

    const {
      featureId,
      name,
      key,
      dataType,
      departmentScoped
    } = req.body;

    const metric = await MetricDefinition.create({
      organizationId: req.user.organizationId,
      featureId,
      name,
      key,
      dataType,
      departmentScoped
    });

    res.status(201).json({
      success: true,
      metric
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMetricsByFeature = async (req, res) => {
  try {

    const { featureId } = req.params;

    const metrics = await MetricDefinition.find({
      organizationId: req.user.organizationId,
      featureId
    });

    res.status(200).json({
      success: true,
      metrics
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};