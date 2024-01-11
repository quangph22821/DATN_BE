import Bill from "../models/bill";

// Get All Bill
export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({})
      .populate("products.productId")
      .populate("userId");

    if (!bills || bills.length === 0) {
      return res.status(400).json({ message: "Không có hóa đơn!" });
    }

    return res
      .status(200)
      .json({ message: "Lấy danh sách bill thành công!", bills });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Bill By User
export const getUserBills = async (req, res) => {
  const { userId } = req.params;
  try {
    const bills = await Bill.find({ userId })
      .populate("products.productId")
      .populate("userId");

    if (!bills || bills.length === 0) {
      return res.status(400).json({ message: "Không có hóa đơn!" });
    }

    return res
      .status(200)
      .json({ message: "Lấy danh sách bill user thành công!", bills });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get One Bill
export const getBill = async (req, res) => {
  const { billId } = req.params;
  try {
    const bill = await Bill.findById(billId)
      .populate("products.productId")
      .populate("userId");

    if (!bill) {
      return res.status(400).json({ message: "Không có hóa đơn!" });
    }

    return res.status(200).json({ message: "Lấy bill thành công!", bill });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update Status Bill
export const updateBill = async (req, res) => {
  const { billId } = req.params;
  const { status, paymentStatus } = req.body;
  try {
    // Tìm bill cần cập nhật
    const bill = await Bill.findById(billId);

    if (!bill) {
      return res.status(400).json({ message: "Không có hóa đơn!" });
    }

    if (bill.status === "Chờ xác nhận") {
      if (
        status === "Đã xác nhận" ||
        status === "Đang giao hàng" ||
        status === "Đã giao hàng" ||
        status === "Hủy đơn hàng"
      ) {
        bill.status = status;
      } else {
        return res
          .status(400)
          .json({
            message: "Không thể chuyển từ 'Chờ xác nhận' sang trạng thái khác.",
          });
      }
    } else if (bill.status === "Đã xác nhận") {
      if (
        status === "Đang giao hàng" ||
        status === "Đã giao hàng" ||
        status === "Hủy đơn hàng"
      ) {
        bill.status = status;
      } else {
        return res
          .status(400)
          .json({
            message: "Không thể chuyển từ 'Đã xác nhận' sang trạng thái khác.",
          });
      }
    } else if (bill.status === "Đang giao hàng") {
      if (status === "Đã giao hàng" || status === "Hủy đơn hàng") {
        bill.status = status;
      } else {
        return res
          .status(400)
          .json({
            message:
              "Không thể chuyển từ 'Đang giao hàng' sang trạng thái khác.",
          });
      }
    }
    if (paymentStatus) {
      bill.paymentStatus = paymentStatus;
    }

    await bill.save();

    return res.status(200).json({ message: "Cập nhật bill thành công!", bill });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// HỦY ĐƠN HÀNG
export const cancelBill = async (req, res) => {
  const { billId } = req.params;
  const { newStatus } = req.body;

  try {
    // Tìm và cập nhật trạng thái trong MongoDB
    const bill = await Bill.findByIdAndUpdate(
      billId,
      { status: newStatus },
      { new: true }
    );

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (!bill) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }
    // Kiểm tra xem đơn hàng đã bị hủy trước đó chưa
    if (bill.status === "Hủy đơn hàng") {
      return res.status(400).json({ message: "Đơn hàng đã bị hủy trước đó!" });
    }

    if (
      bill.status !== "Chờ xác nhận" &&
      bill.paymentMethod !== "PayOnDelivery"
    ) {
      return res.status(400).json({ message: "Bạn không thể hủy đơn hàng!" });
    }

    // Hủy đơn hàng
    bill.status = "Hủy đơn hàng";
    await bill.save();

    return res.status(200).json({
      message: "Hủy đơn hàng thành công!",
      bill,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error.message);
    res.status(500).json({ error: "Lỗi khi cập nhật trạng thái đơn hàng" });
  }
};
