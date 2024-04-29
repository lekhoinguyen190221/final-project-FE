import React, {useEffect, useState} from 'react'
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import Navbar from "./Navbar";
import Footer from "./Footer";
import httpRequest from "../config/http-request";
import {useDispatch} from "react-redux";
import {setInformation} from "../store/informationSlice";

export const MainLayout = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const token = localStorage.getItem('token')
    useEffect(() => {
        if (token) {
            getUser()
        } else {
            dispatch(setInformation({}))
        }
    },[token])
    function getUser() {
        httpRequest.get("/auth/getMe").then((res) => {
            const user = {
                user: {
                    id: res.data.id,
                    role: res.data?.role,
                    displayName: `${res.data?.firstName} ${res.data?.lastName}`,
                    email: res.data?.email,
                    phoneNumber: res.data?.phoneNumber,
                    password: res.data.password,
                    photoURL:
                        "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745",
                },
            };
            dispatch(setInformation(user));
        });
    }

    useEffect(() => {
        if (location.pathname === '/') {
            navigate('/home')
        }
    },[])

    return (
        <div>
            <Navbar />
            {/* start content */}
            <Outlet />
            {/* end content */}
            <Footer/>
        </div>
    )
}
