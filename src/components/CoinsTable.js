import React from "react";
import axios from "axios";
import { Scrollbars } from "react-custom-scrollbars";
import { beautifyPriceValue, beautifyBigPriceValue } from "./priceFormatter";
import "./CoinsTable.css";

class CoinsTable extends React.Component {
  state = {
    coins: {}
  };

  componentWillMount() {
    this.getAllCoins();
  }

  getAllCoins = () => {
    axios.get("https://api.coincap.io/v2/assets?limit=15").then(response => {
      if (response.status === 200) {
        let coins = {};
        response.data.data.map(coin => (coins[coin.id] = coin));
        this.setState({ coins: coins });
        this.subscribeCryptoStream();
      }
    });
  };

  subscribeCryptoStream = () => {
    let assets = Object.keys(this.state.coins).join(",");
    const pricesWs = new WebSocket(
      `wss://ws.coincap.io/prices?assets=${assets}`
    );
    pricesWs.onmessage = msg => {
      this.updateCoin(Object.entries(JSON.parse(msg.data)));
    };
  };

  updateCoin = message => {
    let coins = Object.assign({}, this.state.coins);
    message.forEach(pair => {
      coins[pair[0]].priceUsd = pair[1];
    });
    this.setState({ coins: coins });
  };

  render() {
    return (
      <div className="table__container">
        <div className="table">
          <div className="table__row table__row--heading">
            <div className="table__cell table__cell--heading">Name</div>
            <div className="table__cell table__cell--heading">Price</div>
            <div className="table__cell table__cell--heading hidden-xs">
              Market Cap
            </div>
            <div className="table__cell table__cell--heading hidden-xs">
              Volume (24Hr)
            </div>
          </div>
          <Scrollbars style={{ height: 500 }} className="table__body">
            <div>
              {Object.keys(this.state.coins).map((key, index) => {
                let coin = this.state.coins[key];
                return (
                  <div key={index} className="table__row">
                    <div className="table__cell">{coin.name}</div>
                    <div className="table__cell">
                      ${beautifyPriceValue(coin.priceUsd)}
                    </div>
                    <div className="table__cell hidden-xs">
                      ${beautifyBigPriceValue(coin.marketCapUsd)}
                    </div>
                    <div className="table__cell hidden-xs">
                      ${beautifyBigPriceValue(coin.volumeUsd24Hr)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default CoinsTable;
