import React from 'react'
import styles from './shopProduct.module.scss'

class ShopProduct extends React.Component {
  render() {

    return (
      <div className={styles.product}>
        <div className={styles.imageWrap}>
          <img src={'gentrification-tee.png'} className={styles.image} alt="Gentrification T-Shirt" />
        </div>
        <div className={styles.form}>
          <form target="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value="U8EBJKLEAHDHS" />
            <input type="hidden" name="on0" value="Size" />
            <h2 style={ {margin: '0 0 20px', fontSize: '1.5rem'} }>$40</h2>
            <p>
            <select name="os0">
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Extra Large">Extra Large</option>
            </select>
            </p>
            <input type="hidden" name="currency_code" value="USD" />
            <p>
              <button type="submit" name="submit">BUY</button>
            </p>
            <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
          </form>
        </div>
      </div>
    )
  }
}

export default ShopProduct