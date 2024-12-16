import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {Signup} from './pages/Signup.js'
import {Signin} from './pages/Signin.js'
import {Protected} from './pages/Protected.js'
import {Users} from './pages/Users.js'
import { ViewProduct } from './pages/ViewProduct.js';
import { Cart } from './pages/Cart.js';
import { Success } from './pages/Success.js';
import { Error } from './pages/Error.js';

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
          <Route path="success" element={<Success/>}/>
          <Route path="cancel" element={<Error/>}/>
        </Route> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
