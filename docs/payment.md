```js
payment = {
  payer: 'tom',
  beneficiary: 'jerry',
  currency: 'USD',
  amount: 10000, // in atomic denomination, ie cents
  status: 'received',
  location: 'fbo account',
  adjustments: [
    {label: 'transaction fee', amount: -30, percent: -0.029},
    {label: 'platform fee', amount: 0, percent: -0.05},
    {label: 'discount from sales', amount: 0, percent: +0.02}
  ],
  line items: [
    {label: 'processor', amount: 330,  beneficiary: 'Stripe'},
    {label: 'platform',  amount: 500,  beneficiary: 'mySweetCo'},
    {label: 'donation',  amount: 500,  beneficiary: 'red cross'},
    {label: 'main fee',  amount: 9000, beneficiary: 'Amazon'},
  ]
};
With a payment you can:
- charge
- freeze
- refund
- chargeback
- disburse
- adjust
```

1. save latest state:
  ```json
    {status: 'received'}
  ```
  - no recall
  - best memory; O(1)
  - best read speed
  - best write speed
  - best for human to read
  - best to program
  ```js
    // Functional style
    var payment = {beneficiary: 'bob'};
    function freeze(payment){
      payment.status = 'frozen';
    }
    payment.status // 'frozen'
  ```

2: save complete records
  ```json
    {time: 0967, status: 'received',   beneficiary: 'jerry' },
    {time: 0954, status: 'received',   beneficiary: 'tommy' },
    {time: 0921, status: 'uncaptured', beneficiary: 'tommy' }
  ```
  - total recall
  - worst memory
  - okay read speed
  - okay write speed
  - okay for human to read
  - okay to program
  ```js
    // Functional style
    var payment = {record:[], beneficiary: 'bob', timestamp: new Date()};
    function freeze(payment){
      payment.record.push({status: 'frozen', beneficiary: 'bob', timestamp: new Date()});
    }
    status(payment) // 'frozen'
  ```

3. save record deltas
  ```json
    {time: 0967, beneficiary: 'tommy' },
    {time: 0954, status: 'received'   },
    {time: 0921, status: 'uncaptured', beneficiary: 'tommy' }
  ```
  - total recall
  - okay memory needs
  - worst read speed; needs to reconstruct complete payment?
  - okay write speed
  - worst for human to read? only tells you what changed
  - worst to program? diffing more expensive than simple push
  // Functional style
  ```js
    var payment = {record:[], beneficiary: 'bob', timestamp: new Date()};
    function freeze(payment){
      payment.record.push({status: 'frozen', timestamp: new Date()});
    }
    status(payment) // 'frozen'
  ```
