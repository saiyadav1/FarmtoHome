const mongodb = require('../models/index')
const jwt = require('jsonwebtoken');
var mongo = require('mongodb');


async function storecontactusmessage(req, res, next) {

    const { type, name,
        email,
        mobileNumber,
        subject,
        message } = req.body;
    const database = mongodb.client.db('agro_farm');
    const collection = database.collection('usercontactus');
    const query = {};


    const doc = {
        type: type,
        name: name,
        email: email,
        mobileNumber: mobileNumber,
        subject: subject,
        message: message,
    }
    const result = await collection.insertOne(doc);
    const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET)
    res.json({
        status: "Success",
        acessToken: accessToken,
        response: 'Your message has been saved!'
    })
    res.end();

}


async function customerLogin(req, res, next) {

    const { email, password, type } = req.body;
    const database = mongodb.client.db('agro_farm');
    const collection = database.collection('userauth');
    const query = { username: email };
    const data = await collection.findOne(query, {});

    if (data) {
        if (data.password == password) {
            if (data.type === type) {
                const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET)
                res.json({
                    status: "Success",
                    acessToken: accessToken,
                    user_id: data._id.toString(),
                    name: data.username,
                    user_location: data.userLocation
                })
                res.end();
            }
            else {
                return res.json({ status: 'Failure', response: 'Not a valid user' })
            }
        } else {
            return res.json({ status: 'Failure', response: 'Password wrong' })
        }
    } else {
        return res.json({ status: 'Failure', response: 'No such user exist' })
    }
}

async function customerregistration(req, res, next) {
    const { email, password, name, type, userLocation } = req.body;
    const database = mongodb.client.db('agro_farm');
    const collection = database.collection('userauth');
    const query = { username: email };
    const data = await collection.findOne(query, {});
    if (data) {
        return res.json({ status: 'Failure', response: 'Accounted already present' });
    } else {
        const doc = {
            type: type,
            name: name,
            userLocation: userLocation,
            username: email,
            password: password,
        }
        const result = await collection.insertOne(doc);
        const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET)
        res.json({
            status: "Success",
            name: name,
            acessToken: accessToken,
            user_id: result.insertedId.toString(),
            user_location: userLocation
        })
        res.end();
        // next();
    }
}


async function customergetfarmProducts(req, res, next) {
    const { farm_name } = req.query;
    const database = mongodb.client.db('agro_farm');
    const collection = database.collection('sellerproducts');
    const query = { farmName: farm_name };
    const cursor = collection.find(query, {});
    if ((await collection.countDocuments(query)) === 0) {
        res.json({ status: 'Failure', response: 'No data found' })
    } else {
        let data = [];
        for await (const doc of cursor) {
            const {
                farmName,
                farmLocation,
                mobileNumber,
                name,
                my_products,
                user_id
            } = doc;
            data.push({
                farmName,
                farmLocation,
                mobileNumber,
                name,
                my_products,
                farmer_id: user_id
            })
        }
        res.json({ status: 'Success', response: 'Got Data', data: data })
    }
}

async function customerCreateNewOrder(req, res, next) {
    const {
        customerEmail,
        customer_id,
        customerLocation,
        orderData,
        orderAmount,
        orderTime,
        farmer_id,
        orderStatus
    } = req.body;

    const database = mongodb.client.db('agro_farm');
    const collection = database.collection('orderData');

    const doc = {
        customerEmail: customerEmail,
        customer_id: customer_id,
        customerLocation: customerLocation,
        orderData: orderData,
        orderAmount: orderAmount,
        orderTime: orderTime,
        farmer_id: farmer_id,
        orderStatus: orderStatus
    }
    const result = await collection.insertOne(doc);
    const accessToken = jwt.sign(customerEmail, process.env.ACCESS_TOKEN_SECRET);
    res.json({
        status: "Success",
        acessToken: accessToken,
        order_id: result.insertedId.toString(),
    })
    res.end();
}

async function getCustomerOrderData(req, res, next) {
    const { type, customer_id } = req.query;
    const database = mongodb.client.db('agro_farm');
    const collection = database.collection('orderData');
    const query = { customer_id: customer_id };
    const cursor = collection.find(query, {});

    if (customer_id == null || customer_id == 'undefined' || customer_id == '') {
        res.status(400).json({ status: 'Failure', response: 'seller id is undedined', data: [] })
        res.end()
    }
    else if ((await collection.countDocuments(query)) === 0) {
        res.json({ status: 'Success', response: 'Got Data', data: [] })
    } else {
        let data = [];
        for await (const doc of cursor) {
            let orderId = doc._id.toString();
            const {
                customerEmail,
                customerLocation,
                orderData,
                orderAmount,
                orderTime,
                farmer_id,
                orderStatus
            } = doc;
            data.push({
                customerEmail,
                customerLocation,
                orderData,
                orderAmount,
                orderTime,
                farmer_id,
                orderStatus,
                orderId
            })
        }
        res.json({ status: 'Success', response: 'Got Data', data: data })
    }
}


async function sellerLogin(req, res, next) {
    const { email, password, type } = req.body;
    const database = mongodb.client.db('agro_farm');
    const collection = database.collection('userauth');
    const query = { username: email };
    const data = await collection.findOne(query, {});
    if (data) {
        if (data.password == password) {
            if (data.type === type) {
                const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET)
                res.json({
                    status: "Success",
                    user_id: data._id.toString(),
                    acessToken: accessToken,
                    name: data.name,
                    mobileNumber: data.mobileNumber,
                    farmName: data.farmName,
                    farmLocation: data.farmLocation
                })
                res.end();
            }
            else {
                return res.json({ status: 'Failure', response: 'Not a valid user' })
            }
        } else {
            return res.json({ status: 'Failure', response: 'Password wrong' })
        }
    } else {
        return res.json({ status: 'Failure', response: 'No such user exist' })
    }
}

async function sellerRegistration(req, res, next) {
    const { type, name, email, mobileNumber, farmName, farmLocation, password } = req.body;
    const database = mongodb.client.db('agro_farm');
    const collection = database.collection('userauth');
    const query = { username: email };
    const data = await collection.findOne(query, {});
    if (data) {
        return res.json({ status: 'Failure', response: 'Accounted already present' })
    } else {
        const doc = {
            type: type,
            name: name,
            username: email,
            password: password,
            mobileNumber: mobileNumber,
            farmName: farmName,
            farmLocation: farmLocation
        }
        const result = await collection.insertOne(doc);
        const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
        res.json({
            status: "Success",
            acessToken: accessToken,
            user_id: result.insertedId.toString(),
            name: name,
            mobileNumber: mobileNumber,
            farmName: farmName,
            farmLocation: farmLocation
        })
        res.end();
        // next()
    }
}

async function addNewProduct(req, res, next) {
    const {
        type,
        productName,
        imgUrl,
        productType,
        availableQuantity,
        priceperQuantity,
        quantityType,
        description,
        user_state } = req.body;
    const database = mongodb.client.db('agro_farm');
    const collection = database.collection('sellerproducts');
    const query = { user_id: user_state.user_id };
    const data = await collection.findOne(query, {});
    if (data) {
        const options = { upsert: true };
        const updateDoc = {
            $push: {
                "my_products": {
                    productName: productName,
                    imgUrl: imgUrl,
                    productType: productType,
                    availableQuantity: availableQuantity,
                    description: description,
                    priceperQuantity: priceperQuantity,
                    quantityType: quantityType,
                }
            },
        };
        const result = await collection.updateOne(query, updateDoc, options);
        res.json({ status: "Success", response: 'Product added successfully' })
        res.end();
    } else {
        const doc = {
            type: type,
            user_id: user_state.user_id,
            farmName: user_state.farmName,
            farmLocation: user_state.farmLocation,
            mobileNumber: user_state.mobileNumber,
            name: user_state.name,
            my_products: [
                {
                    productName: productName,
                    imgUrl: imgUrl,
                    productType: productType,
                    availableQuantity: availableQuantity,
                    priceperQuantity: priceperQuantity,
                    quantityType: quantityType,
                    description: description,
                }
            ]
        }
        const result = await collection.insertOne(doc);
        res.json({ status: "Success", response: 'Product added successfully' })
        res.end();
    }
}

//sending user products 
async function getProductData(req, res, next) {
    const { user_id } = req.query;
    const database = mongodb.client.db('agro_farm');
    const collection = database.collection('sellerproducts');
    const query = { user_id: user_id };
    const cursor = collection.find(query, {});
    if ((await collection.countDocuments(query)) === 0) {
        res.json({ status: 'Success', response: 'Got Data', data: [] })
    } else {
        let data = [];
        for await (const doc of cursor) {
            const { type,
                user_id,
                farmName,
                farmLocation,
                mobileNumber,
                name,
                my_products
            } = doc;
            data.push({
                type,
                user_id,
                farmName,
                farmLocation,
                mobileNumber,
                name,
                my_products
            })
        }
        res.json({ status: 'Success', response: 'Got Data', data: data })
    }
}

//sending seller products to customer
async function customergetnearbyproducts(req, res, next) {
    const { user_Location } = req.query;
    const database = mongodb.client.db('agro_farm');
    const collection = database.collection('sellerproducts');
    const query = { farmLocation: user_Location };
    const cursor = collection.find(query, {});
    if ((await collection.countDocuments(query)) === 0) {
        res.json({ status: 'Success', response: 'Got Data', data: [] })
    } else {
        let data = [];
        for await (const doc of cursor) {
            const {
                farmName,
                farmLocation,
                mobileNumber,
                name,
                my_products
            } = doc;
            data.push({
                farmName,
                farmLocation,
                mobileNumber,
                name,
                my_products
            })
        }
        res.json({ status: 'Success', response: 'Got Data', data: data })
    }
}



async function getSellerOrderData(req, res, next) {
    const { type, seller_id } = req.query;
    const database = mongodb.client.db('agro_farm');
    const collection = database.collection('orderData');
    const query = { farmer_id: seller_id };
    const cursor = collection.find(query, {});

    if (seller_id == null || seller_id == 'undefined' || seller_id == '') {
        res.status(400).json({ status: 'Failure', response: 'seller id is undedined', data: [] })
        res.end()
    }
    else if ((await collection.countDocuments(query)) === 0) {
        res.json({ status: 'Success', response: 'Got Data', data: [] })
    } else {
        let data = [];
        for await (const doc of cursor) {
            let orderId = doc._id.toString();
            const {
                customerEmail,
                customerLocation,
                orderData,
                orderAmount,
                orderTime,
                farmer_id,
                orderStatus
            } = doc;
            data.push({
                customerEmail,
                customerLocation,
                orderData,
                orderAmount,
                orderTime,
                farmer_id,
                orderStatus,
                orderId
            })
        }
        res.json({ status: 'Success', response: 'Got Data', data: data })
    }
}

async function getSellerOrderDataById(req, res, next) {
    const { type, order_id } = req.query;
    const database = mongodb.client.db('agro_farm');
    const collection = database.collection('orderData');

    let o_id = new mongo.ObjectId(order_id);

    const query = { '_id': o_id };

    // const cursor = collection.find(query, {});
    const data = await collection.findOne(query, {});
    if (data) {
        res.json({ status: 'Success', response: 'Got Data', data: data });
    } else {
        res.status(404).json({ status: 'Failure', response: 'Order not found', data: [] });
    }
}

async function changeOrderStatus(req, res, next) {
    const { type, order_id, order_status } = req.body;
    const database = mongodb.client.db('agro_farm');
    const collection = database.collection('orderData');
    console.log('order_id,order_status', order_id, order_status)

    let o_id = new mongo.ObjectId(order_id);
    const query = { '_id': o_id };
    const updateDocument = {
        $set: {
            orderStatus: order_status,
        },
    };
    // const cursor = collection.find(query, {});
    const result = await collection.updateOne(query, updateDocument);
    if (result) {
        res.json({ status: 'Success', response: 'Got Data', response: 'Status has been changed' });
    } else {
        res.status(404).json({ status: 'Failure', response: 'Order not found', data: [] });
    }

}

//seller Apis controller

//delete product 
async function deleteProduct(req, res, next) {
    const {
        productName,
        user_state } = req.body;
    const database = mongodb.client.db('agro_farm');
    const collection = database.collection('sellerproducts');
    const query = { user_id: user_state.user_id };
    const data = await collection.findOne(query, {});
    if (data) {
        const options = { multi: true };
        const updateDoc = {
            $pull: {
                "my_products": {
                    productName: productName,
                }
            },
        };
        const result = await collection.updateOne(query, updateDoc, options);
        res.json({ status: "Success", response: 'Product removed successfully' })
        res.end();
    } else {
        res.json({ status: "Failure", response: 'no such product found' })
        res.end();
    }
}

module.exports = {
    sellerLogin,
    customerLogin,
    customerregistration,
    sellerRegistration,
    addNewProduct,
    getProductData,
    customergetnearbyproducts,
    deleteProduct,
    customergetfarmProducts,
    customerCreateNewOrder,
    getSellerOrderData,
    getSellerOrderDataById,
    changeOrderStatus,
    getCustomerOrderData,
    storecontactusmessage
}