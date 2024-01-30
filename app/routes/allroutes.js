module.exports = app => {

    //controllers
    const controller = require("../controller/controller");
    const jwt = require('jsonwebtoken');
    var router = require("express").Router();

    router.get('/testing',  (req, res) => { 
        res.send('Welcome');
    });
    //common api
    router.post('/contactmessage', controller.storecontactusmessage, (req, res) => { });

    //customer login
    router.post('/customerLogin', controller.customerLogin, (req, res) => { });
    // router.post('/customerLogin', (req, res) => { 
    //     const { email, password, type } = req.body;
    //     res.send('got data')
    // });

    //customer registration
    router.post('/customerregistraion', controller.customerregistration, (req, res) => { })

    //customer get products near by
    router.get('/getProductsnearme', controller.customergetnearbyproducts, (req, res) => { })

    //customer get farm data
    router.get('/getfarmdata', controller.customergetfarmProducts, (req, res) => { })
    
    //customer make new order
    router.post('/customerNewOrder', controller.customerCreateNewOrder, (req, res) => { })

    //get customer orders data
    router.get('/customergetMyOrders', controller.getCustomerOrderData, (req, res) => { });




    //seller registration
    router.post('/sellerRegistration', controller.sellerRegistration, (req, res) => { })

    //seller login
    router.post('/sellerlogin', controller.sellerLogin, (req, res) => { });


    //get user product data
    router.get('/getproductsdata', controller.getProductData, (req, res) => { });

    //add new seller product
    router.post('/addproduct', controller.addNewProduct, (req, res) => { });

    //add new seller product
    router.post('/deleteproduct', controller.deleteProduct, (req, res) => { });

    //get seller orders data
    router.get('/sellergetMyOrders', controller.getSellerOrderData, (req, res) => { });
    
    //get seller order data by id
    router.get('/sellergetMyOrderbyID', controller.getSellerOrderDataById, (req, res) => { });

    //seller change order status
    router.put('/sellerChangeOrderStatus', controller.changeOrderStatus, (req, res) => { });

    app.use("/", router);
};