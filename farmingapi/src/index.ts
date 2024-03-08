import { Hono } from 'hono'
import { cors } from 'hono/cors'


type Bindings = {
  DB: D1Database;
}



const app: Hono<{ Bindings: Bindings }> = new Hono()

app.use(
  '/*',
  cors({
    origin: 'http://localhost:5173',
    allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE']
  })
)

// create users

app.post('/users/new', async (c) => {

  const{username,email,password,is_seller} = await c.req.json();

  const{success} = await c.env.DB.prepare(`INSERT INTO users (username,email,password,is_seller) VALUES (?,?,?,?);`).bind(username,email,password,is_seller).run();

    if(success)
  {
    return c.text("Succesfuly product created");
  }
     else
  {
    return c.text("failed");
  }

})


// create a products
// Assuming you have a `users` table in your database

// product_id	seller_id	name	description	price	quantity
app.post('/products/new',async(c) => {

  const {seller_id,name,description,price,quantity} = await c.req.json();

  const{success} = await c.env.DB.prepare(`INSERT INTO products (seller_id,name,description,price,quantity) VALUES (?,?,?,?,?)`).bind(seller_id,name,description,price,quantity).run();

  if(success)
  {
    return c.text("Succesfuly product created");
  }
  else
  {
    return c.text("failed");
  }


})

app.get('/products/:id',async(c) => {

    const{id} = c.req.param();

    const rows = await c.env.DB.prepare(`SELECT * FROM products WHERE product_id = ${id}`).all();

    return c.json(rows);

});

app.get('/products/new/get-all', async (c) => {

    const result = await c.env.DB.prepare('SELECT * FROM products').all();

    return c.json(result);
  
} );



app.delete('/delete',async(c) => {

    await c.env.DB.prepare('DELETE FROM products').all();

    return c.text("Succesfuly all product deleted");

})

app.delete('/delete/:id',async(c) => {

  const {id} = c.req.param();

  await c.env.DB.prepare(`DELETE FROM products WHERE product_id = ${id}`).all();

  return c.text("Succesfuly product deleted");

});


app.post('/orders/new',async(c) => {

  //order_id	user_id	product_id	quantity	total_price	order_date

    const {user_id,product_id,quantity,total_price} =await c.req.json();

    const{success} = await c.env.DB.prepare(`INSERT INTO orders (user_id,product_id,quantity,total_price) VALUES (?,?,?,?)`).bind(user_id,product_id,quantity,total_price).run();

    if(success)
    {
      return c.text("Succesfuly order created");
    }
    else
    {
      return c.text("failed");
    }

});

app.get('orders/new/get-all',async(c) =>  {

    const rows = await c.env.DB.prepare(`SELECT * FROM orders`).all();

    return c.json(rows);

} )


app.get('/orders/:id',async(c) => {

  const{id} = c.req.param();

  const rows = await c.env.DB.prepare(`SELECT * FROM orders WHERE order_id = ${id}`).all();

  return c.json(rows);

});

app.delete('/orders/delete',async(c) =>  {

    await c.env.DB.prepare('DELETE FROM orders').all();

    return c.text("Succesfuly all order deleted");

})

app.delete('/orders/delete/:id',async(c) => {

  const {id} = c.req.param();

  await c.env.DB.prepare(`DELETE FROM orders WHERE order_id = ${id}`).all();

  return c.text("Succesfuly order deleted");

} );



export default app