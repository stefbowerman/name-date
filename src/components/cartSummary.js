import React from 'react'
import { Link } from 'gatsby'
import styles from './cartSummary.module.scss'

const CartSummary = ({ show, lineItems }) => {
  const klasses = [styles.cartSummary]

  if(show) {
    klasses.push(styles.show)
  }

  return (
    <span className={klasses.join(' ')}>
      <Link to="/cart">
        {`Cart - ${lineItems.length} ${lineItems.length == 1 ? 'Item' : 'Items'}`}
      </Link>
    </span>
  )
}

export default CartSummary