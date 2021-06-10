export const formatPrice = (price) => {
  price = Number.parseFloat(price).toFixed(2)
  price = `$${price.replace('.00', '')}`

  return price
}

export const getScrollY = () => {
  return (window.scrollY || window.pageYOffset) || 0;
}