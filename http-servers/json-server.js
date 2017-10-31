require('http')
.createServer()
.on('request', (req, res) => {

    console.log("request");

    const product = { id: 1,
        name: 'Supreme T-Shirt',
        brand: 'Supreme',
        price: 99.99,
        options: [{ color: 'blue'},{ size: 'XL'}]
       }

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(product))
})
.listen(3000)