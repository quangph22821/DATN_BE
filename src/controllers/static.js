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

// controllers/static.js

// controllers/static.js

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

// LỌC THEO NGÀY
// export const getTotalPriceByDay = async (req, res) => {
//   try {
//     const { selectedYear, selectedMonth, selectedDay } = req.body; // Lấy năm, tháng và ngày từ request parameters

//     if (!selectedYear || !selectedMonth || !selectedDay) {
//       return res
//         .status(400)
//         .json({ message: "Vui lòng chọn năm, tháng và ngày!" });
//     }

//     const aggregatedResults = await Bill.aggregate([
//       {
//         $match: {
//           $expr: {
//             $and: [
//               { $eq: [{ $year: "$createdAt" }, parseInt(selectedYear)] },
//               { $eq: [{ $month: "$createdAt" }, parseInt(selectedMonth)] },
//               { $eq: [{ $dayOfMonth: "$createdAt" }, parseInt(selectedDay)] },
//             ],
//           },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: "$totalPrice" },
//         },
//       },
//     ]);

//     if (!aggregatedResults || aggregatedResults.length === 0) {
//       return res
//         .status(400)
//         .json({
//           message: `Không có hóa đơn cho ngày ${selectedDay}/${selectedMonth}/${selectedYear}!`,
//         });
//     }

//     const totalPrice = aggregatedResults[0].total;

//     return res.status(200).json({
//       message: `Lấy tổng giá trị cho ngày ${selectedDay}/${selectedMonth}/${selectedYear} thành công!`,
//       totalPrice,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// LỌC THEO TUẦN
// export const getTotalPriceByWeek = async (req, res) => {
//   try {
//     const { selectedYear, selectedMonth, selectedWeek } = req.body; // Lấy năm, tháng và tuần từ request parameters

//     if (!selectedYear || !selectedMonth || !selectedWeek) {
//       return res
//         .status(400)
//         .json({ message: "Vui lòng chọn năm, tháng và tuần!" });
//     }

//     const aggregatedResults = await Bill.aggregate([
//       {
//         $match: {
//           $expr: {
//             $and: [
//               { $eq: [{ $year: "$createdAt" }, parseInt(selectedYear)] },
//               { $eq: [{ $month: "$createdAt" }, parseInt(selectedMonth)] },
//               { $eq: [{ $week: "$createdAt" }, parseInt(selectedWeek)] },
//             ],
//           },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: "$totalPrice" },
//         },
//       },
//     ]);

//     if (!aggregatedResults || aggregatedResults.length === 0) {
//       return res
//         .status(400)
//         .json({
//           message: `Không có hóa đơn cho tuần ${selectedWeek} của tháng ${selectedMonth}/${selectedYear}!`,
//         });
//     }

//     const totalPrice = aggregatedResults[0].total;

//     return res.status(200).json({
//       message: `Lấy tổng giá trị cho tuần ${selectedWeek} của tháng ${selectedMonth}/${selectedYear} thành công!`,
//       totalPrice,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// LỌC THEO THÁNG
// export const getTotalPriceByMonth = async (req, res) => {
//   try {
//     const { selectedYear, selectedMonth } = req.body; // Lấy năm và tháng từ request parameters

//     if (!selectedYear || !selectedMonth) {
//       return res.status(400).json({ message: "Vui lòng chọn năm và tháng!" });
//     }

//     const aggregatedResults = await Bill.aggregate([
//       {
//         $match: {
//           $expr: {
//             $and: [
//               { $eq: [{ $year: "$createdAt" }, parseInt(selectedYear)] },
//               { $eq: [{ $month: "$createdAt" }, parseInt(selectedMonth)] },
//             ],
//           },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: "$totalPrice" },
//         },
//       },
//     ]);

//     if (!aggregatedResults || aggregatedResults.length === 0) {
//       return res
//         .status(400)
//         .json({
//           message: `Không có hóa đơn cho tháng ${selectedMonth}/${selectedYear}!`,
//         });
//     }

//     const totalPrice = aggregatedResults[0].total;

//     return res.status(200).json({
//       message: `Lấy tổng giá trị cho tháng ${selectedMonth}/${selectedYear} thành công!`,
//       totalPrice,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// export const getTotalPriceByYear = async (req, res) => {
//   try {
//     const { selectedYear } = req.body; // Lấy năm từ request parameters

//     if (!selectedYear) {
//       return res.status(400).json({ message: "Vui lòng chọn năm!" });
//     }

//     const aggregatedResults = await Bill.aggregate([
//       {
//         $match: {
//           $expr: { $eq: [{ $year: "$createdAt" }, parseInt(selectedYear)] },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: "$totalPrice" },
//         },
//       },
//     ]);

//     if (!aggregatedResults || aggregatedResults.length === 0) {
//       return res
//         .status(400)
//         .json({ message: `Không có hóa đơn cho năm ${selectedYear}!` });
//     }

//     const totalPrice = aggregatedResults[0].total;

//     return res.status(200).json({
//       message: `Lấy tổng giá trị cho năm ${selectedYear} thành công!`,
//       totalPrice,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };
