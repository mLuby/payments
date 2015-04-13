"description": "take in payments, edit them, then disburse them."

pure functions
- easier to test
- no side effects — why is this good?
  - avoid race conditions
lazy evaluation
- avoid unnecessary calculations
immutable data structures
- cheap copy
- easy equality
- avoid race conditions?
streams/mapReduce
- allow reasonable operations on huge data sets

API
- create, read, update, delete
- put,    get,  post,   delete

display pledge count for a project:
function(projectId){
  return seq(getPayments, selectPaymentsByProject, filterPayments, mapAmount, sum)(projectId)
}

√ server processes list then sends result to client
- secure
- lower network overhead
X server sends list to client to process result
- distributed processing load



