import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductImage, useImageFallback } from '../utils/images.js'
import { formatCurrency } from '../utils/cart.js'

// The "individual product view". Shows every detail for one product plus a
// form for selecting a bundle, color, and quantity before adding it to the
// cart. React state here (selectedSize/selectedColor/quantity) tracks the
// pending selection; it's only turned into a cart entry when Add to Cart is
// clicked. ("selectedSize" holds the bundle choice — reusing the same
// generic size/color/quantity shape the assignment spec describes.)
function ProductDetailView({ products, onAddToCart }) {
  const { productId } = useParams()
  const product = products.find((p) => String(p.id) === productId)

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState('')

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h1 className="h4">Product not found</h1>
        <p className="text-muted">That product may no longer be available.</p>
        <Link to="/shop" className="btn btn-primary">
          Back to Shop
        </Link>
      </div>
    )
  }

  const {
    name,
    brand,
    category,
    price,
    salePrice,
    longDescription,
    colors,
    sizes,
    activeArea,
    hasScreen,
    screenResolution,
    pressureLevels,
    connectivity,
    includedPen,
    expressKeys,
    osSupport,
    tiltSupport,
    quantityInStock,
    rating,
    numberOfReviews,
    freeShipping,
  } = product

  const onSale = typeof salePrice === 'number'
  const unitPrice = onSale ? salePrice : price
  const outOfStock = quantityInStock === 0

  function clampQuantity(value) {
    const n = Number.isFinite(value) ? Math.floor(value) : 1
    return Math.max(1, Math.min(n, quantityInStock || 1))
  }

  function handleAddToCart(e) {
    e.preventDefault()
    setConfirmation('')

    // Prevent addition until required options are selected.
    if (!selectedSize || !selectedColor) {
      setError('Please select a bundle and color before adding this item to your cart.')
      return
    }
    // Prevent invalid quantities.
    if (!Number.isInteger(quantity) || quantity < 1) {
      setError('Quantity must be a whole number of 1 or more.')
      return
    }
    if (quantity > quantityInStock) {
      setError(`Only ${quantityInStock} left in stock.`)
      return
    }

    setError('')
    onAddToCart({ product, size: selectedSize, color: selectedColor, quantity })
    setConfirmation(`Added ${quantity} × ${name} (${selectedColor}, ${selectedSize}) to your cart.`)
  }

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link to="/shop">Shop</Link>
          </li>
          <li className="breadcrumb-item">{category}</li>
          <li className="breadcrumb-item active" aria-current="page">
            {name}
          </li>
        </ol>
      </nav>

      <div className="row g-5">
        <div className="col-md-6">
          <img
            src={getProductImage(product.image)}
            alt={name}
            className="img-fluid rounded product-detail-img w-100"
            onError={(e) => useImageFallback(e, product.imageFallback)}
          />
        </div>

        <div className="col-md-6">
          <p className="text-uppercase text-muted small mb-1">
            {brand} &middot; {category}
          </p>
          <h1 className="h3">{name}</h1>
          <p className="rating mb-2" aria-label={`Rated ${rating} out of 5`}>
            ★ {rating.toFixed(1)} <span className="text-muted">({numberOfReviews} reviews)</span>
          </p>

          <div className="mb-3">
            {onSale ? (
              <>
                <span className="text-decoration-line-through text-muted me-2">
                  {formatCurrency(price)}
                </span>
                <span className="fs-4 fw-bold text-danger">{formatCurrency(salePrice)}</span>
              </>
            ) : (
              <span className="fs-4 fw-bold">{formatCurrency(price)}</span>
            )}
          </div>

          <p>{longDescription}</p>

          <ul className="list-unstyled small text-muted mb-4 spec-list">
            <li>Active area: {activeArea}</li>
            <li>Screen: {hasScreen ? screenResolution : 'None (screenless pen tablet)'}</li>
            <li>Pressure sensitivity: {pressureLevels.toLocaleString()} levels{tiltSupport ? ', tilt supported' : ''}</li>
            <li>Connectivity: {connectivity}</li>
            <li>Included pen: {includedPen}</li>
            {expressKeys > 0 && <li>Programmable express keys: {expressKeys}</li>}
            <li>Compatible with: {osSupport.join(', ')}</li>
            <li>Free shipping: {freeShipping ? 'Yes' : 'No'}</li>
            <li>
              {outOfStock ? (
                <span className="text-danger fw-semibold">Out of stock</span>
              ) : (
                `In stock: ${quantityInStock} available`
              )}
            </li>
          </ul>

          <form onSubmit={handleAddToCart} noValidate>
            <fieldset className="mb-3" disabled={outOfStock}>
              <legend className="h6">Bundle</legend>
              <div className="d-flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`btn btn-sm option-btn ${
                      selectedSize === size ? 'btn-dark' : 'btn-outline-dark'
                    }`}
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mb-3" disabled={outOfStock}>
              <legend className="h6">Color</legend>
              <div className="d-flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`btn btn-sm option-btn ${
                      selectedColor === color ? 'btn-dark' : 'btn-outline-dark'
                    }`}
                    onClick={() => setSelectedColor(color)}
                    aria-pressed={selectedColor === color}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mb-3" style={{ maxWidth: '10rem' }}>
              <label htmlFor="quantity" className="form-label h6">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                className="form-control"
                min="1"
                max={quantityInStock || 1}
                value={quantity}
                disabled={outOfStock}
                onChange={(e) => setQuantity(clampQuantity(Number(e.target.value)))}
              />
              {!outOfStock && (
                <div className="form-text">
                  Total for {quantity}: {formatCurrency(unitPrice * quantity)}
                </div>
              )}
            </div>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}
            {confirmation && (
              <div className="alert alert-success py-2" role="status">
                {confirmation}{' '}
                <Link to="/cart" className="alert-link">
                  View cart
                </Link>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg" disabled={outOfStock}>
              {outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailView
