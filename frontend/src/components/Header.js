import React, { useContext, useState } from 'react'
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify'
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import { FaMicrophone } from "react-icons/fa";
import { IoMdMicOff } from "react-icons/io";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const [menuDisplay,setMenuDisplay] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()
  // const searchInput = useLocation()
  // const URLSearch = new URLSearchParams(searchInput?.search)
  // const searchQuery = URLSearch.getAll("q")
  const [search,setSearch] = useState("")
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [micON, setMicON] = useState(false);

  const handleLogout = async() => {
    const fetchData = await fetch(SummaryApi.logout_user.url,{
      method : SummaryApi.logout_user.method,
      credentials : 'include'
    })

    const data = await fetchData.json()

    if(data.success){
      toast.success(data.message)
      dispatch(setUserDetails(null))
      navigate("/")
    }

    if(data.error){
      toast.error(data.message)
    }

  }

  const handleSearch = ()=>{
    const value = search;

    if(value){
      navigate(`/search?q=${value}`)
    }else{
      navigate("/search")
    }
    setSearch("");
  }

  const handleSpeechRecognition = () => {
    resetTranscript();
    setSearch("");
    setMicON(true);
    SpeechRecognition.startListening({ continuous: true , language: "en" });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    setSearch(transcript);
    resetTranscript();
    setMicON(false);
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter"){
      handleSearch();
    }
  }

  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-40'>
      <div className=' h-full container mx-auto flex items-center px-4 justify-between'>
            <div className=''>
                <Link to={"/"}>
                    <img src="logo.png" width="120" height="70" alt="logo" />
                </Link>
            </div>

            <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-3'>
                <div className='relative flex w-full items-center'>
                  <input type='text' placeholder='search product here...' className='w-full outline-none' onChange={(e) => setSearch(e.target.value)} value={search} onKeyDown={handleKeyDown} />
                  { micON ? 
                    <IoMdMicOff className='absolute right-3 cursor-pointer' onClick={handleStop} />
                    : 
                    <FaMicrophone className='absolute right-3 cursor-pointer' onClick={handleSpeechRecognition} />
                  }
                </div>
                <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white'>
                  <GrSearch className='cursor-pointer' onClick={handleSearch}/>
                </div>
            </div>


            <div className='flex items-center gap-7'>
                
                <div className='relative flex justify-center'>

                  {
                    user?._id && (
                      <div className='text-3xl cursor-pointer relative flex justify-center' onClick={()=>setMenuDisplay(preve => !preve)}>
                        {
                          user?.profilePic ? (
                            <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
                          ) : (
                            <FaRegCircleUser/>
                          )
                        }
                      </div>
                    )
                  }
                  
                  
                  {
                    menuDisplay && (
                      <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded' >
                        <nav>
                          {
                            user?.role === ROLE.ADMIN && (
                              <Link to={"/admin-panel/all-products"} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={()=>setMenuDisplay(preve => !preve)}>Admin Panel</Link>
                            )
                          }
                         
                        </nav>
                      </div>
                    )
                  }
                 
                </div>

                  {
                     user?._id && (
                      <Link to={"/cart"} className='text-2xl relative'>
                          <span><FaShoppingCart/></span>
      
                          <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                              <p className='text-sm'>{context?.cartProductCount}</p>
                          </div>
                      </Link>
                      )
                  }
              


                <div>
                  {
                    user?._id  ? (
                      <button onClick={handleLogout} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Logout</button>
                    )
                    : (
                    <Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Login</Link>
                    )
                  }
                    
                </div>

            </div>

      </div>
    </header>
  )
}

export default Header