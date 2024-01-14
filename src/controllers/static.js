import Bill from "../models/bill";

// lấy tất cả đơn hàng
export const getToalPrice = async (req, res) => {
  try {
    let bills = await Bill.find({});
    //   console.log(bills);
    if (!bills || bills.length === 0) {
      return res.status(400).json({ message: "Không có hóa đơn!" });
    }
    let formattedBills = bills.map((bill) => ({
      totalPrice: bill.totalPrice,
      month: bill.createdAt.getMonth() + 1,
      date: bill.createdAt.getDate(),
      year: bill.createdAt.getFullYear(),
      // Thêm các trường khác nếu cần
    }));
    // console.log(formattedBills);
    let totalPrice = 0;
    for (let i = 0; i < bills.length; i++) {
      totalPrice += bills[i].totalPrice;
    }
    // console.log(totalPrice);
    return res
      .status(200)
      .json({ message: "Lấy danh sách bill thành công!", bills });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const getTotalPriceByFilter = async (req, res) => {
  try {
    const { year, month, week, day } = req.query;

    let matchExpression = {};

    if (year) {
      matchExpression.$expr = { $eq: [{ $year: "$createdAt" }, parseInt(year)] };
    }

    if (month) {
      matchExpression.$expr = {
        $and: [
          { $eq: [{ $year: "$createdAt" }, parseInt(year)] },
          { $eq: [{ $month: "$createdAt" }, parseInt(month)] },
        ],
      };
    }

    if (week) {
      if (day) {
        // Lọc dữ liệu theo tuần hiện tại và đến ngày hiện tại
        matchExpression.$expr = {
          $and: [
            { $eq: [{ $year: "$createdAt" }, parseInt(year)] },
            { $eq: [{ $week: "$createdAt" }, parseInt(week)] },
            { $gte: ["$createdAt", new Date(`${year}-${month}-01`)] }, // Ngày đầu tiên của tháng
            { $lte: ["$createdAt", new Date(`${year}-${month}-31T23:59:59`)] }, // Ngày cuối cùng của tháng
          ],
        };
      } else {
        // Lọc dữ liệu theo tuần hiện tại mà không yêu cầu ngày cụ thể
        matchExpression.$expr = {
          $and: [
            { $eq: [{ $year: "$createdAt" }, parseInt(year)] },
            { $eq: [{ $week: "$createdAt" }, parseInt(week)] },
          ],
        };
      }
    }

    if (day) {
      matchExpression.$expr = {
        $and: [
          { $eq: [{ $year: "$createdAt" }, parseInt(year)] },
          { $eq: [{ $month: "$createdAt" }, parseInt(month)] },
          { $eq: [{ $dayOfMonth: "$createdAt" }, parseInt(day)] },
        ],
      };
    }

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
      return res.status(400).json({
        message: "Không có dữ liệu thỏa mãn điều kiện lọc!",
      });
    }

    const totalPrice = aggregatedResults[0].total;

    return res.status(200).json({
      message: "Lọc dữ liệu thành công!",
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
