import Bill from "../models/bill";
import moment from "moment";


const aggregateTotalPrice = async (matchExpression) => {
  try {
    const aggregatedResults = await Bill.aggregate([
      {
        $match: matchExpression,
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    if (!aggregatedResults || aggregatedResults.length === 0) {
      return 0;
    }

    return aggregatedResults[0].total;
  } catch (error) {
    throw error;
  }
};

export const getTotalPriceByDate = async (req, res) => {
  try {
    const { selectedYear, selectedMonth, selectedDay } = req.body;

    if (!selectedYear || !selectedMonth || !selectedDay) {
      return res
        .status(400)
        .json({ message: "Vui lòng chọn năm, tháng và ngày!" });
    }

    const matchExpression = {
      $expr: {
        $and: [
          { $eq: [{ $year: "$createdAt" }, parseInt(selectedYear)] },
          { $eq: [{ $month: "$createdAt" }, parseInt(selectedMonth)] },
          { $eq: [{ $dayOfMonth: "$createdAt" }, parseInt(selectedDay)] },
        ],
      },
    };

    const totalPrice = await aggregateTotalPrice(matchExpression);

    return res.status(200).json({
      message: `Lấy tổng giá trị cho ngày ${selectedDay}/${selectedMonth}/${selectedYear} thành công!`,
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
