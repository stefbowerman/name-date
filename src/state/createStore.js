import { createStore as reduxCreateStore } from 'redux'

// actions
const CLIENT_CREATED = 'CLIENT_CREATED'
const PRODUCTS_FOUND = 'PRODUCTS_FOUND'
const CHECKOUT_FOUND = 'CHECKOUT_FOUND'
const SHOP_FOUND = 'SHOP_FOUND'
const ADD_VARIANT_TO_CART = 'ADD_VARIANT_TO_CART'
const UPDATE_QUANTITY_IN_CART = 'UPDATE_QUANTITY_IN_CART'
const REMOVE_LINE_ITEM_IN_CART = 'REMOVE_LINE_ITEM_IN_CART'

const reducer = (state, action) => {
  switch (action.type) {
    case CLIENT_CREATED:
      return {...state, client: action.payload}
    case PRODUCTS_FOUND:
      return {...state, products: action.payload}
    case CHECKOUT_FOUND:
      return {...state, checkout: action.payload}
    case SHOP_FOUND:
      return {...state, shop: action.payload}
    case ADD_VARIANT_TO_CART:
      return {...state, checkout: action.payload.checkout}
    case UPDATE_QUANTITY_IN_CART:
      return {...state, checkout: action.payload.checkout}
    case REMOVE_LINE_ITEM_IN_CART:
      return {...state, checkout: action.payload.checkout}
    default:
      return state
  }
}

const initialState = {
  checkout: {
    lineItems: []
  },
  products: [],
  shop: {},
  client: {}
}

// const createStore = () => reduxCreateStore(reducer, initialState, (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()))
const createStore = () => reduxCreateStore(reducer, initialState)

export default createStore