import { Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import httpRequest from "../config/http-request";
import {setInformation} from "../store/informationSlice";
import {useDispatch} from "react-redux";

function sleep(ms) {
  new Promise((r) => setTimeout(r, ms));
}
function Home() {
  const [messageApi, contextHolder] = message.useMessage();
  const queryParameters = new URLSearchParams(window.location.search);
  const token = queryParameters.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch()
  function getToken() {
    try {
      localStorage.setItem("token", token);
      sleep(1000);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Đã có lỗi xảy ra",
      });
    } finally {
      window.close();
    }
  }

  useEffect(() => {
    getToken();
  }, []);

  return (
    <div className="h-[100vh] flex flex-col justify-center">
      <Spin tip="Loading" size="large">
        <div className="content" />
      </Spin>
    </div>
  );
}

export default Home;
