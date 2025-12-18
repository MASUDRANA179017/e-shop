import React, { useState, useEffect, useRef } from 'react';
import { 
    FaBarcode, FaSearch, FaShoppingCart, FaTrash, FaPlus, FaMinus, FaMoneyBillWave, FaCreditCard, FaPrint, FaStore, FaTimes, FaDownload, FaCheck
} from 'react-icons/fa';
import { getVendorProducts } from '../../../../@Services/ProductService';
import { getAllStores } from '../../../../@Services/StoreService';
import { openSession, getActiveSession, createTransaction } from '../../../../@Services/PosService';
import { getAllUsers, registerUser } from '../../../../@Services/authService';
import api from '../../../../api/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../../../../context/CurrencyContext';

const VendorPos = () => {
    const { formatPrice } = useCurrency();
    const [session, setSession] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [storeId, setStoreId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountPaid, setAmountPaid] = useState(0);
    const [customerId, setCustomerId] = useState('');
    const [customerQuery, setCustomerQuery] = useState('');
    const [customerFirstName, setCustomerFirstName] = useState('');
    const [customerLastName, setCustomerLastName] = useState('');
    const [foundCustomer, setFoundCustomer] = useState(null);
    const [customerLoading, setCustomerLoading] = useState(false);
    
    // Receipt State
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    
    // Barcode Input Ref
    const barcodeInputRef = useRef(null);
    const navigate = useNavigate();

    const resolveImageUrl = (url) => {
        if (!url) return null;
        if (typeof url !== 'string') return null;
        if (url.startsWith('data:')) return url;
        if (url.startsWith('http')) return url;
        if (url.startsWith('/')) return `${api.defaults.baseURL}${url}`;
        return url;
    };

    // Initial Load
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        console.log("Starting loadInitialData...");
        try {
            // 1. Fetch Products
            console.log("Fetching vendor products...");
            const productData = await getVendorProducts();
            console.log("Fetched products:", productData);
            setProducts(productData || []);
            setFilteredProducts(productData || []);

            // 2. Resolve store and ensure active session
            console.log("Fetching stores...");
            const user = JSON.parse(localStorage.getItem('user'));
            const stores = await getAllStores();
            console.log("Fetched stores:", stores);
            
            const myStore = (stores || []).find(s => (s.ownerId || s.owner?.id) === user?.id) || (stores || [])[0];
            console.log("My Store:", myStore);
            
            if (myStore?.id) {
                setStoreId(myStore.id);
                try {
                    console.log("Checking active session...");
                    const active = await getActiveSession(myStore.id);
                    console.log("Active session:", active);
                    if (active && active.id) {
                        setSession(active);
                    } else {
                        console.log("Opening new session...");
                        const opened = await openSession({ storeId: myStore.id, openingBalance: 0 });
                        setSession(opened);
                    }
                } catch (sessionErr) {
                    console.error("Session error, trying to open new one:", sessionErr);
                    const opened = await openSession({ storeId: myStore.id, openingBalance: 0 });
                    setSession(opened);
                }
            } else {
                console.warn("No store found for user");
            }
            setAmountPaid(0);
            
        } catch (error) {
            console.error("Error loading POS data:", error);
            toast.error("Failed to load POS data. Please refresh.");
        } finally {
            console.log("Finished loadInitialData, setting loading to false");
            setLoading(false);
        }
    };

    // Filter products on search
    useEffect(() => {
        if (!searchTerm) {
            setFilteredProducts(products);
        } else {
            const lowerTerm = searchTerm.toLowerCase();
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(lowerTerm) || 
                (p.barcode && p.barcode.toLowerCase().includes(lowerTerm)) ||
                p.id.toString().includes(lowerTerm)
            );
            setFilteredProducts(filtered);
            
            // Auto-add if exact barcode match
            const exactMatch = products.find(p => p.barcode?.toLowerCase() === lowerTerm || p.id.toString() === lowerTerm);
            if (exactMatch) {
                addToCart(exactMatch);
                setSearchTerm(""); // Clear after auto-add
            }
        }
    }, [searchTerm, products]);

    const handleStartSession = async () => {
        try {
            if (!storeId) return;
            const opened = await openSession({ storeId, openingBalance: 0 });
            setSession(opened);
        } catch (err) {
            console.error('Failed to open session', err);
            alert(err?.response?.data?.message || 'Failed to open session');
        }
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => 
                    item.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, change) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = item.quantity + change;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setProcessing(true);
        try {
            const totalAmount = calculateTotal();
            const paidAmount = Number(amountPaid) || totalAmount;
            
            const transactionData = {
                sessionId: session?.id,
                customerId: customerId ? Number(customerId) : foundCustomer?.id || undefined,
                items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
                discountAmount: 0,
                taxAmount: 0,
                paymentMethod,
                amountPaid: paidAmount,
                notes: undefined,
            };
            const res = await createTransaction(transactionData);
            
            // Prepare Receipt Data
            setReceiptData({
                ...transactionData,
                id: res?.id || Date.now(),
                items: [...cart],
                store: session?.store,
                date: new Date(),
                total: totalAmount,
                change: paidAmount - totalAmount,
                customer: foundCustomer
            });
            
            setShowReceipt(true);
            toast.success('Transaction completed successfully', { position: 'top-center', autoClose: 3000 });
            
            // alert(`Transaction Successful! Total: $${calculateTotal().toFixed(2)}`);
            clearCart();
            setAmountPaid(0);
            setFoundCustomer(null);
            setCustomerQuery('');
            setCustomerFirstName('');
            setCustomerLastName('');
            setCustomerId('');
        } catch (error) {
            console.error("Checkout failed:", error);
            toast.error(error?.response?.data?.message || "Checkout failed. Please try again.", { position: 'top-center', autoClose: 4000 });
        } finally {
            setProcessing(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // Keep focus on barcode input
    useEffect(() => {
        const handleKeyDown = () => {
            // If not typing in another input, focus barcode input
            if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                barcodeInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleFindCustomer = async () => {
        if (!customerQuery) return;
        setCustomerLoading(true);
        try {
            const users = await getAllUsers();
            const q = customerQuery.trim().toLowerCase();
            const found = (users || []).find(
                u => u.email?.toLowerCase() === q || u.username?.toLowerCase() === q
            );
            if (found) {
                setFoundCustomer(found);
                setCustomerId(String(found.id));
            } else {
                setFoundCustomer(null);
            }
        } catch {
            setFoundCustomer(null);
        } finally {
            setCustomerLoading(false);
        }
    };

    const handleRegisterCustomer = async () => {
        if (!customerQuery || !customerFirstName || !customerLastName) return;
        const email = customerQuery.includes('@') ? customerQuery.trim().toLowerCase() : `${customerQuery.trim().toLowerCase()}@example.com`;
        const username = customerQuery.trim().toLowerCase();
        const password = `pos-${Math.random().toString(36).slice(2, 10)}`;
        const profileImage = `${api.defaults.baseURL}/uploads/default/file-1761926804589-16322692.jpg`;
        try {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            await registerUser({
                email,
                password,
                firstName: customerFirstName,
                lastName: customerLastName,
                username,
                profileImage,
                role: 'user',
                refVendorId: currentUser?.id
            });
            toast.success('Customer registered successfully', { position: 'top-center', autoClose: 3000 });
            const users = await getAllUsers();
            const created = (users || []).find(u => u.email?.toLowerCase() === email);
            if (created?.id) {
                setFoundCustomer(created);
                setCustomerId(String(created.id));
            } else {
                setFoundCustomer(null);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to register customer', { position: 'top-center', autoClose: 4000 });
        }
    };

    if (loading) return <div className="p-10 text-center">Loading POS System...</div>;

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">POS Session Closed</h2>
                    <p className="text-gray-600 mb-6">Open a new session to start selling.</p>
                    <button 
                        onClick={handleStartSession}
                        className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition flex items-center gap-2 mx-auto"
                    >
                        <FaStore /> Open Session
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-100px)] gap-4">
            {/* Left Side: Product Grid */}
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-200 flex gap-2">
                    <div className="relative flex-1">
                        <FaBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                            ref={barcodeInputRef}
                            type="text" 
                            placeholder="Scan Barcode or Search Product..." 
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700">
                        <FaSearch />
                    </button>
                </div>

                {/* Categories (Optional - could add later) */}
                
                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <div 
                                key={product.id} 
                                onClick={() => addToCart(product)}
                                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition flex flex-col items-center text-center h-full"
                            >
                                <img 
                                    src={resolveImageUrl(product.productThumbnail) || "https://via.placeholder.com/100"} 
                                    alt={product.name} 
                                    className="w-24 h-24 object-cover rounded-md mb-2"
                                />
                                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">{product.name}</h3>
                                <div className="mt-auto">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-1 inline-block">
                                        {product.category?.name || "Item"}
                                    </span>
                                    <p className="font-bold text-green-600">{formatPrice(Number(product.price || 0))}</p>
                                </div>
                            </div>
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No products found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side: Cart / Checkout */}
            <div className="w-96 bg-white rounded-lg shadow-sm flex flex-col border-l border-gray-200">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <FaShoppingCart className="text-blue-600" /> Current Sale
                    </h2>
                    <div className="text-sm text-gray-500 mt-1">
                        Session ID: #{session.id}
                    </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <FaShoppingCart size={48} className="mb-2 opacity-20" />
                            <p>Cart is empty</p>
                            <p className="text-xs">Scan items to add</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm flex justify-between items-center">
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                                    <p className="text-gray-500 text-xs">{formatPrice(Number(item.price || 0))} x {item.quantity}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center border rounded-md">
                                        <button 
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                                        >
                                            <FaMinus size={10} />
                                        </button>
                                        <span className="px-2 text-sm font-semibold">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                                        >
                                            <FaPlus size={10} />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-400 hover:text-red-600 p-1"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Totals & Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatPrice(calculateTotal())}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax (0%)</span>
                            <span>{formatPrice(0)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-800 border-t border-gray-300 pt-2">
                            <span>Total</span>
                            <span>{formatPrice(calculateTotal())}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <div>
                                <label className="text-xs text-gray-500">Payment Method</label>
                                <select
                                    className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="mobile">Mobile</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Amount Paid</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
                                    value={amountPaid}
                                    onChange={(e) => setAmountPaid(e.target.value)}
                                    placeholder={formatPrice(calculateTotal())}
                                />
                            </div>
                        </div>
                        <div className="pt-2 space-y-2">
                            <label className="text-xs text-gray-500">Customer Email or Username</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm"
                                    value={customerQuery}
                                    onChange={(e) => setCustomerQuery(e.target.value)}
                                    placeholder="email or phone-like username"
                                />
                                <button
                                    onClick={handleFindCustomer}
                                    className="border border-blue-500 text-blue-600 px-3 rounded-md text-sm"
                                    disabled={customerLoading}
                                >
                                    {customerLoading ? '...' : 'Find'}
                                </button>
                            </div>
                            {foundCustomer && (
                                <div className="text-xs text-green-600">
                                    Using customer #{foundCustomer.id}: {foundCustomer.firstName} {foundCustomer.lastName}
                                </div>
                            )}
                            {!foundCustomer && customerQuery && (
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        className="border border-gray-300 rounded-md px-2 py-2 text-sm"
                                        value={customerFirstName}
                                        onChange={(e) => setCustomerFirstName(e.target.value)}
                                        placeholder="First name"
                                    />
                                    <input
                                        type="text"
                                        className="border border-gray-300 rounded-md px-2 py-2 text-sm"
                                        value={customerLastName}
                                        onChange={(e) => setCustomerLastName(e.target.value)}
                                        placeholder="Last name"
                                    />
                                    <button
                                        onClick={handleRegisterCustomer}
                                        className="col-span-2 border border-green-600 text-green-700 px-3 py-2 rounded-md text-sm"
                                    >
                                        Quick Register Customer
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={clearCart}
                            className="border border-red-500 text-red-500 py-2 rounded-lg hover:bg-red-50 font-medium"
                            disabled={cart.length === 0}
                        >
                            Cancel
                        </button>
                        {receiptData && (
                            <button 
                                onClick={() => setShowReceipt(true)}
                                className="border border-blue-500 text-blue-600 py-2 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center gap-2"
                            >
                                <FaPrint /> Last Receipt
                            </button>
                        )}
                    </div>
                    
                    <button 
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || processing}
                        className="w-full mt-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                <FaMoneyBillWave /> Pay {formatPrice(calculateTotal())}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Receipt Modal */}
            {showReceipt && receiptData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 max-h-[90vh] flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                            <h3 className="font-bold text-lg">Transaction Complete</h3>
                            <button onClick={() => setShowReceipt(false)} className="text-gray-500 hover:text-gray-700">
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FaCheck size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">{formatPrice(Number(receiptData.total || 0))}</h2>
                                <p className="text-gray-500">Paid via {receiptData.paymentMethod}</p>
                            </div>
                            
                            <div className="space-y-4">
                                <button 
                                    onClick={handlePrint}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
                                >
                                    <FaPrint /> Print Receipt
                                </button>
                                <button 
                                    onClick={handlePrint}
                                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 font-medium"
                                >
                                    <FaDownload /> Download PDF
                                </button>
                                <button
                                    onClick={() => { setShowReceipt(false); navigate('/dashboard/vendor/my-orders'); }}
                                    className="w-full border border-green-500 text-green-700 py-3 rounded-lg hover:bg-green-50 flex items-center justify-center gap-2 font-medium"
                                >
                                    Go to Order History
                                </button>
                            </div>
                            <p className="text-xs text-center text-gray-400 mt-4">
                                * To save as PDF, click Print and select "Save as PDF" as the destination.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden Printable Receipt */}
            {receiptData && (
                <div className="hidden print:block print:absolute print:top-0 print:left-0 print:w-full print:h-auto print:bg-white print:z-[9999] p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold uppercase tracking-wide">{receiptData.store?.name || "Store Receipt"}</h1>
                        <p className="text-gray-600">{receiptData.store?.address || "Store Address"}</p>
                        <p className="text-gray-600">{receiptData.store?.city || ""}</p>
                        <p className="text-gray-500 text-sm mt-2">
                            {new Date(receiptData.date).toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-sm">Trans ID: #{receiptData.id}</p>
                    </div>
                    
                    <div className="border-t border-b border-gray-300 py-2 mb-4">
                        <div className="grid grid-cols-12 font-bold text-sm mb-2">
                            <div className="col-span-6">Item</div>
                            <div className="col-span-2 text-center">Qty</div>
                            <div className="col-span-2 text-right">Price</div>
                            <div className="col-span-2 text-right">Total</div>
                        </div>
                        {receiptData.items.map((item, i) => (
                            <div key={i} className="grid grid-cols-12 text-sm mb-1">
                                <div className="col-span-6 truncate">{item.name}</div>
                                <div className="col-span-2 text-center">{item.quantity}</div>
                                <div className="col-span-2 text-right">{formatPrice(Number(item.price || 0))}</div>
                                <div className="col-span-2 text-right">{formatPrice(Number(item.price || 0) * Number(item.quantity || 0))}</div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatPrice(Number(receiptData.total || 0))}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>{formatPrice(0)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-1 mt-1">
                            <span>Total</span>
                            <span>{formatPrice(Number(receiptData.total || 0))}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span>Payment Method</span>
                            <span className="capitalize">{receiptData.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Amount Paid</span>
                            <span>{formatPrice(Number(receiptData.amountPaid || 0))}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Change</span>
                            <span>{formatPrice(Number(receiptData.change || 0))}</span>
                        </div>
                    </div>
                    
                    {receiptData.customer && (
                        <div className="mt-6 border-t border-gray-300 pt-2 text-sm text-center">
                            <p>Customer: {receiptData.customer.firstName} {receiptData.customer.lastName}</p>
                        </div>
                    )}
                    
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>Thank you for your business!</p>
                    </div>
                </div>
            )}
            <ToastContainer />
            <style>{`
                 @media print {
                     body * {
                         visibility: hidden;
                     }
                     .print\\:block {
                         visibility: visible;
                         display: block !important;
                     }
                     .print\\:block * {
                         visibility: visible;
                     }
                     .print\\:absolute {
                         position: absolute;
                         top: 0;
                         left: 0;
                         width: 100%;
                     }
                 }
             `}</style>
        </div>
    );
};

export default VendorPos;
