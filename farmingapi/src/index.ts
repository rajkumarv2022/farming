import { Hono } from 'hono'
import { cors } from 'hono/cors'


type Bindings = {
  DB: D1Database;
}



const app: Hono<{ Bindings: Bindings }> = new Hono()

app.use(
  '/*',
  cors({
    origin: ['http://localhost:5173','https://vegetable-sell.vercel.app/','https://d22b751b.vegetablesell.pages.dev/'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE','PUT']
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

app.post('/users/new/user_id',async(c) => {

  try {
    const { email, password, checked } = await c.req.json();



    // Use placeholders in the SQL query and pass parameters separately
    const statement = c.env.DB.prepare('SELECT user_id FROM users WHERE email = ? AND password = ? AND is_seller =?');
    const result = await statement.bind(email,password,checked).all();
    const ans = result.results.length;

    if(ans == 1)
    {
      return c.json(result);
    }
    else
    {
      return c.json('not loged in');
    }
    
  } catch (error) {
    console.error('Error fetching user:', error);
   
  }

})

// app.post('/users/new/login/checked',async(c) => {

//   try {
//     const {email, password,checked} = await c.req.json();

//     // Use placeholders in the SQL query and pass parameters separately
//     const statement = c.env.DB.prepare('SELECT user_id FROM users WHERE email = ? AND password = ? AND is_seller = ?');
//     const result = await statement.bind(email,password,checked).all();
//     const ans = result.results.length;

//     if(ans == 1)
//     {
//       return c.json('loged in');
//     }
//     else
//     {
//       return c.json('not loged in');
//     }
    
//   } catch (error) {
//     console.error('Error fetching user:', error);
   
//   }

// })


// create a products
// Assuming you have a `users` table in your database

// product_id	seller_id	name	description	price	quantity
app.post('/products/new',async(c) => {

  const {seller_id,name,description,price,quantity,typeofPrd,image} = await c.req.json();

  const{success} = await c.env.DB.prepare(`INSERT INTO products (seller_id,name,description,price,quantity,typeofPrd,image) VALUES (?,?,?,?,?,?,?)`).bind(seller_id,name,description,price,quantity,typeofPrd,image).run();

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


app.put('/products/new/update', async (c) => {
  const { product_id, name, description, price, quantity, typeofPrd, image } = await c.req.json();

  const { success } = await c.env.DB.prepare(`
    UPDATE products 
    SET 
      name = ?, 
      description = ?, 
      price = ?, 
      quantity = ?, 
      typeofPrd = ? ,
      image = ?
    WHERE 
      product_id = ?
  `).bind(name, description, price, quantity, typeofPrd, image, product_id).all();

  if (success) {
    return c.text('Successfully updated');
  } else {
    return c.text('Failed to update');
  }
});



app.delete('/delete',async(c) => {

    await c.env.DB.prepare('DELETE FROM products').all();

    return c.text("Succesfuly all product deleted");

})

app.delete('/delete/:id',async(c) => {
  try{

  const id =c.req.param('id');

  await c.env.DB.prepare(`DELETE FROM products WHERE product_id = ?`).bind(id).all();

  return c.text("Succesfuly product deleted");
  }
  catch(e:any){
    return c.text(e.message);
  }
});  

app.delete('/delete/all/:id',async(c) => {
  try{

  const {id} = c.req.param();

  await c.env.DB.prepare(`DELETE FROM products WHERE seller_id = ?`).bind(id).all();

  return c.text("Succesfuly product deleted");
  }
  catch(e:any){
    return c.text(e.message);
  }
});



app.post('/orders/new',async(c) => {

  //order_id	user_id	product_id	quantity	total_price	order_date

    const {user_id,product_id,name,description,quantity,total_price,typeofPrd} =await c.req.json();

    const{success} = await c.env.DB.prepare(`INSERT INTO orders (user_id,product_id,name,description,quantity,total_price,typeofPrd) VALUES (?,?,?,?,?,?,?)`).bind(user_id,product_id,name,description,quantity,total_price,typeofPrd).run();

    if(success)
    {
      return c.text("Succesfuly order created");
    }
    else
    {
      return c.text("failed");
    }

});

//store personal information about the user to deliver the product

app.get('/orders/new/get-all',async(c) =>  {

    const rows = await c.env.DB.prepare(`SELECT * FROM orders`).all();

    return c.json(rows);

} )

//get userreg

app.get('/orders/new/get-userreg/:id', async (c) => {
  const { id } = c.req.param();
  
  const result = await c.env.DB.prepare(`
    SELECT * FROM orders 
    WHERE user_id = ?
    ORDER BY order_date DESC 
    LIMIT 1
  `).bind(id).first(); // Use `first()` to get a single result instead of `all()`

  if (result) {
    return c.json(result);
  } else {
    return c.json({ error: 'No orders found for this user.' }, 404);
  }
});



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

app.delete('/orders/delete/user/:id',async(c) => {

  const {id} = c.req.param();

  await c.env.DB.prepare(`DELETE FROM orders WHERE user_id = ${id}`).all();

  return c.text('All History Cleared')
  
});

app.post('/cart/new',async(c) => {

  // cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
  // user_id INTEGER,
  // product_id INTEGER NOT NULL,
  // seller_id INTEGER NOT NULL,
  // name TEXT NOT NULL,
  // description TEXT,
  // price REAL NOT NULL,
  // quantity INTEGER NOT NULL,

  const {user_id,product_id,seller_id,name,description,price,quantity,typeofPrd,oqnt} = await c.req.json();

  const{success} = await c.env.DB.prepare(`INSERT INTO cart (user_id,product_id,seller_id,name,description,price,quantity,typeofPrd,oqnt) VALUES (?,?,?,?,?,?,?,?,?)`).bind(user_id,product_id,seller_id,name,description,price,quantity,typeofPrd,oqnt).run();

  if(success)
  {
    return c.text("Succesfuly cart created");
  }
  else
  {
    return c.text("failed");
  }


});

app.get('/cart/new/get-all', async (c) => {

  const result = await c.env.DB.prepare('SELECT * FROM cart').all();

  return c.json(result);

} );
//delete cart

app.delete('/cart/delete',async(c) => {

    await c.env.DB.prepare('DELETE FROM cart').all();

    return c.text("Succesfuly all cart deleted");

});

//delete cart by id

app.delete('/cart/delete/:id',async(c) => {

  const {id} = c.req.param();

    await c.env.DB.prepare(`DELETE FROM cart WHERE cart_id=${id}`).all();

    return c.text("Succesfuly cart deleted");

})

app.delete('/cart/delete/user/:id',async(c) => {

const{id} = c.req.param();

 await c.env.DB.prepare(`DELETE FROM cart WHERE user_id=${id}`).all();

 return c.text('Succesfully all cart Cleared');


});

app.get('/product/sql/allsearch',async(c) => {

    const query = c.req.query('search')

    const typePrd  = await c.env.DB.prepare(`SELECT * FROM products WHERE typeofPrd LIKE ?;`).bind(`%${query}`).all()

    return c.json(typePrd);

});


// app.get('/',async(c) => {

//   const result = await c.env.DB.prepare(`SELECT * FROM users`).all();

//   return c.json(result);



// });

//log in form 



export default app