import React from 'react'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'
import Helpers from '../helpers'
import styles from './shopProduct.module.scss'

const mapStateToProps = state => {
  const props = {
    client: state.client,
    checkoutId: state.checkout.id
  }

  return props
}

const mapDispatchToProps = dispatch => {
  return {
    addVariantToCart: payload => {
      dispatch({type: 'ADD_VARIANT_TO_CART', payload: payload})
    }
  }
}

class ShopProduct extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedVariant: null,
      isBeingAdded: false
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleAddToCart = this.handleAddToCart.bind(this)
  }

  componentDidMount() {
    // Get the first variant available for sale
    let selectedVariant = this.props.product.variants.find((v) => {
      return v.availableForSale
    });

    if(!selectedVariant) {
      selectedVariant = this.props.product.variants[0]
    }

    this.setState({
      selectedVariant: selectedVariant
    })

    // this.props.client.product.fetch(this.props.product.shopifyId).then((product) => {
    //   console.log('done fetching');
    //   console.log(product);
    //   // this checks the currently selected variant for availability
    //   // const result = product.variants.filter(
    //   //   variant => variant.id === productVariant.shopifyId
    //   // )
    //   // setAvailable(result[0].available)
    // })
  }

  handleOnChange(e) {
    const variant = this.props.product.variants.find((v) => {
      return v.shopifyId === e.target.value
    })

    this.setState({
      selectedVariant: variant
    })
  }

  handleAddToCart(e) {
    if(this.state.isBeingAdded) {
      return;
    }

    const lineItem = {
      variantId: this.state.selectedVariant.shopifyId,
      quantity: 1
    }

    this.setState({
      isBeingAdded: true
    })

    this.props.client.checkout.addLineItems(this.props.checkoutId, [lineItem]).then((checkout) => {
      this.props.addVariantToCart({checkout})

      navigate('/cart/')
    });
  }

  render() {
    const product = this.props.product

    let price = this.state.selectedVariant ? this.state.selectedVariant.price : product.priceRange.minVariantPrice.amount
        price = Helpers.formatPrice(price)

    return (
      <div className={styles.product}>
        <div className={styles.imageWrap}>
          { 
            product.images.length &&
            <img src={product.images[0].originalSrc} className={styles.image} />
          }
        </div>
        <div className={styles.form}>
          <h2 className={styles.title}>{price}</h2>

          { product.availableForSale ?
            <div>
              <p>
                <select onChange={this.handleOnChange} style={ {display: (product.variants.length === 1 ? 'none' : '')} }>
                  {
                    product.variants.map((variant, i) => {
                      return (
                        <option key={i} value={variant.shopifyId} disabled={!variant.availableForSale}>{variant.title}{`${!variant.availableForSale ? ' - Sold out' : ''}`}</option>
                      )
                    })
                  }
                </select>
              </p>
              <p>
                <button type="submit" onClick={this.handleAddToCart} disabled={this.state.isBeingAdded}>{this.state.isBeingAdded ? 'ADDING...' : 'BUY'}</button>
              </p>
            </div>
            :
            <p>SOLD OUT :(</p>
          }
        </div>
      </div>
    )
  }
}

const ConnectedShopProduct = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShopProduct)

export default ConnectedShopProduct