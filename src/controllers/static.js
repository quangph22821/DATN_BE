import Bill from "../models/bill";

// lấy tất cả đơn hàng
export const getToalPrice = async (req, res) => {
    try {
        let bills = await Bill.find({})
        //   console.log(bills);
        if (!bills || bills.length === 0) {
            return res.status(400).json({ message: "Không có hóa đơn!" });

        }
        let formattedBills = bills.map(bill => ({
            totalPrice: bill.totalPrice,
            month: bill.createdAt.getMonth()+1,
            date: bill.createdAt.getDate(),
            year: bill.createdAt.getFullYear()
            // Thêm các trường khác nếu cần
        }));
        // console.log(formattedBills);
        let totalPrice = 0;
        for (let i = 0; i < bills.length; i++) {
            totalPrice += bills[i].totalPrice
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


//lọc theo ngày


// export const getToalPriceByDate = async (req, res) => {
//     try {
//         let bills = await Bill.find({});
        
//         if (!bills || bills.length === 0) {
//             return res.status(400).json({ message: "Không có hóa đơn!" });
//         }

//         let formattedBills = bills.map(bill => ({
//             totalPrice: bill.totalPrice,
//             month: bill.createdAt.getMonth() + 1,
//             date: bill.createdAt.getDate(),
//             year: bill.createdAt.getFullYear()
//             // Thêm các trường khác nếu cần
//         }));

//         // Lọc totalPrice theo ngày
//         let filteredBillsByDate = formattedBills.filter(bill => {
//             const currentDate = new Date(); // Để so sánh với ngày hiện tại
//             return (
//                 bill.date === currentDate.getDate() &&
//                 bill.month === currentDate.getMonth() + 1 &&
//                 bill.year === currentDate.getFullYear()
//             );
//         });
//         console.log("Price  ngày",filteredBillsByDate);
//         // Tính tổng totalPrice từ danh sách lọc
//         let totalFilteredPrice = filteredBillsByDate.reduce((total, bill) => total + bill.totalPrice, 0);
//         console.log("Price 1 ngày",totalFilteredPrice);

//         return res.status(200).json({
//             message: "Lấy danh sách bill thành công!",
//             bills: formattedBills,
//             totalFilteredPrice
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: error.message,
//         });
//     }
// };


///
export const getTotalPriceByMonth = async (req, res) => {
    try {
        
        // const year = 2023; // Đổi thành năm bạn quan tâm
        const year = Number(req.query.year) || Number(new Date().getFullYear());
        const month = Number(req.query.month) || Number(new Date().getMonth()+1); // Đổi thành tháng bạn quan tâm

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const bills = await Bill.find({
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        });

        if (!bills || bills.length === 0) {
            return res.status(400).json({ message: "Không có hóa đơn cho tháng và năm này!" });
        }

        // Tính tổng totalPrice từ danh sách hóa đơn
        const totalFilteredPrice = bills.reduce((total, bill) => total + bill.totalPrice, 0);

        return res.status(200).json({
            message: `Lấy tổng totalPrice cho tháng ${month} năm ${year} thành công!`,
            totalFilteredPrice
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
