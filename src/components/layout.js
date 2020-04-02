import React from 'react'
import { Link } from 'gatsby'
import { connect } from 'react-redux'
import Client from 'shopify-buy'
import get from 'lodash/get'

import BackButton from './backButton'
import Navigation from './navigation'

import base from '../styles/base.scss'

const mapStateToProps = (state) => {
  const props = {
    checkout: state.checkout
  }

  return props
}

const mapDispatchToProps = (dispatch) => {
  return {
    clientCreate: (data) => dispatch({ type: 'CLIENT_CREATED', payload: data }),
    checkoutCreate: (data) => dispatch({ type: 'CHECKOUT_FOUND', payload: data })
  }
}

class Layout extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  async initializeCheckout(client) {
    const isBrowser = typeof window !== 'undefined'
    const existingCheckoutId = isBrowser ? typeof window !== 'undefined' && window.localStorage.getItem('shopify_checkout_id') : null // need the window && or netlify will choke

    const setCheckoutInState = checkout => {
      if(isBrowser) {
        typeof window !== 'undefined' && window.localStorage.setItem('shopify_checkout_id', checkout.id)
      }

      this.setState({ checkout });
    }

    const createNewCheckout = () => client.checkout.create()
    const fetchCheckout = id => client.checkout.fetch(id)

    if(existingCheckoutId) {
      try {
        const checkout = await fetchCheckout(existingCheckoutId)
        this.props.checkoutCreate(checkout); // dispatch

        // Make sure this cart hasn't already been purchased
        if(!checkout.completedAt) {
          setCheckoutInState(checkout)
          return
        }
      } catch(e) {
        localStorage.setItem('shopify_checkout_id', null)
      }
    }

    const newCheckout = await createNewCheckout()
    this.props.checkoutCreate(newCheckout); // dispatch
    setCheckoutInState(newCheckout)
  }

  componentDidMount() {
    const client = Client.buildClient({
      domain: 'namedate.myshopify.com',
      storefrontAccessToken: '28c72258e1f9647431f8d339048a0b7c'
    });

    this.props.clientCreate(client);
    this.initializeCheckout(client)
  }

  render() {
    const { location, children, checkout } = this.props

    let rootPath = `/`
    if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
      rootPath = __PATH_PREFIX__ + `/`
    }

    const lineItems = get(checkout, 'lineItems', [])
    const showCart = lineItems && lineItems.length > 0 && location.pathname.indexOf('cart') == -1

    return (
      <div>
        <BackButton show={location.pathname !== '/'} />
        <Navigation />
        <p style={ {position: 'fixed', zIndex: 1, top: 20, right: 20, opacity: (showCart ? 1 : 0), pointerEvents: (showCart ? 'auto' : 'none')} }>
          <Link to="/cart">{`Cart - ${lineItems.length} ${lineItems.length == 1 ? 'Item' : 'Items'}`}</Link>
        </p>
        {children}
      </div>
    )
  }
}

const ConnectedLayout = connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout)

export default ConnectedLayout
