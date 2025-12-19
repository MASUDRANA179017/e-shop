// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ProductImageSlider from "../../commonLayouts/ProductImageSlide";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart, FaStar, FaStore, FaCheckCircle, FaTruck, FaUndo, FaShieldAlt, FaHeadset } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { getProductBarcode } from "../../../@Services/BarcodeService";
import { createReview } from "../../../@Services/ReviewService";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [barcode, setBarcode] = useState(null);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    fetch("http://localhost:3000/product/getAll")
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.find((item) => item.id === parseInt(id));
        setProduct(foundProduct || null);

        if (foundProduct) {
          setRelatedProducts(
            data.filter(
              (p) => p.category?.id === foundProduct.category?.id && p.id !== foundProduct.id
            ).slice(0, 4)
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!product?.id) return;
    getProductBarcode(product.id)
      .then((data) => {
        setBarcode(data?.barcode || data);
      })
      .catch((err) => {
        console.error("Failed to load barcode", err);
      });
  }, [product?.id]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.productThumbnail,
      thumbnail: product.productThumbnail,
      brand: product.brand,
      isService: false,
      type: 'product',
      quantity: quantity
    });
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
       // Regular product buy now
       const item = {
         id: product.id,
         name: product.name,
         price: product.price,
         image: product.productThumbnail,
         thumbnail: product.productThumbnail,
         brand: product.brand,
         quantity: quantity,
         isService: false
       };
       // Directly go to checkout or cart
       addToCart(item); // Add to cart first to ensure persistence
       navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      await createReview({
        productId: product.id,
        rating: reviewRating,
        comment: reviewComment
      });
      alert("Review submitted successfully! You earned 5 points.");
      setShowReviewForm(false);
      setReviewComment("");
      // Ideally refresh product reviews here
    } catch (error) {
      console.error(error);
      alert("Failed to submit review. Please ensure you are logged in.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleToggleWishlist = () => {
      if (isInWishlist(product.id)) {
          removeFromWishlist(product.id);
      } else {
          addToWishlist({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.productThumbnail,
              thumbnail: product.productThumbnail,
              brand: product.brand
          });
      }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
    </div>
  );

  if (!product) return (
    <div className="container mx-auto py-16 text-center">
      <h2 className="text-2xl font-bold text-gray-700">Product not found.</h2>
      <Link to="/product" className="text-primary hover:underline mt-4 block">Browse Products</Link>
    </div>
  );

  const isWishlisted = isInWishlist(product.id);

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 4.8; // Default mock rating for better UI if empty

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-primary">Home</Link> &gt; 
            <Link to="/product" className="hover:text-primary mx-1">Products</Link> &gt; 
            <span className="text-gray-800 font-medium ml-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-2xl shadow-sm p-6 lg:p-10">
          {/* Left Column: Image Gallery */}
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-inner bg-gray-100 border border-gray-100">
               {/* Assuming ProductImageSlider handles styling internally, wrapping it for control */}
               <ProductImageSlider product={product} />
            </div>
            
            {/* Barcode Section (Hidden if not available, subtle if is) */}
            {barcode && (
                <div className="flex items-center justify-center bg-gray-50 p-4 rounded-lg border border-gray-200 border-dashed">
                    <span className="text-xs text-gray-500 mr-3 uppercase tracking-wider font-semibold">
                        Product Code
                    </span>
                    <img
                        src={barcode}
                        alt="Barcode"
                        className="h-10 opacity-80 mix-blend-multiply"
                    />
                </div>
            )}
          </div>

          {/* Right Column: Product Info */}
          <div className="flex flex-col">
             <div className="mb-4">
                 <span className="bg-orange-50 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {product.category?.name || "Service"}
                 </span>
             </div>
             
             <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
                {product.name}
             </h1>
             
             <div className="flex items-center gap-4 mb-6">
                 <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-100">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-bold text-gray-800">{averageRating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm ml-1">({product.reviews.length} reviews)</span>
                 </div>
                 {product.stock > 0 ? (
                     <div className="flex items-center text-green-600 text-sm font-medium">
                         <FaCheckCircle className="mr-1" /> Available
                     </div>
                 ) : (
                     <div className="flex items-center text-red-500 text-sm font-medium">
                         <FaCheckCircle className="mr-1" /> Currently Unavailable
                     </div>
                 )}
             </div>

             <div className="flex items-end gap-3 mb-8">
                 <div className="text-4xl font-bold text-primary">
                    {formatPrice(product.price)}
                 </div>
                 {/* Mock original price for discount effect */}
                 <div className="text-xl text-gray-400 line-through mb-1">
                    {formatPrice(product.price * 1.2)}
                 </div>
                 <div className="text-sm font-bold text-red-500 bg-red-50 px-2 py-1 rounded mb-2">
                    20% OFF
                 </div>
             </div>
             
             <p className="text-gray-600 text-lg leading-relaxed mb-8 border-b border-gray-100 pb-8">
                {product.description || "Discover premium quality with this product. We ensure durability, style, and satisfaction with every purchase."}
             </p>

             {/* Vendor Info Card */}
             {product.store && (
                 <div className="flex items-center bg-gray-50 p-4 rounded-xl mb-8 border border-gray-100 hover:border-orange-200 transition-colors">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary font-bold text-xl mr-4 border border-gray-100 overflow-hidden">
                        {product.store.imageUrl ? (
                          <img src={product.store.imageUrl} alt={product.store.name} className="w-full h-full object-cover" />
                        ) : (
                          product.store.name.charAt(0)
                        )}
                     </div>
                     <div className="flex-grow">
                         <p className="text-xs text-gray-500 font-semibold uppercase">
                            Seller
                         </p>
                         <h3 className="font-bold text-gray-800 flex items-center">
                            {product.store.name} <MdVerified className="text-primary ml-1" />
                         </h3>
                     </div>
                     <Link to={`/vendor/${product.store.id}`} className="text-sm font-bold text-primary hover:underline">
                         View Profile
                     </Link>
                 </div>
             )}

            {/* Quantity Selector for Products */}
            <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                            -
                        </button>
                        <input 
                            type="number" 
                            className="w-16 text-center font-bold text-gray-800 outline-none"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                        />
                        <button 
                            onClick={() => setQuantity(q => q + 1)}
                            className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                            +
                        </button>
                    </div>
                    <span className="text-sm text-gray-500">
                        {product.stock > 0 ? `${product.stock} items available` : "Out of Stock"}
                    </span>
                </div>
            </div>

             {/* Action Buttons */}
             <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                 <button
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                    className={`flex-1 font-bold py-3 sm:py-4 px-4 sm:px-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 ${
                        (product.stock <= 0) 
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" 
                        : "bg-[#FF624C] hover:bg-[#FF3B2F] text-white shadow-orange-200"
                    }`}
                 >
                    Buy Now
                 </button>
                 <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`flex-1 border-2 font-bold py-3 sm:py-4 px-4 sm:px-8 rounded-xl transition-colors ${
                        (product.stock <= 0)
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white border-[#FF624C] text-[#FF624C] hover:bg-[#FFF0EC]"
                    }`}
                 >
                    Add to Cart
                 </button>
                 <button
                    onClick={handleToggleWishlist}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-colors flex items-center justify-center ${isWishlisted ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-200 text-gray-400 hover:border-red-400 hover:text-red-500'}`}
                 >
                    {isWishlisted ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
                 </button>
             </div>
          </div>
        </div>

        {/* Facilities / Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-12">
            {[
                { icon: <FaTruck />, title: "Fast Delivery", desc: "Ships within 24h" },
                { icon: <FaUndo />, title: "Easy Return", desc: "30 Day Returns" },
                { icon: <FaShieldAlt />, title: "Secure Payment", desc: "100% Protected" },
                { icon: <FaHeadset />, title: "24/7 Support", desc: "Dedicated Team" }
            ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-3xl text-[#FF624C] mb-3">{item.icon}</div>
                    <h4 className="font-bold text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
            ))}
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Customer Reviews</h3>
                {!showReviewForm && (
                    <button 
                        onClick={() => setShowReviewForm(true)}
                        className="text-primary font-bold hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors"
                    >
                        Write a Review
                    </button>
                )}
            </div>

            {showReviewForm && (
                <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-4">Write your review</h4>
                    <form onSubmit={handleReviewSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setReviewRating(star)}
                                        className={`text-2xl focus:outline-none ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        <FaStar />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Comment</label>
                            <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                rows="4"
                                placeholder="Share your experience..."
                                required
                            ></textarea>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowReviewForm(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={reviewSubmitting}
                                className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow hover:bg-orange-600 disabled:opacity-50"
                            >
                                {reviewSubmitting ? "Submitting..." : "Submit Review"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {product.reviews.length > 0 ? (
                <div className="space-y-6">
                    {product.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 mr-3">
                                        {review.user?.firstName?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-gray-800">{review.user?.firstName || "Anonymous User"}</h5>
                                        <div className="flex text-yellow-400 text-sm">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">{review.date || "Recently"}</span>
                            </div>
                            <p className="text-gray-600 pl-13">{review.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                !showReviewForm && (
                <div className="text-center py-10 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 mb-4">No reviews yet. Be the first to review this service!</p>
                    <button onClick={() => setShowReviewForm(true)} className="text-blue-600 font-bold hover:underline">Write a Review</button>
                </div>
                )
            )}
        </div>

        {/* Related Services */}
        {relatedProducts.length > 0 && (
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Similar Services</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {relatedProducts.map((p) => (
                        <Link key={p.id} to={`/product/${p.id}`} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={p.productThumbnail || "/frontend/products/product01.png"}
                                    alt={p.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-primary shadow-sm">
                                    {p.category?.name}
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-gray-800 mb-1 truncate group-hover:text-primary transition-colors">{p.name}</h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-primary font-bold">{formatPrice(p.price)}</span>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <FaStar className="text-yellow-400 mr-1" /> 4.8
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
