import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import logo from '../Img/Logo_Bistro.png'
import {useSelector} from "react-redux";

function Navbar() {
  const navigate = useNavigate()
  const userInfo = useSelector((state) => state.author.information)
    const token = localStorage.getItem('token')

    return (
      <div className='h-24 flex items-center border-b-[1px] justify-between bg-[#FFFFF5]'>
        <span className='ml-4 cursor-pointer text-3xl font-semibold' onClick={() => navigate('/home')}>
          <img src={logo} width='250' alt=""/>
        </span>
          {
              !token ? (
                  <div className='mr-4'>
                      <Button type='text' className='mr-2 w-[100px] h-[50px]' onClick={() => navigate('/login')}>Log in</Button>
                      <Button className='w-[100px] h-[50px]' onClick={() => navigate('/signup')}>Sign Up</Button>
                  </div>
              ) : (
                  <div className='w-[200px] mr-6 flex justify-between items-center'>
                      <span className='font-medium'>Hello {userInfo?.user?.displayName}</span>
                      <img
                          className='rounded-[50%] w-[55px] border-2 border-gray-800 cursor-pointer'
                          src={userInfo?.user?.photoURL} alt=""
                          onClick={() => navigate('/user')}
                      />
                  </div>
              )
          }

      </div>
    );
  }

  export default Navbar;
