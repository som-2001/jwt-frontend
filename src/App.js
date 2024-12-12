import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {Signup} from './pages/Signup.js'
import {Signin} from './pages/Signin.js'
import {Protected} from './pages/Protected.js'
import {Users} from './pages/Users.js'
import { ViewProduct } from './pages/ViewProduct.js';
import { Cart } from './pages/Cart.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/' element={<Protected/>}>
          <Route path='users' element={<Users/>} />
          <Route path='viewproduct/:id/:category' element={<ViewProduct/>} />
          <Route path="cart" element={<Cart/>}/>
        </Route> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
