import Cart from '../components/Cart.jsx'

function CartView({ cartItems, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="container py-5">
      <h1 className="h3 mb-4">Your Cart</h1>
      <Cart
        cartItems={cartItems}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onRemove={onRemove}
      />
    </div>
  )
}

export default CartView
