export default {
  formatPrice(price) {
    price = Number.parseFloat(price).toFixed(2)
    price = `$${price.replace('.00', '')}`

    return price
  }
}