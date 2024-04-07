import React, { useState } from "react";
import { Products } from "./Products";
import "./App.css";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.css";

const App = () => {
  const [ProductsCategory, setProductsCategory] = useState(Products);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("products"); // or 'cart'

  const addToCart = (product) => {
    const cartIndex = cart.findIndex((item) => item.id === product.id);
    if (cartIndex !== -1) {
      const newCart = cart.map((item, index) => {
        if (index === cartIndex) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCart(newCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    const cartIndex = cart.findIndex((item) => item.id === productId);
    if (cartIndex !== -1 && cart[cartIndex].quantity > 1) {
      const newCart = cart.map((item, index) => {
        if (index === cartIndex) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      setCart(newCart);
    } else if (cartIndex !== -1) {
      const newCart = cart.filter((item, index) => index !== cartIndex);
      setCart(newCart);
    }
  };

  function howManyofThis(id) {
    const item = cart.find((item) => item.id === id);
    return item ? item.quantity : 0;
  }

  const render_products = (ProductsCategory) => {
    return (
      <div className="category-section">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-600 category-title">Products ({ProductsCategory.length})</h2>
        <div className="m-6 p-3 mt-10 ml-0 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-10" style={{ maxHeight: "calc(100vh - 320px)", overflowY: "scroll" }}>
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
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => removeFromCart(product.id)}>
                      -
                    </button>
                    <span className="px-2">{howManyofThis(product.id)}</span>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => addToCart(product)}>
                      +
                    </button>
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

  //2 view functions

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [dataF, setDataF] = useState({});

  const CartView = ({ cart, addToCart, removeFromCart, setView }) => {
    const onSubmit = (data) => {
      // update hooks
      setView("confirm");
      setDataF(data);
    };
    return (
      <div className="container mt-3" style={{ maxHeight: "calc(100vh - 260px)", overflowY: "auto" }}>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-600 category-title">Cart</h2>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img src={item.image} width="50" className="img-thumbnail" alt={item.title} />
                    {item.title}
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => removeFromCart(item.id)}>
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => addToCart(item)}>
                        +
                      </button>
                    </div>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <p className="total"><strong>Total: </strong>${total.toFixed(2)}</p>
        </div>

        <hr />
        <br></br>
        <h3 className="text-3xl font-extrabold tracking-tight text-gray-600 category-title">Payment Information</h3>
        <br></br>
        <div className="container"></div>

        <div className="row">
          <div className="col-lg-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input {...register("fullName", { required: true })} className="form-control" id="fullName" placeholder="FirstName LastName" />
                {errors.fullName && <p className="text-danger">Full Name is required.</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input {...register("email", { required: true, pattern: /^\S+@\S+$/i })} className="form-control" id="email" placeholder="email@example.com" />
                {errors.email && <p className="text-danger">Email is required.</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="card" className="form-label">
                  Card
                </label>
                <input {...register("creditCard", { required: true, pattern: /^\d{16}$/ })} className="form-control" id="card" placeholder="XXXXXXXXXXXXXXXX" />
                {errors.creditCard && <p className="text-danger">16-digit Card number is required.</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input {...register("address", { required: true })} className="form-control" id="address" placeholder="Address" />
                {errors.address && <p className="text-danger">Address is required.</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="address2" className="form-label">
                  Address 2 (Optional)
                </label>
                <input {...register("address2")} className="form-control" id="address2" placeholder="Address 2" />
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <input {...register("city", { required: true })} className="form-control" id="city" placeholder="City" />
                  {errors.city && <p className="text-danger">City is required.</p>}
                </div>

                <div className="col-md-4">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <input {...register("state", { required: true })} className="form-control" id="state" placeholder="State" />
                  {errors.state && <p className="text-danger">State is required.</p>}
                </div>

                <div className="col-md-2">
                  <label htmlFor="zip" className="form-label">
                    Zip
                  </label>
                  <input {...register("zip", { required: true, pattern: /^\d{5}$/ })} className="form-control" id="zip" placeholder="Zip" />
                  {errors.zip && <p className="text-danger">Zip is required.</p>}
                </div>

                <div style={{paddingBottom: '30px'}}>
                  <button className="btn btn-info rounded-pill px-10" type="submit">
                    Confirm Purchase
                  </button> {" "}
                  <button className="btn btn-info rounded-pill px-10" type="button" onClick={() => {setView("products"); setQuery(''); setProductsCategory(Products);}}>
                Back to Products
              </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const ConfirmView = ({ cart, setView }) => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
    const backToProducts = () => {
      setCart([]);
      setDataF({}); 
      setQuery(''); 
      setProductsCategory(Products); 
      setView("products");
    };
  
    return (
      <div className="container mt-3" style={{ maxHeight: "calc(100vh - 260px)", overflowY: "auto" }}>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-600 category-title">Order summary</h2><br></br>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img src={item.image} width="50" className="img-thumbnail" alt={item.title} />
                    {item.title}
                  </td>
                  <td>
                    <span className="px-3">{item.quantity}</span>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div><strong>Total: </strong>${total.toFixed(2)}</div>
        <br></br>
        <div style={{paddingBottom: '30px'}}>
          <h3><strong>Name: </strong>{dataF.fullName}</h3>
          <p><strong>Email: </strong>{dataF.email}</p>
          <p><strong>Card: </strong>XXXX-XXXX-XXXX-{(dataF.creditCard || '').slice(-4)}</p>
          <p><strong>Address: </strong><br></br>{dataF.address}</p>
          <p>{dataF.address2}</p>
          <p>
            {dataF.city}, {dataF.state} - {dataF.zip}{" "}
          </p>
          <br></br>
          <button className="btn btn-info rounded-pill px-10" type="button" onClick={backToProducts}>
            Back to Products
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex fixed flex-col">
      <div className="w-screen bg-gray-100 xl:basis-1/5" style={{ minWidth: "65%" }}>
        <div className="px-6 py-4">
          <h1 className="text-3xl mb-2 font-bold text-teal-500">Assignment 02 - Product Catalog and Cart App</h1>
          <p className="text-gray-700 text-black">
            by <b style={{ color: "teal" }}>Gabriel Unser and Muralikrishna Patibandla</b>
          </p>
          <button className="btn btn-info rounded-pill px-10" type="button" onClick={() => setView("cart")}>
            Checkout
          </button>{" "}
          <button className="btn btn-info rounded-pill px-10" type="button" onClick={() => setView("products")}>
            Products
          </button>
          <div className="py-3">
            <input
              type="search"
              placeholder="Search"
              className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg
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