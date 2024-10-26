import optionRoutes from "./options.js";
import orderRoutes from "./orders.js";
import productRoutes from "./products.js";
import tableRoutes from "./tables.js";

export default function Router(app){ 

    app.use(['/add-option', '/options'], optionRoutes);
    app.use(['/add-order', '/orders'], orderRoutes);
    app.use(['/add-product', '/products'], productRoutes);
    app.use(['/add-table', '/tables'], tableRoutes);
    
};