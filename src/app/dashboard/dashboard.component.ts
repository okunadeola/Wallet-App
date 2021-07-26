import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppserviceService } from '../service/appservice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    public actRoute: ActivatedRoute,
    public route: Router,
    public nav: AppserviceService
  ) {}
  public id: any;
  public user: any;
  public userHistory: any;
  public userMessage: any;
  public userPassord: any;
  public userWallets: any;

  public on: any;
  public off: any;

  public error: any;
  public success: any;

  public dark: any;
  public light: any;

  public searchInput: any;

  public otherUser: any;

  public transferIndex: any;
  public transferReceiver: any;

  public dacctInput: any;
  public damountInput: any;
  public dpasswordInput: any;

  public tacctInput: any;
  public tamountInput: any;
  public tpasswordInput: any;

  public acctInput: any;
  public amountInput: any;
  public passwordInput: any;

  public walletName: any;
  public walletAmount: any;
  public walletPassword: any;

  ngOnInit(): void {
    this.actRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      let arr: any = localStorage.getItem('walletRegister');
      let arrData: any = JSON.parse(arr);
      let finder: any = arrData.find(
        (val: any) => Number(val.id) === Number(this.id)
      );

      let loggedUser: any = localStorage.getItem('walletLogin');
      let loggedArr: any = JSON.parse(loggedUser);

      if (finder !== undefined) {
        if (loggedArr !== null) {
          let logged: any = loggedArr.find(
            (val: any) =>
              val.email === finder.email && val.password === finder.password
          );
          if (!logged) {
            alert('you have not logged in');
            this.route.navigate(['/login']);
          } else {
            this.nav.nav.next(false);
            this.user = finder;
            this.userPassord = this.user.password;
            this.userHistory = this.user.history;
            this.userMessage = this.user.message;
            this.userWallets = this.user.walletCatalogue;
            this.otherUser = arrData.filter(
              (val: any) => Number(val.id) !== Number(this.id)
            );
          }
        } else {
          alert('you have not logged in');
          this.route.navigate(['/login']);
        }
      } else {
        alert('you are not register');
        this.route.navigate(['/register']);
      }
    });
  }

  deposit() {
    if (this.dacctInput && this.damountInput && this.dpasswordInput) {
      if (this.dpasswordInput === this.user.password) {
        if (this.dacctInput === this.user.account) {
          if (this.damountInput >= 1) {
            let arr: any = localStorage.getItem('walletRegister');
            let arrData: any = JSON.parse(arr);
            let finder: any = arrData.find(
              (val: any) => Number(val.id) === Number(this.id)
            );
            finder.balance += this.damountInput;
            let now = new Date();
            finder.history.unshift({
              topic: 'depositMoney',
              amount: this.damountInput,
              from: this.user.fullname,
              time: now.toLocaleDateString(),
              date: Date.now(),
            });

            this.user.history.unshift({
              topic: 'depositMoney',
              amount: this.damountInput,
              from: this.user.fullname,
              time: now.toLocaleDateString(),
              date: Date.now(),
            });

            let index = arrData.indexOf(finder);
            arrData[index] = finder;
            localStorage.setItem('walletRegister', JSON.stringify(arrData));

            this.success = `you have successfully deposit ${this.damountInput} to your account !`;
            this.infoNullifier();
            this.user.balance += this.damountInput;

            this.dacctInput = null;
            this.damountInput = null;
            this.dpasswordInput = null;
          } else {
            this.error = 'your deposit amount cannot be 0 or less than 1';
            this.alertNullifier();
          }
        } else {
          this.error = 'your acount number is not correct';
          this.alertNullifier();
        }
      } else {
        this.error = 'your password is not correct';
        this.alertNullifier();
      }
    } else {
      this.error = 'all field must be field';
      this.alertNullifier();
    }
  }

  acceptMoneyRequest(message: any, tIndex: any) {
    this.tacctInput = message.account;
    this.tamountInput = message.amount;
    this.transferIndex = tIndex;
    this.transferReceiver = message.account;
  }

  rejectMoneyRequest(message: any, index: any) {
    if (confirm('are you sure')) {
      let theMessage = this.userMessage[index];
      this.userMessage.splice(index, 1);
      let searchArr: any = localStorage.getItem('walletRegister');
      let searchArrData: any = JSON.parse(searchArr);
      let receiver: any = searchArrData.find(
        (val: any) => Number(val.account) === Number(message.account)
      );
      let sender: any = searchArrData.find(
        (val: any) => Number(val.id) === Number(this.id)
      );

      let now = new Date();
      receiver.message.unshift({
        topic: 'transferRequestRejected',
        amount: message.amount,
        from: this.user.fullname,
        timeOfRequest: message.date,
        account: this.user.account,
        time: now.toLocaleDateString(),
        date: Date.now(),
      });

      sender.history.unshift({
        topic: 'transferRequestRejected',
        amount: message.amount,
        to: message.fullname,
        account: message.account,
        time: now.toLocaleDateString(),
        date: Date.now(),
      });

      let messageLocator = sender.message.find(
        (val: any) => val.date === theMessage.date
      );
      let theMessageIndex = sender.message.indexOf(messageLocator);

      sender.message.splice(theMessageIndex, 1);

      let senderIndex = searchArrData.indexOf(sender);
      let receiverIndex = searchArrData.indexOf(receiver);
      searchArrData[receiverIndex] = receiver;
      searchArrData[senderIndex] = sender;
      localStorage.setItem('walletRegister', JSON.stringify(searchArrData));
    }
  }

  transfer() {
    if (this.tamountInput && this.tpasswordInput && this.tacctInput) {
      if (this.tpasswordInput === this.user.password) {
        if (Number(this.tacctInput) !== Number(this.user.account)) {
          if (Number(this.tamountInput) <= Number(this.user.balance)) {
            if (this.tamountInput >= 1) {
              let searchArr: any = localStorage.getItem('walletRegister');
              let searchArrData: any = JSON.parse(searchArr);
              let accFinder: any = searchArrData.find(
                (val: any) => Number(val.account) === Number(this.tacctInput)
              );
              let sender: any = searchArrData.find(
                (val: any) => Number(val.id) === Number(this.id)
              );
              if (accFinder) {
                this.success = `you have successfully transfer ${this.tamountInput} to ${accFinder.account} !`;
                this.infoNullifier();
                accFinder.balance += Number(this.tamountInput);

                let now = new Date();

                accFinder.history.unshift({
                  topic: 'transferedMoney',
                  amount: this.tamountInput,
                  from: this.user.account,
                  time: now.toLocaleDateString(),
                  date: Date.now(),
                });

                this.user.history.unshift({
                  topic: 'moneyTransfer',
                  amount: this.tamountInput,
                  to: accFinder.account,
                  time: now.toLocaleDateString(),
                  date: Date.now(),
                });

                sender.history.unshift({
                  topic: 'moneyTransfer',
                  amount: this.tamountInput,
                  to: accFinder.account,
                  time: now.toLocaleDateString(),
                  date: Date.now(),
                });

                this.user.balance -= Number(this.tamountInput);
                sender.balance -= Number(this.tamountInput);
                let senderIndex = searchArrData.indexOf(sender);
                let index = searchArrData.indexOf(accFinder);
                searchArrData[index] = accFinder;
                searchArrData[senderIndex] = sender;

                localStorage.setItem(
                  'walletRegister',
                  JSON.stringify(searchArrData)
                );

                if (this.tacctInput === this.transferReceiver) {
                  let theMessage = this.userMessage[this.transferIndex];
                  this.userMessage.splice(this.transferIndex, 1);
                  let searchArr: any = localStorage.getItem('walletRegister');
                  let searchArrData: any = JSON.parse(searchArr);
                  // let accFinder: any = searchArrData.find((val: any) => Number(val.account) ===Number(this.transferReceiver))
                  let sender: any = searchArrData.find(
                    (val: any) => Number(val.id) === Number(this.id)
                  );

                  let messageLocator = sender.message.find(
                    (val: any) => val.date === theMessage.date
                  );
                  let theMessageIndex = sender.message.indexOf(messageLocator);
                  console.log(messageLocator);
                  sender.message.splice(theMessageIndex, 1);

                  let localStorageIndex = searchArrData.indexOf(sender);
                  searchArrData[localStorageIndex] = sender;
                  localStorage.setItem(
                    'walletRegister',
                    JSON.stringify(searchArrData)
                  );
                }

                this.tamountInput = null;
                this.tpasswordInput = null;
                this.tacctInput = null;
              } else {
                this.error = 'the acount number you input is not available';
                this.alertNullifier();
              }
            } else {
              this.error = 'your transfer amount cannot be 0 or less than 1';
              this.alertNullifier();
            }
          } else {
            this.error =
              'your current balance is less than the amount you attempted to transfer, kindly deposit to continue the transaction';
            this.alertNullifier();
          }
        } else {
          this.error = 'oops! you cant transfer money to yourself!';
          this.alertNullifier();
        }
      } else {
        this.error = 'your password is not correct';
        this.alertNullifier();
      }
    } else {
      this.error = 'all field must be filled';
      this.alertNullifier();
    }
  }

  requestMoney() {
    if (this.acctInput && this.amountInput && this.passwordInput) {
      if (this.passwordInput === this.user.password) {
        if (Number(this.acctInput) !== Number(this.user.account)) {
          if (this.amountInput >= 1) {
            let searchArr: any = localStorage.getItem('walletRegister');
            let searchArrData: any = JSON.parse(searchArr);
            let accFinder: any = searchArrData.find(
              (val: any) => Number(val.account) === Number(this.acctInput)
            );

            if (accFinder) {
              let arr: any = localStorage.getItem('walletRegister');
              let arrData: any = JSON.parse(arr);
              let finder: any = arrData.find(
                (val: any) => Number(val.account) === Number(this.acctInput)
              );
              let userFinder: any = arrData.find(
                (val: any) => Number(val.id) === Number(this.id)
              );
              let now = new Date();

              finder.message.unshift({
                topic: 'moneyRequest',
                amount: this.amountInput,
                from: this.user.fullname,
                to: finder.account,
                account: this.user.account,
                time: now.toLocaleDateString(),
                date: Date.now(),
              });

              this.user.history.unshift({
                topic: 'moneyRequest',
                amount: this.amountInput,
                from: this.user.fullname,
                to: finder.account,
                account: this.user.account,
                time: now.toLocaleDateString(),
                date: Date.now(),
              });

              userFinder.history.unshift({
                topic: 'moneyRequest',
                amount: this.amountInput,
                from: this.user.fullname,
                to: finder.account,
                account: this.user.account,
                time: now.toLocaleDateString(),
                date: Date.now(),
              });

              let userIndex = arrData.indexOf(userFinder);
              arrData[userIndex] = userFinder;
              let index = arrData.indexOf(finder);
              arrData[index] = finder;
              localStorage.setItem('walletRegister', JSON.stringify(arrData));

              this.success = `you have successfully request ${this.amountInput} from  ${finder.fullname} with account number ${finder.account}!`;
              this.infoNullifier();

              this.acctInput = null;
              this.amountInput = null;
              this.passwordInput = null;
            } else {
              this.error = 'the acount number you input is not available';
              this.alertNullifier();
            }
          } else {
            this.error = 'your request amount cannot be 0 or less than 1';
            this.alertNullifier();
          }
        } else {
          this.error = 'oops! you cant request money from yourself!';
          this.alertNullifier();
        }
      } else {
        this.error = 'your password is not correct';
        this.alertNullifier();
      }
    } else {
      this.error = 'all field must be filled';
      this.alertNullifier();
    }
  }

  createWallet() {
    if (this.walletName && this.walletAmount && this.walletPassword) {
      if (this.walletPassword === this.user.password) {
        let name: any = this.walletName.toLowerCase();
        if (
          name !== 'unknown' &&
          name !== 'null' &&
          name !== 'empty' &&
          name !== 'o' &&
          name !== '0' &&
          name !== 'unknow'
        ) {
          if (this.walletAmount >= 1) {
            // if (!this.walletAmount.includes("e")) {
            if (this.walletAmount < this.user.balance) {
              this.success = 'your new wallet has been created successfully';
              this.infoNullifier();

              let arr: any = localStorage.getItem('walletRegister');
              let arrData: any = JSON.parse(arr);
              let userFinder: any = arrData.find(
                (val: any) => Number(val.id) === Number(this.id)
              );
              let now = new Date();

              this.user.balance -= this.walletAmount;
              userFinder.balance -= this.walletAmount;

              this.userWallets.push({
                walletName: this.walletName,
                walletAmount: this.walletAmount,
                creationDate: now.toLocaleDateString(),
                date: Date.now(),
              });

              userFinder.walletCatalogue.push({
                walletName: this.walletName,
                walletAmount: this.walletAmount,
                creationDate: now.toLocaleDateString(),
                date: Date.now(),
              });

              userFinder.history.unshift({
                topic: 'walletCreated',
                amount: this.walletAmount,
                name: this.walletName,
                account: this.user.account,
                time: now.toLocaleDateString(),
                date: Date.now(),
              });

              this.user.history.unshift({
                topic: 'walletCreated',
                amount: this.walletAmount,
                name: this.walletName,
                account: this.user.account,
                time: now.toLocaleDateString(),
                date: Date.now(),
              });

              let userIndex = arrData.indexOf(userFinder);
              arrData[userIndex] = userFinder;
              localStorage.setItem('walletRegister', JSON.stringify(arrData));

              this.walletName = null;
              this.walletAmount = null;
              this.walletPassword = null;
            } else {
              this.error =
                'Sorry your balance is insufficient to create new wallet, fund your account and try again';
              this.alertNullifier();
            }
            // }else{
            //   alert("sorry exponential notation is not valid, kindly input valid amount")
            // }
          } else {
            this.error = 'your wallet amount cannot be 0 or less than 1';
            this.alertNullifier();
          }
        } else {
          this.error =
            'your wallet name cannot be empty, null or unknown kindly try another name';
          this.alertNullifier();
        }
      } else {
        this.error = 'your password is not correct';
        this.alertNullifier();
      }
    } else {
      this.error = 'all field must be filled';
      this.alertNullifier();
    }
  }

  deleteWallet(wallet: any, i: any) {
    if (confirm('are you sure')) {
      let theWallet = this.userWallets[i];
      this.userWallets.splice(i, 1);
      let searchArr: any = localStorage.getItem('walletRegister');
      let searchArrData: any = JSON.parse(searchArr);
      let user: any = searchArrData.find(
        (val: any) => Number(val.id) === Number(this.id)
      );

      this.user.balance += wallet.walletAmount;
      user.balance += wallet.walletAmount;

      let now = new Date();
      user.history.unshift({
        topic: 'deletedWallet',
        amount: wallet.walletAmount,
        name: wallet.walletName,
        time: now.toLocaleDateString(),
        date: Date.now(),
      });

      this.user.history.unshift({
        topic: 'deletedWallet',
        amount: wallet.walletAmount,
        name: wallet.walletName,
        time: now.toLocaleDateString(),
        date: Date.now(),
      });

      let walletLocator = user.walletCatalogue.find(
        (val: any) => val.date === theWallet.date
      );
      let theWalletIndex = user.walletCatalogue.indexOf(walletLocator);

      user.walletCatalogue.splice(theWalletIndex, 1);

      let userIndex = searchArrData.indexOf(user);
      searchArrData[userIndex] = user;
      localStorage.setItem('walletRegister', JSON.stringify(searchArrData));
    }
  }

  removeNotice(message: any, index: any) {
    if (confirm('are you sure')) {
      let theMessage = this.userMessage[index];
      this.userMessage.splice(index, 1);
      let searchArr: any = localStorage.getItem('walletRegister');
      let searchArrData: any = JSON.parse(searchArr);
      let sender: any = searchArrData.find(
        (val: any) => Number(val.id) === Number(this.id)
      );

      let now = new Date();

      // sender.history.unshift({
      //   topic: 'deleteTransferRequestRejected',
      //   amount:message.amount,
      //   from: message.from,
      //   account: message.account,
      //   time : now.toLocaleDateString(),
      //   date:  Date.now()
      // })

      let messageLocator = sender.message.find(
        (val: any) => val.date === theMessage.date
      );
      let theMessageIndex = sender.message.indexOf(messageLocator);

      sender.message.splice(theMessageIndex, 1);

      let senderIndex = searchArrData.indexOf(sender);
      searchArrData[senderIndex] = sender;
      localStorage.setItem('walletRegister', JSON.stringify(searchArrData));
    }
  }

  snapRequest(user: any) {
    this.acctInput = user.account;
  }

  removeAlert() {
    this.error = '';
  }

  toggle() {
    let mode: any = document.getElementById('switch');
    let foreGround: any = document.getElementById('container-fluid');
    let ground: any = document.getElementById('template');
    let stream: any = document.getElementById('stream');
    let sideNav: any = document.getElementById('sideNav');
    let bankName: any = document.getElementById('bankName');
    let bank: any = document.getElementById('bank__name');
    let cardView: any = document.getElementById('cad__view');
    let historyView: any = document.getElementById('history__view');
    let messageView: any = document.getElementById('message__view');
    let requestView: any = document.getElementById('request__view');
    let card: any = document.getElementById('card');
    let visa: any = document.getElementById('visa');
    let eachWallet: any = document.querySelectorAll('.each__wallet');
    let formControl: any = document.querySelectorAll('.form-control-sm');
    let navTab: any = document.querySelectorAll('.tab');

    if (this.light === undefined) {
      mode.innerHTML = `<div id="switch" class="switch" title="light Mode" (click)="toggle()" ><i class="fa fa-toggle-off"></i></div>`;
      mode.style.color = '#fff';
      foreGround.style.backgroundColor = '#3E3E4A';
      ground.style.backgroundColor = '#111';
      sideNav.style.backgroundColor = '#1A1A1E';
      // sideNav.style.border = '4px solid #555';
      bankName.style.color = '#fff';
      bank.style.color = '#fff';
      stream.style.color = '#fff';
      cardView.style.backgroundColor = '#1A1A1E';
      cardView.style.color = '#fff';
      requestView.style.backgroundColor = '#1A1A1E';
      requestView.style.color = '#aaa';
      requestView.style.border = '4px solid #333';
      historyView.style.backgroundColor = '#1A1A1E';
      historyView.style.border = '4px solid #333';
      messageView.style.backgroundColor = '#1A1A1E';
      messageView.style.border = '4px solid #333';
      card.style.opacity = '0.01';
      visa.style.opacity = '0.4';
      eachWallet.forEach((each: any) => {
        each.style.backgroundColor = '#1A1A1E';
      });
      formControl.forEach((each: any) => {
        each.style.backgroundColor = 'rgb(180, 173, 173)';
      });
      navTab.forEach((each: any) => {
        each.style.backgroundColor = 'rgb(180, 173, 173)';
      });

      this.light = true;
    } else if (this.light) {
      mode.innerHTML = `<div id="switch" class="switch" title="light Mode" (click)="toggle()" ><i class="fa fa-toggle-on"></i></div>`;
      mode.style.color = '#222';
      foreGround.style.backgroundColor = '#fff';
      ground.style.backgroundColor = '#DBE0E6';
      sideNav.style.backgroundColor = 'whitesmoke';
      // sideNav.style.border = '4px solid #ddd';
      bankName.style.color = '#000';
      bank.style.color = '#000';
      stream.style.color = '#000';
      cardView.style.backgroundColor = '#fff';
      cardView.style.color = '#000';
      requestView.style.backgroundColor = '#fff';
      requestView.style.color = '#000';
      historyView.style.backgroundColor = '#fff';
      historyView.style.border = '4px solid rgb(238, 236, 236)';
      requestView.style.border = ' 4px solid rgb(238, 236, 236)';
      messageView.style.backgroundColor = '#fff';
      messageView.style.border = '4px solid rgb(238, 236, 236)';
      card.style.opacity = '1';
      visa.style.opacity = '1';
      eachWallet.forEach((each: any) => {
        each.style.backgroundColor = '#fff';
      });
      formControl.forEach((each: any) => {
        each.style.backgroundColor = '#fff';
      });
      navTab.forEach((each: any) => {
        each.style.backgroundColor = 'rgb(180, 173, 173)';
        each.style.color = '#333';
      });

      this.light = undefined;
    }
  }

  logout() {
    this.nav.nav.next(true);
    localStorage.removeItem('walletLogin');
    this.route.navigate(['/']);
  }

  search() {
    let filter: any = this.otherUser.filter((val: any) => {
      return val.username.includes(this.searchInput);
    });
    if (filter.length > 0) {
      this.otherUser = filter;
    } else {
      alert('sorry, user not found');
      let arr: any = localStorage.getItem('walletRegister');
      let arrData: any = JSON.parse(arr);
      this.otherUser = arrData.filter(
        (val: any) => Number(val.id) !== Number(this.id)
      );
    }
  }

  toggleNav() {
    let theElement: any = document.getElementById('sideNav');
    theElement.classList.add('side__nav__open');
  }

  toggleNavOff() {
    let theElement: any = document.getElementById('sideNav');
    theElement.classList.remove('side__nav__open');
  }

  default() {
    if (this.searchInput === '') {
      let arr: any = localStorage.getItem('walletRegister');
      let arrData: any = JSON.parse(arr);
      this.otherUser = arrData.filter(
        (val: any) => Number(val.id) !== Number(this.id)
      );
    }
  }

  toggleHistory() {
    let history: any = document.getElementById('history__view');
    let notification: any = document.getElementById('message__view');

    let historyTab: any = document.getElementById('histor');
    let notificationTab: any = document.getElementById('messag');
    console.log(history);
    console.log(notification);
    history.style.display = 'block';
    notification.style.display = 'none';

    historyTab.classList.add('boder');
    notificationTab.classList.remove('boder');
  }

  toggleNotice() {
    let history: any = document.getElementById('history__view');
    let notification: any = document.getElementById('message__view');

    let historyTab: any = document.getElementById('histor');
    let notificationTab: any = document.getElementById('messag');

    history.style.display = 'none';
    notification.style.display = 'block';

    historyTab.classList.remove('boder');
    notificationTab.classList.add('boder');
  }

  alertNullifier() {
    setTimeout(() => {
      this.error = '';
    }, 7000);
  }

  infoNullifier() {
    setTimeout(() => {
      this.success = '';
    }, 4000);
  }

  depositAccont() {
    this.dacctInput = this.user.account;
  }
}
