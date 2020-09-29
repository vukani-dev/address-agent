import axios from 'axios';
var querystring = require('querystring');
const baseURL = 'https://rocky-bayou-30254.herokuapp.com/'

export default {
  api(address, coinName) {

    var data = {
      address: address,
      coinName: coinName
    }
    switch (coinName) {
      case 'Ethereum':
        return axios.post(baseURL + 'getEthAmtFromAddress', querystring.stringify(data));
        break;
      case 'Bitcoin':
        return axios.post(baseURL + 'getBtcAmtFromAddress', querystring.stringify(data));
        break;
      case 'Ripple':
        return axios.post(baseURL + 'getXrpAmtFromAddress', querystring.stringify(data));
        break;
      case 'Ethereum-Classic':
        return axios.post(baseURL + 'getEtcAmtFromAddress', querystring.stringify(data));
        break;
      default:
        return 'ya dun goofed'
    }
  }
}
