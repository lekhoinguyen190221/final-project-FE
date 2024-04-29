import logo from '../Img/Logo_Bistro.png'
function Footer() {
    return (
        <footer className="p-4 sm:p-6 bg-[#FFFFF5] border-t-2">
            <div className="mx-auto max-w-screen-xl">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <a href="https://flowbite.com" className="flex items-center">
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                                <div className='flex'>
                                    <img src={logo} width='350' alt=""/>
                                </div>
                            </span>
                        </a>
                    </div>
                    <div className="grid grid-cols-2 gap-16 sm:gap-6 sm:grid-cols-3">
                        <div className='mx-4'>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Contact</h2>
                            <ul className="text-gray-600 dark:text-gray-400">
                                <li className="mb-4">
                                    <a href="https://www.facebook.com/profile.php?id=100010484971483" className="hover:underline ">Facebook</a>
                                </li>
                                <li>
                                    <a href="discordapp.com/users/690078986914496542" className="hover:underline">Discord</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="https://flowbite.com" className="hover:underline">™</a> V 1.1.1
            </span>
                </div>
            </div>
        </footer>
    )
}

export default Footer