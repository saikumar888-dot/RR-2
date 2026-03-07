import { response } from 'express'
import MetricData from '../models/metricdata.model.js'

export const addMetricsData = async (req , res) => {
    try {
        if(!req.user) {
            return res.status(401).json({
                sucess: false,
                message: "Unauthorized"
            })
        }

        const {
            metricId,
            value,
            departmentId,
            periodType,
            periodStart,
            periodEnd
        } = req.body

        const metricData = await MetricData.create({
            organizationId: req.user.organizationId,
            metricId,
            departmentId,
            value,
            periodType,
            periodStart,
            periodEnd,
            submittedBy: req.user._id
        })

        res.status(201).json({
            success: true,
            data: metricData
        })
    } catch (error) {

        response.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getMetricDataByMetric = async (req, res) => {
  try {

    const { metricId } = req.params;

    const data = await MetricData.find({
      organizationId: req.user.organizationId,
      metricId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const getLatestMetricData = async (req, res) => {
  try {

    const { metricId } = req.params;

    const data = await MetricData.findOne({
      organizationId: req.user.organizationId,
      metricId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const getMetricDataWithMetric = async (req, res) => {
  try {

    const { metricId } = req.params;

    const data = await MetricData.find({
      organizationId: req.user.organizationId,
      metricId
    })
    .populate("metricId", "name key dataType")
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};