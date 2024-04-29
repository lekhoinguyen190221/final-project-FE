import Navbar from "./Navbar";
import { Button, Col, Form, Input, InputNumber, message } from "antd";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import httpRequest from "../config/http-request";
import { useDispatch, useSelector } from "react-redux";

function Login({ mode }) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [accessToken, setAccessToken] = useState("");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  let interval = null;
  const loadToken = () => {
    interval = setInterval(() => {
      setAccessToken(localStorage.getItem("token"));
    }, 2000);
  };
  loadToken();
  useEffect(() => {
    if (accessToken) {
      clearInterval(interval);
      window.open("/home", "_self");
    }
  }, [accessToken]);

  const error = (response) => {
    messageApi.open({
      type: "error",
      content: response,
    });
  };

  const success = (response) => {
    messageApi.open({
      type: "success",
      content: response,
    });
  };

  function handleLogin() {
    if (mode === "dk") {
      httpRequest
        .post("/auth/register", form.getFieldsValue(true))
        .then((response) => {
          success("Register Success");
          navigate("/login");
        })
        .catch((err) => {
          error(err.response.data.message);
        });
    }
    if (mode === "dn") {
      httpRequest
        .post("/auth/login", form.getFieldsValue(true))
        .then((response) => {
          localStorage.setItem("token", response.data?.token);
          success("Login Success");
          navigate("/home");
        })
        .catch((err) => {
          error(err.response?.data?.message);
        });
    }
    if (mode === "fgp") {
      httpRequest
        .post("/auth/forgotPassword", form.getFieldsValue(true))
        .then((response) => {
          success("Sent success, check your email");
        })
        .catch((err) => {
          error(err.response?.data?.message);
        });
    }
    if (mode === "rs") {
      httpRequest
        .post("/auth/resetPassword", form.getFieldsValue(true))
        .then((response) => {
          success("Sent success");
          navigate("/login");
        })
        .catch((err) => {
          error(err.response?.data?.message);
        });
    }
  }

  async function handleLoginWithPlatform(platform) {
    try {
      window.open(
        "http://localhost:3002/auth/withGoogle",
        "Base login with google",
        "height=700,width=500,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes"
      );
    } catch (error) {}
  }

  useEffect(() => {
    if (mode === "rs") {
      form.setFieldsValue({
        email: email,
        token: token,
      });
    }
  }, []);

  return (
    <div>
      {contextHolder}
      <div className="flex justify-center bg-gray-100 h-[80vh]">
        <div className="w-[35%] h-fit border-[1px] shadow-2xl bg-white my-16 rounded-xl">
          <div className="p-10">
            {mode !== "rs" && (
              <h1 className="uppercase text-3xl mb-6 font-semibold">
                {mode === "dn"
                  ? "Login"
                  : mode === "dk"
                  ? "Sign Up"
                  : "Forgot Password"}
              </h1>
            )}
            <Form form={form}>
              <Col>
                <Form.Item
                  labelAlign="left"
                  name="email"
                  label="Email"
                  labelCol={{ span: 4 }}
                  rules={[
                    {
                      type: "email",
                      message: "Wrong format",
                    },
                  ]}
                >
                  <Input placeholder="Enter email" />
                </Form.Item>
              </Col>
              {mode === "dk" && (
                <div>
                  <Col>
                    <Form.Item
                      labelAlign="left"
                      name="firstName"
                      label="Full Name"
                      labelCol={{ span: 4 }}
                      rules={[
                        { required: true, message: "Please Enter Fullname!" },
                      ]}
                    >
                      <Input placeholder="Enter Fullname" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      labelAlign="left"
                      name="phoneNumber"
                      label="Phone Number"
                      labelCol={{ span: 4 }}
                    >
                      <Input placeholder="Enter Phone Number" />
                    </Form.Item>
                  </Col>
                </div>
              )}
              {mode !== "fgp" && (
                <Col>
                  <Form.Item
                    labelAlign="left"
                    name="password"
                    label="Password"
                    labelCol={{ span: 4 }}
                  >
                    <Input.Password placeholder="Enter Password" />
                  </Form.Item>
                </Col>
              )}
            </Form>
            {mode === "dn" && (
              <div className="flex my-10">
                <div
                  className="mr-2 w-full border py-2 rounded-xl flex justify-center items-center"
                  onClick={() => handleLoginWithPlatform("google")}
                >
                  <FcGoogle style={{ fontSize: "20px" }} />
                  <span className="ml-2">Google</span>
                </div>
              </div>
            )}
            <div className="flex justify-end flex items-center justify-between">
              {mode !== "fgp" && (
                <a className="" href="/forgot-password">
                  Forgot Password?
                </a>
              )}
              <Button
                type="primary"
                className="w-[150px] h-[40px]"
                onClick={() => handleLogin()}
              >
                {mode === "dn"
                  ? "Login"
                  : mode === "dk"
                  ? "Sign Up"
                  : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
