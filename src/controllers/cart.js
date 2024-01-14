import Cart from "../models/cart.js";
import User from "../models/user.js";
import Product from "../models/product.js";
import Bill from "../models/bill.js";

// Get All Cart
export const getCarts = async (req, res) => {
  try {
    const carts = await Cart.find();

    if (carts.length === 0) {
      return res.status(400).json({ message: "Không có giỏ hàng nào!" });
    }

    return res.json({
      message: "Lấy danh sách giỏ hàng thành công!",
      carts,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Get One Cart
export const getCart = async (req, res) => {
  const { _id: userId } = req.user;

  try {
    // Tìm kiếm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId })
      .populate("products.productId")
      .populate("userId");

    if (!cart) {
      return res.status(400).json({ message: "Không có giỏ hàng nào!" });
    }

    return res.json({
      message: "Lấy giỏ hàng thành công!",
      cart,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Add To Cart
export const addToCart = async (req, res) => {
  const { _id: userId } = req.user;
  const { productId, quantity = 1 } = req.body;

  try {
    // Kiểm tra xem user có giỏ hàng hay chưa
    let cart = await Cart.findOne({ userId })
      .populate("products.productId")
      .populate("userId");

    // Nếu chưa có giỏ hàng thì tạo mới
    if (!cart) {
      cart = await Cart.create({
        userId,
        products: [],
        shippingFee: 100,
      });

      // Cập nhật id của Cart trong collection User
      await User.findByIdAndUpdate(userId, { cartId: cart._id });
    }
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    let productExists = cart.products.find(
      (product) => product.productId?._id == productId
    );
    // console.log("73 cart", productExists);
    if (!productExists) {
      // Sản phẩm chưa tồn tại trong giỏ hàng, thêm mới
      const product = await Product.findById(productId);
      cart.products.push({
        productId: product._id,
        quantity: quantity,
        price: product.price * quantity,
      });
    } else {
      // Sản phẩm đã tồn tại trong giỏ hàng, chỉ cần cập nhật số lượng và giá
      if (quantity) {
        productExists.quantity = productExists.quantity + Number(quantity)
      } else {
        productExists.quantity = quantity;
      }

      const getPriceProduct = await Product.findById(productId).select("price");
      productExists.price = getPriceProduct.price * productExists.quantity;
    }

    await cart.save();

    // Tính tổng giá của giỏ hàng
    handleTotalOrder(cart);

    return res
      .status(200)
      .json({ message: "Sản phẩm đã được thêm vào giỏ hàng!", cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Upcate Cart
export const updateCart = async (req, res) => {
  const { _id: userId } = req.user;
  const { productId, quantity } = req.body;
  try {
    // Kiểm tra xem user có giỏ hàng hay chưa
    let cart = await Cart.findOne({ userId })
      .populate("products.productId")
      .populate("userId");

    // Nếu không tìm thấy giỏ hàng, trả về lỗi
    if (!cart) {
      return res.status(400).json({ message: "Không có giỏ hàng!" });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    let product = cart.products.find(
      (product) => product?.productId?._id == productId
    );

    // Nếu không tìm thấy sản phẩm trong giỏ hàng, trả về lỗi
    if (!product) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng!" });
    }

    // Cập nhật số lượng sản phẩm
    product.quantity = quantity;

    // Cập nhật giá sản phẩm theo số lượng
    const getPriceProduct = await Product.findById(productId).select("price");
    product.price = getPriceProduct.price * quantity;

    await cart.save();

    // Tính tổng giá của giỏ hàng
    handleTotalOrder(cart);

    return res.status(200).json({ message: "Cập nhật thành công!", cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete One Product In Cart
export const deleteProductCart = async (req, res) => {
  const { _id: userId } = req.user;
  const { productId } = req.params;
  try {
    // Tìm kiếm giỏ hàng của người dùng
    let cart = await Cart.findOne({ userId })
      .populate("products.productId")
      .populate("userId");

    // Nếu không tìm thấy giỏ hàng, trả về lỗi
    if (!cart) {
      return res.status(400).json({ message: "Cart not found!" });
    }

    // Tạo mảng mới không chứa sản phẩm muốn xóa
    cart.products = cart.products.filter(
      (product) => product.productId._id != productId
    );

    await cart.save();

    // Tính tổng giá của giỏ hàng
    handleTotalOrder(cart);

    return res.status(200).json({ message: "Xóa thành công!", cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete All Product In Cart
export const deleteAllProductCart = async (req, res) => {
  const { _id: userId } = req.user;
  try {
    // Tìm kiếm giỏ hàng của người dùng
    let cart = await Cart.findOne({ userId });

    // Nếu không tìm thấy giỏ hàng, trả về lỗi
    if (!cart) {
      return res.status(400).json({ message: "Cart not found!" });
    }

    // Xóa tất cả sản phẩm trong giỏ hàng
    cart.products = [];

    await cart.save();

    // Tính tổng giá của giỏ hàng
    handleTotalOrder(cart);

    return res.status(200).json({ message: "Xóa thành công!", cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// CheckOut
export const checkOut = async (req, res) => {
  const { _id: userId } = req.user;
  const {
    phone,
    city,
    district,
    commune,
    shippingAddress,
    paymentMethod,
    paymentStatus,
  } = req.body;
  try {
    // Tìm kiếm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId });
  console.log("216",cart._id);
    // Nếu không có giỏ hàng thì trả về lỗi
    if (!cart || cart.products.length === 0) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy sản phẩm nào!" });
    } 
    
    
    if(cart) {
      // Lấy thông tin user
      const user = await User.findById(userId);

      // Tạo Bill
      const bill = await Bill.create({
        userId,
        cartId: cart._id,
        phone: phone,
        city: city,
        district: district,
        commune: commune,
        shippingAddress: shippingAddress,
        totalPrice: cart.totalPrice,
        shippingFee: cart.shippingFee,
        totalOrder: cart.totalOrder,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        products: cart.products,
      });

      // Populate đến bảng user
      await bill.populate("userId");

      // Sau khi tạo bill cập nhật lại giỏ hàng
      (cart.totalPrice = 0),
        (cart.totalOrder = 0),
        (cart.products = []),
        await cart.save();

      // Sau khi tạo bill thêm id bill vào bảng user
      user.billsId.push(bill._id);

      await user.save();
      
      return res.status(200).json({ message: "Đặt hàng thành công!",bill  });
    }


  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// hàm để tính tổng giá sản phẩm trong giỏ hàng
const handleTotalOrder = async (cart) => {
  try {
    // Tính tổng giá của giỏ hàng
    const total = cart.products.reduce((accumulator, product) => {
      return accumulator + product.price;
    }, 0);

    cart.totalPrice = total;
    cart.totalOrder = cart.totalPrice + cart.shippingFee;
    await cart.save();
    return cart;
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
