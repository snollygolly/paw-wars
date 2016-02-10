# [{{config.site.name}}: The Definitive Guide](/manual)

---

## Bank
You will start off in a city of your choosing with $__{{game.bank.starting_cash}}__ in starting cash, $__{{game.bank.starting_savings}}__ in starting savings, and $-__{{game.bank.starting_debt}}__ in starting debt.

Your debt will compound interest at a rate of __{{math game.bank.debt_interest math.times 100}}%__ per turn.  It's a good idea to try and pass off your debt as soon as you can.  Debt can only be payed from your savings account, so make sure that you put cash in your savings account if you intend to pay off your debt.  Your savings account will also compound at a rate of __{{math game.bank.savings_interest math.times 100}}%__ per turn.

You can also borrow money from the bank if you're running low.  There's currently no limit on how much you can borrow.  Be careful though, if you borrow too much, you'll have a difficult time repaying it and getting out from under the debt.

---

```
Technical Configuration Options:

game.bank.starting_cash = {{game.bank.starting_cash}}
game.bank.starting_savings = {{game.bank.starting_savings}}
game.bank.starting_debt = {{game.bank.starting_debt}}
game.bank.debt_interest = {{game.bank.debt_interest}}
game.bank.savings_interest = {{game.bank.savings_interest}}
```
