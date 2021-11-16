Step to setup this claim site: 
1. Prepare the static/snapshot_nuko.json file: Get signed snapshot from nekonium/nukopunch. Sort the database to descending order and add 1 more field (balance in NUKO) to each data entries (optional, see snapshot_nuko.json for more info)
2. Deploy konuko contract & modify the contract address & network in contract.js
3. After installing nodejs and npm, type: `npm install` 
4. `npm run serve`
