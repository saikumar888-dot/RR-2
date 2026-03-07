import Feature from "../models/feature.model.js";
import MetricDefinition from '../models/metricdefinition.model.js'
import MetricData from '../models/metricdata.model.js'

export const getFeatureFullData = async (req, res) => {
  try {

    const { featureId } = req.params;

    const feature = await Feature.findById(featureId);

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: "Feature not found"
      });
    }

    const metrics = await MetricDefinition.find({
      featureId,
      organizationId: req.user.organizationId
    });

    const result = [];

    for (const metric of metrics) {

      const latestValue = await MetricData.findOne({
        metricId: metric._id,
        organizationId: req.user.organizationId
      }).sort({ createdAt: -1 });

      result.push({
        metricName: metric.name,
        metricKey: metric.key,
        dataType: metric.dataType,
        value: latestValue ? latestValue.value : null
      });

    }

    res.status(200).json({
      success: true,
      feature: feature.name,
      metrics: result
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const getOrganizationDashboard = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const organizationId = req.user.organizationId;

    const features = await Feature.find({
      organizationId,
      enabled: true
    });

    const dashboard = [];

    for (const feature of features) {

      const metrics = await MetricDefinition.find({
        featureId: feature._id,
        organizationId
      });

      const metricResults = [];

      for (const metric of metrics) {

        const latestData = await MetricData.findOne({
          metricId: metric._id,
          organizationId
        }).sort({ createdAt: -1 });

        metricResults.push({
          metricId: metric._id,
          name: metric.name,
          key: metric.key,
          dataType: metric.dataType,
          value: latestData ? latestData.value : null,
          periodType: latestData ? latestData.periodType : null
        });

      }

      dashboard.push({
        featureId: feature._id,
        featureName: feature.name,
        featureKey: feature.key,
        metrics: metricResults
      });

    }

    res.status(200).json({
      success: true,
      features: dashboard
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};