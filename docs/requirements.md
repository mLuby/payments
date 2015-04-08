## Requirements:
1. Can handle VERY large number of payments.
  - never load all payments into memory.
  - never iterate through all payments.
2. Users can see a payment's history, ie timeline of a payment.
  - payment modifications and/or previous state are saved.
3. Users can freeze, refund, and disburse individual payments.
4. Users can freeze, refund, and disburse payments en masse.
5. Payments respond to chargeback webhooks.
6. Can cheaply calculate project sum.
7. Discounts can be applied and removed per payment.
8. Fee structure can be modified per payment.
9. One payment can pay for many items.
10. Many payments can go toward one item.
11. Tolerate processor API failures.
12. Describe which accounts parts of payments belong in.

## Approaches:
1. lazy loading
2. a payment is a (doubly?) linked list, with most recent at head and last at tail.
  <payment> = {
    state_created_at: 12/14/15,
    previous_state: <ref to obj>,
    next_state: <ref to obj>
  }
  Does the db contain all these <payment> states, or just the latest?
    - if all, constantly filter for only latest (next_state === null) or maintain list of latest
    - if just latest, where are previous states stored?
4. User provides list of payment ids, or associated id (eg a project id)
6. Want to keep payment separate from project and pledge, but better have those notions internally
  than payment notions externally
12. is payment the atomic unit? when money belongs in different accounts due to a charge,
  is it one payment per, or does the payment allocate money via line items? in which case maybe
  line items are the atomic unit?
    payment: {amount: $100, fbo_amount: $95, ops_amount: $05, charge_id: 1}
      or
    payment_fbo: {amount: $95, charge_id: 1}
    payment_ops: {amount: $05, charge_id: 1}

  The former could use line items.
  - Are fees and discounts line items?
    - fees: we take 5% of the total payment, CC processor takes 3%+30¢.
    - discounts: reduce our fee by 50%. first project bonus = 20% off all fees
    - line items: processor fee $3.30, platform fee $5, tip $1

  The latter would create multiple transactions txn linked to an initial charge txn:
  txn:1 parent:null type:charge   amt:100 from:payer to:us
  txn:2 parent:1    type:transfer amt:95  from:us    to:fbo
  txn:3 parent:1    type:transfer amt:5   from:us    to:fees
  This pattern is useful if there are likely to be multiple transfers over the course of a charge's life,
  but it is complex, and makes reporting/debugging difficult without tools.

## Most common actions, descending order or importance:
1. sum project's payments (all traffic, many projects/user)
  - GET /project/:id/payments/sum, possibly pub/sub for live updates (bittorrent pub/sub?)
2. create/charge new payment (portion of traffic, one project/user)
  - PUT /payment/charge <data>
3. view payment record/history/timeline
  - GET /payment/:id/history
4. freeze, refund, chargeback
  - PUT /payment/:id/freeze
5. disburse project's payments (one project/user)
  - PUT /project/:id/payments/disburse
6. modify fees and discounts
  - POST /payment/:id/
7. edit payment details
  - POST /payment/:id/edit
