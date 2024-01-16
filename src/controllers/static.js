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

export const getTotalPriceByMonth = async (req, res) => {
  try {
    const { selectedYear, selectedMonth } = req.query;

    if (!selectedYear || !selectedMonth) {
      return res.status(400).json({ message: "Vui lòng chọn năm và tháng!" });
    }

    // Sử dụng moment.js để xác định số ngày trong tháng
    const daysInMonth = moment(`${selectedYear}-${selectedMonth}`, "YYYY-MM").daysInMonth();

    // Tạo mảng chứa các biểu thức $match cho từng ngày trong tháng
    const dailyMatchExpressions = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1; // index + 1 vì ngày trong tháng là từ 1 đến daysInMonth
      return {
        $and: [
          { $expr: { $eq: [{ $year: "$createdAt" }, parseInt(selectedYear)] } },
          { $expr: { $eq: [{ $month: "$createdAt" }, parseInt(selectedMonth)] } },
          { $expr: { $eq: [{ $dayOfMonth: "$createdAt" }, day] } },
          { status: "Đã giao hàng" }, // Thêm điều kiện đã giao hàng
        ],
      };
    });

    // Tính tổng doanh thu cho từng ngày trong tháng
    const dailyTotalPrices = await Promise.all(
      dailyMatchExpressions.map((expression) => aggregateTotalPrice(expression))
    );

    return res.status(200).json({
      message: `Lấy tổng giá trị cho những đơn đã giao hàng trong tháng ${selectedMonth}/${selectedYear} thành công!`,
      dailyTotalPrices,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// TỶ LỆ ĐẶT HÀNG
export const getOrderSuccessRate = async (req, res) => {
  try {
    const bills = await Bill.find({});

    if (!bills || bills.length === 0) {
      return res.status(400).json({ message: 'Không có hóa đơn!' });
    }

    // Tính tổng số đơn hàng
    const totalOrders = bills.length;

    // Tính số đơn hàng đã nhận và đã hủy
    const receivedOrders = bills.filter((order) => order.status === 'Đã giao hàng');
    const canceledOrders = bills.filter((order) => order.status === 'Hủy đơn hàng');

    const successRate = ((receivedOrders.length / totalOrders) * 100).toFixed(2);
    const cancelRate = ((canceledOrders.length / totalOrders) * 100).toFixed(2);

    return res.status(200).json({
      message: 'Thống kê tỷ lệ đặt hàng thành công và tỷ lệ hủy đơn hàng thành công!',
      successRate,
      cancelRate,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};