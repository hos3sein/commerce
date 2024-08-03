# E-Commerce service

This system for buy ans sell product

## install

```
npm install
```

## run project

```
npm run dev
```

```
SERVER : http://121.41.58.117:6010/api/v1/truck
LOCAL : http://localhost:6010/api/v1/truck
PORT : 6010
```

#

#

#

#

## Create Sales

##### URL : commerce/sales/createsales

#

##### Method : POST

#

| Parameter          | Type           | Description   |
| :----------------- | :------------- | :------------ |
| `productType`      | `Number`       | **Required**, |
| `productName`      | `String`       | **Required**. |
| `fineness`         | `Number`       | **Required**. |
| `lossOfLgnition`   | `Number`       | **Required**. |
| `waterdemandRatio` | `Number`       | **Required**. |
| `price`            | `Number`       | **Required**. |
| `smallSamplePrice` | `Number`       | **Required**. |
| `largeSamplePrice` | `Number`       | **Required**. |
| `quantity`         | `Number`       | **Required**. |
| `fixedQuantity`    | `Bol`          | **opanail**.  |
| `lineMaker`        | `Bol`          | **Required**. |
| `address`          | `Obj`          | **Required**  |
| `note`             | `String`       | **opanail**.  |
| `phoneNumber`      | `string`       | **opanail**.  |
| `grade`            | `Number`       | **opanail**.  |
| `labReport`        | `string array` | **opanail**.  |

### All sales Me

##### URL :/commerce/sales/allsalesme

##### Method : GET

##

#

### all sales

##### URL : /commerce/sales/allsales

##### Method : GET

##

#

#

## Buy Sample

##### URL : commerce/sales/buy

#

##### Method : POST

#

| Parameter     | Type     | Description                                        |
| :------------ | :------- | :------------------------------------------------- |
| `price`       | `Number` | **Required**,                                      |
| `buyType`     | `Number` | **Required**.0=Sales 1=small sample 2=large sample |
| `destination` | `Obj`    | **Required**.                                      |
| `sales`       | `string` | **Required**.                                      |

### change status

##### URL : /commerce/sales/changestatus/:buyID/:status

##### Method : GET

##

#

#

### Approve Buyer

##### URL : /commerce/sales/approvebuyer/:buyID

##### Method : GET

##

#

#
