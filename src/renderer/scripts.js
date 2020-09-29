import axios from 'axios';
import BlockchainApis from './services/blockchainApis'
import Utilities from './services/utilities'
const storage = require('electron-json-storage');


export default {
  data() {
    return {
      importedJson: 'x',
      addDialog: false,
      editAddressDialog: false,
      newCoin: null,
      newAddress: null,
      supportedCoins: Utilities.supportedCoins(),
      addressBook: [],
      selectedAddress: {},
      test: '',
      test2: '',
      total: 0,
      snackbar: false,
      snackBarText: '',
      error: false,
      errorMessages: []
    }
  },
  methods: {
    importAddressBook() {
      this.$refs.inputBtn.click();
    },
    filesChange(event) {
      var files = event.target.files || event.dataTransfer.files;
      if (!files.length)
        return;
      this.createInput(files[0]);
    },
    createInput(file) {
      var reader = new FileReader();
      var vm = this;
      reader.onload = (e) => {
        vm.importedJson = reader.result;
        try {
          var parsedJson = JSON.parse(vm.importedJson)
          if (Utilities.checkIfAddressBook(parsedJson)) {
            this.addressBook = parsedJson;
            this.snackBarText = "Address book succesfully imported!"
            this.snackbar = true
            this.getValueOfAddressBook();
          } else {
            console.log('Not an addressBook')
          }
        } catch (e) {
          console.log('Bad Json file bro')
        }

      }
      reader.readAsText(file);
    },
    saveCookie() {
      try {
        storage.set('addressBook', this.addressBook, function (error) {
          if (error) throw error;
        });
        this.snackBarText = "Address book succesfully saved!"
        this.snackbar = true
      } catch (e) {
        console.log(e);
      }
    },
    getLocalAddressBook(addressBook) {
      console.log(addressBook);
      var empty = Object.keys(addressBook).length == 0;

      if(empty){
        this.addressBook = [];
      }
      else{
        this.addressBook = addressBook;
        this.getValueOfAddressBook();
      }
    },
    exportAddressBook() {
      this.test = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.addressBook));
      this.$refs.downloadLink.setAttribute("href", "data:" + this.test)
      console.log(this.$refs.downloadLink)
      this.$refs.downloadLink.click();

    },
    addAddress(coin, address) {
      var coinInfo = this.searchForCoin(coin);

      console.log(this.addressBook);
      this.addressBook.push({
        "avatar": coinInfo.avatar,
        "symbol": coinInfo.symbol,
        "name": coinInfo.name,
        "address": address,
        "worth": 0,
        "balance": 0,
        "position": 0
      });
      this.addressBook.push({
        "divider": true,
        "inset": true
      })

      this.getValueOfAddressBook();
      this.snackBarText = coinInfo.name + " address succesfuly added!"
      this.snackbar = true
      this.addDialog = false
    },
    editAddress(address) {
      console.log(address)
      this.selectedAddress = address;
      this.editAddressDialog = true;
    },
    removeAddress() {
      var i = null;
      for (i = 0; this.addressBook.length > i; i += 1) {
        if (this.addressBook[i].position === this.selectedAddress.position) {
          this.addressBook.splice(i, 1)
        }
      }
      this.editAddressDialog = false;
      this.getValueOfAddressBook();
    },
    searchForCoin(coinSymbol) {
      var i = null;
      for (i = 0; this.supportedCoins.length > i; i += 1) {
        if (this.supportedCoins[i].symbol === coinSymbol) {
          return this.supportedCoins[i];
        }
      }
    },
    getValueOfAddressBook() {
      this.total = 0;
      var position = 1;
      for (var i = 0, len = this.addressBook.length; i < len; i++) {
        if (!this.addressBook[i].divider) {
          console.log(this.addressBook[i]);
          this.addressBook[i].position = position;

          this.getValueOfAddress(this.addressBook[i].address, this.addressBook[i].name, i);
          position++;
          console.log(this.addressBook)
        }
      }

    },
    getValueOfAddress(address, coinName, bookPosition) {
      BlockchainApis.api(address, coinName)
        .then(response => {
          console.log(response)
          this.addressBook[bookPosition].balance = response.data.balance;
          this.addressBook[bookPosition].worth = response.data.worth;
          this.total += parseFloat(this.addressBook[bookPosition].worth);
        }, error => {
          this.errorMessages.push(Utilities.buildErrorMessage(address, coinName))
          this.error = true;
        });



    },
    testerButton() {
      // console.log(this.addressBook[0].avatar);
      // console.log(this.addressBook[0].address);
      // var x=  this.$cookies.set('addressBook', JSON.stringify(this.addressBook))
      // this.$cookies.isKey(keyName)
      // console.log(x)
      // storage.setDataPath();
      // const defaultDataPath = storage.getDefaultDataPath()

      // session.defaultSession.cookies.get({}, (error, cookies) => {
      //   console.log(error, cookies)
      //   this.test = cookies;
      // })
      console.log('this.test')

      // this.total = 0;
      // for (var i = 0, len = this.addressBook.length; i < len; i++) {
      //   if (!this.addressBook[i].divider) {
      //     console.log(this.addressBook[i]);
      //     this.getValueOfAddress(this.addressBook[i].address, this.addressBook[i].subtitle, i);
      //     console.log(this.addressBook)
      //   }
      // }
      //console.log(this.test2);
    }
  },
  created: function () {
    // this.addressBook = JSON.parse(this.$cookies.get('addressBook'));
    this.addAddressBook = [];
    var func = this.getLocalAddressBook;
    storage.get('addressBook', function (error, data) {
      if (error) throw error;
      func(data);
    });
    // setTimeout(function() {
    //   func(x);
    // }, 2000);
    // this.addressBook = JSON.parse(this.$cookies.get('addressBook'));
    //
    // if (this.addressBook) {
    //   this.getValueOfAddressBook();
    // } else {
    //   this.addressBook = [];
    // }

    //rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn
    // var final = '12pTc7twZ2T1BHv4zJHHSpHQn7XLUivMx4'
    // BlockchainApis.ethApi('0x1Ae4c1aC38BE9110bDb4cc19eC15Bbf7172F8157')
    //   .then(response => {
    //     var balance = CryptoConverter.getEthBalance(response.data.balance);
    //     CoinToUsd.getUsd('Ethereum').then(response => {
    //       return (response.data[0].price_usd * balance).toFixed(2);
    //     })
    //   });
    //Services.getAgencies('0x1Ae4c1aC38BE9110bDb4cc19eC15Bbf7172F8157')
    // axios.get(balanceService.ethApi('0x1Ae4c1aC38BE9110bDb4cc19eC15Bbf7172F8157'))
    //   .then(response => {
    //
    //
    //     console.log(weiToETH)
    //     this.test =  weiToETH
    //   })
    //   .catch(e => {
    //     console.log(e)
    //   })
  }

}