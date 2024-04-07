import React, { useState } from "react";
import { Products } from "./Products";
import "./App.css";
import Shop from "./Shopping";

const CartView = ({ cart, addToCart, removeFromCart, setView }) => {
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Cart</h2>
      {cart.map((item, index) => (
        <div key={index}>
          <img className="img-fluid" src={item.image} width={150} alt={item.title} />
          {item.title} - ${item.price} x {item.quantity}
          <button onClick={() => removeFromCart(item)}>-</button>
          <button onClick={() => addToCart(item)}>+</button>
        </div>
      ))}
      <div>Total: ${total.toFixed(2)}</div>
      <Shop items={cart} />
      <div>
        <button className="btn btn-info rounded-pill px-10" type="button" onClick={() => setView("confirm")}>
          Confirm purchase
        </button>
      </div>
      <div>
        <button className="btn btn-info rounded-pill px-10" type="button" onClick={() => setView("products")}>
          Back to Products
        </button>
      </div>
    </div>
  );
};

const ConfirmView = ({ cart, setView }) => {
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return (
    <div>
      <h2>Order summary</h2>
      {cart.map((item, index) => (
        <div key={index}>
          <img className="img-fluid" src={item.image} width={150} alt={item.title} />
          {item.title} - ${item.price} x {item.quantity}
        </div>
      ))}
      <div>Total: ${total.toFixed(2)}</div>
      <button onClick={() => setView("products")}>Back to Products</button>
    </div>
  );
};

const App = () => {
  const [ProductsCategory, setProductsCategory] = useState(Products);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("products"); // or 'cart'

  const addToCart = (product) => {
    let found = cart.some((item) => item.id === product.id);
    if (found) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem.quantity > 1) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item)));
    } else {
      setCart(cart.filter((item) => item.id !== product.id));
    }
  };

  function howManyofThis(id) {
    let hmot = cart.filter((cartItem) => cartItem.id === id);
    return hmot.length;
  }

  const render_products = (ProductsCategory) => {
    return (
      <div className="category-section">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-600 category-title">Products ({ProductsCategory.length})</h2>
        <div className="m-6 p-3 mt-10 ml-0 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-10" style={{ maxHeight: "calc(100vh - 300px)", overflowY: "scroll" }}>
          {/* Loop Products */}
          {ProductsCategory.map((product, index) => (
            <div key={index} className="group relative shadow-lg">
              <div className="min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-60 lg:aspect-none">
                <img alt={product.title} src={product.image} className="w-full h-full object-center object-cover lg:w-full lg:h-full" />
              </div>
              <div className="flex justify-between p-3">
                <div>
                  <h3 className="text-sm text-gray-700">
                  <span style={{ fontSize: "16px", fontWeight: "600" }}>{product.title}</span>
                  </h3>

                  <div>
                  <button className="btn btn-outline-secondary btn-sm" variant="light" onClick={() => removeFromCart(product.id)}>-</button>
                  <span className="px-2">{howManyofThis(product.id)}</span>
                  <button className="btn btn-outline-secondary btn-sm" variant="light" onClick={() => addToCart(product)}>+</button>
                </div>

                  <p className="text-sm font-medium text-green-600">${product.price}</p>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    const results = Products.filter((eachProduct) => {
      if (e.target.value === "") return ProductsCategory;
      return eachProduct.title.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setProductsCategory(results);
  };

  return (
    <div className="flex fixed flex-col">
      <div className="w-screen bg-gray-100 xl:basis-1/5" style={{ minWidth: "65%" }}>
        <div className="px-6 py-4">
          <h1 className="text-3xl mb-2 font-bold text-teal-500">Product Catalog App</h1>
          <p className="text-gray-700 text-black">
            by <b style={{ color: "teal" }}>Gabriel Unser solely</b>
          </p>
          <button className="btn btn-info rounded-pill px-10" type="button" onClick={() => setView("cart")}>
            Checkout
          </button>
          <div className="py-3">
            <input
              type="search"
              placeholder="Search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700
dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={query}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="ml-5 p-3 xl:basis-4/5">
        {view === "products" && render_products(ProductsCategory)}
        {view === "cart" && <CartView cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} setView={setView} />}
        {view === "confirm" && <ConfirmView cart={cart} setView={setView} />}
      </div>
    </div>
  );
};

export default App;
