import React from 'react'
import { Link, graphql, navigate } from 'gatsby'
import { connect } from 'react-redux'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import Helpers from '../helpers'
import styles from './cart.module.scss'

const mapStateToProps = state => {
  const props = {
    client: state.client,
    checkout: state.checkout
  }

  return props
}

const mapDispatchToProps = (dispatch) => {
  return {
    lineItemRemoved: payload => {
      dispatch({type: 'REMOVE_LINE_ITEM_IN_CART', payload: payload})
    }
  }
}

class CartPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cartInProgress: false
    }

    this.handleRemoveClick = this.handleRemoveClick.bind(this)
  }

  handleRemoveClick(lineItemID) {
    if(this.state && this.state.cartInProgress) return;

    this.setState({
      cartInProgress: true
    })

    // Remove an item from the checkout
    this.props.client.checkout.removeLineItems(this.props.checkout.id, [lineItemID]).then((checkout) => {
      // Do something with the updated checkout
      this.props.lineItemRemoved({checkout})

      this.setState({
        cartInProgress: false
      })

      if(checkout.lineItems.length === 0) {
        navigate('/shop/')
      }
    });
  }

  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')

    const shieldClasses = [styles.shield]

    if(this.state && this.state.cartInProgress) {
      shieldClasses.push(styles.shieldActive)
    }

    const lineItemsSubtotalPriceAmount = get(this.props, 'checkout.lineItemsSubtotalPrice.amount', 0)

    return (
      <Layout location={this.props.location} >
        <Helmet title={`Cart | ${siteTitle}`} />
        <div className="shopWrapper">
          <div style={ {display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '100px 0' } }>
            <div className="container">
              <div style={ {maxWidth: 450, width: '100%', margin: '0 auto', textAlign: 'justify', position: 'relative'} }>
                <div className={shieldClasses.join(' ')}></div>
                {this.props.checkout.lineItems && this.props.checkout.lineItems.length > 0 ? 
                  <div>
                    <div className={styles.lineItemWrap}>
                      {this.props.checkout.lineItems.map((lineItem, i) => {
                        return (
                          <div key={i} className={styles.lineItem}>
                            <div style={ {display: 'flex', flexDirection: 'row', padding: '10px 0'} }>
                              <div>
                                <img src={lineItem.variant.image.src} style={ {width: 90, marginRight: 20} } />
                              </div>
                              <div style={ {flex: 1, padding: '0 20px'}}>
                                <div style={ {fontWeight: 'bold', textTransform: 'uppercase'} }>{lineItem.title}</div>
                                { Helpers.formatPrice(lineItem.variant.price) }
                                { lineItem.quantity > 1 && <div>Qty: {lineItem.quantity}</div>}
                                { lineItem.variant.selectedOptions.map((option, i) => {
                                  return (
                                    <div key={i}>{option.name}: {option.value}</div>
                                  )
                                })}
                                <div><span className={styles.lineItemRemove} onClick={() => this.handleRemoveClick(lineItem.id) }>&times; &nbsp;Remove</span></div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div>
                      <a href={this.props.checkout.webUrl} className="button" style={ {width: '100%'} }>{Helpers.formatPrice(lineItemsSubtotalPriceAmount)}  &nbsp; &ndash; &nbsp;  Checkout</a>
                    </div>
                  </div>
                  :
                  ''
                }
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

const connectedCartPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(CartPage)

export default connectedCartPage

export const pageQuery = graphql`
  query CartQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
