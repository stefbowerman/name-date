import React, { useEffect, useState } from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import Client from 'shopify-buy'
import get from 'lodash/get'
import { Loader } from 'isomorphic-pixi'

import BackButton from './backButton'
import Navigation from './navigation'
import CartSummary from './cartSummary'
import AudioPlayer from './audioPlayer'

import base from '../styles/base.scss'

const mapStateToProps = state => {
  const props = {
    checkout: state.checkout,
    audioShouldBePlaying: state.audioShouldBePlaying
  }

  return props
}

const mapDispatchToProps = dispatch => {
  return {
    clientCreate: (data) => dispatch({ type: 'CLIENT_CREATED', payload: data }),
    checkoutCreate: (data) => dispatch({ type: 'CHECKOUT_FOUND', payload: data }),
    createPixiLoader: (data) => dispatch({ type: 'CREATE_PIXI_LOADER', payload: data })
  }
}

const Layout = ({
  location,
  children,
  checkout,
  audioShouldBePlaying,
  clientCreate,
  checkoutCreate,
  createPixiLoader
}) => {

  useEffect(() => {
    const pixiLoader = new Loader()
    const client = Client.buildClient({
      domain: 'namedate.myshopify.com',
      storefrontAccessToken: '28c72258e1f9647431f8d339048a0b7c'
    });

    async function initializeCheckout(client) {
      const isBrowser = typeof window !== 'undefined'
      const existingCheckoutId = isBrowser ? typeof window !== 'undefined' && window.localStorage.getItem('shopify_checkout_id') : null // need the window && or netlify will choke
  
      const setCheckoutInState = checkout => {
        if(isBrowser) {
          typeof window !== 'undefined' && window.localStorage.setItem('shopify_checkout_id', checkout.id)
        }  
      }
  
      const createNewCheckout = () => client.checkout.create()
      const fetchCheckout = id => client.checkout.fetch(id)
  
      if(existingCheckoutId) {
        try {
          const checkout = await fetchCheckout(existingCheckoutId)
          checkoutCreate(checkout); // dispatch
  
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

      checkoutCreate(newCheckout); // dispatch
      setCheckoutInState(newCheckout)
    }     

    clientCreate(client);
    initializeCheckout(client)
    createPixiLoader(pixiLoader)
  }, [])
  
  const currentPath = location.pathname.replace(/^\/+|\/+$/g, ''); // Remove any leading or trailing slashs
  const lineItems = get(checkout, 'lineItems', [])
  const showCart = lineItems && lineItems.length > 0 && currentPath !== 'cart'

  return (
    <StaticQuery
      query={graphql`
        query LayoutQuery {
          site {
            siteMetadata {
              title
              description
            }
          }
        }
      `}
      render={data => (
        
        <React.Fragment>
          <Helmet>
            <title>{data.site.siteMetadata.title}</title>
            <meta name="description" content={data.site.siteMetadata.description}></meta>
            <meta property="og:site_name" content={data.site.siteMetadata.title}></meta>
            <meta property="og:title" content={data.site.siteMetadata.title}></meta>
            <meta property="og:description" content={data.site.siteMetadata.description}></meta>
          </Helmet>

          <BackButton show={currentPath !== ''} />
          <Navigation />
          <CartSummary show={showCart} lineItems={lineItems} />
          
          {children}
    
          <AudioPlayer
            file={'/namedatemix.mp3'}
          />
        </React.Fragment>
      )}
    />
  )
}

const ConnectedLayout = connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout)

export default ConnectedLayout
