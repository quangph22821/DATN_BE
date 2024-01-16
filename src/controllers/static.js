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

export const getTotalPriceByYear = async (req, res) => {
  try {
    const { selectedYear } = req.query;

    if (!selectedYear) {
      return res.status(400).json({ message: "Vui lòng chọn năm!" });
    }

    const matchExpression = {
      $expr: { $eq: [{ $year: "$createdAt" }, parseInt(selectedYear)] },
    };

    // Tạo mảng chứa các biểu thức $match cho từng tháng
    const monthlyMatchExpressions = Array.from({ length: 12 }, (_, index) => {
      return {
        $and: [
          matchExpression,
          {
            $expr: {
              $eq: [{ $month: "$createdAt" }, index + 1], // index + 1 vì tháng trong MongoDB là từ 1 đến 12
            },
          },
        ],
      };
    });

    // Tính tổng doanh thu cho từng tháng
    const monthlyTotalPrices = await Promise.all(
      monthlyMatchExpressions.map((expression) =>
        aggregateTotalPrice({ ...expression, ...{ status: "Đã giao hàng" } })
      )
    );

    return res.status(200).json({
      message: `Lấy tổng giá trị cho những đơn đã giao hàng trong năm ${selectedYear} thành công!`,
      monthlyTotalPrices,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};